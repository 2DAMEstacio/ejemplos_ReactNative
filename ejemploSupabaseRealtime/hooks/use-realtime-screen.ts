import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/lib/supabase';
import {
  createLiveQuestion,
  fetchLiveQuestions,
  LiveQuestionRow,
  liveQuestionsQueryKey,
  sortLiveQuestions,
  toggleLiveQuestionAnswered,
  upvoteLiveQuestion,
} from '@/services/live-questions.service';

export function useRealtimeScreen() {
  const router = useRouter();
  const { authChecked, sessionUserId, signOut } = useAuth();
  const queryClient = useQueryClient();

  const [topic, setTopic] = useState('General');
  const [questionText, setQuestionText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [realtimeStatus, setRealtimeStatus] = useState('CONNECTING');
  const [reconnectAttempt, setReconnectAttempt] = useState(0);

  useEffect(() => {
    if (authChecked && !sessionUserId) {
      router.replace('/login');
    }
  }, [authChecked, router, sessionUserId]);

  // Query principal del feed. Se activa solo con sesión autenticada.
  const questionsQuery = useQuery({
    queryKey: liveQuestionsQueryKey,
    queryFn: fetchLiveQuestions,
    enabled: !!sessionUserId,
  });

  useEffect(() => {
    // Sin usuario autenticado no abrimos canal Realtime, porque esta pantalla
    // depende de datos protegidos y del contexto de sesión actual.
    if (!sessionUserId) {
      return;
    }

    // Estado visible en UI para diagnosticar la salud del canal.
    setRealtimeStatus('CONNECTING');
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;

    // Realtime nos envía eventos INSERT/UPDATE/DELETE. En lugar de hacer refetch
    // completo del feed en cada evento, actualizamos la caché de React Query
    // en caliente para que la UI refleje el cambio al instante.
    //
    // Ventajas:
    // 1) Menos tráfico de red.
    // 2) Menor latencia visual.
    // 3) Mantiene useQuery como fuente inicial de datos, pero el "stream"
    //    posterior se aplica incrementalmente.
    const applyRealtimeChange = (payload: RealtimePostgresChangesPayload<Record<string, unknown>>) => {
      queryClient.setQueryData<LiveQuestionRow[]>(liveQuestionsQueryKey, (current = []) => {
        // Copia defensiva para mantener inmutabilidad del estado en caché.
        const next = [...current];

        if (payload.eventType === 'DELETE') {
          // En DELETE, Supabase envía la fila anterior en payload.old.
          // Eliminamos por id del snapshot local.
          const deletedId = String(payload.old.id ?? '');
          return next.filter((item) => item.id !== deletedId);
        }

        // Para INSERT/UPDATE usamos payload.new y lo normalizamos al tipo del feed.
        const incoming = payload.new as unknown as LiveQuestionRow;
        if (!incoming?.id) {
          // Si el evento llega incompleto, evitamos corromper caché.
          return next;
        }

        // Si ya existe en caché: UPDATE.
        // Si no existe: INSERT.
        const index = next.findIndex((item) => item.id === incoming.id);
        if (index >= 0) {
          next[index] = incoming;
        } else {
          next.push(incoming);
        }

        // Mantiene el mismo criterio de orden que la query base (votos + fecha).
        return sortLiveQuestions(next);
      });
    };

    // Canal único para el feed. Escuchamos cualquier cambio de la tabla.
    const channel = supabase
      .channel('live-questions-feed')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'live_questions' },
        applyRealtimeChange
      )
      .subscribe((status, subscribeError) => {
        // Exponemos estado de suscripción en pantalla.
        setRealtimeStatus(status);
        if (subscribeError) {
          setError(subscribeError.message);
        }
        // Si el canal vuelve a estar operativo:
        // - Reseteamos contador de backoff.
        // - Lanzamos una sincronización puntual para recuperar posibles eventos
        //   perdidos durante una desconexión temporal.
        if (status === 'SUBSCRIBED') {
          setReconnectAttempt(0);
          void queryClient.invalidateQueries({ queryKey: liveQuestionsQueryKey });
          return;
        }
        // Si falla la conexión, aplicamos reconexión exponencial:
        // 1s, 2s, 4s... hasta 10s máximo.
        // Cambiar reconnectAttempt fuerza este useEffect a recrear canal.
        if (status === 'TIMED_OUT' || status === 'CHANNEL_ERROR' || status === 'CLOSED') {
          const delay = Math.min(10000, 1000 * 2 ** reconnectAttempt);
          reconnectTimer = setTimeout(() => {
            setReconnectAttempt((prev) => prev + 1);
          }, delay);
        }
      });

    return () => {
      // Cleanup estricto para evitar fugas:
      // - cancelamos timers pendientes de reconexión
      // - cerramos el canal al desmontar o re-crear efecto
      if (reconnectTimer) {
        clearTimeout(reconnectTimer);
      }
      void supabase.removeChannel(channel);
    };
  }, [queryClient, reconnectAttempt, sessionUserId]);

  const createQuestionMutation = useMutation<void, Error, { topic: string; question: string; authorId: string }>({
    mutationFn: async (input: { topic: string; question: string; authorId: string }) =>
      createLiveQuestion(input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: liveQuestionsQueryKey });
      setQuestionText('');
    },
    onError: (mutationError) => {
      setError(mutationError.message);
    },
  });

  const upvoteMutation = useMutation<void, Error, string>({
    mutationFn: (questionId: string) => upvoteLiveQuestion(questionId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: liveQuestionsQueryKey });
    },
    onError: (mutationError) => {
      setError(mutationError.message);
    },
  });

  const toggleAnsweredMutation = useMutation<void, Error, { questionId: string; nextValue: boolean }>({
    mutationFn: (input: { questionId: string; nextValue: boolean }) =>
      toggleLiveQuestionAnswered(input.questionId, input.nextValue),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: liveQuestionsQueryKey });
    },
    onError: (mutationError) => {
      setError(mutationError.message);
    },
  });

  const createQuestion = useCallback(async () => {
    const normalizedTopic = topic.trim() || 'General';
    const normalizedQuestion = questionText.trim();

    if (!normalizedQuestion) {
      Alert.alert('Pregunta requerida', 'Escribe una pregunta para publicarla.');
      return;
    }

    if (!sessionUserId) {
      Alert.alert('Sesion no valida', 'Vuelve a iniciar sesion.');
      return;
    }

    setError(null);

    await createQuestionMutation.mutateAsync({
      authorId: sessionUserId,
      topic: normalizedTopic,
      question: normalizedQuestion,
    });
  }, [createQuestionMutation, questionText, sessionUserId, topic]);

  const upvoteQuestion = useCallback(async (questionId: string) => {
    setError(null);
    await upvoteMutation.mutateAsync(questionId);
  }, [upvoteMutation]);

  const toggleAnswered = useCallback(async (questionId: string, nextValue: boolean) => {
    setError(null);
    await toggleAnsweredMutation.mutateAsync({ questionId, nextValue });
  }, [toggleAnsweredMutation]);

  const questions = questionsQuery.data ?? [];
  const loading = questionsQuery.isLoading || questionsQuery.isFetching;
  const saving = createQuestionMutation.isPending;
  const fetchError = questionsQuery.error?.message ?? null;
  const currentError = error ?? fetchError;

  const fetchQuestions = useCallback(async () => {
    // Recarga manual desde UI.
    setError(null);
    await queryClient.invalidateQueries({ queryKey: liveQuestionsQueryKey });
  }, [queryClient]);

  return {
    loading,
    saving,
    error: currentError,
    questions,
    topic,
    setTopic,
    questionText,
    setQuestionText,
    fetchQuestions,
    createQuestion,
    upvoteQuestion,
    toggleAnswered,
    signOut,
    sessionUserId,
    realtimeStatus,
  };
}
