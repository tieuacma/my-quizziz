# TODO: Quiz Game Implementation Plan

## Phase 1: Data Types & Interfaces

- [ ] 1.1 Update `types/quiz.ts` to match task requirements
  - BaseQuestion with id, type, points, time_limit
  - MultiChoiceQuestion with options (is_correct)
  - FillBlankQuestion with correct_answers[], caseSensitive
  - ReadingQuestion with context_text, sub_questions
  - QuizState for game tracking

## Phase 2: Core Logic (Custom Hooks)

- [ ] 2.1 Create `hooks/useQuizLogic.ts`
  - Super Shuffle (Fisher-Yates 2-pass)
  - Scoring Formula
  - Answer validation
  - Timer management
  - Streak tracking
  - Question navigation

## Phase 3: UI Components

- [ ] 3.1 Create `components/quiz-game/QuizGame.tsx` (main container)
- [ ] 3.2 Create `components/quiz-game/QuizLayout.tsx` (header/footer)
- [ ] 3.3 Create `components/quiz-game/StreakAndRank.tsx`
- [ ] 3.4 Create `components/quiz-game/ScoreBoard.tsx`
- [ ] 3.5 Create `components/quiz-game/ProgressStats.tsx`
- [ ] 3.6 Create `components/quiz-game/QuestionEngine.tsx`
- [ ] 3.7 Create `components/quiz-game/MultiChoiceCard.tsx`
- [ ] 3.8 Create `components/quiz-game/FillBlankCard.tsx`
- [ ] 3.9 Create `components/quiz-game/ReadingCard.tsx`
- [ ] 3.10 Create `components/quiz-game/FloatingPoints.tsx`

## Phase 4: Animations (Framer Motion)

- [ ] 4.1 Question transitions with AnimatePresence
- [ ] 4.2 Floating points animation
- [ ] 4.3 Score counter with count-up animation

## Phase 5: Testing & Integration

- [ ] 5.1 Create demo quiz data
- [ ] 5.2 Test the Quiz Game flow
