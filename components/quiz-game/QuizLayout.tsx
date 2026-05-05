"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ReadingQuestion } from "@/types/quiz";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Clock, ChevronRight, BookOpen } from "lucide-react";
import StreakAndRank from "./StreakAndRank";
import ScoreBoard from "./ScoreBoard";
import ProgressStats from "./ProgressStats";
import QuestionEngine from "./QuestionEngine";
import type { QuizQuestion, QuizState } from "@/types/quiz";

interface QuizLayoutProps {
  quizState: QuizState;
  timeLeft: number;
  currentQuestion: QuizQuestion | undefined;
  questions: QuizQuestion[];
  handleAnswer: (isCorrect: boolean) => void;
  handleSubQuestionAnswer: (subId: string, optionId: string) => void;
  handleCompleteReading: (question: ReadingQuestion) => void;
  readingSubAnswers: Record<string, string>;
  isReadingQuestionComplete: (question?: QuizQuestion) => boolean;
  goToPrevious: () => void;
  restartQuiz: () => void;
}

export default function QuizLayout({
  quizState,
  timeLeft,
  currentQuestion,
  questions,
  handleAnswer,
  handleSubQuestionAnswer,
  handleCompleteReading,
  readingSubAnswers,
  isReadingQuestionComplete,
  goToPrevious,
  //  restartQuiz,
}: QuizLayoutProps) {
  const rawProgress =
    ((quizState.current_question_index ?? 0) + 1) / (questions.length || 1);

  const progress = Number.isFinite(rawProgress) ? rawProgress * 100 : 0;
  const isReading = currentQuestion?.type === "reading";
  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white">
      {/* Header - Glassmorphism */}
      <header className="w-full shrink-0 backdrop-blur-md bg-white/10 border-b border-white/20 px-6 py-4 flex items-center justify-between z-50">
        <div className="flex items-center gap-6">
          <StreakAndRank streak={quizState.streak} />
          <motion.div className="relative">
            <Progress
              value={progress}
              className="w-48 h-3 bg-white/20 [&>div]:bg-gradient-to-r [&>div]:from-indigo-400 via-purple-400 to-pink-400 shadow-lg [&>div]:shadow-[0_0_20px_rgba(147,51,234,0.6)]"
            />
            <motion.div
              className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur opacity-75 animate-shimmer"
              style={{ width: `${progress}%` }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </motion.div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 px-4 py-2 backdrop-blur-sm bg-black/20 rounded-xl">
            <Clock className="w-5 h-5" />
            <span className="font-mono font-bold text-lg">{timeLeft}s</span>
          </div>
          <ScoreBoard score={quizState.score} />
        </div>
      </header>

      {/* Main Vertical Stack Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 min-h-0">
          <QuestionEngine
            question={currentQuestion}
            quizState={
              quizState as QuizState & { currentSubQuestionIndex: number }
            }
            handleAnswer={handleAnswer}
            handleSubQuestionAnswer={handleSubQuestionAnswer}
            handleCompleteReading={handleCompleteReading}
            readingSubAnswers={readingSubAnswers}
            isReadingQuestionComplete={isReadingQuestionComplete}
          />
        </div>
      </main>

      {/* Footer - Glassmorphism */}
      <footer className="w-full shrink-0 backdrop-blur-md bg-white/10 border-t border-white/20 py-4 flex justify-center z-50">
        <div className="w-full max-w-5xl flex items-center justify-center px-6">
          <ProgressStats
            correctCount={quizState.correct_count}
            wrongCount={quizState.wrong_count}
          />
        </div>
      </footer>
    </div>
  );
}
