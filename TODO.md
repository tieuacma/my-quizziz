# Refactor Quiz System TODO

## Steps to Complete
- [x] Create app/data/data.json with questions in new format (include type, answer as number for multiple_choice, string/string[] for fill_in_blank)
- [x] Update app/data/quizdata.ts: Define union types for questions, import questions from data.json, implement checkAnswer function
- [x] Update app/hooks/useQuiz.ts: Modify handleAnswerClick to use checkAnswer, adjust for numeric answers in multiple_choice
- [x] Test the refactored logic (dev server started successfully)
- [x] Fix TypeScript error in page.tsx for options property
- [x] Update page.tsx to conditionally render Options or FillInBlank based on question type
- [x] Create FillInBlank component with input, submit button, and specified UI effects
- [x] Update useQuiz.ts to handle fill_in_blank submission and UI states
- [x] Update getOptionClass for multiple_choice to match specified behavior
- [x] Test the complete UI functionality (build successful)
