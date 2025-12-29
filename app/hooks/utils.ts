import { Question } from "../data/quizdata";

// Tạo mã Hash từ mảng câu hỏi gốc để nhận biết thay đổi nội dung
export function hashQuestions(questions: Question[]): string {
  const str = JSON.stringify(questions);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0; // Chuyển thành số nguyên 32-bit
  }
  return hash.toString();
}

// Thuật toán xáo trộn mảng Fisher-Yates
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Xử lý xáo trộn câu hỏi và đáp án mà vẫn giữ đúng đáp án đúng
export const prepareQuestions = (data: Question[]): Question[] => {
  const shuffledQuestions = shuffleArray(data);
  return shuffledQuestions.map((question): Question => {
    if (question.type === "multiple_choice") {
      const shuffledOptions = shuffleArray(question.options);
      // Tìm nội dung của đáp án đúng cũ
      const correctAnswerText = question.options[question.answer - 1];
      // Tìm vị trí mới của nội dung đó trong mảng đã xáo trộn
      const newAnswerIndex = shuffledOptions.indexOf(correctAnswerText) + 1;
      return {
        ...question,
        options: shuffledOptions,
        answer: newAnswerIndex,
      };
    }
    return question;
  });
};