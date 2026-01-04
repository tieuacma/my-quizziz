import { Question, MultipleChoiceQuestion } from "../data/quizdata";

/**
 * Tạo mã Hash rút gọn từ mảng câu hỏi
 * Dùng để phát hiện thay đổi dữ liệu từ MongoDB nhanh chóng.
 */
export const hashQuestions = (questions: Question[]): string => {
  const str = JSON.stringify(questions);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0; // Ép kiểu về số nguyên 32-bit
  }
  return hash.toString();
};

/**
 * Thuật toán xáo trộn mảng Fisher-Yates (Generic)
 * Sử dụng bản sao để không làm thay đổi mảng gốc (Immutability).
 */
export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * Chuẩn bị dữ liệu câu hỏi: Xáo trộn thứ tự câu và thứ tự đáp án.
 * Fix: Đảm bảo mapping đáp án đúng chính xác kể cả khi nội dung options trùng nhau.
 */
export const prepareQuestions = (data: Question[]): Question[] => {
  // Trộn thứ tự các câu hỏi
  return shuffleArray(data).map((q): Question => {
    if (q.type !== "multiple_choice") return q;

    // Tạo mảng các object trung gian để giữ index gốc của option
    // Điều này giúp tránh lỗi indexOf khi có 2 option nội dung giống nhau
    const indexedOptions = q.options.map((text, index) => ({ text, originalIndex: index }));
    const shuffledIndexedOptions = shuffleArray(indexedOptions);

    // Tìm vị trí mới của đáp án đúng (giả sử q.answer là index 0-based từ MongoDB)
    const newAnswerIndex = shuffledIndexedOptions.findIndex(
      opt => opt.originalIndex === q.answer
    );

    return {
      ...q,
      options: shuffledIndexedOptions.map(opt => opt.text),
      answer: newAnswerIndex,
    } as MultipleChoiceQuestion;
  });
};