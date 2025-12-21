import { useState } from "react";
import { FillInBlankQuestion } from "../data/quizdata";

interface FillInBlankProps {
  question: FillInBlankQuestion;
  handleSubmit: (answer: string) => void;
  showFeedback: boolean;
  selectedAnswer: string | null;
}

export default function FillInBlank({ question, handleSubmit, showFeedback, selectedAnswer }: FillInBlankProps) {
  const [inputValue, setInputValue] = useState("");

  const handleSubmitClick = () => {
    if (inputValue.trim()) {
      handleSubmit(inputValue.trim());
    }
  };

  const getInputClass = () => {
    if (!showFeedback) return "w-full p-6 border-2 border-gray-200 rounded-2xl focus:border-purple-400 focus:bg-purple-50 transition-all duration-200 text-xl";

    const isCorrect = Array.isArray(question.answer)
      ? question.answer.some(ans => ans.trim().toLowerCase() === inputValue.trim().toLowerCase())
      : question.answer.trim().toLowerCase() === inputValue.trim().toLowerCase();

    if (isCorrect) return "w-full p-6 border-2 border-green-500 bg-green-100 rounded-2xl shadow-md animate-pulse text-xl";
    return "w-full p-6 border-2 border-red-500 bg-red-100 rounded-2xl shadow-md text-xl";
  };

  const getCorrectAnswer = () => {
    return Array.isArray(question.answer) ? question.answer[0] : question.answer;
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Nhập câu trả lời của bạn..."
        className={getInputClass()}
        disabled={showFeedback}
        onKeyPress={(e) => e.key === 'Enter' && !showFeedback && handleSubmitClick()}
      />
      {!showFeedback && (
        <button
          onClick={handleSubmitClick}
          className="px-8 py-3 bg-purple-500 text-white rounded-2xl hover:bg-purple-600 transition-colors duration-200 font-semibold text-lg"
          disabled={!inputValue.trim()}
        >
          Xác nhận
        </button>
      )}
      {showFeedback && !Array.isArray(question.answer)
        ? question.answer.trim().toLowerCase() === inputValue.trim().toLowerCase()
        : showFeedback && Array.isArray(question.answer) && question.answer.some(ans => ans.trim().toLowerCase() === inputValue.trim().toLowerCase()) && (
        <div className="text-center">
          <p className="text-green-600 font-semibold text-lg">Đúng rồi!</p>
        </div>
      )}
      {showFeedback && !(Array.isArray(question.answer)
        ? question.answer.some(ans => ans.trim().toLowerCase() === inputValue.trim().toLowerCase())
        : question.answer.trim().toLowerCase() === inputValue.trim().toLowerCase()) && (
        <div className="text-center">
          <p className="text-red-600 font-semibold text-lg">Đáp án đúng:</p>
          <p className="text-green-600 font-bold text-xl">{getCorrectAnswer()}</p>
        </div>
      )}
    </div>
  );
}
