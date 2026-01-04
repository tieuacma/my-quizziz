import { useCallback } from "react";
import { Question, checkAnswer } from "../data/quizdata";

interface QuizHandlersProps {
  questions: Question[];
  currentQuestion: number;
  timeLeft: number;
  currentStreak: number;
  showFeedback: boolean;
  selectedAnswer: string | null;
  setSelectedAnswer: (answer: string | null) => void;
  setShowFeedback: (show: boolean) => void;
  setPointsEarned: (points: number) => void;
  setScore: (value: number | ((prev: number) => number)) => void;
  setCorrectAnswers: (value: number | ((prev: number) => number)) => void;
  setCurrentStreak: (value: number | ((prev: number) => number)) => void;
  setMaxStreak: (value: number | ((prev: number) => number)) => void;
  setShowPointsAnimation: (show: boolean) => void;
  setScoreUpdateAnimation: (show: boolean) => void;
  setCurrentQuestion: (question: number) => void;
  setTimeLeft: (time: number) => void;
  setShowScore: (show: boolean) => void;
  setWrongAnswers: (id: number) => void;
}

export const useQuizHandlers = ({
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
  setWrongAnswers,
}: QuizHandlersProps) => {

  /**
   * Chuyển sang câu hỏi tiếp theo hoặc kết thúc quiz
   */
  const handleNextQuestion = useCallback(() => {
    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
      setTimeLeft(questions[nextQuestion].timeLimit || 20);
      setSelectedAnswer(null);
      setShowFeedback(false);
      setPointsEarned(0);
    } else {
      setShowScore(true);
    }
  }, [currentQuestion, questions, setCurrentQuestion, setTimeLeft, setSelectedAnswer, setShowFeedback, setPointsEarned, setShowScore]);

  /**
   * Xử lý khi người dùng chọn đáp án
   * Tích hợp logic Điểm hy vọng (Hope Points)
   */
  const handleAnswerClick = useCallback((selectedOption: string) => {
    if (showFeedback) return; // Ngăn bấm nhiều lần khi đang hiện feedback

    const question = questions[currentQuestion];
    setSelectedAnswer(selectedOption);
    setShowFeedback(true);

    // Chuyển đổi option text sang định dạng answer (1, 2, 3...) hoặc giữ nguyên nếu là text
    let userAnswer: string | number;
    if (question.type === "multiple_choice") {
      userAnswer = (question.options?.indexOf(selectedOption) ?? -1) + 1;
    } else {
      userAnswer = selectedOption;
    }

    const isCorrect = checkAnswer(question, userAnswer);

    if (isCorrect) {
      // 1. Tính toán chuỗi thắng mới
      const nextStreak = currentStreak + 1;

      // 2. Tính "Điểm hy vọng" dựa trên streak
      // Công thức: min((streak // 3) * 100, 1200)
      const hopePoints = Math.min(Math.floor(nextStreak / 3) * 100, 1200);

      let totalPoints = 0;

      if (timeLeft <= 0) {
        // TÌNH HUỐNG HẾT GIỜ: Chỉ nhận điểm hy vọng
        totalPoints = hopePoints;
      } else {
        // TÌNH HUỐNG CÒN GIỜ: Điểm cơ bản (tốc độ) + Điểm hy vọng
        const basePoints = Math.round((1000 + (timeLeft / (question.timeLimit || 20)) * 500) / 10) * 10;
        totalPoints = basePoints + hopePoints;
      }

      // 3. Cập nhật các trạng thái điểm và streak
      setPointsEarned(totalPoints);
      setScore((prev: number) => prev + totalPoints);
      setCorrectAnswers((prev: number) => prev + 1);
      
      setCurrentStreak((prev: number) => {
        const newStreak = prev + 1;
        setMaxStreak((currentMax: number) => Math.max(currentMax, newStreak));
        return newStreak;
      });

      // 4. Kích hoạt hiệu ứng giao diện
      setShowPointsAnimation(true);
      setScoreUpdateAnimation(true);
      
      setTimeout(() => {
        setShowPointsAnimation(false);
        setScoreUpdateAnimation(false);
      }, 500);

    } else {
      // TÌNH HUỐNG SAI: Reset streak về 0 và lưu vào danh sách câu sai
      setCurrentStreak(0);
      setPointsEarned(0);
      setWrongAnswers(question.id); 
    }

    // Tự động chuyển câu sau 1.5 giây để người chơi xem kết quả đúng/sai
    setTimeout(() => {
      handleNextQuestion();
    }, 1500);

  }, [
    currentQuestion, 
    questions, 
    timeLeft, 
    currentStreak, 
    showFeedback, 
    setSelectedAnswer, 
    setShowFeedback, 
    setPointsEarned, 
    setScore, 
    setCorrectAnswers, 
    setCurrentStreak, 
    setMaxStreak, 
    setShowPointsAnimation, 
    setScoreUpdateAnimation, 
    handleNextQuestion, 
    setWrongAnswers
  ]);

  /**
   * Trả về class Tailwind dựa trên trạng thái đúng/sai để hiển thị lên nút
   */
  const getOptionClass = useCallback((option: string) => {
    if (!showFeedback) {
      return "w-full text-left p-6 border-2 border-gray-200 rounded-2xl hover:border-purple-400 hover:bg-purple-50 transition-all duration-200 group transform hover:scale-102 shadow-sm hover:shadow-md";
    }

    const question = questions[currentQuestion];
    if (question.type !== "multiple_choice") return "";

    const isSelected = option === selectedAnswer;
    const isCorrect = question.options?.[question.answer - 1] === option;

    if (isCorrect) {
      return "w-full text-left p-6 border-2 border-green-500 bg-green-100 rounded-2xl shadow-md text-green-700 font-bold";
    }
    if (isSelected && !isCorrect) {
      return "w-full text-left p-6 border-2 border-red-500 bg-red-100 rounded-2xl shadow-md text-red-700 font-bold";
    }
    return "w-full text-left p-6 border-2 border-gray-300 bg-gray-100 rounded-2xl opacity-50 cursor-not-allowed";
  }, [showFeedback, questions, currentQuestion, selectedAnswer]);

  /**
   * Chơi lại quiz
   */
  const resetQuiz = useCallback(() => {
    window.location.reload(); 
  }, []);

  return {
    handleAnswerClick,
    handleNextQuestion,
    getOptionClass,
    resetQuiz,
  };
};