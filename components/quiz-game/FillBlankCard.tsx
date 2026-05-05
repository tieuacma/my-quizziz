"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FillInBlankQuestion } from "@/types/quiz";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface FillBlankCardProps {
  question: FillInBlankQuestion;
  onAnswer: (isCorrect: boolean) => void;
}

export default function FillBlankCard({
  question,
  onAnswer,
}: FillBlankCardProps) {
  const [userAnswer, setUserAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const checkAnswer = () => {
    if (submitted) return;

    const normalizedUserAnswer = question.caseSensitive
      ? userAnswer.trim()
      : userAnswer.trim().toLowerCase();

    const isMatch = question.answers.some((answer) =>
      question.caseSensitive
        ? normalizedUserAnswer === answer.trim()
        : normalizedUserAnswer === answer.toLowerCase().trim(),
    );

    setIsCorrect(isMatch);
    setSubmitted(true);

    setTimeout(() => {
      onAnswer(isMatch);
    }, 1200);
  };

  useEffect(() => {
    return () => {
      setUserAnswer("");
      setSubmitted(false);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-4xl flex flex-col items-center gap-12"
    >
      <div className="w-full bg-white rounded-2xl shadow-md p-8 md:p-12 border border-slate-200">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 text-center leading-tight mb-12 px-4">
          {question.question}
        </h2>

        <div className="flex flex-col items-center gap-8">
          <div className="w-full max-w-3xl relative mx-auto">
            <Input
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Enter your answer here..."
              className="w-full h-24 lg:h-28 text-3xl lg:text-4xl text-center rounded-3xl border-4 border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 shadow-xl transition-all p-0"
              disabled={submitted}
            />
            {submitted && (
              <motion.div
                className={cn(
                  "absolute inset-0 flex items-center justify-center rounded-3xl text-4xl font-black shadow-2xl transition-all duration-500 z-10",
                  isCorrect ? "bg-emerald-500" : "bg-red-500",
                )}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                {isCorrect ? (
                  <CheckCircle className="w-20 h-20 text-white" />
                ) : (
                  <XCircle className="w-20 h-20 text-white" />
                )}
              </motion.div>
            )}
          </div>

          {!submitted ? (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <Button
                size="lg"
                className="w-full max-w-lg px-16 py-10 text-2xl font-bold bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-2xl"
                onClick={checkAnswer}
              >
                Check Answer
              </Button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ scale: 1.1, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-4xl font-black text-center px-8 py-6 rounded-2xl bg-slate-100 border-4 border-slate-300"
            >
              {isCorrect ? "✅ Correct!" : "❌ Keep trying!"}
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
