import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  GraduationCap,
  BookOpen,
  Users,
  BarChart3,
  ArrowRight,
  Sparkles,
} from "lucide-react";

const FEATURES = [
  {
    icon: BookOpen,
    title: "Khóa học đa dạng",
    desc: "Truy cập hàng trăm khóa học chất lượng cao từ các giảng viên hàng đầu.",
  },
  {
    icon: Users,
    title: "Quản lý lớp học",
    desc: "Dễ dàng quản lý lớp học, theo dõi tiến độ và tương tác với học sinh.",
  },
  {
    icon: BarChart3,
    title: "Báo cáo chi tiết",
    desc: "Theo dõi kết quả học tập với biểu đồ và báo cáo trực quan.",
  },
  {
    icon: Sparkles,
    title: "Trải nghiệm thông minh",
    desc: "Giao diện hiện đại, tối ưu cho mọi thiết bị.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#05040f] text-white">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-48 -right-48 w-[600px] h-[600px] rounded-full bg-purple-700/15 blur-[140px]" />
          <div className="absolute -bottom-48 -left-48 w-[600px] h-[600px] rounded-full bg-violet-700/15 blur-[140px]" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-32 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-slate-300 mb-8">
            <Sparkles className="w-4 h-4 text-violet-400" />
            Hệ thống quản lý học tập thông minh
          </div>

          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-6">
            Nâng tầm{" "}
            <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
              trải nghiệm học tập
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10">
            Zenith EDU giúp giáo viên và học sinh kết nối, quản lý khóa học và
            theo dõi tiến độ một cách hiệu quả.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup">
              <Button
                size="lg"
                className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white shadow-lg shadow-purple-600/30 px-8"
              >
                Bắt đầu ngay <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/login">
              <Button
                size="lg"
                variant="outline"
                className="border-white/10 hover:bg-white/8 text-white px-8"
              >
                Đăng nhập
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Tính năng nổi bật</h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Mọi thứ bạn cần để quản lý và nâng cao chất lượng giảng dạy, học
            tập.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((f) => (
            <Card
              key={f.title}
              className="bg-white/[0.03] border-white/8 hover:bg-white/[0.06] transition-colors group"
            >
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-600/20 to-purple-600/20 flex items-center justify-center mb-4 group-hover:from-violet-600/30 group-hover:to-purple-600/30 transition-colors">
                  <f.icon className="w-6 h-6 text-violet-400" />
                </div>
                <h3 className="text-white font-semibold mb-2">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {f.desc}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
        <div className="rounded-3xl bg-gradient-to-r from-violet-900/40 to-purple-900/40 border border-white/10 p-10 sm:p-16 text-center">
          <GraduationCap className="w-12 h-12 text-violet-400 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">Sẵn sàng bắt đầu?</h2>
          <p className="text-slate-400 max-w-lg mx-auto mb-8">
            Tham gia cùng hàng nghìn giáo viên và học sinh đang sử dụng Zenith
            EDU mỗi ngày.
          </p>
          <Link href="/signup">
            <Button
              size="lg"
              className="bg-white text-[#05040f] hover:bg-slate-200 font-semibold px-8"
            >
              Tạo tài khoản miễn phí
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/8 py-8 text-center text-slate-500 text-sm">
        © 2026 Zenith EDU. All rights reserved.
      </footer>
    </div>
  );
}
