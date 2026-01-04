import { useState, useEffect, useRef } from "react";
import { Question } from "../data/quizdata";
import { useQuizEffects } from "./quizEffects";
import { useQuizHandlers } from "./quizHandlers";
import { createClient } from "@/lib/supabase/client";

interface UseQuizProps {
  initialQuestions: Question[];
  sessionId: string;
  initialState: {
    currentQuestion: number;
    score: number;
    wrongAnswers: number[];
  };
}

export const useQuiz = ({ initialQuestions, sessionId, initialState }: UseQuizProps) => {
  const supabase = createClient();
  
  // --- STATE QUẢN LÝ TIẾN ĐỘ ---
  const [questions] = useState<Question[]>(initialQuestions);
  const [currentQuestion, setCurrentQuestion] = useState(initialState.currentQuestion);
  const [score, setScore] = useState(initialState.score);
  const [wrongAnswers, setWrongAnswers] = useState<number[]>(initialState.wrongAnswers);
  const [showScore, setShowScore] = useState(false);

  // --- STATE GIAO DIỆN & UI ---
  const [isLoading, setIsLoading] = useState(true); // Khởi tạo là true để chạy effect loading
  const [timeLeft, setTimeLeft] = useState(initialQuestions[initialState.currentQuestion]?.timeLimit || 20);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [pointsEarned, setPointsEarned] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalTimeSpent, setTotalTimeSpent] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [showPointsAnimation, setShowPointsAnimation] = useState(false);
  const [scoreUpdateAnimation, setScoreUpdateAnimation] = useState(false);

  const isFirstRender = useRef(true);

  // --- ĐỒNG BỘ HÓA SUPABASE (DEBOUNCED) ---
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const syncProgress = async () => {
      if (!sessionId) return;

      const { error } = await supabase
        .from('quiz_sessions')
        .update({
          current_index: currentQuestion,
          score: score,
          wrong_answers: wrongAnswers,
          // Sửa chỗ này nếu bạn dùng status là string
          status: showScore ? 'completed' : 'playing' 
        })
        .eq('id', sessionId);

      if (error) console.error("Sync Error:", error.message);
    };

    const timeoutId = setTimeout(syncProgress, 300); // Tăng lên 300ms để an toàn hơn cho mạng yếu
    return () => clearTimeout(timeoutId);
  }, [currentQuestion, score, wrongAnswers, showScore, sessionId, supabase]);

  // --- HANDLERS ---
  const handlers = useQuizHandlers({
    questions,
    currentQuestion,
    timeLeft,
    currentStreak,
    showFeedback,
    selectedAnswer,
    setSelectedAnswer,
    setShowFeedback,
    setPointsEarned,
    setScore,
    setCorrectAnswers,
    setCurrentStreak,
    setMaxStreak,
    setShowPointsAnimation,
    setScoreUpdateAnimation,
    setCurrentQuestion,
    setTimeLeft,
    setShowScore,
    // FIX: Đảm bảo không lưu trùng ID câu hỏi vào danh sách sai
    setWrongAnswers: (id: number) => {
      setWrongAnswers(prev => prev.includes(id) ? prev : [...prev, id]);
    } 
  });

  // --- EFFECTS ---
  useQuizEffects({
    isLoading,
    setIsLoading,
    timeLeft,
    setTimeLeft,
    showScore,
    showFeedback,
    questions, // Cần truyền để tính toán trong effects nếu cần
    currentQuestion,
    handleAnswerClick: handlers.handleAnswerClick,
  });

  return {
    ...handlers,
    questions,
    currentQuestion,
    score,
    showScore,
    timeLeft,
    selectedAnswer,
    showFeedback,
    pointsEarned,
    showPointsAnimation,
    scoreUpdateAnimation,
    correctAnswers,
    totalTimeSpent,
    maxStreak,
    isLoading,
    wrongAnswers
  };
};