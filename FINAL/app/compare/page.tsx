"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  GitCompare,
  Briefcase,
  Users,
  CheckCircle2,
  XCircle,
  GraduationCap,
  Sparkles,
  RefreshCw,
  Mail,
  Phone,
  Layers,
} from "lucide-react";
import { Candidate, Job } from "@/lib/types";
import { formatScore, getScoreBadgeColor } from "@/lib/utils";

export default function CompareCandidatesPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJobId, setSelectedJobId] = useState("");
  const [selectedCandIds, setSelectedCandIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [candRes, jobRes] = await Promise.all([
        fetch("/api/candidates"),
        fetch("/api/jobs"),
      ]);
      const candJson = await candRes.json();
      const jobJson = await jobRes.json();

      if (candJson.success) {
        setCandidates(candJson.data);
        if (candJson.data.length >= 2) {
          setSelectedCandIds([candJson.data[0].id, candJson.data[1].id]);
        }
      }
      if (jobJson.success && jobJson.data.length > 0) {
        setJobs(jobJson.data);
        setSelectedJobId(jobJson.data[0].id);
      }
    } catch (e) {
      console.error("Failed to load compare data", e);
    } finally {
      setLoading(false);
    }
  };

  const selectedJob = jobs.find((j) => j.id === selectedJobId);
  const comparedCandidates = candidates.filter((c) => selectedCandIds.includes(c.id));

  const toggleCandidateSelection = (id: string) => {
    if (selectedCandIds.includes(id)) {
      if (selectedCandIds.length <= 1) return; // Keep at least 1
      setSelectedCandIds(selectedCandIds.filter((cid) => cid !== id));
    } else {
      if (selectedCandIds.length >= 4) {
        alert("You can compare up to 4 candidates simultaneously.");
        return;
      }
      setSelectedCandIds([...selectedCandIds, id]);
    }
  };

  const calculateCandidateMatch = (candSkills: string[], reqSkills: string[] = []) => {
    if (!reqSkills || reqSkills.length === 0) return { score: 0, matching: [], missing: [] };
    const candSet = new Set(candSkills.map((s) => s.trim().toLowerCase()));
    const matching: string[] = [];
    const missing: string[] = [];

    for (const req of reqSkills) {
      if (candSet.has(req.trim().toLowerCase())) {
        matching.push(req);
      } else {
        missing.push(req);
      }
    }

    const score = (matching.length / reqSkills.length) * 100;
    return { score: Math.round(score * 100) / 100, matching, missing };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Candidate Comparison Matrix
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Side-by-side skill coverage, credentials, and experience evaluation for targeted role requisitions
          </p>
        </div>
      </div>

      {/* Target Job Selector & Candidate Multi-picker */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-purple-600" /> Comparison Target Role:
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

          <div className="text-xs text-slate-400">
            Select 2–4 candidates to compare:
          </div>
        </div>

        {/* Candidate Multi-select Pills */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          {candidates.map((c) => {
            const isSelected = selectedCandIds.includes(c.id);
            return (
              <button
                key={c.id}
                onClick={() => toggleCandidateSelection(c.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                  isSelected
                    ? "bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-600/20"
                    : "bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 border-slate-200/80 dark:border-slate-700 hover:border-slate-400"
                }`}
              >
                {isSelected && "✓ "} {c.name} ({c.resumeFormat})
              </button>
            );
          })}
        </div>
      </div>

      {/* Comparison Grid */}
      {loading ? (
        <div className="py-14 text-center text-slate-400 text-xs">Loading comparison matrix...</div>
      ) : comparedCandidates.length === 0 ? (
        <div className="py-14 text-center text-slate-400 text-xs">
          Please select at least 2 candidates to compare.
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl shadow-sm overflow-x-auto p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 min-w-[700px]">
            {comparedCandidates.map((cand) => {
              const evalRes = calculateCandidateMatch(
                cand.skills || [],
                selectedJob?.requiredSkills || []
              );
              const colors = getScoreBadgeColor(evalRes.score);

              return (
                <div
                  key={cand.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    {/* Header */}
                    <div>
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-base text-slate-900 dark:text-white">
                          {cand.name}
                        </h3>
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                            cand.resumeFormat === "PDF"
                              ? "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200/80"
                              : "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200/80"
                          }`}
                        >
                          {cand.resumeFormat}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 truncate mt-0.5">{cand.email}</p>
                    </div>

                    {/* Match Score Card */}
                    <div className={`p-3 rounded-2xl border text-center ${colors.bg} ${colors.border}`}>
                      <span className="text-[9px] uppercase font-bold text-slate-400 block">
                        Match Index vs {selectedJob?.title}
                      </span>
                      <span className={`text-2xl font-black ${colors.text}`}>
                        {formatScore(evalRes.score)}
                      </span>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden mt-1.5">
                        <div
                          className={`h-full ${colors.bar}`}
                          style={{ width: `${evalRes.score}%` }}
                        />
                      </div>
                    </div>

                    {/* Experience & Education */}
                    <div className="text-xs space-y-1.5 pt-1">
                      <div>
                        <span className="font-semibold text-slate-400 text-[10px] uppercase tracking-wider block">
                          Experience:
                        </span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          {cand.experience}
                        </span>
                      </div>
                      <div>
                        <span className="font-semibold text-slate-400 text-[10px] uppercase tracking-wider block">
                          Education:
                        </span>
                        <span className="text-slate-700 dark:text-slate-300">
                          {cand.education}
                        </span>
                      </div>
                    </div>

                    {/* Matching Skills */}
                    <div>
                      <span className="font-bold text-emerald-700 dark:text-emerald-400 text-[10px] uppercase tracking-wider block mb-1">
                        Matched Skills ({evalRes.matching.length})
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {evalRes.matching.map((s) => (
                          <span
                            key={s}
                            className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                          >
                            ✓ {s}
                          </span>
                        ))}
                        {evalRes.matching.length === 0 && (
                          <span className="text-slate-400 italic text-[10px]">None</span>
                        )}
                      </div>
                    </div>

                    {/* Missing Skills */}
                    <div>
                      <span className="font-bold text-rose-700 dark:text-rose-400 text-[10px] uppercase tracking-wider block mb-1">
                        Skill Gaps ({evalRes.missing.length})
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {evalRes.missing.map((s) => (
                          <span
                            key={s}
                            className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                          >
                            ✗ {s}
                          </span>
                        ))}
                        {evalRes.missing.length === 0 && (
                          <span className="text-emerald-600 font-semibold text-[10px]">
                            None (100% matched)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
                    <Link
                      href={`/candidates/${cand.id}`}
                      className="text-xs font-semibold text-blue-600 hover:underline block text-center"
                    >
                      View Full Profile
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
