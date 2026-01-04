export type BaseQuestion = {
  id: number;
  question: string;
  timeLimit: number;
  image?: string; // Thêm trường image (tùy chọn) - ví dụ: "/quiz/cau1.jpg"
};

export type MultipleChoiceQuestion = BaseQuestion & {
  type: "multiple_choice";
  options: string[];
  answer: number; // Index (1, 2, 3...)
};

export type FillInBlankQuestion = BaseQuestion & {
  type: "fill_in_blank";
  answer: string | string[]; 
};

export type TrueFalseQuestion = BaseQuestion & {
  type: "true_false";
  options: ["Đúng", "Sai"];
  answer: number; // 1: Đúng, 2: Sai
};

// Cấu trúc cho câu hỏi phụ trong bài đọc
export interface ReadingSubQuestion {
  id: number;
  question: string;
  options: string[];
  answer: number;
  type: "reading_sub" | "multiple_choice"; // Cho phép câu phụ là MCQ
  image?: string; // Câu hỏi phụ cũng có thể có ảnh riêng
}

export type ReadingQuestion = BaseQuestion & {
  type: "reading";
  passage: string; // Đoạn văn bản dùng chung
  subQuestions: ReadingSubQuestion[];
};

export type Question = 
  | MultipleChoiceQuestion 
  | FillInBlankQuestion 
  | TrueFalseQuestion 
  | ReadingQuestion;

/**
 * Dữ liệu mẫu JSON
 */
const questionsData: any[] = []; 
export const questions: Question[] = questionsData as Question[];

/**
 * Hàm kiểm tra đáp án: Đã tối ưu hóa
 */
export function checkAnswer(
  question: Question | ReadingSubQuestion,
  userAnswer: string | number | null | undefined
): boolean {
  if (userAnswer === null || userAnswer === undefined) return false;

  // 1. Xử lý câu hỏi Điền vào chỗ trống
  if ("type" in question && question.type === "fill_in_blank") {
    const normalizedUser = userAnswer.toString().trim().toLowerCase();
    const correctAnswers = Array.isArray(question.answer)
      ? question.answer
      : [question.answer];

    return correctAnswers.some((ans: any) =>
      ans.toString().trim().toLowerCase() === normalizedUser
    );
  }

  // 2. Xử lý Trắc nghiệm, Đúng/Sai, Reading Sub-questions (so sánh Index)
  // Lưu ý: userAnswer truyền vào từ handler thường đã được convert sang số
  if ("answer" in question && typeof question.answer === "number") {
    return Number(userAnswer) === question.answer;
  }

  return false;
}