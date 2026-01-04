"use client";
import { useState, useEffect, useMemo } from "react";
import { useQuiz } from "../../hooks/useQuiz";
import { useQuizSession } from "../../hooks/useQuizSession"; // Import hook quản lý session
import Question from "../../components/Question";
import Options from "../../components/Options";
import FillInBlank from "../../components/FillInBlank";
import Timer from "../../components/Timer";
import ScoreDisplay from "../../components/ScoreDisplay";
import FinalScore from "../../components/FinalScore";
import PointsAnimation from "../../components/PointsAnimation";

interface QuizClientProps {
  user: any;
  mongoQuiz: any;
  quizVersion: string;
}

export default function QuizClient({ user, mongoQuiz }: QuizClientProps) {
  const { getLatestSession, createNewSession } = useQuizSession();
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [existingSession, setExistingSession] = useState<any>(null);
  const [activeSession, setActiveSession] = useState<any>(null);

  // 1. Kiểm tra session cũ ngay khi vào trang
  useEffect(() => {
    async function checkSession() {
      const latest = await getLatestSession(user.id, mongoQuiz.slug);
      
      // Chỉ cho phép làm tiếp nếu status vẫn đang là 'playing'
      if (latest && latest.status === 'playing') {
        setExistingSession(latest);
      } else {
        setExistingSession(null);
      }
      setIsCheckingSession(false);
    }
    checkSession();
  }, [user.id, mongoQuiz.slug]);

  // 2. Logic bắt đầu lượt mới
  const handleStartNew = async () => {
    setIsCheckingSession(true);
    const newSession = await createNewSession(user.id, mongoQuiz);
    setActiveSession(newSession);
    setIsCheckingSession(false);
  };

  // 3. Logic làm tiếp
  const handleContinue = () => {
    setActiveSession(existingSession);
  };

  // --- GIAO DIỆN CHỜ & LỰA CHỌN ---
  if (isCheckingSession) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mb-4"></div>
        <p>Đang kiểm tra tiến độ của bạn...</p>
      </div>
    );
  }

  // Nếu chưa vào trận, hiện Menu lựa chọn
  if (!activeSession) {
    return (
      <main className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl p-10 max-w-lg w-full shadow-2xl text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{mongoQuiz.title}</h1>
          <p className="text-gray-500 mb-8">{mongoQuiz.description || "Hãy hoàn thành tốt nhất có thể!"}</p>
          
          <div className="space-y-4">
            {existingSession ? (
              <>
                <button
                  onClick={handleContinue}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-4 rounded-2xl font-bold text-lg transition-all shadow-lg hover:shadow-purple-200"
                >
                  Làm tiếp (Câu {existingSession.current_index + 1})
                </button>
                <button
                  onClick={handleStartNew}
                  className="w-full border-2 border-gray-200 hover:border-red-400 hover:bg-red-50 text-gray-600 py-4 rounded-2xl font-bold transition-all"
                >
                  Bắt đầu lượt mới
                </button>
              </>
            ) : (
              <button
                onClick={handleStartNew}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold text-lg transition-all shadow-lg"
              >
                Bắt đầu chơi ngay
              </button>
            )}
          </div>
        </div>
      </main>
    );
  }

  // Nếu đã chọn xong session -> Render Component QuizGame bên dưới
  return <QuizGame activeSession={activeSession} mongoQuiz={mongoQuiz} />;
}

// --- COMPONENT CHƠI GAME CHÍNH ---
function QuizGame({ activeSession, mongoQuiz }: { activeSession: any; mongoQuiz: any }) {
  // Sắp xếp lại câu hỏi theo đúng questionnaire lưu trong session
  const orderedQuestions = useMemo(() => {
    return activeSession.questionnaire.map((qId: number) => 
      mongoQuiz.questions.find((q: any) => q.id === qId)
    ).filter(Boolean);
  }, [activeSession.questionnaire, mongoQuiz.questions]);

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
    getOptionClass,
    questions,
    correctAnswers,
    totalTimeSpent,
    maxStreak,
    isLoading,
    resetQuiz,
  } = useQuiz({
    initialQuestions: orderedQuestions,
    sessionId: activeSession.id,
    initialState: {
      currentQuestion: activeSession.current_index || 0,
      score: activeSession.score || 0,
      wrongAnswers: activeSession.wrong_answers || []
    }
  });

  if (isLoading) return <div className="text-white text-center">Đang tải câu hỏi...</div>;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6 relative">
      <ScoreDisplay score={score} scoreUpdateAnimation={scoreUpdateAnimation} />
      <PointsAnimation showPointsAnimation={showPointsAnimation} pointsEarned={pointsEarned} />
      
      <div className="bg-white rounded-[2.5rem] shadow-2xl p-16 w-full max-w-7xl relative overflow-hidden transition-all duration-500">
        <div className="absolute top-0 left-0 w-full h-4 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500"></div>

        {showScore ? (
          <FinalScore
            score={score}
            totalQuestions={questions.length}
            correctAnswers={correctAnswers}
            totalTimeSpent={totalTimeSpent}
            maxStreak={maxStreak}
            onPlayAgain={() => window.location.reload()} // Reset bằng cách reload để check lại session
          />
        ) : (
          <div className="space-y-12">
            <Timer
              currentQuestion={currentQuestion}
              questionsLength={questions.length}
              timeLeft={timeLeft}
              timeLimit={questions[currentQuestion]?.timeLimit || 20}
            />
            
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