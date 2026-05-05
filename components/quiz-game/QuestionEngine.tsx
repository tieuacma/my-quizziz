"use client";

import React from "react";
import type {
  QuizQuestion,
  QuizState,
  ReadingQuestion,
  MultipleChoiceQuestion,
} from "@/types/quiz";
import MultiChoiceCard from "./MultiChoiceCard";
import ReadingCard from "./ReadingCard";

interface QuestionEngineProps {
  question?: QuizQuestion;
  quizState: QuizState & { currentSubQuestionIndex: number };
  handleAnswer: (isCorrect: boolean) => void;
  handleSubQuestionAnswer?: (subId: string, optionId: string) => void;
  handleCompleteReading?: (question: ReadingQuestion) => void;
  readingSubAnswers: Record<string, string>;
  isReadingQuestionComplete: (question?: QuizQuestion) => boolean;
}

export default function QuestionEngine({
  question,
  quizState,
  handleAnswer,
  handleSubQuestionAnswer,
  handleCompleteReading,
  readingSubAnswers,
  isReadingQuestionComplete,
}: QuestionEngineProps) {
  if (!question) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-black/50">
        Loading question...
      </div>
    );
  }

  const renderQuestionContent = () => {
    switch (question.type) {
      case "multiple-choice":
        return (
          <MultiChoiceCard
            question={question as MultipleChoiceQuestion}
            onAnswer={handleAnswer}
          />
        );
      case "reading":
        return (
          <ReadingCard
            question={question as ReadingQuestion}
            onSubAnswer={handleSubQuestionAnswer!}
            onComplete={handleCompleteReading!}
            readingSubAnswers={readingSubAnswers}
            currentSubQuestionIndex={quizState.currentSubQuestionIndex}
            isReadingQuestionComplete={() =>
              isReadingQuestionComplete(question)
            }
          />
        );
      default:
        return (
          <div className="w-full h-full flex items-center justify-center text-white text-2xl">
            Question type not supported: {question.type}
          </div>
        );
    }
  };

  return (
    <div className="w-full h-full overflow-hidden flex flex-col">
      {renderQuestionContent()}
    </div>
  );
}
