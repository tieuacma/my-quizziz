"use client";

import { MarkdownRenderer } from "@components/MarkdownRenderer";
import Options from "@components/Options";
import FillInBlank from "@components/FillInBlank";

interface ReadingContentProps {
  activeQ: any;
  subIndex: number | null | undefined;
  completedSubQuestions: any[];
  handleAnswerClick: (answer: any) => void;
  getOptionClass: (option: any) => string;
  showFeedback: boolean;
  selectedAnswer: string | null;
  isReviseMode?: boolean;
  reviseSubQuestion?: any;
}

export default function ReadingContent({
  activeQ,
  subIndex,
  completedSubQuestions,
  handleAnswerClick,
  getOptionClass,
  showFeedback,
  selectedAnswer,
  isReviseMode = false,
  reviseSubQuestion,
}: ReadingContentProps) {
  // Safety check for activeQ
  if (!activeQ) {
    return <div className="text-center p-8 text-red-500">Error: Reading question not found</div>;
  }

  const showSubQuestionList = (subIndex === null || subIndex === undefined);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* CỘT TRÁI: NỘI DUNG BÀI ĐỌC */}
      <div className="bg-slate-50 p-8 rounded-3xl border-2 border-slate-100 shadow-inner overflow-y-auto max-h-[650px] custom-scrollbar">
        <div className="sticky top-0 bg-slate-50 pb-4 mb-4 border-b border-slate-200">
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">Reading Passage</h3>
        </div>
        <div className="text-slate-700 leading-relaxed text-lg prose prose-slate max-w-none">
          <MarkdownRenderer content={activeQ.passage} />
        </div>
      </div>

      {/* CỘT PHẢI: CÂU HỎI CON */}
      <div className="flex flex-col h-full">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <span className="bg-purple-100 text-purple-600 px-3 py-1 rounded-lg text-sm">Questions</span>
          Làm các câu hỏi dưới đây:
        </h3>

        {isReviseMode && reviseSubQuestion ? (
          /* HIỂN THỊ CHI TIẾT CÂU HỎI PHỤC THÙ (REVISE MODE) */
          <div className="bg-white p-8 rounded-3xl border-2 border-orange-200 shadow-xl shadow-orange-50/50 animate-in zoom-in-95 duration-300">
            <div className="mb-6 flex items-center justify-between">
               <span className="font-black text-orange-600">CÂU HỎI PHỤC THÙ</span>
            </div>

            <div className="text-xl font-bold text-gray-800 mb-8 leading-snug">
              <MarkdownRenderer content={reviseSubQuestion.question} />
            </div>

            {(reviseSubQuestion.type === "multiple_choice" ||
              reviseSubQuestion.type === "true_false" ||
              reviseSubQuestion.type === "reading_sub") ? (
              <Options
                options={(reviseSubQuestion.type === "true_false" ||
                         reviseSubQuestion.type === "reading_sub")
                  ? ["Đúng", "Sai"]
                  : reviseSubQuestion.options}
                getOptionClass={getOptionClass}
                handleAnswerClick={handleAnswerClick}
                showFeedback={showFeedback}
              />
            ) : (
              <FillInBlank
                question={reviseSubQuestion}
                handleSubmit={handleAnswerClick}
                showFeedback={showFeedback}
                selectedAnswer={selectedAnswer as string}
                questionId={reviseSubQuestion.id}
              />
            )}
          </div>
        ) : showSubQuestionList ? (
          /* HIỂN THỊ DANH SÁCH CÂU HỎI CON (OVERVIEW) */
          <div className="space-y-4">
            {activeQ.subQuestions.map((subQ: any, index: number) => {
              const completedSub = completedSubQuestions.find((sub) => sub.id === subQ.id);
              const isAnswered = !!completedSub;
              const isCorrect = completedSub?.correct || false;

              return (
                <div
                  key={subQ.id}
                  className={`group p-5 rounded-2xl border-2 transition-all duration-300 ${
                    !isAnswered
                      ? "border-gray-100 bg-white hover:border-purple-300 hover:shadow-md"
                      : isCorrect
                      ? "border-green-500 bg-green-50"
                      : "border-red-500 bg-red-50"
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="font-medium text-gray-700">
                      <span className="text-gray-400 mr-2">#{index + 1}</span>
                      <MarkdownRenderer content={subQ.question} />
                    </div>
                    {isAnswered && (
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                        isCorrect ? "bg-green-500 text-white" : "bg-red-500 text-white"
                      }`}>
                        {isCorrect ? "✓" : "✗"}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : subIndex !== null && subIndex !== undefined ? (
          /* HIỂN THỊ CHI TIẾT CÂU HỎI ĐANG CHỌN (ACTIVE) */
          <div className="bg-white p-8 rounded-3xl border-2 border-purple-100 shadow-xl shadow-purple-50/50 animate-in zoom-in-95 duration-300">
            <div className="mb-6 flex items-center justify-between">
               <span className="font-black text-purple-600">CÂU HỎI {subIndex + 1}</span>
            </div>

            <div className="text-xl font-bold text-gray-800 mb-8 leading-snug">
              <MarkdownRenderer content={activeQ.subQuestions[subIndex].question} />
            </div>

            {(activeQ.subQuestions[subIndex].type === "multiple_choice" ||
              activeQ.subQuestions[subIndex].type === "true_false" ||
              activeQ.subQuestions[subIndex].type === "reading_sub") ? (
              <Options
                options={(activeQ.subQuestions[subIndex].type === "true_false" ||
                         activeQ.subQuestions[subIndex].type === "reading_sub")
                  ? ["Đúng", "Sai"]
                  : activeQ.subQuestions[subIndex].options}
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
        ) : null}
      </div>
    </div>
  );
}
