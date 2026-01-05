import { useCallback } from "react";
import { Question, checkAnswer, ReadingSubQuestion } from "../data/quizdata";
import { useAudio } from "./useAudio";

interface QuizHandlersProps {
  questions: Question[];
  currentQuestion: number;
  subIndex: number | undefined;
  setSubIndex: React.Dispatch<React.SetStateAction<number | undefined>>;
  timeLeft: number;
  currentStreak: number;
  showFeedback: boolean;
  selectedAnswer: string | number | null;
  setSelectedAnswer: (answer: string | number | null) => void;
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
  wrongAnswers: number[];
  setWrongAnswers: (id: number, isCorrectRevise?: boolean) => void;
  isReviseMode: boolean;
  setIsReviseMode: (val: boolean) => void;
  showReviseSelection: boolean;
  setShowReviseSelection: (val: boolean) => void;
  reviseOptions: any[];
  setReviseOptions: (options: any[]) => void;
  tempQuestion: any | null;
  setTempQuestion: (q: any | null) => void;
  completedSubQuestions: { id: number; correct: boolean }[];
  setCompletedSubQuestions: React.Dispatch<React.SetStateAction<{ id: number; correct: boolean }[]>>;
}

export const useQuizHandlers = (props: QuizHandlersProps) => {
  const {
    questions, currentQuestion, subIndex, setSubIndex, timeLeft, currentStreak,
    showFeedback, selectedAnswer, setSelectedAnswer, setShowFeedback, setPointsEarned,
    setScore, setCorrectAnswers, setCurrentStreak, setMaxStreak, setShowPointsAnimation,
    setScoreUpdateAnimation, setCurrentQuestion, setTimeLeft, setShowScore,
    wrongAnswers, setWrongAnswers, isReviseMode, setIsReviseMode, showReviseSelection,
    setShowReviseSelection, reviseOptions, setReviseOptions, tempQuestion, setTempQuestion,
    completedSubQuestions, setCompletedSubQuestions,
  } = props;

  // Audio functionality
  const { playCorrectSound, playWrongSound } = useAudio();

  // 1. Logic chuyển câu hỏi tiếp theo
  const handleNextQuestion = useCallback(() => {
    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
      setSubIndex(0);
      setTimeLeft(questions[nextQuestion].timeLimit || 20);
      setSelectedAnswer(null);
      setShowFeedback(false);
      setPointsEarned(0);
    } else {
      setShowScore(true);
    }
  }, [currentQuestion, questions, setCurrentQuestion, setSubIndex, setTimeLeft, setSelectedAnswer, setShowFeedback, setPointsEarned, setShowScore]);

  // 2. Logic chọn câu hỏi phục thù từ danh sách
  const selectReviseQuestion = useCallback((q: any) => {
    setTempQuestion(q);
    setIsReviseMode(true);
    setShowReviseSelection(false);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setTimeLeft((q as Question).timeLimit || 20);
    // For reading questions in revise mode, start from the first sub-question
    if (q.type === "reading" || q.type === "reading_sub") {
      setSubIndex(0);
      setCompletedSubQuestions([]);
    } else {
      setSubIndex(0);
    }
  }, [setIsReviseMode, setShowReviseSelection, setSelectedAnswer, setShowFeedback, setTimeLeft, setTempQuestion, setSubIndex, setCompletedSubQuestions]);

  // 3. Logic xử lý khi người dùng chọn đáp án
  const handleAnswerClick = useCallback((selectedOption: string | number) => {
    if (showFeedback) return;

    // Ép kiểu về any để linh hoạt truy cập thuộc tính options mà không bị lỗi TS
    let activeQuestion: any = tempQuestion || questions[currentQuestion];
    if (activeQuestion.type === "reading" && !isReviseMode && subIndex !== undefined) {
      activeQuestion = activeQuestion.subQuestions[subIndex];
    } else if (activeQuestion.type === "reading" && isReviseMode && subIndex !== undefined) {
      activeQuestion = activeQuestion.subQuestions[subIndex];
    } else if (activeQuestion.type === "reading_sub" && isReviseMode) {
      // In revise mode, tempQuestion is already the sub-question
      activeQuestion = activeQuestion;
    }

    setSelectedAnswer(selectedOption);
    setShowFeedback(true);

    // Chuẩn hóa đáp án (Chuyển chuỗi text sang index 1-based nếu là trắc nghiệm)
    let userAnswer = selectedOption;
    if (["multiple_choice", "true_false", "reading_sub"].includes(activeQuestion.type)) {
      if (typeof selectedOption === "string" && activeQuestion.options) {
        const options = activeQuestion.options as string[];
        const idx = options.indexOf(selectedOption);
        userAnswer = (idx !== -1 ? idx : -1) + 1;
      }
    }

    const isCorrect = checkAnswer(activeQuestion, userAnswer);
    const currentMainQ = questions[currentQuestion];
    const isReadingSub = currentMainQ.type === "reading" && !isReviseMode;

    // Play sound effects
    if (isCorrect) {
      playCorrectSound();
    } else {
      playWrongSound();
    }

    // Xử lý điểm số và trạng thái
    if (isReadingSub) {
      setCompletedSubQuestions(prev => [...prev, { id: activeQuestion.id, correct: isCorrect }]);
      if (isCorrect) {
        setPointsEarned(100);
        setScore((prev) => prev + 100);
        setCorrectAnswers((prev) => prev + 1);
        setShowPointsAnimation(true);
        setScoreUpdateAnimation(true);
      }
    } else {
      if (isCorrect) {
        const nextStreak = currentStreak + 1;
        const streakBonus = Math.min(Math.floor(nextStreak / 3) * 100, 1200);
        const limit = activeQuestion.timeLimit || currentMainQ.timeLimit || 20;
        const basePoints = timeLeft <= 0 ? 0 : Math.round((1000 + (timeLeft / limit) * 500) / 10) * 10;
        const totalPoints = basePoints + streakBonus;

        setPointsEarned(totalPoints);
        setScore((prev) => prev + totalPoints);
        setCorrectAnswers((prev) => prev + 1);

        if (isReviseMode) {
          setWrongAnswers(activeQuestion.id, true);
        } else {
          setCurrentStreak((prev) => {
            const newStreak = prev + 1;
            setMaxStreak((currentMax) => Math.max(currentMax, newStreak));
            return newStreak;
          });
        }
        setShowPointsAnimation(true);
        setScoreUpdateAnimation(true);
      } else {
        if (!isReviseMode) {
          setCurrentStreak(0);
          setWrongAnswers(activeQuestion.id);
        }
        setPointsEarned(0);
      }
    }

    // Xử lý chuyển cảnh sau khi hiện feedback
    setTimeout(() => {
      setShowPointsAnimation(false);
      setScoreUpdateAnimation(false);

      if (isReviseMode) {
        // Handle reading questions in revise mode - progress through sub-questions
        const currentTempQ = tempQuestion;
        if (currentTempQ.type === "reading" && subIndex !== undefined && subIndex < currentTempQ.subQuestions.length - 1) {
          setSubIndex(prev => (prev !== undefined ? prev + 1 : 0));
          setSelectedAnswer(null);
          setShowFeedback(false);
        } else if (currentTempQ.type === "reading" && subIndex !== undefined && subIndex === currentTempQ.subQuestions.length - 1) {
          // All sub-questions completed in revise mode
          setIsReviseMode(false);
          setTempQuestion(null);
          setSelectedAnswer(null);
          setShowFeedback(false);
        } else {
          // Single question revise mode
          setIsReviseMode(false);
          setTempQuestion(null);
          setSelectedAnswer(null);
          setShowFeedback(false);
        }
      } else {
        const streakAfter = isCorrect ? currentStreak + 1 : 0;
        
        if (isCorrect && streakAfter > 0 && streakAfter % 5 === 0 && wrongAnswers.length > 0) {
          const shuffled = [...wrongAnswers].sort(() => 0.5 - Math.random());
          const options = shuffled.slice(0, 3).map(id => {
            let found: any = questions.find(q => q.id === id);
            if (!found) {
              questions.forEach(q => {
                if (q.type === "reading") {
                  const sub = q.subQuestions.find(s => s.id === id);
                  if (sub) found = sub;
                }
              });
            }
            return found;
          }).filter(Boolean);
          
          setReviseOptions(options);
          setShowReviseSelection(true);
        } else {
          if (currentMainQ.type === "reading" && subIndex !== undefined && subIndex < currentMainQ.subQuestions.length - 1) {
            setSubIndex(prev => (prev !== undefined ? prev + 1 : 0));
            setSelectedAnswer(null);
            setShowFeedback(false);
          } else if (currentMainQ.type === "reading" && subIndex !== undefined && subIndex === currentMainQ.subQuestions.length - 1) {
            const finalCompleted = [...completedSubQuestions, { id: activeQuestion.id, correct: isCorrect }];
            const allCorrect = finalCompleted.every(sub => sub.correct);

            if (allCorrect) {
              setCurrentStreak((p) => p + 1);
              setScore((p) => p + 500);
            } else {
              setCurrentStreak(0);
              setWrongAnswers(currentMainQ.id);
            }
            setCompletedSubQuestions([]);
            handleNextQuestion();
          } else {
            handleNextQuestion();
          }
        }
      }
    }, 800);
  }, [
    currentQuestion, subIndex, questions, timeLeft, currentStreak, showFeedback, isReviseMode, 
    tempQuestion, wrongAnswers, completedSubQuestions, setSelectedAnswer, setShowFeedback, 
    setPointsEarned, setScore, setCorrectAnswers, setCurrentStreak, setMaxStreak, 
    setShowPointsAnimation, setScoreUpdateAnimation, handleNextQuestion, setWrongAnswers, 
    setIsReviseMode, setTempQuestion, setShowReviseSelection, setReviseOptions, setSubIndex,
    setCompletedSubQuestions
  ]);

  // 4. Logic quản lý Class CSS cho các Option
  const getOptionClass = useCallback((option: string) => {
    let activeQuestion: any = tempQuestion || questions[currentQuestion];
    if (activeQuestion.type === "reading" && !isReviseMode && subIndex !== undefined) {
      activeQuestion = activeQuestion.subQuestions[subIndex];
    } else if (activeQuestion.type === "reading" && isReviseMode && subIndex !== undefined) {
      activeQuestion = activeQuestion.subQuestions[subIndex];
    } else if (activeQuestion.type === "reading_sub" && isReviseMode) {
      // In revise mode, tempQuestion is already the sub-question
      activeQuestion = activeQuestion;
    }

    if (!showFeedback) {
      return "w-full text-left p-6 border-2 border-gray-200 rounded-2xl hover:border-purple-400 hover:bg-purple-50 transition-all duration-200 group transform hover:scale-102 shadow-sm hover:shadow-md";
    }

    const isSelected = option === selectedAnswer;
    
    // Kiểm tra đáp án đúng bằng cách so sánh text option
    const options = activeQuestion.options as string[];
    const isCorrect = options && options[activeQuestion.answer - 1] === option;

    if (isCorrect) return "w-full text-left p-6 border-2 border-green-500 bg-green-100 rounded-2xl shadow-md text-green-700 font-bold";
    if (isSelected && !isCorrect) return "w-full text-left p-6 border-2 border-red-500 bg-red-100 rounded-2xl shadow-md text-red-700 font-bold";
    return "w-full text-left p-6 border-2 border-gray-300 bg-gray-100 rounded-2xl opacity-50 cursor-not-allowed";
  }, [showFeedback, questions, currentQuestion, subIndex, selectedAnswer, tempQuestion, isReviseMode]);

  return {
    handleAnswerClick,
    handleNextQuestion,
    getOptionClass,
    resetQuiz: () => window.location.reload(),
    selectReviseQuestion
  };
};