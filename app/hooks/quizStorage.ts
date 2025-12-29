import { QuizState } from "./types";

export const QUIZ_STATE_KEY = 'quiz_state';
export const QUIZ_HASH_KEY = 'quiz_questions_hash';

/**
 * Lưu trạng thái Quiz vào localStorage.
 * Thêm kiểm tra để đảm bảo không lưu các giá trị null/undefined dưới dạng chuỗi.
 */
export const saveQuizState = (state: Partial<QuizState> | null) => {
  try {
    if (state === null || state === undefined) {
      localStorage.removeItem(QUIZ_STATE_KEY);
      return;
    }
    // Chỉ thực hiện stringify khi state thực sự là một object hợp lệ
    const stateString = JSON.stringify(state);
    if (stateString !== "undefined" && stateString !== "null") {
      localStorage.setItem(QUIZ_STATE_KEY, stateString);
    }
  } catch (e) {
    console.error("Lỗi khi lưu state:", e);
  }
};

/**
 * Tải trạng thái Quiz và xử lý các trường hợp dữ liệu hỏng.
 * Đây là nơi giải quyết lỗi "undefined" is not valid JSON.
 */
export const loadQuizState = (): QuizState | null => {
  try {
    const saved = localStorage.getItem(QUIZ_STATE_KEY);

    // Kiểm tra tất cả các biến thể của dữ liệu rác (do extension hoặc lỗi lưu trữ cũ)
    if (
      !saved || 
      saved === "undefined" || 
      saved === "null" || 
      saved === "[object Object]" ||
      saved.trim() === ""
    ) {
      return null;
    }

    const parsed = JSON.parse(saved);

    // Đảm bảo dữ liệu sau khi parse phải là object và không phải null
    if (typeof parsed !== 'object' || parsed === null) {
      return null;
    }

    return parsed as QuizState;
  } catch (e) {
    // Nếu JSON.parse thất bại, xóa key lỗi để tránh lặp lại lỗi ở lần load sau
    console.error("Dữ liệu LocalStorage bị lỗi JSON:", e);
    localStorage.removeItem(QUIZ_STATE_KEY);
    return null;
  }
};

export const clearQuizState = () => {
  localStorage.removeItem(QUIZ_STATE_KEY);
};

export const saveQuizHash = (hash: string) => {
  if (hash) {
    localStorage.setItem(QUIZ_HASH_KEY, hash);
  }
};

export const loadQuizHash = (): string | null => {
  const hash = localStorage.getItem(QUIZ_HASH_KEY);
  return (hash === "undefined" || hash === "null") ? null : hash;
};