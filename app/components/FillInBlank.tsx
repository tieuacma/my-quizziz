"use client";
import { useState, useEffect } from "react";

interface FillInBlankProps {
  question: any;
  handleSubmit: (answer: string) => void;
  showFeedback: boolean;
  selectedAnswer: string | null;
  questionId: number | string;
}

export default function FillInBlank({ question, handleSubmit, showFeedback, questionId }: FillInBlankProps) {
  const [inputValue, setInputValue] = useState("");

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
    // Chuyển đổi answer sang String để tránh lỗi .trim() is not a function
    if (Array.isArray(question.answer)) {
      return question.answer.some((ans: any) => String(ans).trim().toLowerCase() === userAns);
    }
    return String(question.answer).trim().toLowerCase() === userAns;
  };

  const getInputClass = () => {
    const baseClass = "w-full p-6 border-2 rounded-2xl transition-all duration-200 text-xl outline-none ";
    if (!showFeedback) {
      return baseClass + "border-gray-200 focus:border-purple-400 focus:bg-purple-50";
    }
    return isAnswerCorrect() 
      ? baseClass + "border-green-500 bg-green-100 shadow-md text-green-700" 
      : baseClass + "border-red-500 bg-red-100 shadow-md text-red-700";
  };

  const getCorrectDisplay = () => {
    const ans = Array.isArray(question.answer) ? question.answer[0] : question.answer;
    return String(ans);
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
            inputValue.trim() ? "bg-purple-500 text-white hover:bg-purple-600 shadow-lg" : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
          disabled={!inputValue.trim()}
        >Xác nhận</button>
      ) : (
        <div className="text-center">
          {isAnswerCorrect() ? (
            <p className="text-green-600 font-bold text-2xl">✨ Đúng rồi!</p>
          ) : (
            <div className="space-y-2">
              <p className="text-red-500 font-semibold">Đáp án đúng là:</p>
              <p className="text-green-600 font-black text-3xl underline">{getCorrectDisplay()}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}