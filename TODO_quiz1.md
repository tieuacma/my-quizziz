# Quiz Creation Feature - Implementation Plan

## Task Overview

Build a professional quiz creation page with:

- Multiple question types (multiple-choice, fill-in-the-blank, true-false, reading)
- Server Action for file persistence
- Modern UX with preview and toast notifications
- Timer feature (per question & global default)

---

## Implementation Order

1. ✅ Create `types/quiz.ts` - Complete with all interfaces
2. ✅ Create Server Action - `saveQuizAction` implemented
3. ✅ Create quiz-create page with full UI (COMPLETE)
   - ✅ Quiz metadata form (title, description, time limit)
   - ✅ Question list management (add, remove, reorder)
   - ✅ Multiple Choice editor with add/remove options
   - ✅ Fill-in-the-blank editor
   - ✅ True/False editor
   - ✅ Reading passage editor with nested sub-questions
   - ✅ Save integration with server action
   - ✅ Toast notification system
   - ✅ Form reset after success
4. ✅ Link "Tạo Quiz" button in teacher dashboard
5. ✅ Test and verify

---

## Refactoring - COMPLETED

### Quiz Editor Flow (NEW)

- `app/quiz-create/page.tsx` - Simple create form (title, description, category, defaultTime)
- `app/actions/quiz-actions.ts` - createQuizAction, updateQuizAction, getQuizAction
- `app/quiz-editor/[id]/page.tsx` - Full editor with questions + timer

### Timer Feature

- ✅ Individual question timeLimit (seconds)
- ✅ Global defaultTime for quiz
- ✅ Apply default to all questions button
