# Quiz Module Refactoring Plan

## Phase 1: Types & Service

- [x] Update `types/quiz.ts` - Add timeLimit, defaultTime, category
- [x] Create `app/lib/quiz-service.ts` - Data service with fs module

## Phase 2: Server Actions

- [x] Create `app/actions/quiz-actions.ts` - createQuizAction, updateQuizAction, getQuizAction

## Phase 3: UI Components

- [x] Reuse existing `app/quiz-create/components.tsx` - QuizSettings, QuestionTypeSelector

## Phase 4: Pages

- [x] Simplify `app/quiz-create/page.tsx` - Create only (metadata input)
- [x] Create `app/quiz-editor/[id]/page.tsx` - Full editor with timer feature

## Phase 5: Timer Feature

- [x] Add "Apply to all questions" button (client state) - ✅ Implemented
- [x] Individual question timeLimit input - ✅ Implemented
- [x] Server Action save - ✅ Implemented

## COMPLETED ✅
