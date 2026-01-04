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
  const [subIndex, setSubIndex] = useState(0); // CHỈ SỐ CÂU HỎI PHỤ (Dành cho Reading)
  const [score, setScore] = useState(initialState.score);
  const [wrongAnswers, setWrongAnswers] = useState<number[]>(initialState.wrongAnswers);
  const [showScore, setShowScore] = useState(false);

  // --- STATE PHỤC THÙ (REVISE) ---
  const [isReviseMode, setIsReviseMode] = useState(false);
  const [showReviseSelection, setShowReviseSelection] = useState(false);
  const [reviseOptions, setReviseOptions] = useState<any[]>([]); 
  const [tempQuestion, setTempQuestion] = useState<any | null>(null);

  // --- STATE CHO READING QUESTION ---
  const [completedSubQuestions, setCompletedSubQuestions] = useState<{id: number, correct: boolean}[]>([]); 

  // --- STATE GIAO DIỆN & UI ---
  const [isLoading, setIsLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(initialQuestions[initialState.currentQuestion]?.timeLimit || 20);
  const [selectedAnswer, setSelectedAnswer] = useState<string | number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [pointsEarned, setPointsEarned] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalTimeSpent, setTotalTimeSpent] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [showPointsAnimation, setShowPointsAnimation] = useState(false);
  const [scoreUpdateAnimation, setScoreUpdateAnimation] = useState(false);

  const isFirstRender = useRef(true);

  // --- ĐỒNG BỘ HÓA SUPABASE ---
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const syncProgress = async () => {
      if (!sessionId) return;
      // Không đồng bộ khi đang ở màn hình chọn câu hỏi phục thù để tránh ghi đè trạng thái tạm thời
      if (showReviseSelection) return;

      const { error } = await supabase
        .from('quiz_sessions')
        .update({
          current_index: currentQuestion,
          score: score,
          wrong_answers: wrongAnswers,
          status: showScore ? 'completed' : 'playing' 
        })
        .eq('id', sessionId);

      if (error) console.error("Sync Error:", error.message);
    };

    const timeoutId = setTimeout(syncProgress, 300);
    return () => clearTimeout(timeoutId);
  }, [currentQuestion, score, wrongAnswers, showScore, sessionId, supabase, showReviseSelection]);

  // --- HANDLERS ---
  const handlers = useQuizHandlers({
    questions,
    currentQuestion,
    subIndex,
    setSubIndex,
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
    wrongAnswers,
    setWrongAnswers: (id: number, isCorrectRevise: boolean = false) => {
      setWrongAnswers(prev => {
        if (isCorrectRevise) return prev.filter(qId => qId !== id);
        return prev.includes(id) ? prev : [...prev, id];
      });
    },
    isReviseMode,
    setIsReviseMode,
    showReviseSelection,
    setShowReviseSelection,
    reviseOptions,
    setReviseOptions,
    tempQuestion,
    setTempQuestion,
    completedSubQuestions,
    setCompletedSubQuestions
  });

  // --- EFFECTS ---
  useQuizEffects({
    isLoading,
    setIsLoading,
    timeLeft,
    setTimeLeft,
    showScore,
    showFeedback,
    questions,
    currentQuestion,
    handleAnswerClick: handlers.handleAnswerClick,
  });

  return {
    ...handlers, // Bao gồm handleNextQuestion, handleAnswerClick, getOptionClass, selectReviseQuestion, resetQuiz
    questions,
    currentQuestion,
    subIndex,
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
    wrongAnswers,
    isReviseMode,
    showReviseSelection,
    reviseOptions,
    tempQuestion,
    completedSubQuestions,
    currentStreak
  };
};