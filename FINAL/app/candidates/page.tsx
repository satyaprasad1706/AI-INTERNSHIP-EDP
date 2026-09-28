"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  Search,
  Download,
  Filter,
  Eye,
  Trash2,
  File,
  FileCode,
  Sparkles,
  Layers,
  UploadCloud,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import { Candidate } from "@/lib/types";
import { generateCandidatesCsv, downloadCsv } from "@/lib/export-csv";

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [formatFilter, setFormatFilter] = useState("ALL");

  useEffect(() => {
    fetchCandidates();
  }, [formatFilter]);

  const fetchCandidates = async () => {
    setLoading(true);
    try {
      const url =
        formatFilter !== "ALL"
          ? `/api/candidates?format=${formatFilter}`
          : "/api/candidates";
      const res = await fetch(url);
      const json = await res.json();
      if (json.success) {
        setCandidates(json.data);
      }
    } catch (e) {
      console.error("Failed to load candidates", e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete applicant record for ${name}?`)) return;
    try {
      const res = await fetch(`/api/candidates/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        setCandidates((prev) => prev.filter((c) => c.id !== id));
      }
    } catch (e) {
      alert("Failed to delete candidate");
    }
  };

  const handleExportCsv = () => {
    if (candidates.length === 0) {
      alert("No candidate records to export.");
      return;
    }
    const csvContent = generateCandidatesCsv(candidates);
    downloadCsv("candidate_talent_directory.csv", csvContent);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  const filteredCandidates = candidates.filter((c) => {
    const q = searchTerm.toLowerCase();
    const matchName = c.name.toLowerCase().includes(q);
    const matchEmail = c.email.toLowerCase().includes(q);
    const matchSkills = c.skills?.some((s) => s.toLowerCase().includes(q));
    const matchExp = c.experience.toLowerCase().includes(q);
    return matchName || matchEmail || matchSkills || matchExp;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Talent Directory
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Indexed candidate profiles with verified credentials, skills, and resume documents
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 text-xs font-semibold shadow-sm transition-all"
            title="Export candidate_talent_directory.csv"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
          <Link
            href="/resumes"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm shadow-blue-600/20 transition-all"
          >
            <UploadCloud className="w-3.5 h-3.5" />
            Ingest Resumes
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, skill, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          {/* Format Tabs */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setFormatFilter("ALL")}
              className={`px-3 py-1 rounded-lg transition-all ${
                formatFilter === "ALL"
                  ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              All ({candidates.length})
            </button>
            <button
              onClick={() => setFormatFilter("PDF")}
              className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1 ${
                formatFilter === "PDF"
                  ? "bg-white dark:bg-slate-700 text-rose-600 dark:text-rose-400 shadow-sm"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <File className="w-3 h-3" /> PDF
            </button>
            <button
              onClick={() => setFormatFilter("TXT")}
              className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1 ${
                formatFilter === "TXT"
                  ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <FileCode className="w-3 h-3" /> TXT
            </button>
          </div>
        </div>
      </div>

      {/* Candidate List View */}
      {loading ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-14 text-center text-slate-400 text-xs flex flex-col items-center justify-center gap-2">
          <RefreshCw className="w-5 h-5 animate-spin text-blue-600" />
          <span>Loading candidate profiles...</span>
        </div>
      ) : filteredCandidates.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-14 text-center border border-slate-200/80 dark:border-slate-800/80 space-y-3">
          <Users className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
          <p className="font-bold text-sm text-slate-700 dark:text-slate-300">
            No candidates found matching your criteria.
          </p>
          <p className="text-xs text-slate-400">
            Ingest new resumes or click &quot;Seed Talent Pool&quot; in the header.
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-200/80 dark:border-slate-800 text-slate-400 uppercase font-bold text-[10px] tracking-wider">
                <tr>
                  <th className="px-5 py-3.5">Candidate</th>
                  <th className="px-5 py-3.5">Contact</th>
                  <th className="px-5 py-3.5">Experience & Qualifications</th>
                  <th className="px-5 py-3.5">Technical Skill Profile</th>
                  <th className="px-5 py-3.5">Document</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {filteredCandidates.map((c) => (
                  <tr
                    key={c.id}
                    className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    {/* Candidate Name & Avatar */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center shrink-0 border border-slate-200/60 dark:border-slate-700">
                          {getInitials(c.name)}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white text-xs">
                            {c.name}
                          </div>
                          <div className="text-[10px] text-slate-400 truncate max-w-[140px] mt-0.5">
                            {c.resumeFile}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="px-5 py-4 text-slate-600 dark:text-slate-300">
                      <div>{c.email}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{c.phone}</div>
                    </td>

                    {/* Experience & Education */}
                    <td className="px-5 py-4 text-slate-600 dark:text-slate-300 max-w-xs">
                      <div className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                        {c.experience}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate mt-0.5">
                        {c.education}
                      </div>
                    </td>

                    {/* Skills */}
                    <td className="px-5 py-4 max-w-sm">
                      <div className="flex flex-wrap gap-1">
                        {c.skills?.slice(0, 4).map((s) => (
                          <span
                            key={s}
                            className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800"
                          >
                            {s}
                          </span>
                        ))}
                        {c.skills && c.skills.length > 4 && (
                          <span className="text-[10px] text-slate-400 font-bold px-1">
                            +{c.skills.length - 4}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Format */}
                    <td className="px-5 py-4">
                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                          c.resumeFormat === "PDF"
                            ? "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200/80"
                            : "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200/80"
                        }`}
                      >
                        {c.resumeFormat}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/candidates/${c.id}`}
                          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-blue-600 transition-colors"
                          title="View Candidate Profile"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Link>
                        <Link
                          href="/matching"
                          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-purple-600 transition-colors"
                          title="Evaluate vs Job Openings"
                        >
                          <Layers className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(c.id, c.name)}
                          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-rose-50 dark:hover:bg-rose-950/60 hover:text-rose-600 transition-colors"
                          title="Delete Record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
