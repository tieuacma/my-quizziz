'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation'; // Thay đổi từ redirect sang useRouter

interface QuizSummary {
  _id: string;
  title: string;
  description: string;
  grade: string;
  subject: string;
  slug: string;
  createdAt: string;
}

export default function QuizListPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [quizzes, setQuizzes] = useState<QuizSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [isNavigating, setIsNavigating] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    
    // Kiểm tra Auth theo cách Client-side an toàn
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth/login');
      } else {
        setUser(user);
      }
    };

    checkUser();
    fetchQuizzes();
  }, [router]);

  const fetchQuizzes = async () => {
    try {
      const response = await fetch('/api/quiz-data');
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setQuizzes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectQuiz = (slug: string) => {
    setIsNavigating(slug);
    // Chuyển hướng sang trang quiz chi tiết
    router.push(`/quiz/${slug}`);
  };

  if (!user) return null;

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-6">
      <div className="bg-white rounded-[2.5rem] shadow-2xl p-16 w-full max-w-7xl">
        <h1 className="text-4xl font-bold text-center mb-12 text-gray-800">Chọn Bộ Quiz</h1>
        
        {loading ? (
          <div className="text-center py-32">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600 mb-6"></div>
            <p className="text-2xl text-gray-600 font-medium">Đang tải danh sách quiz...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {quizzes.map((quiz) => (
              <div
                key={quiz._id}
                className="group bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-200 hover:border-purple-300 transform hover:-translate-y-1"
                onClick={() => handleSelectQuiz(quiz.slug)}
              >
                <h2 className="text-2xl font-semibold text-gray-800 mb-2 group-hover:text-purple-700 transition-colors">
                  {quiz.title}
                </h2>
                <p className="text-gray-600 mb-4 line-clamp-2">{quiz.description}</p>
                <div className="flex justify-between text-sm text-gray-500 font-medium">
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">Lớp: {quiz.grade}</span>
                  <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded">Môn: {quiz.subject}</span>
                </div>
                
                {isNavigating === quiz.slug && (
                  <div className="mt-4 flex items-center justify-center text-purple-600">
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-current mr-2"></div>
                    <span className="text-sm">Đang mở...</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}