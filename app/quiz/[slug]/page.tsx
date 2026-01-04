import { createClient } from '@/lib/supabase/server';
import QuizClient from './QuizClient';
import { notFound, redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function QuizPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const supabase = await createClient();

  // ✅ BẮT BUỘC try/catch
  let user = null;
  try {
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch (err) {
    redirect('/auth/login');
  }

  if (!user) redirect('/auth/login');

  const res = await fetch(
    `/api/quiz-data?slug=${slug}&t=${Date.now()}`,
    { cache: 'no-store' }
  );

  if (!res.ok) notFound();

  const rawData = await res.json();
  if (!rawData || rawData.error) notFound();

  const mongoQuiz = JSON.parse(JSON.stringify(rawData));

  return (
    <div className="min-h-screen bg-gray-50">
      <QuizClient user={user} mongoQuiz={mongoQuiz} />
    </div>
  );
}
