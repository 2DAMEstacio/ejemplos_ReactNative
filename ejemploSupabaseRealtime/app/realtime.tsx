import { ActivityIndicator, FlatList, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { QuestionItem } from '@/components/question-item';
import { useRealtimeScreen } from '@/hooks/use-realtime-screen';
import { styles } from '@/styles/realtime';

export default function RealtimeScreen() {
  const insets = useSafeAreaInsets();
  const {
    loading,
    saving,
    error,
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
  } = useRealtimeScreen();

  return (
    <SafeAreaView style={[styles.container, { paddingTop: 10, paddingBottom: insets.bottom + 10 }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Supabase Realtime - Q&A Live</Text>
        <Text style={styles.subtitle}>
          Publica preguntas, vota y marca como resueltas. Todo se sincroniza al instante.
        </Text>
        <Text style={styles.statusText}>Canal realtime: {realtimeStatus}</Text>
      </View>

      <View style={styles.card}>
        <View>
          <Text style={styles.label}>Tema</Text>
          <TextInput
            style={styles.input}
            value={topic}
            onChangeText={setTopic}
            placeholder="Ej: React Native"
            placeholderTextColor="#9aa3af"
          />
        </View>

        <View>
          <Text style={styles.label}>Pregunta</Text>
          <TextInput
            style={[styles.input, styles.questionInput]}
            value={questionText}
            onChangeText={setQuestionText}
            placeholder="Ej: Como optimizamos listas largas en mobile?"
            placeholderTextColor="#9aa3af"
            multiline
          />
        </View>

        <View style={styles.row}>
          <TouchableOpacity style={styles.button} onPress={createQuestion} disabled={saving}>
            {saving ? <ActivityIndicator color="#ffffff" /> : <Text style={styles.buttonText}>Publicar</Text>}
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonSecondary} onPress={fetchQuestions} disabled={loading}>
            <Text style={styles.buttonSecondaryText}>Recargar</Text>
          </TouchableOpacity>
        </View>

        {!!error && <Text style={styles.errorText}>{error}</Text>}
      </View>

      <View style={styles.listCard}>
        <Text style={styles.listTitle}>Feed en vivo ({questions.length})</Text>

        {loading ? (
          <ActivityIndicator color="#93c5fd" />
        ) : (
          <FlatList
            data={questions}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingBottom: 10 }}
            ListEmptyComponent={<Text style={styles.emptyText}>Aun no hay preguntas.</Text>}
            renderItem={({ item }) => (
              <QuestionItem
                item={item}
                isMine={item.author_id === sessionUserId}
                onUpvote={upvoteQuestion}
                onToggleAnswered={toggleAnswered}
              />
            )}
          />
        )}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.signOutButton} onPress={signOut}>
          <Text style={styles.signOutText}>Cerrar sesion</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
