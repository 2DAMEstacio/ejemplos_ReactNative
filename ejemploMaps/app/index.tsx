import { Redirect } from 'expo-router';

import { useAuth } from '@/hooks/use-auth';

export default function Index() {
  const { authChecked, sessionUserId } = useAuth();

  if (!authChecked) return null;

  return <Redirect href={sessionUserId ? '/map' : '/login'} />;
}
