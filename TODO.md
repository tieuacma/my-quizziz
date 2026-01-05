# Quiz Bug Fixes

## Issues to Fix
1. **Delay in multiple-choice answers**: Reduce the 1500ms timeout after selecting an answer.
2. **Undefined answers and missing subquestions in revenge mode for reading questions**: Fix subquestion handling in revise mode.
3. **Infinite loop in revenge**: Ensure proper state resets after revise mode.

## Tasks
- [x] Reduce feedback timeout in `handleAnswerClick` from 1500ms to 800ms for better UX.
- [x] Fix revise mode for reading questions: Properly handle subquestions when `tempQuestion` is a reading question.
- [x] Reset `subIndex` to 0 when entering revise mode to prevent subquestion display issues.
- [x] Ensure all states are properly reset after revise mode to prevent infinite loops.
- [x] Update QuizGame to render ReadingContent for reading subquestions in revise mode.
