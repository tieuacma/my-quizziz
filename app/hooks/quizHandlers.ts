import { useCallback } from "react";
import { Question, checkAnswer, ReadingSubQuestion } from "../data/quizdata";

interface QuizHandlersProps {
  questions: Question[];
  currentQuestion: number;
  subIndex: number; // Mới: vị trí câu hỏi phụ
  setSubIndex: React.Dispatch<React.SetStateAction<number>>; // Mới
  timeLeft: number;
  currentStreak: number;
  showFeedback: boolean;
  selectedAnswer: string | number | null; // Cập nhật: chấp nhận number
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
  completedSubQuestions: {id: number, correct: boolean}[];
  setCompletedSubQuestions: React.Dispatch<React.SetStateAction<{id: number, correct: boolean}[]>>;
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

  const handleNextQuestion = useCallback(() => {
    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
      setSubIndex(0); // Reset chỉ số câu phụ
      setTimeLeft(questions[nextQuestion].timeLimit || 20);
      setSelectedAnswer(null);
      setShowFeedback(false);
      setPointsEarned(0);
    } else {
      setShowScore(true);
    }
  }, [currentQuestion, questions, setCurrentQuestion, setSubIndex, setTimeLeft, setSelectedAnswer, setShowFeedback, setPointsEarned, setShowScore]);

  const selectReviseQuestion = useCallback((q: any) => {
    setTempQuestion(q);
    setIsReviseMode(true);
    setShowReviseSelection(false);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setTimeLeft((q as Question).timeLimit || 20);
  }, [setIsReviseMode, setShowReviseSelection, setSelectedAnswer, setShowFeedback, setTimeLeft, setTempQuestion]);

  const handleAnswerClick = useCallback((selectedOption: string | number) => {
    if (showFeedback) return;

    // 1. Xác định câu hỏi hiện tại (Gốc, Phục thù, hoặc Câu phụ của Reading)
    let activeQuestion: Question | ReadingSubQuestion = tempQuestion || questions[currentQuestion];

    // Nếu là Reading và không phải đang Revise, lấy câu hỏi phụ
    if (activeQuestion.type === "reading" && !isReviseMode) {
      activeQuestion = activeQuestion.subQuestions[subIndex];
    }

    setSelectedAnswer(selectedOption);
    setShowFeedback(true);

    // 2. Chuẩn hóa userAnswer để checkAnswer (Dành cho UI truyền chuỗi nhưng data cần Index)
    let userAnswer = selectedOption;
    if (activeQuestion.type === "multiple_choice" || activeQuestion.type === "true_false" || activeQuestion.type === "reading_sub") {
        if (typeof selectedOption === "string") {
            const options = activeQuestion.options as string[];
            userAnswer = (options.indexOf(selectedOption) ?? -1) + 1;
        }
    }

    const isCorrect = checkAnswer(activeQuestion, userAnswer);

    // 3. Tính điểm và Streak
    const currentMainQ = questions[currentQuestion];
    const isReadingSubQuestion = currentMainQ.type === "reading" && !isReviseMode;

    if (isReadingSubQuestion) {
      // Xử lý subQuestion của Reading
      setCompletedSubQuestions(prev => [...prev, { id: activeQuestion.id, correct: isCorrect }]);

      if (isCorrect) {
        setPointsEarned(100); // Điểm nhỏ cho mỗi subQuestion đúng
        setScore((prev) => prev + 100);
        setCorrectAnswers((prev) => prev + 1);
        setShowPointsAnimation(true);
        setScoreUpdateAnimation(true);
      } else {
        setPointsEarned(0);
      }
    } else {
      // Xử lý câu hỏi bình thường
      if (isCorrect) {
        const nextStreak = currentStreak + 1;
        const hopePoints = Math.min(Math.floor(nextStreak / 3) * 100, 1200);

        const limit = (activeQuestion as Question).timeLimit || (tempQuestion || questions[currentQuestion]).timeLimit || 20;
        const basePoints = timeLeft <= 0 ? 0 : Math.round((1000 + (timeLeft / limit) * 500) / 10) * 10;
        const totalPoints = basePoints + hopePoints;

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

    // 4. Xử lý chuyển câu
    setTimeout(() => {
      setShowPointsAnimation(false);
      setScoreUpdateAnimation(false);

      if (isReviseMode) {
        setIsReviseMode(false);
        setTempQuestion(null);
        setSelectedAnswer(null);
        setShowFeedback(false);
      } else {
        const streakAfterThis = isCorrect ? currentStreak + 1 : 0;
        
        // Điều kiện Phục thù
        if (isCorrect && streakAfterThis !== 0 && streakAfterThis % 5 === 0 && wrongAnswers.length > 0) {
          const shuffled = [...wrongAnswers].sort(() => 0.5 - Math.random());
          const options = shuffled.slice(0, 3).map(id => {
              // Tìm trong câu hỏi gốc hoặc subQuestions
              let found: Question | ReadingSubQuestion | undefined = questions.find(q => q.id === id);
              if (!found) {
                  questions.forEach(q => {
                      if (q.type === "reading") {
                          const sub = q.subQuestions.find(s => s.id === id);
                          if (sub) found = sub;
                      }
                  });
              }
              return found;
          }).filter(Boolean) as (Question | ReadingSubQuestion)[];
          
          setReviseOptions(options);
          setShowReviseSelection(true);
        } else {
          // Check nếu là Reading bài đọc thì tăng subIndex
          const currentMainQ = questions[currentQuestion];
          if (currentMainQ.type === "reading" && subIndex < currentMainQ.subQuestions.length - 1) {
            setSubIndex(prev => prev + 1);
            setSelectedAnswer(null);
            setShowFeedback(false);
          } else if (currentMainQ.type === "reading" && subIndex === currentMainQ.subQuestions.length - 1) {
            // Đã làm xong tất cả subQuestions của Reading
            const allCorrect = completedSubQuestions.every(sub => sub.correct);
            if (allCorrect) {
              // Tất cả đúng: tăng streak, điểm thưởng
              setCurrentStreak((prev) => {
                const newStreak = prev + 1;
                setMaxStreak((currentMax) => Math.max(currentMax, newStreak));
                return newStreak;
              });
              setScore((prev) => prev + 500); // Điểm thưởng cho Reading hoàn hảo
            } else {
              // Có câu sai: reset streak, thêm vào wrongAnswers
              setCurrentStreak(0);
              setWrongAnswers(currentMainQ.id);
            }
            // Reset completedSubQuestions cho câu tiếp theo
            setCompletedSubQuestions([]);
            handleNextQuestion();
          } else {
            handleNextQuestion();
          }
        }
      }
    }, 1500);

  }, [
    currentQuestion, subIndex, questions, timeLeft, currentStreak, showFeedback, isReviseMode, 
    tempQuestion, wrongAnswers, setSelectedAnswer, setShowFeedback, setPointsEarned, 
    setScore, setCorrectAnswers, setCurrentStreak, setMaxStreak, setShowPointsAnimation, 
    setScoreUpdateAnimation, handleNextQuestion, setWrongAnswers, setIsReviseMode, 
    setTempQuestion, setShowReviseSelection, setReviseOptions, setSubIndex
  ]);

  const getOptionClass = useCallback((option: string) => {
    let activeQuestion = tempQuestion || questions[currentQuestion];
    if (activeQuestion.type === "reading" && !isReviseMode) {
        activeQuestion = activeQuestion.subQuestions[subIndex];
    }

    if (!showFeedback) {
      return "w-full text-left p-6 border-2 border-gray-200 rounded-2xl hover:border-purple-400 hover:bg-purple-50 transition-all duration-200 group transform hover:scale-102 shadow-sm hover:shadow-md";
    }

    const isSelected = option === selectedAnswer;
    const isCorrect = activeQuestion.options?.[activeQuestion.answer - 1] === option;

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