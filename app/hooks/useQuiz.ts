import { useState, useEffect, useMemo } from "react";
import { questions as originalQuestions, checkAnswer, Question } from "../data/quizdata";

// Fisher-Yates shuffle function
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export const useQuiz = () => {
  // Shuffle questions and options once when hook initializes
  const questions = useMemo(() => {
    // Clone and shuffle questions
    const shuffledQuestions = shuffleArray(originalQuestions);

    // For each multiple choice question, shuffle options and update answer
    return shuffledQuestions.map((question): Question => {
      if (question.type === "multiple_choice") {
        const shuffledOptions = shuffleArray(question.options);
        // Find the new index of the correct answer
        const correctAnswerText = question.options[question.answer - 1]; // answer is 1-based
        const newAnswerIndex = shuffledOptions.indexOf(correctAnswerText) + 1; // 1-based
        return {
          ...question,
          options: shuffledOptions,
          answer: newAnswerIndex,
        };
      }
      return question;
    });
  }, []); // Empty dependency array - shuffle only once per hook instance
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [timeLeft, setTimeLeft] = useState(questions[0].timeLimit);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [pointsEarned, setPointsEarned] = useState(0);
  const [showPointsAnimation, setShowPointsAnimation] = useState(false);
  const [scoreUpdateAnimation, setScoreUpdateAnimation] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalTimeSpent, setTotalTimeSpent] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);

  useEffect(() => {
    if (timeLeft > 0 && !showScore && !showFeedback) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showScore && !showFeedback) {
      handleNextQuestion();
    }
  }, [timeLeft, showScore, showFeedback]);

  const handleAnswerClick = (selectedOption: string) => {
    setSelectedAnswer(selectedOption);
    setShowFeedback(true);

    const question = questions[currentQuestion];
    let userAnswer: string | number;
    if (question.type === "multiple_choice") {
      userAnswer = question.options.indexOf(selectedOption) + 1;
    } else {
      userAnswer = selectedOption;
    }

    const timeSpent = question.timeLimit - timeLeft;
    setTotalTimeSpent(prev => prev + timeSpent);

    if (checkAnswer(question, userAnswer)) {
      setCorrectAnswers(prev => prev + 1);
      setCurrentStreak(prev => {
        const newStreak = prev + 1;
        setMaxStreak(currentMax => Math.max(currentMax, newStreak));
        return newStreak;
      });
      const timeLimit = question.timeLimit;
      const points = Math.round((1000 + (timeLeft / timeLimit) * 500) / 10) * 10;
      setPointsEarned(points);
      setTimeout(() => {
        setScore(prevScore => prevScore + points);
        setScoreUpdateAnimation(true);
        setTimeout(() => setScoreUpdateAnimation(false), 100);
        handleNextQuestion();
      }, 1000);
    } else {
      setCurrentStreak(0);
      setPointsEarned(0);
      setTimeout(() => {
        handleNextQuestion();
      }, 1000);
    }
  };

  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    setShowFeedback(false);
    setPointsEarned(0);
    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
      setTimeLeft(questions[nextQuestion].timeLimit);
    } else {
      setShowScore(true);
    }
  };

  const getOptionClass = (option: string) => {
    if (!showFeedback) return "w-full text-left p-6 border-2 border-gray-200 rounded-2xl hover:border-purple-400 hover:bg-purple-50 transition-all duration-200 group transform hover:scale-102 shadow-sm hover:shadow-md";

    const question = questions[currentQuestion];
    if (question.type !== "multiple_choice") return "";

    const isSelected = option === selectedAnswer;
    const isCorrect = question.options[question.answer - 1] === option;

    if (isSelected && isCorrect) return "w-full text-left p-6 border-2 border-green-500 bg-green-100 rounded-2xl shadow-md";
    if (isSelected && !isCorrect) return "w-full text-left p-6 border-2 border-red-500 bg-red-100 rounded-2xl shadow-md";
    if (!isSelected && isCorrect) return "w-full text-left p-6 border-2 border-green-500 bg-green-100 rounded-2xl shadow-md";
    return "w-full text-left p-6 border-2 border-gray-300 bg-gray-100 rounded-2xl opacity-50";
  };

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
  };
};