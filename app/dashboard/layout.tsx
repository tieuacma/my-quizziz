import { redirect } from "next/navigation";
import { getSession } from "@/app/lib/session";
import { logout } from "@/app/actions/auth";
import Link from "next/link";
import type { UserRole } from "@/app/lib/types";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Home,
  BookOpen,
  FileText,
  BarChart3,
  Calendar,
  School,
  BookText,
  Puzzle,
  Users,
  TrendingUp,
  LogOut,
  GraduationCap,
  Menu,
} from "lucide-react";

const NAV_ITEMS: Record<
  UserRole,
  { href: string; icon: React.ElementType; label: string }[]
> = {
  student: [
    { href: "/dashboard/student", icon: Home, label: "Tổng quan" },
    {
      href: "/dashboard/student/courses",
      icon: BookOpen,
      label: "Khóa học của tôi",
    },
    {
      href: "/dashboard/student/assignments",
      icon: FileText,
      label: "Bài tập",
    },
    {
      href: "/dashboard/student/grades",
      icon: BarChart3,
      label: "Kết quả học tập",
    },
    { href: "/dashboard/student/schedule", icon: Calendar, label: "Lịch học" },
  ],
  teacher: [
    { href: "/dashboard/teacher", icon: Home, label: "Tổng quan" },
    {
      href: "/dashboard/teacher/classes",
      icon: School,
      label: "Quản lý lớp học",
    },
    {
      href: "/dashboard/teacher/lessons",
      icon: BookText,
      label: "Tạo bài học",
    },
    { href: "/dashboard/teacher/quizzes", icon: Puzzle, label: "Tạo Quiz" },
    {
      href: "/dashboard/teacher/students",
      icon: Users,
      label: "Danh sách học sinh",
    },
    { href: "/dashboard/teacher/reports", icon: TrendingUp, label: "Báo cáo" },
  ],
};

function SidebarContent({
  role,
  name,
  navItems,
}: {
  role: UserRole;
  name: string;
  navItems: (typeof NAV_ITEMS)[UserRole];
}) {
  const roleLabel = role === "student" ? "Học sinh" : "Giáo viên";

  return (
    <div className="flex flex-col h-full">
      <div className="px-6 py-5 border-b border-white/8">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center shadow-md shadow-purple-600/30">
            <span className="text-base font-black text-white">Z</span>
          </div>
          <span className="text-white font-bold text-lg tracking-tight">
            Zenith EDU
          </span>
        </div>
      </div>

      <div className="px-4 py-4 border-b border-white/8">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/5">
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarFallback
              className={
                role === "student"
                  ? "bg-gradient-to-br from-cyan-500 to-blue-500 text-white text-sm font-bold"
                  : "bg-gradient-to-br from-amber-500 to-orange-500 text-white text-sm font-bold"
              }
            >
              {name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="text-white text-sm font-medium truncate">{name}</p>
            <p className="text-slate-400 text-xs">{roleLabel}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <TooltipProvider key={item.href} delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/8 transition-all text-sm group"
                >
                  <item.icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  {item.label}
                </Link>
              </TooltipTrigger>
              <TooltipContent
                side="right"
                className="bg-[#1a1a2e] border-white/10 text-white"
              >
                {item.label}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-white/8">
        <form action={logout}>
          <Button
            id="logout-btn"
            type="submit"
            variant="ghost"
            className="w-full justify-start gap-3 px-3 py-2.5 h-auto text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl text-sm font-normal"
          >
            <LogOut className="w-4 h-4" /> Đăng xuất
          </Button>
        </form>
      </div>
    </div>
  );
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  const navItems = NAV_ITEMS[session.role];
  const roleLabel = session.role === "student" ? "Học sinh" : "Giáo viên";

  return (
    <div className="min-h-screen bg-[#07060f] flex">
      <aside className="hidden md:flex w-64 shrink-0 bg-white/3 border-r border-white/8 flex-col h-screen sticky top-0">
        <SidebarContent
          role={session.role}
          name={session.name}
          navItems={navItems}
        />
      </aside>

      <div className="flex-1 flex flex-col min-h-screen">
        <header className="h-16 border-b border-white/8 bg-white/3 backdrop-blur-sm flex items-center px-4 md:px-6 gap-4 sticky top-0 z-10">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-slate-300 hover:text-white hover:bg-white/8"
              >
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-72 bg-[#07060f] border-white/8 p-0"
            >
              <SheetHeader className="sr-only">
                <SheetTitle>Navigation</SheetTitle>
              </SheetHeader>
              <SidebarContent
                role={session.role}
                name={session.name}
                navItems={navItems}
              />
            </SheetContent>
          </Sheet>

          <div className="flex-1">
            <Badge
              className={
                session.role === "student"
                  ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white border-0"
                  : "bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0"
              }
            >
              {session.role === "student" ? (
                <GraduationCap className="w-3 h-3 mr-1" />
              ) : (
                <School className="w-3 h-3 mr-1" />
              )}
              {roleLabel}
            </Badge>
          </div>
          <p className="text-slate-300 text-sm hidden sm:block">
            Xin chào, <strong className="text-white">{session.name}</strong>
          </p>
        </header>

        <main className="flex-1 p-4 md:p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
