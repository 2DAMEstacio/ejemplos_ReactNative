import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';

import { useAuth } from '@/hooks/use-auth';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { authChecked, sessionUserId, loading, signIn, signUp } = useAuth();

  useEffect(() => {
    if (authChecked && sessionUserId) {
      router.replace('/realtime');
    }
  }, [authChecked, router, sessionUserId]);

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Faltan datos', 'Introduce email y password.');
      return;
    }

    const error = await signIn(email, password);

    if (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleSignUp = async () => {
    if (!email || !password) {
      Alert.alert('Faltan datos', 'Introduce email y password.');
      return;
    }

    const error = await signUp(email, password);

    if (error) {
      Alert.alert('Error', error.message);
      return;
    }

    Alert.alert('Listo', 'Cuenta creada. Si tienes confirmacion por email, revisa tu bandeja.');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.select({ ios: 'padding', android: undefined })}
    >
      <View style={styles.card}>
        <Text style={styles.title}>Login</Text>
        <Text style={styles.subtitle}>Accede para probar un flujo con Supabase Realtime.</Text>

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="tu@email.com"
          placeholderTextColor="#9aa3af"
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="********"
          placeholderTextColor="#9aa3af"
        />

        <TouchableOpacity style={styles.primaryButton} onPress={handleSignIn} disabled={loading}>
          {loading ? <ActivityIndicator color="#ffffff" /> : <Text style={styles.primaryText}>Entrar</Text>}
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton} onPress={handleSignUp} disabled={loading}>
          <Text style={styles.secondaryText}>Crear cuenta</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0f172a',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#111827',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: '#1f2937',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  title: {
    fontSize: 28,
    color: '#f9fafb',
    fontWeight: '700',
  },
  subtitle: {
    marginTop: 6,
    marginBottom: 20,
    color: '#9ca3af',
  },
  label: {
    marginBottom: 6,
    color: '#e5e7eb',
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#374151',
    backgroundColor: '#0b1220',
    color: '#f9fafb',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 16,
  },
  primaryButton: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 4,
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
});
