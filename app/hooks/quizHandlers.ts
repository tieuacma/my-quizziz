import { useCallback } from "react";
import { Question, checkAnswer } from "../data/quizdata";
import { clearQuizState, QUIZ_STATE_KEY } from "./quizStorage";

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
  setScore: (updater: (prev: number) => number) => void;
  setCorrectAnswers: (updater: (prev: number) => number) => void;
  setCurrentStreak: (updater: (prev: number) => number) => void;
  setMaxStreak: (updater: (prev: number) => number) => void;
  setShowPointsAnimation: (show: boolean) => void;
  setScoreUpdateAnimation: (show: boolean) => void;
  setCurrentQuestion: (question: number) => void;
  setTimeLeft: (time: number) => void;
  setShowScore: (show: boolean) => void;
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
}: QuizHandlersProps) => {
  const handleAnswerClick = useCallback((selectedOption: string) => {
    if (showFeedback) return;

    const question = questions[currentQuestion];
    setSelectedAnswer(selectedOption);
    setShowFeedback(true);

    // Kiểm tra đáp án
    let userAnswer: string | number;
    if (question.type === "multiple_choice") {
      userAnswer = question.options.indexOf(selectedOption) + 1;
    } else {
      userAnswer = selectedOption;
    }

    const isCorrect = checkAnswer(question, userAnswer);
    const timeSpent = (question?.timeLimit || 20) - timeLeft;

    if (isCorrect) {
      // Tính điểm theo thời gian và chuỗi (Streak)
      const basePoints = Math.round((1000 + (timeLeft / question.timeLimit) * 500) / 10) * 10;
      const bonusPoints = Math.floor(100 * currentStreak / 3);
      const totalPoints = basePoints + bonusPoints;

      setPointsEarned(totalPoints);
      setScore((prev: number) => prev + totalPoints);
      setCorrectAnswers((prev: number) => prev + 1);
      setCurrentStreak((prev: number) => {
        const newStreak = prev + 1;
        setMaxStreak((currentMax: number) => Math.max(currentMax, newStreak));
        return newStreak;
      });

      setShowPointsAnimation(true);
      setScoreUpdateAnimation(true);
      setTimeout(() => {
        setShowPointsAnimation(false);
        setScoreUpdateAnimation(false);
      }, 500);
    } else {
      setCurrentStreak(() => 0);
      setPointsEarned(0);
    }

    // Chuyển câu sau 1.5 giây để người dùng kịp nhìn feedback
    setTimeout(() => {
      handleNextQuestion();
    }, 1500);
  }, [currentQuestion, questions, timeLeft, currentStreak, showFeedback, setSelectedAnswer, setShowFeedback, setPointsEarned, setScore, setCorrectAnswers, setCurrentStreak, setMaxStreak, setShowPointsAnimation, setScoreUpdateAnimation]);

  const handleNextQuestion = useCallback(() => {
    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
      setTimeLeft(questions[nextQuestion].timeLimit);
      setSelectedAnswer(null);
      setShowFeedback(false);
      setPointsEarned(0);
    } else {
      setShowScore(true);
      localStorage.removeItem(QUIZ_STATE_KEY); // Xóa state khi đã hoàn thành
    }
  }, [currentQuestion, questions, setCurrentQuestion, setTimeLeft, setSelectedAnswer, setShowFeedback, setPointsEarned, setShowScore]);

  const getOptionClass = useCallback((option: string) => {
    if (!showFeedback) return "w-full text-left p-6 border-2 border-gray-200 rounded-2xl hover:border-purple-400 hover:bg-purple-50 transition-all duration-200 group transform hover:scale-102 shadow-sm hover:shadow-md";

    const question = questions[currentQuestion];
    if (question.type !== "multiple_choice") return "";

    const isSelected = option === selectedAnswer;
    const isCorrect = question.options[question.answer - 1] === option;

    if (isCorrect) return "w-full text-left p-6 border-2 border-green-500 bg-green-100 rounded-2xl shadow-md";
    if (isSelected && !isCorrect) return "w-full text-left p-6 border-2 border-red-500 bg-red-100 rounded-2xl shadow-md";
    return "w-full text-left p-6 border-2 border-gray-300 bg-gray-100 rounded-2xl opacity-50";
  }, [showFeedback, questions, currentQuestion, selectedAnswer]);

  const resetQuiz = useCallback(() => {
    clearQuizState();
    // Reload lại trang là cách an toàn nhất để reset toàn bộ hệ thống về trạng thái ban đầu
    window.location.reload();
  }, []);

  return {
    handleAnswerClick,
    handleNextQuestion,
    getOptionClass,
    resetQuiz,
  };
};
