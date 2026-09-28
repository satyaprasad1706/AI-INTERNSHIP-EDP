"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Briefcase,
  Download,
  Mail,
  Phone,
  File,
  FileCode,
  ArrowRight,
  RefreshCw,
  Trophy,
} from "lucide-react";
import WorkflowBanner from "@/components/layout/WorkflowBanner";
import { MatchResult } from "@/lib/types";
import { formatScore, getScoreBadgeColor } from "@/lib/utils";
import { generateMatchingCsv, downloadCsv } from "@/lib/export-csv";

export default function ShortlistPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [selectedJobId, setSelectedJobId] = useState("");
  const [shortlistedMatches, setShortlistedMatches] = useState<MatchResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    if (selectedJobId) {
      fetchShortlist(selectedJobId);
    }
  }, [selectedJobId]);

  const fetchJobs = async () => {
    try {
      const res = await fetch("/api/jobs");
      const json = await res.json();
      if (json.success && json.data.length > 0) {
        setJobs(json.data);
        setSelectedJobId(json.data[0].id);
      }
    } catch (e) {
      console.error("Failed to load jobs", e);
    }
  };

  const fetchShortlist = async (jobId: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/matches?jobId=${jobId}&shortlisted=true`);
      const json = await res.json();
      if (json.success) {
        setShortlistedMatches(json.data);
      }
    } catch (e) {
      console.error("Failed to load shortlist", e);
    } finally {
      setLoading(false);
    }
  };

  const selectedJob = jobs.find((j) => j.id === selectedJobId);

  const handleExportCsv = () => {
    if (shortlistedMatches.length === 0) return;
    const csv = generateMatchingCsv(shortlistedMatches, selectedJob?.title || "");
    downloadCsv(`shortlisted_candidates_${selectedJob?.title.toLowerCase().replace(/\s+/g, "_") || "results"}.csv`, csv);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Shortlist Decisions
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Top qualifying candidates meeting hiring criteria, ready for interviews and ATS export
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCsv}
            disabled={shortlistedMatches.length === 0}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm shadow-emerald-600/20 transition-all disabled:opacity-50"
            title="Export shortlisted_candidates.csv"
          >
            <Download className="w-3.5 h-3.5" />
            Export Shortlist CSV
          </button>
          <Link
            href="/ranking"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 text-xs font-semibold shadow-sm transition-all"
          >
            <Trophy className="w-3.5 h-3.5" />
            Adjust Criteria
          </Link>
        </div>
      </div>

      {/* Funnel Progress */}
      <WorkflowBanner currentStep={9} />

      {/* Job Selection Bar */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Briefcase className="w-4 h-4 text-purple-600" /> Target Position:
          </label>
          <select
            value={selectedJobId}
            onChange={(e) => setSelectedJobId(e.target.value)}
            className="px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-900 dark:text-white"
          >
            {jobs.map((j) => (
              <option key={j.id} value={j.id}>
                {j.title} ({j.company})
              </option>
            ))}
          </select>
        </div>

        <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
          ★ {shortlistedMatches.length} Shortlisted Candidates
        </div>
      </div>

      {/* Shortlisted Candidates Cards Grid */}
      {loading ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-14 text-center text-slate-400 text-xs flex flex-col items-center justify-center gap-2">
          <RefreshCw className="w-5 h-5 animate-spin text-blue-600" />
          <span>Loading shortlist...</span>
        </div>
      ) : shortlistedMatches.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-14 text-center border border-slate-200/80 dark:border-slate-800/80 space-y-3">
          <CheckCircle2 className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
          <p className="font-bold text-sm text-slate-700 dark:text-slate-300">
            No candidates are currently shortlisted for this role.
          </p>
          <p className="text-xs text-slate-400">
            Visit the Candidate Leaderboard to apply a Top-N or Score Threshold rule.
          </p>
          <Link
            href="/ranking"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-xl"
          >
            Go to Pipeline Leaderboard
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {shortlistedMatches.map((m) => {
            const colors = getScoreBadgeColor(m.matchScore);
            return (
              <div
                key={m.candidateId}
                className="p-5 rounded-3xl bg-white dark:bg-slate-900 border-2 border-emerald-200/80 dark:border-emerald-800/80 shadow-sm flex flex-col justify-between space-y-4 relative overflow-hidden"
              >
                {/* Shortlist Ribbon */}
                <div className="absolute top-0 right-0 bg-emerald-600 text-white text-[9px] font-black uppercase tracking-wider px-3 py-0.5 rounded-bl-xl shadow-sm">
                  Shortlisted
                </div>

                <div className="space-y-3">
                  <div className="flex items-start justify-between pr-14">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-emerald-600">#{m.rank}</span>
                        <h3 className="font-bold text-base text-slate-900 dark:text-white">
                          {m.candidateName}
                        </h3>
                      </div>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded inline-block mt-1 ${
                          m.resumeFormat === "PDF"
                            ? "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200/80"
                            : "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200/80"
                        }`}
                      >
                        {m.resumeFormat}
                      </span>
                    </div>
                  </div>

                  {/* Contact Snippet */}
                  <div className="text-xs text-slate-400 space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span className="truncate">{m.candidateEmail}</span>
                    </div>
                    {m.candidatePhone && (
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span>{m.candidatePhone}</span>
                      </div>
                    )}
                  </div>

                  {/* Score */}
                  <div className={`p-3 rounded-2xl border flex items-center justify-between ${colors.bg} ${colors.border}`}>
                    <div>
                      <span className="text-[9px] uppercase font-bold text-slate-400 block">
                        Match Index
                      </span>
                      <span className={`text-xl font-black ${colors.text}`}>
                        {formatScore(m.matchScore)}
                      </span>
                    </div>
                    <div className="text-right text-[11px] font-semibold text-emerald-600">
                      ✓ {m.matchingSkills.length} Skills Matched
                    </div>
                  </div>

                  {/* Matched Skills */}
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Verified Technical Skills
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {m.matchingSkills.map((s) => (
                        <span
                          key={s}
                          className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom Action */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 truncate max-w-[140px]">
                    {m.resumeFile}
                  </span>
                  <Link
                    href={`/candidates/${m.candidateId}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline"
                  >
                    Full Profile <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
