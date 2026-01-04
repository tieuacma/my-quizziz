"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import confetti from "canvas-confetti";

function useAnimatedScore(endValue: number, duration: number = 1000) {
  const [animatedValue, setAnimatedValue] = useState(0);
  useEffect(() => {
    let start = 0;
    const stepTime = 30;
    const steps = duration / stepTime;
    const increment = endValue / steps;
    const timer = setInterval(() => {
      start += increment;
      if (start >= endValue) {
        setAnimatedValue(endValue);
        clearInterval(timer);
      } else {
        setAnimatedValue(Math.floor(start));
      }
    }, stepTime);
    return () => clearInterval(timer);
  }, [endValue, duration]);
  return animatedValue;
}

function StatCard({ icon, label, value, unit, color, delay }: any) {
  return (
    <div
      className="relative overflow-hidden bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-md transition-all duration-300 hover:bg-white/10 group animate-in fade-in slide-in-from-bottom-5"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center gap-3 mb-2">
        <span className={`${color} opacity-80`}>{icon}</span>
        <span className="text-white/40 font-bold text-[10px] uppercase tracking-widest">{label}</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-3xl font-black text-white group-hover:text-blue-400 transition-colors">
          {value}
        </span>
        <span className="text-white/20 font-bold text-sm">{unit}</span>
      </div>
    </div>
  );
}

export default function FinalScore({ score, totalQuestions, correctAnswers, totalTimeSpent, maxStreak, onPlayAgain }: any) {
  const animatedScore = useAnimatedScore(score);
  const accuracy = useMemo(() => (totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0), [correctAnswers, totalQuestions]);
  const averageTime = useMemo(() => (totalQuestions > 0 ? (totalTimeSpent / totalQuestions).toFixed(1) : "0"), [totalTimeSpent, totalQuestions]);

  const grade = useMemo(() => {
    if (accuracy >= 95) return { label: "HẠNG S", color: "text-yellow-400", bg: "from-yellow-500/20", sub: "Thần đồng Quiz!" };
    if (accuracy >= 80) return { label: "HẠNG A", color: "text-purple-400", bg: "from-purple-500/20", sub: "Xuất sắc!" };
    return { label: "HẠNG B", color: "text-blue-400", bg: "from-blue-500/20", sub: "Làm tốt lắm!" };
  }, [accuracy]);

  useEffect(() => {
    if (accuracy >= 80) {
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
    }
  }, [accuracy]);

  return (
    /* Container chính: Dùng bg-[#020205] (đen gần như tuyệt đối) 
       để triệt tiêu hoàn toàn màu trắng/xám bị lộ.
    */
    <div className="relative min-h-screen w-full bg-[#020205] text-white flex items-center justify-center p-4 sm:p-6 overflow-x-hidden">
      
      {/* Galaxy Background Layer: 
          Sử dụng fixed để lớp nền phủ cứng toàn bộ màn hình thiết bị.
      */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Vùng sáng tím phía trên bên trái */}
        <div className="absolute top-[-10%] left-[-5%] w-[60%] h-[60%] bg-purple-900/30 blur-[150px] rounded-full opacity-60"></div>
        {/* Vùng sáng xanh phía dưới bên phải */}
        <div className="absolute bottom-[-10%] right-[-5%] w-[60%] h-[60%] bg-blue-900/30 blur-[150px] rounded-full opacity-60"></div>
        {/* Hiệu ứng chuyển màu nhẹ giữa màn hình */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-purple-900/5 to-transparent"></div>
      </div>

      <div className="relative z-10 w-full max-w-2xl bg-black/40 border border-white/10 backdrop-blur-3xl rounded-[2.5rem] p-8 sm:p-12 shadow-[0_0_50px_rgba(0,0,0,0.8)]">
        
        {/* Top Badge */}
        <div className="flex justify-center mb-8">
          <div className={`px-6 py-2 rounded-full bg-gradient-to-b ${grade.bg} to-transparent border border-white/10`}>
            <span className={`text-xs sm:text-sm font-black tracking-[0.3em] ${grade.color}`}>
              {grade.label} • {grade.sub.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Score Display */}
        <div className="text-center mb-10">
          <p className="text-blue-400/50 font-black text-[10px] tracking-[0.6em] mb-4 uppercase">Tổng điểm đạt được</p>
          <h1 className="text-7xl sm:text-9xl font-black tracking-tighter text-white [text-shadow:0_0_40px_rgba(255,255,255,0.15)]">
            {animatedScore.toLocaleString()}
          </h1>
        </div>

        {/* Accuracy Info Bar */}
        <div className="grid grid-cols-2 gap-4 mb-8 bg-white/[0.03] p-6 rounded-3xl border border-white/5">
            <div className="text-center border-r border-white/10">
                <p className="text-white/20 text-[10px] font-bold uppercase mb-1 tracking-widest">Đúng / Tổng</p>
                <p className="text-2xl font-black text-green-400">{correctAnswers} / {totalQuestions}</p>
            </div>
            <div className="text-center">
                <p className="text-white/20 text-[10px] font-bold uppercase mb-1 tracking-widest">Tỉ lệ</p>
                <p className="text-2xl font-black text-blue-400">{accuracy}%</p>
            </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-10">
          <StatCard label="Độ chính xác" value={accuracy} unit="%" color="text-green-400" delay={100} icon="✓" />
          <StatCard label="Chuỗi" value={maxStreak} unit="" color="text-orange-400" delay={200} icon="🔥" />
          <StatCard label="Tốc độ" value={averageTime} unit="s" color="text-blue-400" delay={300} icon="⚡" />
          <StatCard label="Thời gian" value={totalTimeSpent.toFixed(0)} unit="s" color="text-purple-400" delay={400} icon="⏱" />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={onPlayAgain}
            className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl transition-all active:scale-[0.98] shadow-xl shadow-blue-900/20 tracking-[0.2em] text-xs uppercase"
          >
            Làm lượt mới
          </button>
          <Link
            href="/"
            className="w-full py-5 bg-white/5 hover:bg-white/10 text-white/80 font-bold rounded-2xl transition-all border border-white/10 text-center tracking-[0.2em] text-xs uppercase"
          >
            Về trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}