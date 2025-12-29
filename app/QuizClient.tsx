"use client";
import { useState, useEffect } from "react"; // Thêm useState và useEffect
import { useQuiz } from "./hooks/useQuiz";
import Question from "./components/Question";
import Options from "./components/Options";
import FillInBlank from "./components/FillInBlank";
import Timer from "./components/Timer";
import ScoreDisplay from "./components/ScoreDisplay";
import FinalScore from "./components/FinalScore";
import PointsAnimation from "./components/PointsAnimation";

export default function QuizClient() {
  const [isMounted, setIsMounted] = useState(false); // Trạng thái kiểm tra đã mount chưa

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
    isLoading,
    resetQuiz,
  } = useQuiz();

  // Khắc phục lỗi Hydration: Chỉ cho phép render nội dung sau khi component đã mounted
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null; // Hoặc render một loading spinner đơn giản
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-6 relative">
      {/* Các thành phần hoạt động dựa trên logic Client-side */}
      <ScoreDisplay score={score} scoreUpdateAnimation={scoreUpdateAnimation} />
      <PointsAnimation showPointsAnimation={showPointsAnimation} pointsEarned={pointsEarned} />
      
      {/* Tăng max-w lên 7xl và p-16 để giao diện to và thoáng hơn */}
      <div className="bg-white rounded-[2.5rem] shadow-2xl p-16 w-full max-w-7xl relative overflow-hidden transition-all duration-500">
        {/* Thanh trang trí phía trên dày hơn */}
        <div className="absolute top-0 left-0 w-full h-4 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500"></div>

        {isLoading ? (
          <div className="text-center py-32">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600 mb-6"></div>
            <p className="text-2xl text-gray-600 font-medium">Đang chuẩn bị câu hỏi...</p>
          </div>
        ) : showScore ? (
          <FinalScore
            score={score}
            totalQuestions={questions.length}
            correctAnswers={correctAnswers}
            totalTimeSpent={totalTimeSpent}
            maxStreak={maxStreak}
            onPlayAgain={resetQuiz}
          />
        ) : (
          <div className="space-y-12"> {/* Tăng khoảng cách giữa các phần tử */}
            <Timer
              currentQuestion={currentQuestion}
              questionsLength={questions.length}
              timeLeft={timeLeft}
              timeLimit={questions[currentQuestion]?.timeLimit || 20}
            />
            
            {/* Thêm khoảng đệm cho Question */}
            <div className="py-4">
               <Question question={questions[currentQuestion].question} transition={showFeedback} />
            </div>

            <div className="mt-10">
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
          </div>
        )}
      </div>
    </main>
  );
}