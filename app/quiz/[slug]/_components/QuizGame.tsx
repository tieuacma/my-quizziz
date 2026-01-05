"use client";

import { useMemo, useEffect } from "react";
import { useQuiz } from "@hooks/useQuiz";
import { MarkdownRenderer } from "@components/MarkdownRenderer";
import Question from "@components/Question";
import Options from "@components/Options";
import FillInBlank from "@components/FillInBlank";
import Timer from "@components/Timer";
import ScoreDisplay from "@components/ScoreDisplay";
import FinalScore from "@components/FinalScore";
import PointsAnimation from "@components/PointsAnimation";
import { useAudio } from "@hooks/useAudio";
import ReadingContent from "./ReadingContent";

interface QuizGameProps {
  activeSession: any;
  mongoQuiz: any;
}

export default function QuizGame({ activeSession, mongoQuiz }: QuizGameProps) {
  // --- 1. KHAI BÁO TẤT CẢ HOOKS Ở ĐÂY (TOP LEVEL) ---
  
  const { playBackgroundMusic } = useAudio();

  // Khởi tạo danh sách câu hỏi
  const orderedQuestions = useMemo(() => {
    return activeSession.questionnaire
      .map((qId: number) => mongoQuiz.questions.find((q: any) => q.id === qId))
      .filter(Boolean);
  }, [activeSession.questionnaire, mongoQuiz.questions]);

  // Sử dụng custom hook quản lý logic game
  const {
    currentQuestion, score, showScore, timeLeft, selectedAnswer, showFeedback,
    pointsEarned, showPointsAnimation, scoreUpdateAnimation, handleAnswerClick,
    getOptionClass, questions, correctAnswers, totalTimeSpent, maxStreak,
    isLoading, showReviseSelection, reviseOptions, selectReviseQuestion,
    tempQuestion, isReviseMode, subIndex, completedSubQuestions
  } = useQuiz({
    initialQuestions: orderedQuestions,
    sessionId: activeSession.id,
    initialState: {
      currentQuestion: activeSession.current_index || 0,
      score: activeSession.score || 0,
      wrongAnswers: activeSession.wrong_answers || []
    }
  });

  // Chạy nhạc nền khi game bắt đầu (đã chuyển lên trước lệnh return isLoading)
  useEffect(() => {
    if (!isLoading && !showScore) {
      playBackgroundMusic();
    }
  }, [playBackgroundMusic, isLoading, showScore]);

  // --- 2. LOGIC HELPER (Không chứa Hook) ---

  const getMainReadingQuestion = (subQ: any) => {
    return orderedQuestions.find((q: any) => 
      q.type === "reading" && q.subQuestions?.some((s: any) => s.id === subQ.id)
    );
  };

  const RenderImage = ({ src }: { src?: string }) => {
    if (!src) return null;
    return (
      <div className="w-full flex justify-center mb-6 overflow-hidden rounded-2xl border-4 border-gray-50 shadow-sm">
        <img 
          src={src} 
          alt="Quiz illustration" 
          className="max-h-[300px] w-auto object-contain hover:scale-105 transition-transform duration-500"
        />
      </div>
    );
  };

  // --- 3. KIỂM TRA ĐIỀU KIỆN RENDER SỚM (Sau khi đã gọi hết Hook) ---

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-center p-10 animate-pulse">
          <div className="text-4xl mb-4">🎮</div>
          Đang tải câu hỏi...
        </div>
      </div>
    );
  }

  const activeQ = tempQuestion || questions[currentQuestion];

  // --- 4. RENDER GIAO DIỆN CHÍNH ---

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6 relative">
      <ScoreDisplay score={score} scoreUpdateAnimation={scoreUpdateAnimation} />
      <PointsAnimation showPointsAnimation={showPointsAnimation} pointsEarned={pointsEarned} />
      
      <div className="bg-white rounded-[2.5rem] shadow-2xl p-8 md:p-16 w-full max-w-7xl relative overflow-hidden transition-all duration-500">
        {/* Thanh trạng thái phía trên */}
        <div className={`absolute top-0 left-0 w-full h-4 transition-colors duration-500 ${isReviseMode ? 'bg-orange-500' : 'bg-gradient-to-r from-purple-500 via-pink-500 to-red-500'}`}></div>

        {showScore ? (
          <FinalScore
            score={score}
            totalQuestions={questions.length}
            correctAnswers={correctAnswers}
            totalTimeSpent={totalTimeSpent}
            maxStreak={maxStreak}
            onPlayAgain={() => window.location.reload()}
          />
        ) : (
          <div className="space-y-10">
            {showReviseSelection ? (
              /* MÀN HÌNH PHỤC THÙ */
              <div className="flex flex-col items-center justify-center space-y-10 py-10 animate-in fade-in zoom-in">
                <div className="text-center">
                  <h2 className="text-4xl font-black text-orange-500">PHỤC THÙ!</h2>
                  <p className="text-gray-500 mt-2 text-lg">Chọn 1 câu đã làm sai để xóa lỗi:</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                  {reviseOptions.map((q: any) => (
                    <button
                      key={q.id}
                      onClick={() => selectReviseQuestion(q)}
                      className="bg-white border-4 border-orange-50 p-8 rounded-3xl hover:border-orange-400 hover:shadow-xl transition-all group text-left h-60 flex flex-col justify-between"
                    >
                      <div className="text-gray-600 font-medium italic line-clamp-3">
                         <MarkdownRenderer content={q.question} />
                      </div>
                      <span className="text-orange-500 font-bold group-hover:translate-x-2 transition-transform">Sửa câu này →</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* MÀN HÌNH CHƠI CHÍNH */
              <>
                <div className="relative w-full">
                  <Timer
                    currentQuestion={currentQuestion}
                    questionsLength={questions.length}
                    timeLeft={timeLeft}
                    timeLimit={activeQ?.timeLimit || 20}
                  />
                  {isReviseMode && (
                    <div className="absolute -top-2 right-0 bg-orange-500 text-white px-4 py-1 rounded-full font-bold text-xs animate-bounce shadow-md">
                      ⚡ CHẾ ĐỘ PHỤC THÙ
                    </div>
                  )}
                </div>
                
                <div className="py-4 text-2xl font-bold">
                  <Question 
                    question={<MarkdownRenderer content={activeQ.question} />} 
                    transition={showFeedback} 
                  />
                </div>

                <div className="mt-10">
                  {activeQ.type === "reading" || activeQ.type === "reading_sub" ? (
                    <ReadingContent
                      activeQ={activeQ.type === "reading_sub" ? getMainReadingQuestion(activeQ) : activeQ}
                      subIndex={activeQ.type === "reading_sub" ? undefined : subIndex}
                      completedSubQuestions={completedSubQuestions}
                      handleAnswerClick={handleAnswerClick}
                      getOptionClass={getOptionClass}
                      showFeedback={showFeedback}
                      selectedAnswer={selectedAnswer as string}
                      isReviseMode={isReviseMode}
                      reviseSubQuestion={activeQ.type === "reading_sub" ? activeQ : undefined}
                    />
                  ) : (
                    <>
                      <RenderImage src={activeQ.image} />
                      {activeQ.options && activeQ.options.length > 0 ? (
                        <Options
                          options={activeQ.options}
                          getOptionClass={getOptionClass}
                          handleAnswerClick={handleAnswerClick}
                          showFeedback={showFeedback}
                          questionId={activeQ.id}
                          questionType={activeQ.type}
                        />
                      ) : (
                        <FillInBlank
                          question={activeQ}
                          handleSubmit={handleAnswerClick}
                          showFeedback={showFeedback}
                          selectedAnswer={selectedAnswer as string}
                          questionId={activeQ.id}
                        />
                      )}
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </main>
  );
}