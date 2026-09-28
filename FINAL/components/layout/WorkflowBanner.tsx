"use client";

import {
  UploadCloud,
  FileCheck2,
  Tags,
  Briefcase,
  Layers,
  Sparkles,
  Calculator,
  Trophy,
  CheckCircle2,
  Download,
} from "lucide-react";

export default function WorkflowBanner({ currentStep = 1 }: { currentStep?: number }) {
  const steps = [
    { num: 1, label: "Ingest Resumes", icon: UploadCloud },
    { num: 2, label: "Smart Parser", icon: FileCheck2 },
    { num: 3, label: "Skill Intelligence", icon: Tags },
    { num: 4, label: "Job Requisition", icon: Briefcase },
    { num: 5, label: "Skill Profiling", icon: Layers },
    { num: 6, label: "Candidate Match", icon: Sparkles },
    { num: 7, label: "Score Breakdown", icon: Calculator },
    { num: 8, label: "Pipeline Ranking", icon: Trophy },
    { num: 9, label: "Shortlist Decision", icon: CheckCircle2 },
    { num: 10, label: "ATS Export", icon: Download },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-4 shadow-sm mb-6 overflow-x-auto">
      <div className="flex items-center justify-between min-w-[780px] relative px-2">
        {/* Connecting Track */}
        <div className="absolute top-1/2 left-6 right-6 h-0.5 bg-slate-100 dark:bg-slate-800 -translate-y-1/2 z-0" />

        {steps.map((step) => {
          const Icon = step.icon;
          const isDone = step.num < currentStep;
          const isCurrent = step.num === currentStep;

          return (
            <div key={step.num} className="relative z-10 flex flex-col items-center group">
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold transition-all shadow-sm ${
                  isCurrent
                    ? "bg-blue-600 text-white ring-4 ring-blue-100 dark:ring-blue-900/40 scale-105"
                    : isDone
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
              </div>
              <span
                className={`text-[10px] font-semibold mt-1.5 whitespace-nowrap ${
                  isCurrent
                    ? "text-blue-600 dark:text-blue-400 font-bold"
                    : isDone
                    ? "text-emerald-700 dark:text-emerald-400"
                    : "text-slate-400 dark:text-slate-400"
                }`}
              >
                {step.num}. {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
