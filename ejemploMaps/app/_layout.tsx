import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { View } from 'react-native';

import { useAuth } from '@/hooks/use-auth';

export default function RootLayout() {
  const { authChecked, sessionUserId } = useAuth();

  if (!authChecked) {
    return <View />;
  }

  return (
    <>
      <Stack initialRouteName={sessionUserId ? 'map' : 'login'}>
        <Stack.Screen name="login" options={{ headerShown: false, title: 'Login' }} />
        <Stack.Screen name="map" options={{ title: 'Mapa' }} />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}
