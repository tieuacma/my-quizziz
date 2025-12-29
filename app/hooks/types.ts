import { Question } from "../data/quizdata";

export interface QuizState {
  questions: Question[];
  currentQuestion: number;
  score: number;
  showScore: boolean;
  timeLeft: number;
  selectedAnswer: string | null;
  showFeedback: boolean;
  pointsEarned: number;
  correctAnswers: number;
  totalTimeSpent: number;
  currentStreak: number;
  maxStreak: number;
  isNewGame?: boolean;
}
