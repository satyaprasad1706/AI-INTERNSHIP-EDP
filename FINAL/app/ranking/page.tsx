"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Trophy,
  Briefcase,
  Download,
  Filter,
  CheckCircle2,
  XCircle,
  Eye,
  ArrowRight,
  RefreshCw,
  SlidersHorizontal,
} from "lucide-react";
import WorkflowBanner from "@/components/layout/WorkflowBanner";
import { MatchResult } from "@/lib/types";
import { formatScore, getScoreBadgeColor } from "@/lib/utils";
import { generateMatchingCsv, downloadCsv } from "@/lib/export-csv";

export default function RankingPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [selectedJobId, setSelectedJobId] = useState("");
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [loading, setLoading] = useState(false);

  // Shortlisting rule controls
  const [shortlistMode, setShortlistMode] = useState<"threshold" | "top_n">("threshold");
  const [threshold, setThreshold] = useState<number>(70.0);
  const [topN, setTopN] = useState<number>(5);

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    if (selectedJobId) {
      fetchRankedMatches(selectedJobId);
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
      console.error("Failed to fetch jobs", e);
    }
  };

  const fetchRankedMatches = async (jobId: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/matches?jobId=${jobId}`);
      const json = await res.json();
      if (json.success) {
        setMatches(json.data);
      }
    } catch (e) {
      console.error("Failed to fetch matches", e);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyShortlistRule = async () => {
    if (!selectedJobId) return;
    try {
      const res = await fetch("/api/matches/shortlist", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId: selectedJobId,
          shortlistMode,
          threshold,
          topN,
        }),
      });
      const json = await res.json();
      if (json.success) {
        fetchRankedMatches(selectedJobId);
      }
    } catch (e) {
      alert("Failed to update shortlist rule");
    }
  };

  const handleToggleShortlist = async (matchId: string, currentStatus: boolean) => {
    try {
      const res = await fetch("/api/matches/shortlist", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          matchId,
          shortlisted: !currentStatus,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setMatches((prev) =>
          prev.map((m) => (m.id === matchId ? { ...m, shortlisted: !currentStatus } : m))
        );
      }
    } catch (e) {
      alert("Failed to toggle status");
    }
  };

  const selectedJob = jobs.find((j) => j.id === selectedJobId);

  const handleExportCsv = () => {
    if (matches.length === 0) return;
    const csv = generateMatchingCsv(matches, selectedJob?.title || "");
    downloadCsv(`ranked_applicants_${selectedJob?.title.toLowerCase().replace(/\s+/g, "_") || "results"}.csv`, csv);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Pipeline Leaderboard
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Candidates ranked by skill match score with automated and manual shortlisting controls
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCsv}
            disabled={matches.length === 0}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 text-xs font-semibold shadow-sm transition-all disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            Export Leaderboard CSV
          </button>
          <Link
            href="/shortlist"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm shadow-emerald-600/20 transition-all"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Shortlist Decisions
          </Link>
        </div>
      </div>

      {/* Funnel Progress */}
      <WorkflowBanner currentStep={8} />

      {/* Filter and Shortlist Rule Controls */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Target Job Selector */}
          <div className="flex items-center gap-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-purple-600" /> Requisition:
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

          {/* Shortlisting Rule Configuration */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setShortlistMode("threshold")}
                className={`px-3 py-1 rounded-lg transition-all ${
                  shortlistMode === "threshold"
                    ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                    : "text-slate-400"
                }`}
              >
                Score Threshold
              </button>
              <button
                onClick={() => setShortlistMode("top_n")}
                className={`px-3 py-1 rounded-lg transition-all ${
                  shortlistMode === "top_n"
                    ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                    : "text-slate-400"
                }`}
              >
                Top N Applicants
              </button>
            </div>

            {shortlistMode === "threshold" ? (
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-slate-400 font-medium">Score &gt;=</span>
                <select
                  value={threshold}
                  onChange={(e) => setThreshold(Number(e.target.value))}
                  className="px-2.5 py-1 text-xs font-bold rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-900 dark:text-white"
                >
                  <option value={50}>50%</option>
                  <option value={60}>60%</option>
                  <option value={70}>70% (Standard)</option>
                  <option value={80}>80% (Strict)</option>
                  <option value={90}>90% (Top Tier)</option>
                </select>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-slate-400 font-medium">Select Top:</span>
                <select
                  value={topN}
                  onChange={(e) => setTopN(Number(e.target.value))}
                  className="px-2.5 py-1 text-xs font-bold rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-900 dark:text-white"
                >
                  <option value={3}>Top 3</option>
                  <option value={5}>Top 5</option>
                  <option value={10}>Top 10</option>
                  <option value={20}>Top 20</option>
                </select>
              </div>
            )}

            <button
              onClick={handleApplyShortlistRule}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm shadow-blue-600/20 transition-all"
            >
              Apply Rule
            </button>
          </div>
        </div>
      </div>

      {/* Ranking Table */}
      {loading ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-14 text-center text-slate-400 text-xs flex flex-col items-center justify-center gap-2">
          <RefreshCw className="w-5 h-5 animate-spin text-blue-600" />
          <span>Ordering leaderboard...</span>
        </div>
      ) : matches.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-14 text-center border border-slate-200/80 dark:border-slate-800/80 space-y-3">
          <Trophy className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
          <p className="font-bold text-sm text-slate-700 dark:text-slate-300">
            No evaluations computed for this requisition.
          </p>
          <Link
            href={`/matching?jobId=${selectedJobId}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-xl"
          >
            Launch Skill Matcher
          </Link>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-200/80 dark:border-slate-800 text-slate-400 uppercase font-bold text-[10px] tracking-wider">
                <tr>
                  <th className="px-5 py-3.5 text-center w-16">Rank</th>
                  <th className="px-5 py-3.5">Candidate</th>
                  <th className="px-5 py-3.5">Match Index</th>
                  <th className="px-5 py-3.5">Matched Skills</th>
                  <th className="px-5 py-3.5">Skill Gaps</th>
                  <th className="px-5 py-3.5 text-center">Shortlist Status</th>
                  <th className="px-5 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {matches.map((m) => {
                  const colors = getScoreBadgeColor(m.matchScore);
                  return (
                    <tr
                      key={m.candidateId}
                      className={`hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors ${
                        m.shortlisted ? "bg-emerald-50/20 dark:bg-emerald-950/10" : ""
                      }`}
                    >
                      {/* Rank Medal */}
                      <td className="px-5 py-4 text-center">
                        <span
                          className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-black shadow-sm ${
                            m.rank === 1
                              ? "bg-amber-400 text-slate-900 ring-2 ring-amber-300"
                              : m.rank === 2
                              ? "bg-slate-300 text-slate-900"
                              : m.rank === 3
                              ? "bg-amber-600 text-white"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                          }`}
                        >
                          #{m.rank}
                        </span>
                      </td>

                      {/* Candidate Name & Format */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 dark:text-white text-xs">
                            {m.candidateName}
                          </span>
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                              m.resumeFormat === "PDF"
                                ? "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200/80"
                                : "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200/80"
                            }`}
                          >
                            {m.resumeFormat}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{m.candidateEmail}</div>
                      </td>

                      {/* Score Gauge */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <div className={`px-2.5 py-1 rounded-xl border font-black text-xs ${colors.bg} ${colors.text} ${colors.border}`}>
                            {formatScore(m.matchScore)}
                          </div>
                          <div className="w-20 bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden hidden sm:block">
                            <div
                              className={`h-full rounded-full ${colors.bar}`}
                              style={{ width: `${m.matchScore}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Matching Skills */}
                      <td className="px-5 py-4 max-w-xs">
                        <div className="flex flex-wrap gap-1">
                          {m.matchingSkills.slice(0, 4).map((s) => (
                            <span
                              key={s}
                              className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800"
                            >
                              ✓ {s}
                            </span>
                          ))}
                          {m.matchingSkills.length > 4 && (
                            <span className="text-[10px] text-emerald-600 font-bold px-1">
                              +{m.matchingSkills.length - 4}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Missing Skills */}
                      <td className="px-5 py-4 max-w-xs">
                        <div className="flex flex-wrap gap-1">
                          {m.missingSkills.slice(0, 3).map((s) => (
                            <span
                              key={s}
                              className="text-[10px] font-medium px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200/80 dark:border-rose-800"
                            >
                              ✗ {s}
                            </span>
                          ))}
                          {m.missingSkills.length > 3 && (
                            <span className="text-[10px] text-rose-600 font-bold px-1">
                              +{m.missingSkills.length - 3}
                            </span>
                          )}
                          {m.missingSkills.length === 0 && (
                            <span className="text-[10px] text-emerald-600 font-semibold">
                              All matched!
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Shortlist Toggle */}
                      <td className="px-5 py-4 text-center">
                        <button
                          onClick={() => handleToggleShortlist(m.id || "", m.shortlisted)}
                          className={`px-3 py-1 rounded-full text-xs font-bold transition-all shadow-sm ${
                            m.shortlisted
                              ? "bg-emerald-600 text-white hover:bg-emerald-700"
                              : "bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400"
                          }`}
                        >
                          {m.shortlisted ? "★ Shortlisted" : "Not Shortlisted"}
                        </button>
                      </td>

                      {/* Profile Link */}
                      <td className="px-5 py-4 text-right">
                        <Link
                          href={`/candidates/${m.candidateId}`}
                          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-blue-600 inline-flex items-center"
                          title="View Profile"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
