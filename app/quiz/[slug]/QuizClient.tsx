"use client";
import { useState, useEffect, useMemo } from "react";
import { useQuiz } from "../../hooks/useQuiz";
import { useQuizSession } from "../../hooks/useQuizSession";
import Question from "../../components/Question";
import Options from "../../components/Options";
import FillInBlank from "../../components/FillInBlank";
import Timer from "../../components/Timer";
import ScoreDisplay from "../../components/ScoreDisplay";
import FinalScore from "../../components/FinalScore";
import PointsAnimation from "../../components/PointsAnimation";

import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

interface QuizClientProps {
  user: any;
  mongoQuiz: any;
}

// Export để Options.tsx và FillInBlank.tsx có thể dùng chung
export const MarkdownRenderer = ({ content }: { content: string }) => (
  <ReactMarkdown 
    remarkPlugins={[remarkMath]} 
    rehypePlugins={[rehypeKatex]}
    components={{
      // Đảm bảo các thẻ p từ Markdown không gây vỡ dòng không đáng có
      p: ({ children }) => <span className="inline-block m-0">{children}</span> 
    }}
  >
    {content}
  </ReactMarkdown>
);

export default function QuizClient({ user, mongoQuiz }: QuizClientProps) {
  const { getLatestSession, createNewSession } = useQuizSession();
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [existingSession, setExistingSession] = useState<any>(null);
  const [activeSession, setActiveSession] = useState<any>(null);

  useEffect(() => {
    async function checkSession() {
      const latest = await getLatestSession(user.id, mongoQuiz.slug);
      if (latest && latest.status === 'playing') {
        setExistingSession(latest);
      } else {
        setExistingSession(null);
      }
      setIsCheckingSession(false);
    }
    checkSession();
  }, [user.id, mongoQuiz.slug]);

  const handleStartNew = async () => {
    setIsCheckingSession(true);
    const newSession = await createNewSession(user.id, mongoQuiz);
    setActiveSession(newSession);
    setIsCheckingSession(false);
  };

  const handleContinue = () => {
    setActiveSession(existingSession);
  };

  if (isCheckingSession) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mb-4"></div>
        <p>Đang kiểm tra tiến độ của bạn...</p>
      </div>
    );
  }

  if (!activeSession) {
    return (
      <main className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl p-10 max-w-lg w-full shadow-2xl text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{mongoQuiz.title}</h1>
          <div className="text-gray-500 mb-8">
            <MarkdownRenderer content={mongoQuiz.description || "Hãy hoàn thành tốt nhất có thể!"} />
          </div>
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

  return <QuizGame activeSession={activeSession} mongoQuiz={mongoQuiz} />;
}

function QuizGame({ activeSession, mongoQuiz }: { activeSession: any; mongoQuiz: any }) {
  const orderedQuestions = useMemo(() => {
    return activeSession.questionnaire.map((qId: number) =>
      mongoQuiz.questions.find((q: any) => q.id === qId)
    ).filter(Boolean);
  }, [activeSession.questionnaire, mongoQuiz.questions]);

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

  const showSubQuestionList = subIndex === null || subIndex === undefined;

  if (isLoading) return <div className="text-white text-center">Đang tải câu hỏi...</div>;

  const activeQ = tempQuestion || questions[currentQuestion];

  const RenderImage = ({ src }: { src?: string }) => {
    if (!src) return null;
    return (
      <div className="w-full flex justify-center mb-6 overflow-hidden rounded-2xl border-4 border-gray-50 shadow-sm">
        <img 
          src={src} 
          alt="Quiz illustration" 
          className="max-h-[300px] w-auto object-contain hover:scale-105 transition-transform duration-500"
          onError={(e) => (e.currentTarget.style.display = 'none')}
        />
      </div>
    );
  };
  
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6 relative">
      <ScoreDisplay score={score} scoreUpdateAnimation={scoreUpdateAnimation} />
      <PointsAnimation showPointsAnimation={showPointsAnimation} pointsEarned={pointsEarned} />
      
      <div className="bg-white rounded-[2.5rem] shadow-2xl p-16 w-full max-w-7xl relative overflow-hidden transition-all duration-500">
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
          <div className="space-y-12">
            {showReviseSelection ? (
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
                  {activeQ.type !== "reading" && <RenderImage src={activeQ.image} />}
                  {activeQ.type === "reading" && !isReviseMode ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div className="bg-gray-50 p-6 rounded-2xl border-2 border-gray-200 overflow-y-auto max-h-[600px]">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Đọc đoạn văn sau:</h3>
                        <div className="text-gray-700 leading-relaxed">
                          <MarkdownRenderer content={activeQ.passage} />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Trả lời các câu hỏi:</h3>
                        {showSubQuestionList ? (
                          <div className="space-y-3">
                            {activeQ.subQuestions.map((subQ: any, index: number) => {
                              const completedSub = completedSubQuestions.find(sub => sub.id === subQ.id);
                              const isAnswered = !!completedSub;
                              const isCorrect = completedSub?.correct || false;

                              return (
                                <button
                                  key={subQ.id}
                                  onClick={() => {}}
                                  className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${
                                    !isAnswered
                                      ? 'border-gray-200 hover:border-purple-400 hover:bg-purple-50'
                                      : isCorrect
                                      ? 'border-green-500 bg-green-100 text-green-700'
                                      : 'border-red-500 bg-red-100 text-red-700'
                                  }`}
                                >
                                  <div className="flex items-center justify-between gap-4">
                                    <div className="font-medium flex-grow">
                                      <span>Câu {index + 1}: </span>
                                      <MarkdownRenderer content={subQ.question} />
                                    </div>
                                    {isAnswered && (
                                      <span className={`text-lg flex-shrink-0 ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                                        {isCorrect ? '✓' : '✗'}
                                      </span>
                                    )}
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="space-y-6">
                            <button
                              onClick={() => {}}
                              className="flex items-center text-purple-600 hover:text-purple-800 font-medium"
                            >
                              ← Quay lại danh sách câu hỏi
                            </button>

                            <div className="bg-white p-6 rounded-2xl border-2 border-purple-200">
                              <div className="text-lg font-semibold text-gray-800 mb-4">
                                <span className="mr-2">Câu {subIndex + 1}:</span>
                                <MarkdownRenderer content={activeQ.subQuestions[subIndex].question} />
                              </div>

                              {activeQ.subQuestions[subIndex].type === "reading_sub" ? (
                                <Options
                                  options={activeQ.subQuestions[subIndex].options}
                                  getOptionClass={getOptionClass}
                                  handleAnswerClick={handleAnswerClick}
                                  showFeedback={showFeedback}
                                />
                              ) : (
                                <FillInBlank
                                  question={activeQ.subQuestions[subIndex]}
                                  handleSubmit={handleAnswerClick}
                                  showFeedback={showFeedback}
                                  selectedAnswer={selectedAnswer as string}
                                  questionId={activeQ.subQuestions[subIndex].id}
                                />
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : activeQ.type === "multiple_choice" ? (
                    <Options
                      options={activeQ.options}
                      getOptionClass={getOptionClass}
                      handleAnswerClick={handleAnswerClick}
                      showFeedback={showFeedback}
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
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </main>
  );
}