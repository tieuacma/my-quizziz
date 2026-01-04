import { createClient } from '@/lib/supabase/client';

export const useQuizSession = () => {
  const supabase = createClient();

  // Hàm lấy phiên chơi gần nhất (Sửa lỗi "Property getLatestSession does not exist")
  const getLatestSession = async (userId: string, quizSlug: string) => {
    try {
      const { data, error } = await supabase
        .from('quiz_sessions')
        .select('*')
        .eq('user_id', userId)
        .eq('quiz_slug', quizSlug)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (err) {
      console.error("Lỗi getLatestSession:", err);
      return null;
    }
  };

  // Hàm tạo phiên chơi mới
  const createNewSession = async (userId: string, mongoQuiz: any) => {
    try {
      const questionIds = mongoQuiz.questions.map((q: any) => Number(q.id));
      const shuffledIds = [...questionIds].sort(() => Math.random() - 0.5);

      const { data, error } = await supabase
        .from('quiz_sessions')
        .insert({
          user_id: userId,
          quiz_slug: mongoQuiz.slug,
          questionnaire: shuffledIds,
          current_index: 0,
          score: 0,
          wrong_answers: [],
          status: 'playing'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      console.error("Lỗi createNewSession:", err);
      throw err;
    }
  };

  return { getLatestSession, createNewSession };
};