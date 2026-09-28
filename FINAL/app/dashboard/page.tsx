"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  Briefcase,
  Trophy,
  CheckCircle2,
  UploadCloud,
  Layers,
  ArrowRight,
  TrendingUp,
  FileCode,
  File,
  RefreshCw,
  Sparkles,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import WorkflowBanner from "@/components/layout/WorkflowBanner";
import { formatScore, getScoreBadgeColor } from "@/lib/utils";

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [recentCandidates, setRecentCandidates] = useState<any[]>([]);
  const [recentJobs, setRecentJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/dashboard");
      const json = await res.json();
      if (json.success) {
        setStats(json.data.stats);
        setRecentCandidates(json.data.recentCandidates);
        setRecentJobs(json.data.recentJobs);
      }
    } catch (e) {
      console.error("Failed to load dashboard stats", e);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Recruitment Overview
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time pipeline metrics, applicant ingestion status, and role match distributions
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchDashboardData}
            disabled={loading}
            className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 text-xs flex items-center gap-1.5 font-medium shadow-sm transition-all"
            title="Refresh statistics"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <Link
            href="/resumes"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-sm shadow-blue-600/20 transition-all"
          >
            <UploadCloud className="w-3.5 h-3.5" />
            Ingest Resumes
          </Link>
        </div>
      </div>

      {/* Funnel Workflow Progress */}
      <WorkflowBanner currentStep={2} />

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Talent Pool */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Talent Pool
            </span>
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {stats?.totalResumes ?? 0}
            </span>
            <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
              <span className="flex items-center gap-0.5 text-blue-600 font-semibold">
                <File className="w-3 h-3" /> {stats?.pdfCount ?? 0} PDF
              </span>
              <span>•</span>
              <span className="flex items-center gap-0.5 text-indigo-600 font-semibold">
                <FileCode className="w-3 h-3" /> {stats?.txtCount ?? 0} TXT
              </span>
            </div>
          </div>
        </div>

        {/* Processed Profiles */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Profiles Parsed
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {stats?.processedResumes ?? 0}
            </span>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
              Skill Indexed
            </p>
          </div>
        </div>

        {/* Open Job Roles */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Active Requisitions
            </span>
            <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {stats?.activeJobs ?? 0}
            </span>
            <p className="text-[11px] text-slate-400 mt-1">Open positions</p>
          </div>
        </div>

        {/* Average Match Score */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Avg Match Index
            </span>
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {stats?.averageMatchScore ? `${stats.averageMatchScore}%` : "—"}
            </span>
            <p className="text-[11px] text-slate-400 mt-1">Across evaluated roles</p>
          </div>
        </div>

        {/* Shortlisted Candidates */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Shortlisted Talent
            </span>
            <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
              <Trophy className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {stats?.shortlistedCandidates ?? 0}
            </span>
            <p className="text-[11px] text-slate-400 mt-1">Ready for interviews</p>
          </div>
        </div>
      </div>

      {/* Two Column Section: Recent Candidates & Active Jobs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Processed Candidates */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              <h2 className="font-bold text-sm text-slate-900 dark:text-white">
                Recent Candidate Profiles
              </h2>
            </div>
            <Link
              href="/candidates"
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-semibold"
            >
              View directory ({stats?.totalResumes ?? 0})
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {recentCandidates.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-xs">
              No profiles processed yet. Click &quot;Ingest Resumes&quot; or &quot;Seed Talent Pool&quot; in the header.
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {recentCandidates.map((c) => (
                <div key={c.id} className="py-3.5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center shrink-0 border border-slate-200/60 dark:border-slate-700">
                      {getInitials(c.name)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-xs text-slate-900 dark:text-white truncate">
                          {c.name}
                        </p>
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                            c.resumeFormat === "PDF"
                              ? "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200/80"
                              : "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200/80"
                          }`}
                        >
                          {c.resumeFormat}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">
                        {c.email} • {c.experience}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {c.skills.slice(0, 3).map((s: string) => (
                          <span
                            key={s}
                            className="text-[9px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                          >
                            {s}
                          </span>
                        ))}
                        {c.skills.length > 3 && (
                          <span className="text-[9px] text-slate-400 font-semibold">
                            +{c.skills.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <Link
                    href={`/candidates/${c.id}`}
                    className="shrink-0 text-xs px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold"
                  >
                    Profile
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Active Jobs & Quick Match */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-purple-600" />
              <h2 className="font-bold text-sm text-slate-900 dark:text-white">
                Active Job Requisitions
              </h2>
            </div>
            <Link
              href="/jobs"
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-semibold"
            >
              Manage ({stats?.activeJobs ?? 0})
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {recentJobs.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-xs">
              No active job openings. Click &quot;Manage&quot; to create a new role description.
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {recentJobs.map((j) => (
                <div key={j.id} className="py-3.5 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-bold text-xs text-slate-900 dark:text-white truncate">
                      {j.title}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">{j.company}</p>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {j.requiredSkills.slice(0, 4).map((s: string) => (
                        <span
                          key={s}
                          className="text-[9px] font-semibold px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200/80 dark:border-purple-800"
                        >
                          {s}
                        </span>
                      ))}
                      {j.requiredSkills.length > 4 && (
                        <span className="text-[9px] text-slate-400 font-semibold">
                          +{j.requiredSkills.length - 4}
                        </span>
                      )}
                    </div>
                  </div>
                  <Link
                    href={`/matching?jobId=${j.id}`}
                    className="shrink-0 inline-flex items-center gap-1 text-xs px-3.5 py-1.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 shadow-sm shadow-blue-600/20"
                  >
                    <Layers className="w-3 h-3" />
                    Match
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
