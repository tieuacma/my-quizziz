"use client";

import { MarkdownRenderer } from "@components/MarkdownRenderer";

interface QuizIntroProps {
  mongoQuiz: {
    title: string;
    description?: string;
    slug: string;
  };
  existingSession: any;
  handleContinue: () => void;
  handleStartNew: () => void;
}

export default function QuizIntro({
  mongoQuiz,
  existingSession,
  handleContinue,
  handleStartNew,
}: QuizIntroProps) {
  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl p-10 max-w-lg w-full shadow-2xl text-center animate-in fade-in zoom-in duration-500">
        {/* Tiêu đề bài Quiz */}
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          {mongoQuiz.title}
        </h1>

        {/* Mô tả sử dụng Markdown để render công thức/định dạng */}
        <div className="text-gray-500 mb-8 leading-relaxed">
          <MarkdownRenderer
            content={mongoQuiz.description || "Hãy hoàn thành bài tập tốt nhất có thể!"}
          />
        </div>

        <div className="space-y-4">
          {existingSession ? (
            /* Trường hợp có session đang chơi dở */
            <>
              <button
                onClick={handleContinue}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-4 rounded-2xl font-bold text-lg transition-all shadow-lg hover:shadow-purple-200 active:scale-95"
              >
                Làm tiếp (Câu {existingSession.current_index + 1})
              </button>
              
              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-200"></span>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-400">Hoặc</span>
                </div>
              </div>

              <button
                onClick={handleStartNew}
                className="w-full border-2 border-gray-100 hover:border-red-200 hover:bg-red-50 text-gray-500 hover:text-red-600 py-3 rounded-2xl font-semibold transition-all active:scale-95"
              >
                Bắt đầu lượt mới
              </button>
              <p className="text-[10px] text-gray-400">
                * Lưu ý: Bắt đầu lượt mới sẽ xóa tiến trình hiện tại.
              </p>
            </>
          ) : (
            /* Trường hợp chơi mới hoàn toàn */
            <button
              onClick={handleStartNew}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold text-lg transition-all shadow-lg hover:shadow-blue-200 active:scale-95"
            >
              Bắt đầu chơi ngay
            </button>
          )}
        </div>
      </div>
    </main>
  );
}