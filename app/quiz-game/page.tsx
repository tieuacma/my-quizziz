"use client";

import QuizGame from "@/components/quiz-game/QuizGame";
import { sampleQuizData } from "@/components/quiz-game/sample-data";

export default function QuizGamePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50">
      <div className="container mx-auto py-12 px-4">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-600 bg-clip-text text-transparent mb-6">
            Quiz Game
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto">
            Test the fully functional Quizizz-style game with shuffle algorithm,
            animations, scoring, streak system, and responsive design.
          </p>
        </div>

        <QuizGame
          profileId="demo-user-123"
          quizId="demo-quiz-456"
          initialQuestions={sampleQuizData.questions}
        />
      </div>
    </main>
  );
}
