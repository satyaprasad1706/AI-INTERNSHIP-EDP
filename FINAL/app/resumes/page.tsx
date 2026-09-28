"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import {
  UploadCloud,
  File,
  FileCode,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ArrowRight,
  Sparkles,
  Trash2,
  Users,
  Layers,
  FileCheck2,
} from "lucide-react";
import WorkflowBanner from "@/components/layout/WorkflowBanner";

export default function ResumeUploadPage() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedResults, setProcessedResults] = useState<any[]>([]);
  const [processingErrors, setProcessingErrors] = useState<any[]>([]);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addFiles(Array.from(e.target.files));
    }
  };

  const addFiles = (files: File[]) => {
    const valid = files.filter((f) => {
      const ext = f.name.split(".").pop()?.toLowerCase();
      return ext === "pdf" || ext === "txt";
    });

    if (valid.length < files.length) {
      alert("Only .pdf and .txt resume files are supported. Non-supported files were excluded.");
    }

    setSelectedFiles((prev) => [...prev, ...valid]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUploadAndProcess = async () => {
    if (selectedFiles.length === 0) return;

    setIsProcessing(true);
    setStatusMessage(`Ingesting and parsing ${selectedFiles.length} resumes...`);
    setProcessedResults([]);
    setProcessingErrors([]);

    const formData = new FormData();
    for (const file of selectedFiles) {
      formData.append("files", file);
    }

    try {
      const res = await fetch("/api/candidates", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      if (json.success) {
        setProcessedResults(json.data || []);
        setProcessingErrors(json.errors || []);
        setStatusMessage(
          `Successfully processed and indexed ${json.processed} applicant profile(s).`
        );
        setSelectedFiles([]);
      } else {
        setStatusMessage(`Error: ${json.error}`);
      }
    } catch (e: any) {
      setStatusMessage(`Processing error: ${e.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Resume Ingestion & Parsing
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Accepts multi-page PDF and TXT resumes. Extracts candidate contact records, education, experience, and technical skill profiles.
          </p>
        </div>
        <Link
          href="/candidates"
          className="inline-flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold"
        >
          <Users className="w-3.5 h-3.5" />
          View Candidate Directory
        </Link>
      </div>

      {/* Funnel Progress */}
      <WorkflowBanner currentStep={1} />

      {/* Modern Drag & Drop Upload Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-3xl p-10 text-center cursor-pointer transition-all ${
          isDragging
            ? "border-blue-500 bg-blue-50/60 dark:bg-blue-950/40 scale-[1.01]"
            : "border-slate-300 dark:border-slate-700 hover:border-blue-400/80 bg-white dark:bg-slate-900 shadow-sm"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.txt"
          onChange={handleFileSelect}
          className="hidden"
        />
        <div className="max-w-md mx-auto space-y-3.5">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-inner">
            <UploadCloud className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900 dark:text-white">
              Drag and drop applicant resumes, or <span className="text-blue-600 dark:text-blue-400 underline">browse files</span>
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Supports simultaneous batches of <strong className="font-semibold text-slate-600 dark:text-slate-300">.PDF</strong> and <strong className="font-semibold text-slate-600 dark:text-slate-300">.TXT</strong> documents
            </p>
          </div>
          <div className="flex items-center justify-center gap-4 text-[11px] text-slate-400 pt-1">
            <span className="flex items-center gap-1">
              <File className="w-3.5 h-3.5 text-rose-500" /> Multi-page PDF
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <FileCode className="w-3.5 h-3.5 text-blue-500" /> Plain Text (.txt)
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <FileCheck2 className="w-3.5 h-3.5 text-emerald-500" /> Automated Parsing
            </span>
          </div>
        </div>
      </div>

      {/* Selected File Queue */}
      {selectedFiles.length > 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Selected Documents ({selectedFiles.length} files)
            </h3>
            <button
              onClick={() => setSelectedFiles([])}
              className="text-xs text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1 font-semibold"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear Queue
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 max-h-56 overflow-y-auto pr-1">
            {selectedFiles.map((file, idx) => {
              const ext = file.name.split(".").pop()?.toUpperCase();
              return (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 text-xs"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                        ext === "PDF"
                          ? "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
                          : "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                      }`}
                    >
                      {ext}
                    </span>
                    <span className="font-semibold text-slate-700 dark:text-slate-200 truncate">
                      {file.name}
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(idx);
                    }}
                    className="text-slate-400 hover:text-rose-500 p-1 font-bold"
                  >
                    ×
                  </button>
                </div>
              );
            })}
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={handleUploadAndProcess}
              disabled={isProcessing}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-600/20 disabled:opacity-50 transition-all"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Parsing Profiles...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Ingest & Index Profiles
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Status Message */}
      {statusMessage && (
        <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 text-xs font-semibold text-blue-900 dark:text-blue-200 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-600" />
          {statusMessage}
        </div>
      )}

      {/* Errors List */}
      {processingErrors.length > 0 && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 space-y-2">
          <p className="text-xs font-bold text-rose-800 dark:text-rose-300 flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4" /> Some files could not be parsed:
          </p>
          <ul className="text-xs text-rose-700 dark:text-rose-400 list-disc list-inside space-y-1">
            {processingErrors.map((err, i) => (
              <li key={i}>
                <strong>{err.filename}</strong>: {err.reason}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Live Processed Results Grid */}
      {processedResults.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Indexed Profiles ({processedResults.length})
            </h3>
            <Link
              href="/candidates"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 shadow-sm shadow-emerald-600/20"
            >
              Open Candidate Directory
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {processedResults.map((c) => (
              <div
                key={c.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-3.5"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">{c.name}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">{c.email} • {c.phone}</p>
                  </div>
                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                      c.resumeFormat === "PDF"
                        ? "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200/80"
                        : "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200/80"
                    }`}
                  >
                    {c.resumeFormat}
                  </span>
                </div>

                <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                  <p><strong>Education:</strong> {c.education}</p>
                  <p><strong>Experience:</strong> {c.experience}</p>
                </div>

                {/* Extracted Skills */}
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Technical Skills ({c.skills?.length || 0})
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {c.skills?.map((s: string) => (
                      <span
                        key={s}
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
