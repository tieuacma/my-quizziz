import { useEffect } from "react";
import { Question } from "../data/quizdata";

interface QuizEffectsProps {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  timeLeft: number;
  setTimeLeft: (updater: number | ((prev: number) => number)) => void;
  showScore: boolean;
  showFeedback: boolean;
  questions: Question[];
  currentQuestion: number;
  handleAnswerClick: (selectedOption: string) => void;
}

export const useQuizEffects = ({
  isLoading,
  setIsLoading,
  timeLeft,
  setTimeLeft,
  showScore,
  showFeedback,
  // handleAnswerClick, // Không cần dùng trong effect đếm ngược nữa
}: QuizEffectsProps) => {
  
  // 1. Quản lý trạng thái Loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [setIsLoading]);

  // 2. Bộ đếm ngược thời gian
  useEffect(() => {
    // Không đếm nếu đang load, đã kết thúc, hoặc đang hiển thị đáp án
    if (isLoading || showScore || showFeedback) return;

    // Chỉ đếm ngược khi timeLeft > 0
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev: number) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } 
    
    // KHI HẾT GIỜ (timeLeft === 0):
    // Chúng ta không làm gì cả (Không gọi handleAnswerClick).
    // Timer sẽ đứng yên ở mức 0 và chờ người dùng tự bấm.
    
  }, [timeLeft, showScore, showFeedback, isLoading, setTimeLeft]);
};