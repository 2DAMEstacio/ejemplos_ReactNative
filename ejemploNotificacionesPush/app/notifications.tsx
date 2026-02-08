import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';

import { usePushNotifications } from '@/hooks/use-push-notifications';

export default function NotificationsScreen() {
  const router = useRouter();
  const [message, setMessage] = useState('');
  const {
    authChecked,
    sessionUserId,
    pushToken,
    registering,
    sending,
    lastNotification,
    sendNotification,
    signOut,
  } = usePushNotifications();

  useEffect(() => {
    if (authChecked && !sessionUserId) {
      router.replace('/login');
    }
  }, [authChecked, router, sessionUserId]);

  const handleSend = async () => {
    const ok = await sendNotification(message, pushToken);
    if (ok) {
      setMessage('');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Enviar push</Text>
        <Text style={styles.subtitle}>
          {pushToken ? 'Token registrado correctamente.' : 'Registrando token de dispositivo...'}
        </Text>
        {!!pushToken && <Text style={styles.token}>{pushToken}</Text>}
        {registering && <ActivityIndicator color="#2563eb" />}

        <Text style={styles.label}>Texto de la notificacion</Text>
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          placeholder="Escribe el mensaje..."
          placeholderTextColor="#94a3b8"
          multiline
        />

        <TouchableOpacity style={styles.primaryButton} onPress={handleSend} disabled={sending}>
          {sending ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.primaryText}>Enviar a todos</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton} onPress={signOut}>
          <Text style={styles.secondaryText}>Cerrar sesion</Text>
        </TouchableOpacity>

        {!!lastNotification && (
          <View style={styles.receivedBox}>
            <Text style={styles.receivedTitle}>Ultima notificacion recibida</Text>
            <Text style={styles.receivedText}>{lastNotification}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b1120',
    padding: 24,
  },
  card: {
    flex: 1,
    backgroundColor: '#111827',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: '#1f2937',
  },
  title: {
    fontSize: 26,
    color: '#f9fafb',
    fontWeight: '700',
  },
  subtitle: {
    marginTop: 6,
    marginBottom: 16,
    color: '#9ca3af',
  },
  token: {
    color: '#e2e8f0',
    fontSize: 12,
    marginBottom: 16,
  },
  label: {
    color: '#e5e7eb',
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    minHeight: 120,
    borderWidth: 1,
    borderColor: '#334155',
    backgroundColor: '#0b1220',
    borderRadius: 12,
    color: '#f9fafb',
    padding: 12,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  primaryButton: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  primaryText: {
    color: '#ffffff',
    fontWeight: '700',
  },
  secondaryButton: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  secondaryText: {
    color: '#e2e8f0',
    fontWeight: '600',
  },
  receivedBox: {
    marginTop: 24,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  receivedTitle: {
    color: '#cbd5f5',
    fontWeight: '600',
    marginBottom: 6,
  },
  receivedText: {
    color: '#f8fafc',
  },
});
