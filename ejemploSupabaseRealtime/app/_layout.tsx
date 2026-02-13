import { QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { View } from 'react-native';

import { useAuth } from '@/hooks/use-auth';
import { queryClient } from '@/lib/query-client';

export default function RootLayout() {
  const { authChecked, sessionUserId } = useAuth();

  if (!authChecked) {
    return <View />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Stack initialRouteName={sessionUserId ? 'realtime' : 'login'}>
        <Stack.Screen name="login" options={{ headerShown: false, title: 'Login' }} />
        <Stack.Screen name="realtime" options={{ title: 'Realtime' }} />
      </Stack>
      <StatusBar style="auto" />
    </QueryClientProvider>
  );
}
