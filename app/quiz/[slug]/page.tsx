import { createClient } from '@/lib/supabase/server';
import QuizClient from './QuizClient';
import { notFound, redirect } from 'next/navigation';
import clientPromise from "@/lib/mongodb/client";

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs'; // Đảm bảo chạy môi trường Node.js đầy đủ để dùng MongoDB Driver

// Hàm lấy dữ liệu trực tiếp từ MongoDB thay vì fetch qua API nội bộ
async function getQuizData(slug: string) {
  try {
    const client = await clientPromise;
    const db = client.db("quizziz");
    const quiz = await db.collection("quizzes").findOne({ slug });
    
    if (!quiz) return null;

    // Làm sạch dữ liệu (Serialization) để tránh lỗi Digest do truyền ObjectId
    const cleanedQuiz = JSON.parse(JSON.stringify(quiz));
    
    return {
      ...cleanedQuiz,
      updatedAt: cleanedQuiz.updatedAt || cleanedQuiz.createdAt || new Date().toISOString(),
    };
  } catch (error) {
    console.error("Lỗi truy vấn MongoDB trực tiếp:", error);
    return null;
  }
}

export default async function QuizPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const supabase = await createClient();

  // 1. Xác thực người dùng qua Supabase
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    redirect('/auth/login');
  }

  // 2. Lấy dữ liệu Quiz trực tiếp từ Database
  // Thay thế fetch API nội bộ (nguyên nhân gây lỗi 500/404 trên Vercel)
  const mongoQuiz = await getQuizData(slug);

  if (!mongoQuiz) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <QuizClient user={user} mongoQuiz={mongoQuiz} />
    </div>
  );
}