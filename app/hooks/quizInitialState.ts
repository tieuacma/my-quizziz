import { useMemo } from "react";
import { questions as originalQuestions } from "../data/quizdata";
import { hashQuestions, prepareQuestions } from "./utils";
import { loadQuizState, loadQuizHash, clearQuizState, saveQuizHash, saveQuizState } from "./quizStorage";
import { QuizState } from "./types";

export const useInitialQuizState = (): QuizState | null => {
  // 1. Tính toán hash bên ngoài useMemo để React biết khi nào dữ liệu file quizdata thay đổi
  const currentHash = useMemo(() => hashQuestions(originalQuestions), []);

  return useMemo(() => {
    if (typeof window === 'undefined') return null;

    const savedState = loadQuizState();
    const savedHash = loadQuizHash();

    // Hàm tạo state mới hoàn toàn
    const createNewState = (hash: string): QuizState => {
      const freshQuestions = prepareQuestions(originalQuestions);
      saveQuizHash(hash);
      const initialState: QuizState = {
        questions: freshQuestions,
        currentQuestion: 0,
        score: 0,
        showScore: false,
        timeLeft: freshQuestions[0]?.timeLimit || 30,
        selectedAnswer: null,
        showFeedback: false,
        pointsEarned: 0,
        correctAnswers: 0,
        totalTimeSpent: 0,
        currentStreak: 0,
        maxStreak: 0,
        isNewGame: true
      };
      saveQuizState(initialState);
      return initialState;
    };

    // 2. Kiểm tra Hash để reset dữ liệu
    // Nếu hash lưu trữ khác hash hiện tại -> Dữ liệu quizdata.ts đã bị sửa
    if (savedHash && savedHash !== currentHash) {
      console.log("Dữ liệu câu hỏi đã thay đổi, đang khởi tạo lại...");
      clearQuizState();
      return createNewState(currentHash);
    }

    // 3. Nếu không có dữ liệu cũ (Lần đầu chơi hoặc sau khi clear)
    if (!savedState) {
      return createNewState(currentHash);
    }

    // 4. Nếu mọi thứ khớp, tiếp tục game cũ
    return { ...savedState, isNewGame: false };
    
    /**
     * QUAN TRỌNG: Thêm currentHash vào đây.
     * Khi bạn sửa file quizdata.ts, hash thay đổi, useMemo sẽ tính toán lại toàn bộ logic.
     */
  }, [currentHash]); 
};