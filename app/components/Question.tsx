import React from "react";

interface QuestionProps {
  // Thay đổi kiểu dữ liệu từ string sang React.ReactNode để nhận được Component Markdown
  question: React.ReactNode; 
  transition: boolean;
}

export default function Question({ question, transition }: QuestionProps) {
  return (
    <div className="mb-10">
      {/* Thay đổi thẻ h2 thành thẻ div hoặc giữ nguyên h2 nhưng lưu ý: 
          ReactMarkdown sẽ render ra các thẻ p bên trong, 
          việc lồng thẻ p trong h2 có thể gây cảnh báo HTML Validation.
          Tôi chuyển thành div và giữ nguyên style của h2 để an toàn nhất.
      */}
      <div className={`text-3xl font-bold text-gray-800 leading-relaxed transition-all duration-300 ${
        transition ? 'opacity-0 transform translate-x-4' : 'opacity-100 transform translate-x-0'
      }`}>
        {question}
      </div>
    </div>
  );
}