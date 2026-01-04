"use client";
import { useState, useEffect } from "react";

// Định nghĩa interface nội bộ để tránh lỗi import nếu file quizdata chưa cập nhật
interface FillInBlankProps {
  question: any;
  handleSubmit: (answer: string) => void;
  showFeedback: boolean;
  selectedAnswer: string | null;
  questionId: number | string;
}

export default function FillInBlank({ question, handleSubmit, showFeedback, questionId }: FillInBlankProps) {
  const [inputValue, setInputValue] = useState("");

  // CHỐT CHẶN 1: Reset khi questionId thay đổi (Câu tiếp theo)
  useEffect(() => {
    setInputValue("");
  }, [questionId]);

  const handleSubmitClick = () => {
    if (inputValue.trim() && !showFeedback) {
      handleSubmit(inputValue.trim());
    }
  };

  const isAnswerCorrect = () => {
    const userAns = inputValue.trim().toLowerCase();
    if (Array.isArray(question.answer)) {
      return question.answer.some((ans: string) => ans.trim().toLowerCase() === userAns);
    }
    return question.answer.trim().toLowerCase() === userAns;
  };

  const getInputClass = () => {
    const baseClass = "w-full p-6 border-2 rounded-2xl transition-all duration-200 text-xl outline-none ";
    if (!showFeedback) {
      return baseClass + "border-gray-200 focus:border-purple-400 focus:bg-purple-50";
    }
    return isAnswerCorrect() 
      ? baseClass + "border-green-500 bg-green-100 shadow-md animate-pulse text-green-700" 
      : baseClass + "border-red-500 bg-red-100 shadow-md text-red-700";
  };

  const getCorrectDisplay = () => {
    return Array.isArray(question.answer) ? question.answer[0] : question.answer;
  };

  return (
    <div className="flex flex-col items-center space-y-6 w-full max-w-2xl mx-auto">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Nhập câu trả lời của bạn..."
        className={getInputClass()}
        disabled={showFeedback}
        onKeyDown={(e) => e.key === 'Enter' && handleSubmitClick()}
        autoFocus
      />

      {!showFeedback ? (
        <button
          onClick={handleSubmitClick}
          className={`px-12 py-4 rounded-2xl font-bold text-lg transition-all ${
            inputValue.trim() 
              ? "bg-purple-500 text-white hover:bg-purple-600 shadow-lg" 
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
          disabled={!inputValue.trim()}
        >
          Xác nhận
        </button>
      ) : (
        <div className="animate-in fade-in slide-in-from-top-4 duration-300">
          {isAnswerCorrect() ? (
            <p className="text-green-600 font-bold text-2xl flex items-center gap-2">
              <span>✨</span> Đúng rồi!
            </p>
          ) : (
            <div className="text-center space-y-2">
              <p className="text-red-500 font-semibold text-lg">Rất tiếc, đáp án đúng là:</p>
              <p className="text-green-600 font-black text-3xl underline decoration-double">
                {getCorrectDisplay()}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}