import { supabase } from '@/lib/supabase';

export const liveQuestionsQueryKey = ['live_questions'] as const;

export type LiveQuestionRow = {
  id: string;
  author_id: string;
  topic: string;
  question: string;
  votes: number;
  is_answered: boolean;
  created_at: string;
  updated_at: string;
};

export async function fetchLiveQuestions() {
  const { data, error } = await supabase
    .from('live_questions')
    .select('id, author_id, topic, question, votes, is_answered, created_at, updated_at')
    .order('votes', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as LiveQuestionRow[];
}

export async function createLiveQuestion(input: {
  authorId: string;
  topic: string;
  question: string;
}) {
  const { error } = await supabase.from('live_questions').insert({
    author_id: input.authorId,
    topic: input.topic,
    question: input.question,
  });

  if (error) {
    throw new Error(error.message);
  }
}

export async function upvoteLiveQuestion(questionId: string) {
  const { error } = await supabase.rpc('upvote_live_question', {
    question_id: questionId,
  });

  if (error) {
    throw new Error(error.message);
  }
}

export async function toggleLiveQuestionAnswered(questionId: string, nextValue: boolean) {
  const { error } = await supabase
    .from('live_questions')
    .update({ is_answered: nextValue })
    .eq('id', questionId);

  if (error) {
    throw new Error(error.message);
  }
}

export function sortLiveQuestions(items: LiveQuestionRow[]) {
  return [...items].sort((a, b) => {
    if (b.votes !== a.votes) return b.votes - a.votes;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });
}
