"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MultipleChoiceQuestion } from "@/types/quiz";

interface MultiChoiceCardProps {
  question: MultipleChoiceQuestion;
  onAnswer: (isCorrect: boolean) => void;
}

export default function MultiChoiceCard({
  question,
  onAnswer,
}: MultiChoiceCardProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleOptionClick = (optionId: string) => {
    if (submitted || selectedOption) return;

    setSelectedOption(optionId);
    setSubmitted(true);

    const isCorrect = optionId === question.correctOptionId;
    setTimeout(() => {
      onAnswer(isCorrect);
    }, 800);
  };

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      {/* Nửa trên (h-1/2): Question căn giữa hoàn toàn */}
      <div className="h-1/2 flex items-center justify-center p-4">
        <motion.h2
          className="text-5xl font-black text-white text-center leading-tight px-4 max-w-4xl"
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {question.question}
        </motion.h2>
      </div>

      {/* Nửa dưới (h-1/2): Options grid */}
      <div className="h-1/2 bg-black/40 backdrop-blur-xl p-6">
        <div className="grid grid-cols-2 gap-4 max-w-5xl mx-auto w-full h-full px-2">
          {question.options.map((option) => {
            const isSelected = selectedOption === option.id;
            const isCorrect =
              submitted && option.id === question.correctOptionId;
            const isWrong = submitted && isSelected && !isCorrect;

            return (
              <motion.button
                key={option.id}
                onClick={() => handleOptionClick(option.id)}
                disabled={submitted}
                className={cn(
                  "h-full rounded-3xl border-4 font-bold text-xl flex items-center justify-center p-6 transition-all duration-300 shadow-2xl relative overflow-hidden",
                  submitted
                    ? "cursor-default scale-100"
                    : "border-white/30 bg-white/10 hover:border-indigo-400 hover:bg-indigo-500/20 hover:shadow-indigo-500/50 hover:scale-[1.02] active:scale-95",
                  isCorrect &&
                    "border-emerald-400 bg-emerald-500/40 shadow-emerald-500/50 !scale-105",
                  isWrong &&
                    "border-red-400 bg-red-500/40 shadow-red-500/50 !scale-105",
                )}
                whileHover={submitted ? { scale: 1 } : { scale: 1.02 }}
                whileTap={submitted ? { scale: 1 } : { scale: 0.98 }}
                initial={false}
              >
                <span className="text-center leading-relaxed z-10">
                  {option.text}
                </span>
                {isCorrect && (
                  <CheckCircle className="absolute top-3 right-3 w-10 h-10 text-emerald-400 drop-shadow-2xl z-20" />
                )}
                {isWrong && (
                  <XCircle className="absolute top-3 right-3 w-10 h-10 text-red-400 drop-shadow-2xl z-20" />
                )}
                {submitted && (
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-transparent z-0" />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
