"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuizLogic } from "@/hooks/useQuizLogic";
import { QuizQuestion } from "@/types/quiz";
import QuizLayout from "./QuizLayout";
import LoadingState from "./LoadingState";
import QuizSummary from "./QuizSummary";
import { sampleQuizData } from "./sample-data";

interface QuizGameProps {
  profileId: string;
  quizId: string;
  initialQuestions?: QuizQuestion[];
}

export default function QuizGame({
  profileId,
  quizId,
  initialQuestions,
}: QuizGameProps) {
  console.log("[QUIZ-GAME] Rendered with props:", {
    profileId,
    quizId,
    initialQuestions: initialQuestions?.length,
  });

  const {
    questions,
    quizState,
    timeLeft,
    currentQuestion,
    handleAnswer,
    handleSubQuestionAnswer,
    handleCompleteReading,
    readingSubAnswers,
    isReadingQuestionComplete,
    goToPrevious,
    restartQuiz,
    isQuizFinished,
  } = useQuizLogic(
    initialQuestions || sampleQuizData.questions,
    profileId,
    quizId,
  );

  console.log("[QUIZ-GAME] quizState.status:", quizState.status);

  if (quizState.status === "idle") {
    return <LoadingState />;
  }

  return (
    <AnimatePresence mode="wait">
      {isQuizFinished ? (
        <motion.div
          key="summary"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
        >
          <QuizSummary
            quizState={quizState}
            incorrectQuestions={questions.filter((q) =>
              quizState.incorrect_questions.includes(q.id),
            )}
          />
        </motion.div>
      ) : (
        <motion.div
          key={`question-${currentQuestion?.id}`}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.4 }}
        >
          <QuizLayout
            quizState={quizState}
            timeLeft={timeLeft}
            currentQuestion={currentQuestion}
            questions={questions}
            handleAnswer={handleAnswer}
            handleSubQuestionAnswer={handleSubQuestionAnswer}
            handleCompleteReading={handleCompleteReading}
            readingSubAnswers={readingSubAnswers}
            isReadingQuestionComplete={isReadingQuestionComplete}
            goToPrevious={goToPrevious}
            restartQuiz={restartQuiz}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
