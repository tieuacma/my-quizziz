import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import QuizClient from './QuizClient'
import { questions } from './data/quizdata' // Import dữ liệu gốc
import { hashQuestions } from './hooks/utils' // Import hàm hash của bạn

export default async function QuizPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Tạo một key duy nhất dựa trên nội dung file quizdata.ts
  const quizKey = hashQuestions(questions);

  // Truyền quizKey vào để React biết khi nào cần reset toàn bộ Component
  return <QuizClient key={quizKey} />
}