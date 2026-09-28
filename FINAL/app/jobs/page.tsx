"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Briefcase,
  Plus,
  Upload,
  Sparkles,
  Trash2,
  Layers,
  CheckCircle2,
  FileText,
  RefreshCw,
  X,
} from "lucide-react";
import { Job } from "@/lib/types";

export default function JobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form states
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [description, setDescription] = useState("");
  const [extractedSkills, setExtractedSkills] = useState<string[]>([]);
  const [newSkillInput, setNewSkillInput] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/jobs");
      const json = await res.json();
      if (json.success) {
        setJobs(json.data);
      }
    } catch (e) {
      console.error("Failed to load jobs", e);
    } finally {
      setLoading(false);
    }
  };

  const handleExtractSkillsFromDescription = async () => {
    if (!description.trim()) {
      alert("Please enter a job description first.");
      return;
    }
    setIsExtracting(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/api/extract-job-skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
      });
      if (res.ok) {
        const data = await res.json();
        setExtractedSkills(data.skills || []);
      }
    } catch (e) {
      console.error("Extraction error", e);
    } finally {
      setIsExtracting(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setDescription(text);
      if (!title) {
        setTitle(file.name.replace(".txt", "").replace(/_/g, " ").toUpperCase());
      }
    };
    reader.readAsText(file);
  };

  const addCustomSkill = () => {
    const trimmed = newSkillInput.trim();
    if (trimmed && !extractedSkills.includes(trimmed)) {
      setExtractedSkills([...extractedSkills, trimmed]);
      setNewSkillInput("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setExtractedSkills(extractedSkills.filter((s) => s !== skillToRemove));
  };

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      alert("Title and Description are required.");
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          company: company || "Company Inc.",
          description,
          requiredSkills: extractedSkills,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setShowCreateModal(false);
        setTitle("");
        setCompany("");
        setDescription("");
        setExtractedSkills([]);
        fetchJobs();
      } else {
        alert(json.error || "Failed to create job.");
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteJob = async (id: string, jobTitle: string) => {
    if (!confirm(`Delete requisition for "${jobTitle}"?`)) return;
    try {
      const res = await fetch(`/api/jobs/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        setJobs(jobs.filter((j) => j.id !== id));
      }
    } catch (e) {
      alert("Failed to delete job.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Job Requisitions
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Active position openings, skill profiles, and automated applicant evaluation
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-sm shadow-blue-600/20 transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          Create Job Requisition
        </button>
      </div>

      {/* Jobs Grid */}
      {loading ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-14 text-center text-slate-400 text-xs flex flex-col items-center justify-center gap-2">
          <RefreshCw className="w-5 h-5 animate-spin text-blue-600" />
          <span>Loading job requisitions...</span>
        </div>
      ) : jobs.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-14 text-center border border-slate-200/80 dark:border-slate-800/80 space-y-3">
          <Briefcase className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
          <p className="font-bold text-sm text-slate-700 dark:text-slate-300">
            No active job openings.
          </p>
          <p className="text-xs text-slate-400">
            Create a new position or click &quot;Seed Talent Pool&quot; in the header to load demo jobs.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {jobs.map((j) => (
            <div
              key={j.id}
              className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white">
                      {j.title}
                    </h3>
                    <p className="text-xs text-slate-400 font-medium">{j.company}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteJob(j.id, j.title)}
                    className="text-slate-400 hover:text-rose-500 p-1"
                    title="Delete requisition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                  {j.description}
                </p>

                {/* Required Skills Badges */}
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                    <span>Required Technical Profile ({j.requiredSkills?.length || 0} skills)</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {j.requiredSkills?.map((skill: string) => (
                      <span
                        key={skill}
                        className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200/80 dark:border-purple-800"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="text-[11px] text-slate-400">
                  {j.matchCount > 0 ? (
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      ✓ {j.matchCount} candidates evaluated ({j.shortlistedCount} shortlisted)
                    </span>
                  ) : (
                    <span>Ready for candidate evaluation</span>
                  )}
                </div>
                <Link
                  href={`/matching?jobId=${j.id}`}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm shadow-blue-600/20 transition-all"
                >
                  <Layers className="w-3.5 h-3.5" />
                  Run Matching Engine
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Job Description Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Create Job Requisition
                </h3>
                <p className="text-xs text-slate-400">
                  Specify requirements or upload a <code className="text-blue-600 font-semibold">.txt</code> job description
                </p>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateJob} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Job Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Senior Full Stack Developer"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Company / Hiring Team
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Global Tech Solutions"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Role Description & Requirements *
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".txt"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-semibold"
                    >
                      <Upload className="w-3 h-3" /> Upload job_description.txt
                    </button>
                  </div>
                </div>
                <textarea
                  required
                  rows={5}
                  placeholder="Paste job description text with role requirements and required technical skills..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-3 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Automated Skill Extraction Trigger */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Auto-Extract Required Skills
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Extracts required technical skills from the description text
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleExtractSkillsFromDescription}
                  disabled={isExtracting || !description.trim()}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-xl disabled:opacity-50 transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  {isExtracting ? "Extracting..." : "Extract Skills"}
                </button>
              </div>

              {/* Extracted Skills Tag Editor */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Required Skill Profile ({extractedSkills.length})
                </label>
                <div className="flex flex-wrap gap-1.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 min-h-[50px]">
                  {extractedSkills.map((s) => (
                    <span
                      key={s}
                      className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-md bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 border border-purple-200/80 dark:border-purple-800"
                    >
                      {s}
                      <button
                        type="button"
                        onClick={() => removeSkill(s)}
                        className="text-purple-500 hover:text-rose-600 font-bold ml-1"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  {extractedSkills.length === 0 && (
                    <span className="text-xs text-slate-400 py-1">
                      No skills added yet. Click &quot;Auto-Extract Required Skills&quot; or type a skill below.
                    </span>
                  )}
                </div>

                <div className="flex gap-2 mt-2">
                  <input
                    type="text"
                    placeholder="Add custom skill (e.g. Next.js, Docker)..."
                    value={newSkillInput}
                    onChange={(e) => setNewSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addCustomSkill();
                      }
                    }}
                    className="flex-1 px-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={addCustomSkill}
                    className="px-3.5 py-1.5 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-xl hover:bg-slate-300"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md disabled:opacity-50 transition-all"
                >
                  {isSaving ? "Saving Requisition..." : "Save Job Requisition"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
