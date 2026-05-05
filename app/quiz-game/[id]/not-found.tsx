"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50 px-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="space-y-4">
          <h1 className="text-6xl md:text-8xl font-black bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
            404
          </h1>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Bài Quiz không tồn tại
          </h2>
          <p className="text-lg text-gray-600 max-w-sm mx-auto">
            Có thể bạn đã nhập sai mã ID hoặc bài quiz đã bị xóa. Hãy kiểm tra
            lại đường dẫn và thử lại.
          </p>
        </div>

        <div className="pt-8">
          <Button asChild size="lg" className="group">
            <Link href="/quiz-game" className="flex items-center gap-2">
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Quay lại trang chủ Quiz
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
