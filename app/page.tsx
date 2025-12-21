"use client";
import { useQuiz } from "./hooks/useQuiz";
import Question from "./components/Question";
import Options from "./components/Options";
import FillInBlank from "./components/FillInBlank";
import Timer from "./components/Timer";
import ScoreDisplay from "./components/ScoreDisplay";
import FinalScore from "./components/FinalScore";
import PointsAnimation from "./components/PointsAnimation";

export default function QuizPage() {
  const {
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
  } = useQuiz();

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4 relative">
      <ScoreDisplay score={score} scoreUpdateAnimation={scoreUpdateAnimation} />
      <PointsAnimation showPointsAnimation={showPointsAnimation} pointsEarned={pointsEarned} />

      <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-3xl relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500"></div>

        {showScore ? (
          <FinalScore 
            score={score} 
            totalQuestions={questions.length}
            correctAnswers={correctAnswers}
            totalTimeSpent={totalTimeSpent}
            maxStreak={maxStreak}
          />
        ) : (
          <div>
            <Timer
              currentQuestion={currentQuestion}
              questionsLength={questions.length}
              timeLeft={timeLeft}
              timeLimit={questions[currentQuestion].timeLimit}
            />
            <Question question={questions[currentQuestion].question} transition={showFeedback} />
            {questions[currentQuestion].type === "multiple_choice" ? (
              <Options
                options={questions[currentQuestion].options}
                getOptionClass={getOptionClass}
                handleAnswerClick={handleAnswerClick}
                showFeedback={showFeedback}
              />
            ) : (
              <FillInBlank
                question={questions[currentQuestion]}
                handleSubmit={handleAnswerClick}
                showFeedback={showFeedback}
                selectedAnswer={selectedAnswer}
                questionId={questions[currentQuestion].id}
              />
            )}
          </div>
        )}
      </div>
    </main>
  );
}
