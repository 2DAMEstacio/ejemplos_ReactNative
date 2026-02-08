import { useEffect, useMemo, useState } from 'react';
import { Alert, Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

import { supabase } from '@/lib/supabase';


// Configura cómo se muestran las notificaciones al recibirlas.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

type PushTokenRow = {
  token: string;
};

export function usePushNotifications() {
  const [sessionUserId, setSessionUserId] = useState<string | null>(null);
  const [pushToken, setPushToken] = useState<string | null>(null);
  const [registering, setRegistering] = useState(false);
  const [sending, setSending] = useState(false);
  const [lastNotification, setLastNotification] = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  const projectId = useMemo(() => {
    return Constants.easConfig?.projectId ?? Constants.expoConfig?.extra?.eas?.projectId ?? undefined;
  }, []);

  // Sincroniza la sesión y escucha notificaciones entrantes.
  useEffect(() => {
    let active = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      if (data.session) {
        setSessionUserId(data.session.user.id);
      } else {
        setSessionUserId(null);
      }
      setAuthChecked(true);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setSessionUserId(null);
      } else {
        setSessionUserId(session.user.id);
      }
      setAuthChecked(true);
    });

    // En web los listeners de Expo no tienen efecto; evitamos registrarlos.
    const notificationSub =
      Platform.OS === 'web'
        ? null
        : Notifications.addNotificationReceivedListener((notification) => {
          // Guardamos el texto para mostrarlo en pantalla.
          const body = notification.request.content.body ?? 'Notificacion recibida';
          setLastNotification(body);
        });

    return () => {
      active = false;
      authListener.subscription.unsubscribe();
      notificationSub?.remove();
    };
  }, []);

  // Registra el token push cuando hay un usuario autenticado.
  useEffect(() => {
    if (Platform.OS === 'web') return;
    if (!sessionUserId) return;
    registerForPush();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionUserId]);

  // Solicita permisos, obtiene el token de Expo y lo guarda en Supabase.
  const registerForPush = async () => {
    setRegistering(true);
    try {
      if (Platform.OS === 'web') {
        return;
      }
      if (!Device.isDevice) {
        Alert.alert('Dispositivo fisico requerido', 'Las notificaciones push no funcionan en simulador.');
        return;
      }

      // Android requiere un canal de notificación.
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
        });
      }

      // Aseguramos que el usuario otorgue permisos.
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        Alert.alert('Permiso requerido', 'Necesitas aceptar permisos para recibir push.');
        return;
      }

      // El token de Expo se usa en el gateway de push de Expo.
      const tokenResponse = await Notifications.getExpoPushTokenAsync(
        projectId ? { projectId } : undefined,
      );
      setPushToken(tokenResponse.data);

      // Guardamos/actualizamos el token en Supabase para futuros envíos.
      if (sessionUserId) {
        const { error } = await supabase
          .from('push_tokens')
          .upsert(
            {
              token: tokenResponse.data,
              user_id: sessionUserId,
              device_name: Device.deviceName ?? 'unknown',
            },
            { onConflict: 'token' },
          );
        if (error) {
          Alert.alert('Error', error.message);
        }
      }
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'No se pudo registrar el token');
    } finally {
      setRegistering(false);
    }
  };

  // Envía una notificación push a todos los tokens excepto `excludeToken`.
  const sendNotification = async (message: string, excludeToken?: string | null) => {
    if (!message.trim()) {
      Alert.alert('Falta mensaje', 'Escribe el texto de la notificacion.');
      return false;
    }

    setSending(true);
    try {
      const { data, error } = await supabase.from('push_tokens').select('token');
      if (error) {
        Alert.alert('Error', error.message);
        return false;
      }

      // Filtramos tokens vacíos y opcionalmente el token actual.
      const tokens = (data ?? [])
        .map((row: PushTokenRow) => row.token)
        .filter(Boolean)
        .filter((token) => (excludeToken ? token !== excludeToken : true));
      if (tokens.length === 0) {
        Alert.alert('Sin destinatarios', 'No hay tokens registrados.');
        return false;
      }

      // Expo recomienda enviar en lotes; 80 es un tamaño seguro.
      const chunks = chunkArray(tokens, 80);
      for (const chunk of chunks) {
        const messages = chunk.map((token) => ({
          to: token,
          title: 'Notificacion',
          body: message.trim(),
        }));

        const response = await fetch('https://exp.host/--/api/v2/push/send', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(messages),
        });

        if (!response.ok) {
          const errorBody = await response.text();
          throw new Error(errorBody || 'Error enviando notificaciones');
        }
      }

      Alert.alert('Enviado', 'La notificacion se ha enviado.');
      return true;
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'No se pudo enviar');
      return false;
    } finally {
      setSending(false);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return {
    authChecked,
    sessionUserId,
    pushToken,
    registering,
    sending,
    lastNotification,
    sendNotification,
    signOut,
  };
}

function chunkArray<T>(items: T[], size: number) {
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
}
