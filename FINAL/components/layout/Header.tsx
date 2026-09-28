"use client";

import { useState, useEffect } from "react";
import {
  Sparkles,
  Server,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Bell,
  Search,
  Building,
  User,
  ShieldCheck,
  ChevronDown,
} from "lucide-react";

export default function Header() {
  const [pythonHealthy, setPythonHealthy] = useState<boolean | null>(null);
  const [loadingSample, setLoadingSample] = useState(false);
  const [sampleSuccess, setSampleSuccess] = useState(false);

  useEffect(() => {
    checkPythonHealth();
  }, []);

  const checkPythonHealth = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/health", { method: "GET" });
      if (res.ok) {
        setPythonHealthy(true);
      } else {
        setPythonHealthy(false);
      }
    } catch {
      setPythonHealthy(false);
    }
  };

  const loadSampleDataset = async () => {
    setLoadingSample(true);
    setSampleSuccess(false);
    try {
      const res = await fetch("/api/sample/load", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setSampleSuccess(true);
        window.location.reload();
      } else {
        alert("Failed to seed candidates: " + data.error);
      }
    } catch (e: any) {
      alert("Error: " + e.message);
    } finally {
      setLoadingSample(false);
    }
  };

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800/80 px-6 flex items-center justify-between sticky top-0 z-30 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
      {/* Left: Organization / Workspace Switcher */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold cursor-pointer hover:bg-slate-200/60 dark:hover:bg-slate-700/60 transition-colors">
          <Building className="w-3.5 h-3.5 text-blue-600" />
          <span>Global Engineering Hiring</span>
          <ChevronDown className="w-3 h-3 text-slate-400 ml-0.5" />
        </div>

        <span className="h-4 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block" />

        <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-500 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Verified Scoring Active</span>
        </div>
      </div>

      {/* Right: Actions, AI Engine Status, Profile */}
      <div className="flex items-center gap-3.5">
        {/* NLP Parsing Service Status Badge */}
        <div className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700">
          <span className="text-slate-500 dark:text-slate-400 font-medium hidden sm:inline">AI Parser:</span>
          {pythonHealthy === null ? (
            <span className="text-slate-400 text-[11px]">Connecting...</span>
          ) : pythonHealthy ? (
            <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Operational
            </span>
          ) : (
            <span
              className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-semibold text-[11px]"
              title="FastAPI server offline on port 8000"
            >
              <AlertCircle className="w-3 h-3" /> Offline (Port 8000)
            </span>
          )}
        </div>

        {/* Load Demo Profiles Button */}
        <button
          onClick={loadSampleDataset}
          disabled={loadingSample}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 text-xs font-semibold rounded-xl shadow-sm transition-all disabled:opacity-50"
          title="Seed realistic candidates & job descriptions into the database"
        >
          {loadingSample ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Seeding Profiles...</span>
            </>
          ) : sampleSuccess ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 dark:text-emerald-600" />
              <span>Talent Pool Seeded</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5 text-blue-400 dark:text-blue-600" />
              <span>Seed Talent Pool</span>
            </>
          )}
        </button>

        {/* User Avatar */}
        <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 font-bold text-xs">
          <User className="w-4 h-4 text-slate-500" />
        </div>
      </div>
    </header>
  );
}
