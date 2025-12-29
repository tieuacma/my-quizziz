import { useEffect } from "react";
import { Question } from "../data/quizdata";
import { saveQuizState } from "./quizStorage";
import { QuizState } from "./types";

interface QuizEffectsProps {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  initialState: QuizState | null;
  timeLeft: number;
  setTimeLeft: (updater: number | ((prev: number) => number)) => void;
  showScore: boolean;
  showFeedback: boolean;
  questions: Question[];
  currentQuestion: number;
  score: number;
  selectedAnswer: string | null;
  pointsEarned: number;
  correctAnswers: number;
  totalTimeSpent: number;
  currentStreak: number;
  maxStreak: number;
  handleAnswerClick: (selectedOption: string) => void;
}

export const useQuizEffects = ({
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
}: QuizEffectsProps) => {
  // 3. EFFECT: Quản lý trạng thái Loading
  useEffect(() => {
    const delay = initialState?.isNewGame ? 2500 : 0;
    const timer = setTimeout(() => setIsLoading(false), delay);
    return () => clearTimeout(timer);
  }, [initialState, setIsLoading]);

  // 4. EFFECT: Bộ đếm ngược thời gian
  useEffect(() => {
    if (!isLoading && timeLeft > 0 && !showScore && !showFeedback) {
      const timer = setTimeout(() => setTimeLeft((prev: number) => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showScore && !showFeedback && !isLoading) {
      // Tự động xử lý khi hết giờ
      handleAnswerClick("");
    }
  }, [timeLeft, showScore, showFeedback, isLoading, setTimeLeft, handleAnswerClick]);

  // 5. EFFECT: Lưu trạng thái vào LocalStorage (Chỉ lưu khi dữ liệu đã ổn định)
  useEffect(() => {
    if (!isLoading && !showScore) {
      saveQuizState({
        questions,
        currentQuestion,
        score,
        showScore,
        timeLeft,
        selectedAnswer,
        showFeedback,
        pointsEarned,
        correctAnswers,
        totalTimeSpent,
        currentStreak,
        maxStreak
      });
    }
  }, [isLoading, questions, currentQuestion, score, timeLeft, showScore, showFeedback, pointsEarned, correctAnswers, totalTimeSpent, currentStreak, maxStreak]);
};
