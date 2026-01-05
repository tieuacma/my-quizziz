"use client";

import { useState, useEffect } from "react";
import { useQuizSession } from "@hooks/useQuizSession";
import QuizIntro from "./_components/QuizIntro";
import QuizGame from "./_components/QuizGame";

interface QuizClientProps {
  user: any;
  mongoQuiz: any;
}

export default function QuizClient({ user, mongoQuiz }: QuizClientProps) {
  const { getLatestSession, createNewSession } = useQuizSession();
  
  // Trạng thái quản lý luồng dữ liệu
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [existingSession, setExistingSession] = useState<any>(null);
  const [activeSession, setActiveSession] = useState<any>(null);

  // 1. Kiểm tra xem người dùng có bài làm nào đang dang dở không
  useEffect(() => {
    async function checkSession() {
      try {
        const latest = await getLatestSession(user.id, mongoQuiz.slug);
        if (latest && latest.status === 'playing') {
          setExistingSession(latest);
        } else {
          setExistingSession(null);
        }
      } catch (error) {
        console.error("Lỗi khi kiểm tra session:", error);
      } finally {
        setIsCheckingSession(false);
      }
    }
    checkSession();
  }, [user.id, mongoQuiz.slug, getLatestSession]);

  // 2. Hành động: Bắt đầu bài mới hoàn toàn
  const handleStartNew = async () => {
    setIsCheckingSession(true);
    try {
      const newSession = await createNewSession(user.id, mongoQuiz);
      setActiveSession(newSession);
    } catch (error) {
      alert("Không thể khởi tạo bài mới. Vui lòng thử lại!");
    } finally {
      setIsCheckingSession(false);
    }
  };

  // 3. Hành động: Tiếp tục bài đang làm dở
  const handleContinue = () => {
    setActiveSession(existingSession);
  };

  // --- GIAO DIỆN PHẢN HỒI ---

  // Màn hình loading khi đang check DB
  if (isCheckingSession) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mb-4"></div>
        <p className="animate-pulse">Đang chuẩn bị bài tập cho bạn...</p>
      </div>
    );
  }

  // Nếu chưa chọn session nào để "active" -> Hiển thị màn hình Intro (Bắt đầu/Tiếp tục)
  if (!activeSession) {
    return (
      <QuizIntro 
        mongoQuiz={mongoQuiz}
        existingSession={existingSession}
        handleContinue={handleContinue}
        handleStartNew={handleStartNew}
      />
    );
  }

  // Nếu đã có session active -> Vào thẳng giao diện chơi game
  return <QuizGame activeSession={activeSession} mongoQuiz={mongoQuiz} />;
}