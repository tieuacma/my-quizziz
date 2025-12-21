// quizdata.ts
import questionsData from './data.json';

export type BaseQuestion = {
  id: number;
  question: string;
  timeLimit: number;
};

export type MultipleChoiceQuestion = BaseQuestion & {
  type: "multiple_choice";
  options: string[];
  answer: number;
};

export type FillInBlankQuestion = BaseQuestion & {
  type: "fill_in_blank";
  answer: string | string[];
};

export type Question = MultipleChoiceQuestion | FillInBlankQuestion;

export const questions: Question[] = questionsData as Question[];

export function checkAnswer(question: Question, userAnswer: string | number): boolean {
  if (question.type === "multiple_choice") {
    return typeof userAnswer === "number" && userAnswer === question.answer;
  } else if (question.type === "fill_in_blank") {
    if (typeof userAnswer !== "string") return false;
    const normalizedUserAnswer = userAnswer.trim().toLowerCase();
    const answers = Array.isArray(question.answer) ? question.answer : [question.answer];
    return answers.some(ans => ans.trim().toLowerCase() === normalizedUserAnswer);
  }
  return false;
}
