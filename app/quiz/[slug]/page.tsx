import { createClient } from '@/lib/supabase/server';
import QuizClient from './QuizClient';
import { notFound, redirect } from 'next/navigation';

export default async function QuizPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; 
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://127.0.0.1:3000';
  
  try {
    const res = await fetch(`${baseUrl}/api/quiz-data?slug=${slug}&t=${Date.now()}`, {
      cache: 'no-store', 
    });

    if (!res.ok) return notFound();
    const rawData = await res.json();
    if (!rawData || rawData.error) return notFound();

    // CHIẾN THUẬT QUÉT SẠCH: 
    // Biến toàn bộ dữ liệu thành String rồi parse ngược lại để xóa bỏ mọi Class/Object của MongoDB
    const mongoQuiz = JSON.parse(JSON.stringify(rawData));

    // Tính toán Version dựa trên dữ liệu đã làm sạch
    const lastUpdate = mongoQuiz.updatedAt || mongoQuiz.createdAt || new Date().toISOString();

    return (
      <div className="min-h-screen bg-gray-50">
        <QuizClient 
          user={user} 
          mongoQuiz={mongoQuiz} 
        />
      </div>
    );
  } catch (error) {
    console.error("Lỗi Server:", error);
    return notFound();
  }
}