export type BaseQuestion = {
  id: number;
  question: string;
  timeLimit: number;
};

export type MultipleChoiceQuestion = BaseQuestion & {
  type: "multiple_choice";
  options: string[];
  answer: number; // Index của câu đúng
};

export type FillInBlankQuestion = BaseQuestion & {
  type: "fill_in_blank";
  answer: string | string[]; // Có thể là 1 chuỗi hoặc mảng các chuỗi chấp nhận được
};

export type Question = MultipleChoiceQuestion | FillInBlankQuestion;

/**
 * FIX: Đảm bảo questionsData được định nghĩa. 
 * Nếu bạn lấy từ file JSON, hãy dùng: import questionsData from './data.json'
 */
const questionsData: any[] = []; // Thay thế bằng nguồn dữ liệu thực tế của bạn

export const questions: Question[] = questionsData as Question[];

/**
 * Hàm kiểm tra đáp án: Tối ưu cho cả trắc nghiệm và điền vào chỗ trống
 */
export function checkAnswer(question: Question, userAnswer: string | number | null | undefined): boolean {
  if (userAnswer === null || userAnswer === undefined) return false;

  if (question.type === "multiple_choice") {
    // Trắc nghiệm: so sánh index (number)
    return typeof userAnswer === "number" && userAnswer === question.answer;
  } 
  
  if (question.type === "fill_in_blank") {
    // Điền vào chỗ trống: so sánh chuỗi (string)
    const normalizedUser = userAnswer.toString().trim().toLowerCase();
    
    // Đưa tất cả đáp án đúng vào một mảng để dễ kiểm tra
    const correctAnswers = Array.isArray(question.answer) 
      ? question.answer 
      : [question.answer];

    return correctAnswers.some(ans => 
      ans.toString().trim().toLowerCase() === normalizedUser
    );
  }

  return false;
}