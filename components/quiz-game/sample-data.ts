import type { QuizQuestion } from '@/types/quiz'

// Demo data for testing QuizGame
export const sampleQuizData = {
  metadata: {
    id: 'demo-quiz',
    title: 'JavaScript Fundamentals Quiz',
    totalQuestions: 5,
    defaultTime: 30
  },
  questions: [
    {
      id: 'q1',
      type: 'multiple-choice' as const,
      question: 'What is the output of console.log(typeof null)?',
      difficulty: 'medium',
      timeLimit: 30,
      options: [
        { id: 'a1', text: '"object"' },
        { id: 'a2', text: '"null"' },
        { id: 'a3', text: '"undefined"' },
        { id: 'a4', text: '"string"' }
      ],
      correctOptionId: 'a1'
    },
    {
      id: 'q2',
      type: 'fill-in-the-blank' as const,
      question: 'The method used to add elements to the end of an array is ______().',
      difficulty: 'easy',
      timeLimit: 25,
      answers: ['push', 'append'],
      caseSensitive: false
    },
    {
      id: 'q3',
      type: 'multiple-choice' as const,
      question: 'Which method returns a new array with unique values?',
      difficulty: 'hard',
      timeLimit: 35,
      options: [
        { id: 'b1', text: 'filter()' },
        { id: 'b2', text: 'map()' },
        { id: 'b3', text: 'Set([...array])' },
        { id: 'b4', text: 'reduce()' }
      ],
      correctOptionId: 'b3'
    }
  ] as QuizQuestion[]
}

