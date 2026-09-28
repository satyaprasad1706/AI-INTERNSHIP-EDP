"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Layers,
  Briefcase,
  CheckCircle2,
  XCircle,
  Trophy,
  ArrowRight,
  Calculator,
  RefreshCw,
  Sparkles,
  Download,
  Filter,
  ShieldCheck,
} from "lucide-react";
import WorkflowBanner from "@/components/layout/WorkflowBanner";
import { MatchResult } from "@/lib/types";
import { formatScore, getScoreBadgeColor } from "@/lib/utils";
import { generateMatchingCsv, downloadCsv } from "@/lib/export-csv";

function MatchingContent() {
  const searchParams = useSearchParams();
  const initialJobId = searchParams.get("jobId") || "";

  const [jobs, setJobs] = useState<any[]>([]);
  const [selectedJobId, setSelectedJobId] = useState(initialJobId);
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [scoreFilter, setScoreFilter] = useState<number>(0);

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    if (selectedJobId) {
      fetchExistingMatches(selectedJobId);
    }
  }, [selectedJobId]);

  const fetchJobs = async () => {
    try {
      const res = await fetch("/api/jobs");
      const json = await res.json();
      if (json.success && json.data.length > 0) {
        setJobs(json.data);
        if (!selectedJobId) {
          setSelectedJobId(json.data[0].id);
        }
      }
    } catch (e) {
      console.error("Failed to load jobs", e);
    }
  };

  const fetchExistingMatches = async (jobId: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/matches?jobId=${jobId}`);
      const json = await res.json();
      if (json.success) {
        setMatches(json.data);
      }
    } catch (e) {
      console.error("Failed to load matches", e);
    } finally {
      setLoading(false);
    }
  };

  const runMatching = async () => {
    if (!selectedJobId) {
      alert("Please select a job description first.");
      return;
    }
    setEvaluating(true);
    try {
      const res = await fetch("/api/matches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId: selectedJobId,
          shortlistMode: "threshold",
          threshold: 70.0,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setMatches(json.data);
      } else {
        alert(json.error || "Failed to calculate matches.");
      }
    } catch (e: any) {
      alert("Error: " + e.message);
    } finally {
      setEvaluating(false);
    }
  };

  const selectedJob = jobs.find((j) => j.id === selectedJobId);
  const filteredMatches = matches.filter((m) => m.matchScore >= scoreFilter);

  const handleExportCsv = () => {
    if (matches.length === 0) return;
    const csv = generateMatchingCsv(matches, selectedJob?.title || "");
    downloadCsv(`role_match_results_${selectedJob?.title.toLowerCase().replace(/\s+/g, "_") || "results"}.csv`, csv);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Skill Matching Engine
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Transparent skill matching and qualification scoring across all candidate profiles for the selected role
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCsv}
            disabled={matches.length === 0}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 text-xs font-semibold shadow-sm transition-all disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            Export Match Report
          </button>
          <Link
            href="/ranking"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm shadow-blue-600/20 transition-all"
          >
            <Trophy className="w-3.5 h-3.5" />
            View Leaderboard
          </Link>
        </div>
      </div>

      {/* Funnel Progress */}
      <WorkflowBanner currentStep={6} />

      {/* Role Selection & Scoring Box */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Job Selector Box */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4 lg:col-span-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-purple-600" /> Target Job Requisition:
            </label>
            <select
              value={selectedJobId}
              onChange={(e) => setSelectedJobId(e.target.value)}
              className="px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {jobs.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.title} ({j.company})
                </option>
              ))}
            </select>
          </div>

          {selectedJob && (
            <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Required Skills ({selectedJob.requiredSkills?.length || 0}):
                </span>
                <span className="text-[11px] text-slate-400">Position Profile</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {selectedJob.requiredSkills?.map((s: string) => (
                  <span
                    key={s}
                    className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200/80 dark:border-purple-800"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="pt-2 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              {matches.length} candidate(s) evaluated
            </span>
            <button
              onClick={runMatching}
              disabled={evaluating || !selectedJobId}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-600/20 disabled:opacity-50 transition-all"
            >
              {evaluating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Evaluating Skills...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Evaluate All Candidates
                </>
              )}
            </button>
          </div>
        </div>

        {/* Scoring Breakdown Info Card */}
        <div className="p-5 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-blue-400 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" /> Transparent Scoring
            </div>
            <h3 className="font-bold text-sm">Deterministic Matching Index</h3>
            <p className="text-xs text-slate-300 leading-relaxed font-normal">
              Candidate scores reflect the exact proportion of required role skills verified on their resume.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-center space-y-1">
            <p className="text-[11px] text-slate-400">Scoring Algorithm</p>
            <p className="text-xs font-bold text-emerald-400">
              (Matching Skills / Required Skills) × 100
            </p>
          </div>
        </div>
      </div>

      {/* Matching Results Cards */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Candidate Evaluation Cards</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              {filteredMatches.length} Profiles
            </span>
          </h2>

          <div className="flex items-center gap-2.5">
            <label className="text-xs text-slate-400 font-medium">Filter by Score:</label>
            <select
              value={scoreFilter}
              onChange={(e) => setScoreFilter(Number(e.target.value))}
              className="px-3 py-1 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
            >
              <option value={0}>All Scores (0%+)</option>
              <option value={50}>50%+ Match</option>
              <option value={70}>70%+ Match (Shortlist Ready)</option>
              <option value={80}>80%+ High Match</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-14 text-center text-slate-400 text-xs flex flex-col items-center justify-center gap-2">
            <RefreshCw className="w-5 h-5 animate-spin text-blue-600" />
            <span>Loading evaluation cards...</span>
          </div>
        ) : filteredMatches.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-14 text-center border border-slate-200/80 dark:border-slate-800/80 space-y-3">
            <Layers className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
            <p className="font-bold text-sm text-slate-700 dark:text-slate-300">
              No matching evaluations computed yet for this role.
            </p>
            <p className="text-xs text-slate-400">
              Click &quot;Evaluate All Candidates&quot; above to score applicant profiles.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredMatches.map((m) => {
              const colors = getScoreBadgeColor(m.matchScore);
              return (
                <div
                  key={m.candidateId}
                  className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col justify-between space-y-4"
                >
                  {/* Candidate & Score Header */}
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-400">#{m.rank}</span>
                          <h3 className="font-bold text-base text-slate-900 dark:text-white">
                            {m.candidateName}
                          </h3>
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
                        <p className="text-xs text-slate-400 mt-0.5">{m.candidateEmail}</p>
                      </div>

                      {/* Score Badge */}
                      <div className={`px-3.5 py-1.5 rounded-2xl border text-center shrink-0 ${colors.bg} ${colors.border}`}>
                        <div className={`text-lg font-black ${colors.text}`}>
                          {formatScore(m.matchScore)}
                        </div>
                        <p className="text-[9px] uppercase font-bold tracking-wider text-slate-400">
                          Match Index
                        </p>
                      </div>
                    </div>

                    {/* Score Bar */}
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${colors.bar}`}
                        style={{ width: `${m.matchScore}%` }}
                      />
                    </div>

                    {/* Matching vs Missing Skills Breakdown */}
                    <div className="space-y-2.5 pt-1 text-xs">
                      {/* Matching Skills */}
                      <div>
                        <p className="font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1 mb-1 text-[11px] uppercase tracking-wider">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Matched Skills ({m.matchingSkills?.length || 0})
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {m.matchingSkills && m.matchingSkills.length > 0 ? (
                            m.matchingSkills.map((s) => (
                              <span
                                key={s}
                                className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800"
                              >
                                ✓ {s}
                              </span>
                            ))
                          ) : (
                            <span className="text-slate-400 italic text-[11px]">None</span>
                          )}
                        </div>
                      </div>

                      {/* Missing Skills */}
                      <div>
                        <p className="font-bold text-rose-700 dark:text-rose-400 flex items-center gap-1 mb-1 text-[11px] uppercase tracking-wider">
                          <XCircle className="w-3.5 h-3.5" /> Skill Gaps ({m.missingSkills?.length || 0})
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {m.missingSkills && m.missingSkills.length > 0 ? (
                            m.missingSkills.map((s) => (
                              <span
                                key={s}
                                className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200/80 dark:border-rose-800"
                              >
                                ✗ {s}
                              </span>
                            ))
                          ) : (
                            <span className="text-emerald-600 font-semibold text-[11px]">
                              None (100% Skill Coverage!)
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom Status */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <span
                      className={`font-bold px-2.5 py-0.5 rounded-md text-[11px] ${
                        m.shortlisted
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                          : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                      }`}
                    >
                      {m.shortlisted ? "★ SHORTLISTED" : "IN REVIEW"}
                    </span>
                    <Link
                      href={`/candidates/${m.candidateId}`}
                      className="text-blue-600 dark:text-blue-400 hover:underline font-semibold flex items-center gap-1 text-xs"
                    >
                      View Profile <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default function MatchingPage() {
  return (
    <Suspense fallback={<div className="p-14 text-center text-xs text-slate-400">Loading Skill Matcher...</div>}>
      <MatchingContent />
    </Suspense>
  );
}
