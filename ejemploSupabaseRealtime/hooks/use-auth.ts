import { useEffect, useState } from 'react';

import { supabase } from '@/lib/supabase';

export function useAuth() {
  const [sessionUserId, setSessionUserId] = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [loading, setLoading] = useState(false);

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

    return () => {
      active = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setLoading(false);
    return error;
  };

  const signUp = async (email: string, password: string) => {
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
    });
    setLoading(false);
    return error;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return {
    authChecked,
    sessionUserId,
    loading,
    signIn,
    signUp,
    signOut,
  };
}
