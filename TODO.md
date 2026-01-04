# TODO: Implement ReadingQuestion with subQuestions

## Steps to Complete

- [x] Add state in useQuiz.ts for reading mode: currentSubQuestion index, completedSubQuestions array, readingMode boolean
- [x] Update quizHandlers.ts to handle subQuestion answers: correct adds points/streak, wrong marks ReadingQuestion as wrong, saves to supabase, restarts ReadingQuestion
- [x] Modify QuizClient.tsx to render reading type with split layout: left side passage, right side clickable subQuestions list
- [x] Add UI for subQuestion display with back button and color coding (green for correct, red for wrong)
- [x] Ensure subQuestions share time from ReadingQuestion
- [x] When all subQuestions answered, proceed to next question
- [x] Test the reading question flow
- [x] Verify supabase saving for wrong ReadingQuestions
