# TODO: Quiz Lint Fixes

## Step 1: Fix implicit 'any' for 'questions' in hooks/useQuizLogic.ts

- [x] Edit useMemo to remove circular self-reference: always use shuffledQuestions
- [x] Verify no other type issues

**Fixed! Type error TS7022 resolved. Questions now properly typed as QuizQuestion[].**

## Step 2: Fix TS2322 in QuizLayout.tsx -> QuestionEngine.tsx

- [x] Make `question?: QuizQuestion` in QuestionEngineProps
- [x] Added missing `quizState: QuizState` prop
- [x] Verify

**All lint errors resolved!**
