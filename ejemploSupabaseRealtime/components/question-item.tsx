import { Text, TouchableOpacity, View } from 'react-native';

import { LiveQuestionRow } from '@/services/live-questions.service';
import { styles } from '@/styles/realtime';

type QuestionItemProps = {
  item: LiveQuestionRow;
  isMine: boolean;
  onUpvote: (id: string) => void;
  onToggleAnswered: (id: string, nextValue: boolean) => void;
};

export function QuestionItem({ item, isMine, onUpvote, onToggleAnswered }: QuestionItemProps) {
  return (
    <View style={[styles.item, isMine && styles.itemOwn, item.is_answered && styles.itemAnswered]}>
      <View style={styles.itemTopRow}>
        <Text style={styles.topicBadge}>{item.topic}</Text>
        <Text style={styles.itemMeta}>{item.is_answered ? 'Resuelta' : 'Abierta'}</Text>
      </View>

      <Text style={styles.itemTitle}>{item.question}</Text>

      <Text style={styles.itemMeta}>Votos: {item.votes}</Text>
      <Text style={styles.itemMeta}>{new Date(item.created_at).toLocaleString()}</Text>

      <View style={styles.itemActions}>
        <TouchableOpacity style={styles.smallButton} onPress={() => onUpvote(item.id)}>
          <Text style={styles.smallButtonText}>+1 voto</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.smallButtonSecondary}
          onPress={() => onToggleAnswered(item.id, !item.is_answered)}
        >
          <Text style={styles.smallButtonSecondaryText}>
            {item.is_answered ? 'Reabrir' : 'Marcar resuelta'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
