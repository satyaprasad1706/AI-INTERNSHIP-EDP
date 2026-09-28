"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  UploadCloud,
  Users,
  Briefcase,
  GitCompare,
  Trophy,
  CheckCircle2,
  LineChart,
  Home,
  ShieldCheck,
  Building2,
  Layers,
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const mainNav = [
    { name: "Overview", href: "/", icon: Home },
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Jobs & Requisitions", href: "/jobs", icon: Briefcase },
    { name: "Candidates", href: "/candidates", icon: Users },
    { name: "Upload Resumes", href: "/resumes", icon: UploadCloud },
  ];

  const matchingNav = [
    { name: "Skill Matcher", href: "/matching", icon: Layers },
    { name: "Leaderboard & Ranking", href: "/ranking", icon: Trophy },
    { name: "Shortlist", href: "/shortlist", icon: CheckCircle2 },
    { name: "Compare Candidates", href: "/compare", icon: GitCompare },
  ];

  const analyticsNav = [
    { name: "Talent Analytics", href: "/analytics", icon: LineChart },
  ];

  return (
    <aside className="w-64 bg-slate-950 text-slate-200 flex flex-col shrink-0 border-r border-slate-800/80 min-h-screen select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/80">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-blue-500 flex items-center justify-center text-white font-black text-lg shadow-md shadow-blue-500/20 group-hover:scale-105 transition-all">
            RM
          </div>
          <div>
            <h1 className="font-bold text-base tracking-tight text-white flex items-center gap-1.5">
              ResumeMatch
              <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30 tracking-wider">
                ATS
              </span>
            </h1>
            <p className="text-[11px] text-slate-400 font-medium">Find the right candidate faster</p>
          </div>
        </Link>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 py-4 px-3 space-y-5 overflow-y-auto">
        {/* Core ATS Section */}
        <div className="space-y-1">
          <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Recruitment
          </div>
          {mainNav.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-blue-600 text-white shadow-sm shadow-blue-600/20"
                    : "text-slate-400 hover:bg-slate-900 hover:text-slate-100"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>

        {/* AI Screening & Evaluation Section */}
        <div className="space-y-1">
          <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Matching & Screening
          </div>
          {matchingNav.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-blue-600 text-white shadow-sm shadow-blue-600/20"
                    : "text-slate-400 hover:bg-slate-900 hover:text-slate-100"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>

        {/* Intelligence & Analytics Section */}
        <div className="space-y-1">
          <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Intelligence
          </div>
          {analyticsNav.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-blue-600 text-white shadow-sm shadow-blue-600/20"
                    : "text-slate-400 hover:bg-slate-900 hover:text-slate-100"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recruiter Workspace Profile Card */}
      <div className="p-3.5 border-t border-slate-800/80 bg-slate-900/40 m-2 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold text-xs shadow-inner">
            HR
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-xs text-white truncate">Talent Acquisition</p>
            <p className="text-[10px] text-slate-400 truncate flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span> Enterprise Workspace
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
