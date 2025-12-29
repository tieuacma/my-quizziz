import { useState } from "react";
import { Question } from "../data/quizdata";
import { useInitialQuizState } from "./quizInitialState";
import { useQuizEffects } from "./quizEffects";
import { useQuizHandlers } from "./quizHandlers";

// --- HOOK CHÍNH ---

export const useQuiz = () => {
  const [isLoading, setIsLoading] = useState(true);

  // 1. KHỞI TẠO ĐỒNG BỘ: Kiểm tra Hash và State ngay lập tức
  const initialState = useInitialQuizState();

  // 2. GÁN STATE: Đảm bảo tất cả state lấy từ cùng một nguồn initialState
  const [questions, setQuestions] = useState<Question[]>(initialState?.questions || []);
  const [currentQuestion, setCurrentQuestion] = useState(initialState?.currentQuestion || 0);
  const [score, setScore] = useState(initialState?.score || 0);
  const [showScore, setShowScore] = useState(initialState?.showScore || false);
  const [timeLeft, setTimeLeft] = useState(initialState?.timeLeft || 0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(initialState?.selectedAnswer || null);
  const [showFeedback, setShowFeedback] = useState(initialState?.showFeedback || false);
  const [pointsEarned, setPointsEarned] = useState(initialState?.pointsEarned || 0);
  const [correctAnswers, setCorrectAnswers] = useState(initialState?.correctAnswers || 0);
  const [totalTimeSpent, setTotalTimeSpent] = useState(initialState?.totalTimeSpent || 0);
  const [currentStreak, setCurrentStreak] = useState(initialState?.currentStreak || 0);
  const [maxStreak, setMaxStreak] = useState(initialState?.maxStreak || 0);

  const [showPointsAnimation, setShowPointsAnimation] = useState(false);
  const [scoreUpdateAnimation, setScoreUpdateAnimation] = useState(false);

  // 3-5. EFFECTS
  const { handleAnswerClick, handleNextQuestion, getOptionClass, resetQuiz } = useQuizHandlers({
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
  });

  useQuizEffects({
    isLoading,
    setIsLoading,
    initialState,
    timeLeft,
    setTimeLeft,
    showScore,
    showFeedback,
    questions,
    currentQuestion,
    score,
    selectedAnswer,
    pointsEarned,
    correctAnswers,
    totalTimeSpent,
    currentStreak,
    maxStreak,
    handleAnswerClick,
  });

  return {
    currentQuestion,
    score,
    showScore,
    timeLeft,
    selectedAnswer,
    showFeedback,
    pointsEarned,
    showPointsAnimation,
    scoreUpdateAnimation,
    handleAnswerClick,
    handleNextQuestion,
    getOptionClass,
    questions,
    correctAnswers,
    totalTimeSpent,
    maxStreak,
    isLoading,
    resetQuiz,
  };
};
