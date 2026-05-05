"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import type {
  ReadingQuestion,
  ReadingSubQuestion,
  MultipleChoiceOption,
} from "@/types/quiz";

interface ReadingCardProps {
  question: ReadingQuestion;
  onSubAnswer: (subId: string, optionId: string) => void;
  onComplete: (question: ReadingQuestion) => void;
  readingSubAnswers: Record<string, string>;
  currentSubQuestionIndex: number;
  isReadingQuestionComplete: () => boolean;
}

export default function ReadingCard({
  question,
  onSubAnswer,
  onComplete,
  readingSubAnswers,
  currentSubQuestionIndex,
  isReadingQuestionComplete,
}: ReadingCardProps) {
  const currentSub = question.questions[
    currentSubQuestionIndex
  ] as ReadingSubQuestion & {
    correctOptionId?: string;
    options?: MultipleChoiceOption[];
  };

  const isComplete = isReadingQuestionComplete();
  const answeredCount = Object.keys(readingSubAnswers).length;
  const totalSubs = question.questions.length;

  const handleOptionClick = (optionId: string) => {
    if (!currentSub.correctOptionId || readingSubAnswers[currentSub.id]) return;
    onSubAnswer(currentSub.id, optionId);
  };

  return (
    <div className="w-full h-full flex flex-col overflow-hidden bg-black/10 min-h-0">
      {/* Tầng Trên: h-[60vh] flex-row */}
      <div className="flex-1 flex border-b border-white/10 min-h-0">
        {/* Nửa Trái (w-1/2): Passage scrollable */}
        <div className="w-1/2 overflow-y-auto min-h-0 p-8 scrollbar-thin scrollbar-thumb-white/30 scrollbar-track-black/50">
          <motion.div
            className="h-full prose prose-xl max-w-none text-slate-200 leading-relaxed bg-white/5 backdrop-blur-xl rounded-3xl border border-white/20 p-8 shadow-2xl"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="prose prose-lg">
              <p className="break-words whitespace-pre-wrap">
                {question.passage}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Nửa Phải (w-1/2): Current subquestion centered */}
        <div className="w-1/2 flex items-center justify-center p-8 bg-black/20">
          <motion.div
            className="text-center w-full max-w-3xl px-8"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-4xl md:text-5xl font-black text-white mb-12 leading-tight drop-shadow-2xl">
              {currentSub.question}
            </h2>
            <div className="text-xl text-slate-300 font-semibold">
              Question {currentSubQuestionIndex + 1} of {totalSubs}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Tầng Dưới: flex-1 bg-black/40 options + complete btn */}
      <div className="flex-1 flex flex-col overflow-hidden min-h-0 bg-black/40 border-t border-white/20">
        {/* Options scrollable area */}
        <div className="flex-1 overflow-y-auto p-8 space-y-4 min-h-0 scrollbar-thin scrollbar-thumb-white/30 scrollbar-track-black/50">
          {currentSub.options?.map((option) => {
            const userAnswer = readingSubAnswers[currentSub.id];
            const isCorrect =
              !!currentSub.correctOptionId &&
              currentSub.correctOptionId === option.id;
            const isAnswered = !!userAnswer;
            const isSelected = userAnswer === option.id;

            return (
              <motion.button
                key={option.id}
                onClick={() => handleOptionClick(option.id)}
                disabled={isAnswered}
                className={cn(
                  "w-full h-24 rounded-3xl border-3 p-6 font-bold text-xl flex items-center shadow-2xl transition-all duration-300 relative overflow-hidden group",
                  isAnswered
                    ? "cursor-default scale-100"
                    : "border-white/20 bg-white/10 hover:border-indigo-400 hover:bg-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-[1.02] active:scale-98",
                  isAnswered &&
                    isCorrect &&
                    "border-emerald-400 bg-emerald-500/40 shadow-emerald-500/50 !scale-105",
                  isAnswered &&
                    isSelected &&
                    !isCorrect &&
                    "border-red-400 bg-red-500/40 shadow-red-500/50 !scale-105",
                )}
                whileHover={isAnswered ? { scale: 1 } : { scale: 1.02 }}
                whileTap={isAnswered ? { scale: 1 } : { scale: 0.98 }}
              >
                {isAnswered && (
                  <div className="mr-6 flex-shrink-0">
                    {isCorrect ? (
                      <div className="w-12 h-12 bg-emerald-400/20 rounded-2xl flex items-center justify-center border-2 border-emerald-400">
                        <span className="text-emerald-400 font-bold text-2xl">
                          ✓
                        </span>
                      </div>
                    ) : isSelected ? (
                      <div className="w-12 h-12 bg-red-400/20 rounded-2xl flex items-center justify-center border-2 border-red-400">
                        <span className="text-red-400 font-bold text-2xl">
                          ✗
                        </span>
                      </div>
                    ) : null}
                  </div>
                )}
                <span className="flex-1 text-left leading-relaxed group-hover:text-white">
                  {option.text}
                </span>
              </motion.button>
            );
          }) || (
            <div className="w-full h-full flex items-center justify-center text-slate-400 text-xl">
              No options available
            </div>
          )}
        </div>

        {/* Complete button fixed bottom */}
        <div className="p-8 border-t border-white/30 bg-black/60">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <Button
              onClick={() => onComplete(question)}
              disabled={!isComplete}
              size="lg"
              className={cn(
                "w-full h-20 text-2xl font-black rounded-3xl shadow-2xl border-4 transition-all duration-500 flex items-center justify-center gap-3 group",
                isComplete
                  ? "bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-600 hover:via-teal-600 hover:to-emerald-700 border-emerald-400/50 shadow-emerald-500/50 hover:shadow-emerald-500/75 hover:scale-[1.02] hover:-translate-y-1"
                  : "bg-gray-800/50 border-gray-600/50 cursor-not-allowed opacity-60 scale-95",
              )}
            >
              <ChevronRight
                className={cn(
                  "w-8 h-8 transition-transform group-hover:translate-x-1",
                  !isComplete && "opacity-50",
                )}
              />
              <span className="uppercase tracking-wider">
                {isComplete
                  ? `Complete Reading Section (${answeredCount}/${totalSubs})`
                  : `Answer all ${totalSubs} questions first`}
              </span>
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
