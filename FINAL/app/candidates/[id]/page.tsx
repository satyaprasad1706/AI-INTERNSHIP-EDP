"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Mail,
  Phone,
  Globe,
  Link2,
  GraduationCap,
  Briefcase,
  FileText,
  FileCode,
  File,
  CheckCircle2,
  Sparkles,
  Layers,
  Code2,
} from "lucide-react";
import { formatScore, getScoreBadgeColor } from "@/lib/utils";

export default function CandidateProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [candidate, setCandidate] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTextTab, setActiveTextTab] = useState<"cleaned" | "raw">("cleaned");

  useEffect(() => {
    fetchCandidate();
  }, [id]);

  const fetchCandidate = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/candidates/${id}`);
      const json = await res.json();
      if (json.success) {
        setCandidate(json.data);
      }
    } catch (e) {
      console.error("Failed to load candidate", e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center text-slate-400 text-xs">
        Loading applicant profile...
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="py-24 text-center space-y-3">
        <p className="font-bold text-slate-800 dark:text-slate-200">Candidate profile not found.</p>
        <Link href="/candidates" className="text-xs text-blue-600 underline font-semibold">
          Return to Candidate Directory
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/candidates"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Candidate Directory
        </Link>
        <Link
          href={`/matching`}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-sm shadow-blue-600/20 transition-all"
        >
          <Layers className="w-3.5 h-3.5" />
          Evaluate Against Job Openings
        </Link>
      </div>

      {/* Header Profile Card */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                {candidate.name}
              </h1>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  candidate.resumeFormat === "PDF"
                    ? "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200/80"
                    : "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200/80"
                }`}
              >
                {candidate.resumeFormat} Document
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Source file: <strong className="font-semibold text-slate-600 dark:text-slate-300">{candidate.resumeFile}</strong> • Added {new Date(candidate.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Contact Badges Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-1">
          <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 text-xs">
            <Mail className="w-4 h-4 text-blue-600 shrink-0" />
            <span className="truncate text-slate-700 dark:text-slate-200 font-medium">
              {candidate.email}
            </span>
          </div>

          <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 text-xs">
            <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="truncate text-slate-700 dark:text-slate-200 font-medium">
              {candidate.phone}
            </span>
          </div>

          <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 text-xs">
            <Globe className="w-4 h-4 text-blue-700 shrink-0" />
            {candidate.linkedin && candidate.linkedin !== "N/A" ? (
              <a
                href={candidate.linkedin}
                target="_blank"
                rel="noreferrer"
                className="truncate text-blue-600 hover:underline font-semibold"
              >
                {candidate.linkedin.replace("https://", "")}
              </a>
            ) : (
              <span className="text-slate-400">Not provided</span>
            )}
          </div>

          <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 text-xs">
            <Link2 className="w-4 h-4 text-purple-600 shrink-0" />
            {candidate.github && candidate.github !== "N/A" ? (
              <a
                href={candidate.github}
                target="_blank"
                rel="noreferrer"
                className="truncate text-purple-600 hover:underline font-semibold"
              >
                {candidate.github.replace("https://", "")}
              </a>
            ) : (
              <span className="text-slate-400">Not provided</span>
            )}
          </div>
        </div>
      </div>

      {/* Two Column Layout: Qualifications/Skills & Document Text Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Skills & Experience */}
        <div className="space-y-6 lg:col-span-1">
          {/* Experience & Education */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4">
            <h2 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-blue-600" /> Career & Credentials
            </h2>
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Experience
                </span>
                <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                  {candidate.experience}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Education & Degree
                </span>
                <p className="font-bold text-slate-800 dark:text-slate-200">
                  {candidate.education}
                </p>
              </div>
            </div>
          </div>

          {/* Technical Skills Profile */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-3">
            <h2 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Code2 className="w-4 h-4 text-emerald-600" /> Verified Technical Skills ({candidate.skills?.length || 0})
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {candidate.skills?.map((s: string) => (
                <span
                  key={s}
                  className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Core Competencies */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-3">
            <h2 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-500" /> Core Competencies ({candidate.keywords?.length || 0})
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {candidate.keywords?.map((k: string) => (
                <span
                  key={k}
                  className="text-xs font-medium px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                >
                  #{k}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Text Inspector & Job Evaluation History */}
        <div className="space-y-6 lg:col-span-2">
          {/* Match History if evaluated */}
          {candidate.matches && candidate.matches.length > 0 && (
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4">
              <h2 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-600" /> Role Evaluations
              </h2>
              <div className="space-y-3">
                {candidate.matches.map((m: any) => {
                  const colors = getScoreBadgeColor(m.matchScore);
                  return (
                    <div
                      key={m.id}
                      className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white text-sm">
                          {m.job?.title}
                        </p>
                        <p className="text-slate-400">{m.job?.company}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-[11px] text-emerald-600 font-semibold">
                            ✓ {m.matchingSkills?.length} Matched
                          </span>
                          <span>•</span>
                          <span className="text-[11px] text-rose-600 font-semibold">
                            ✗ {m.missingSkills?.length} Gap
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-right">
                          <span className={`text-base font-black ${colors.text}`}>
                            {formatScore(m.matchScore)}
                          </span>
                          <p className="text-[10px] text-slate-400 font-semibold">Rank #{m.rank}</p>
                        </div>
                        <span
                          className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                            m.shortlisted
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                              : "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300"
                          }`}
                        >
                          {m.shortlisted ? "Shortlisted" : "In Review"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Document Content Viewer */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" /> Parsed Resume Content
              </h2>
              <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
                <button
                  onClick={() => setActiveTextTab("cleaned")}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    activeTextTab === "cleaned"
                      ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                      : "text-slate-400"
                  }`}
                >
                  Structured Text
                </button>
                <button
                  onClick={() => setActiveTextTab("raw")}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    activeTextTab === "raw"
                      ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                      : "text-slate-400"
                  }`}
                >
                  Source Document
                </button>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 text-slate-200 font-mono text-xs max-h-96 overflow-y-auto whitespace-pre-wrap leading-relaxed border border-slate-800">
              {activeTextTab === "cleaned"
                ? candidate.cleanedText || candidate.rawText || "No text available."
                : candidate.rawText || "No text available."}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
