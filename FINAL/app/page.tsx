import Link from "next/link";
import {
  UploadCloud,
  FileCheck2,
  Trophy,
  LineChart,
  Layers,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Cpu,
  ShieldCheck,
  Zap,
  Users,
  Briefcase,
  Search,
  Check,
} from "lucide-react";
import WorkflowBanner from "@/components/layout/WorkflowBanner";

export default function LandingPage() {
  const capabilityCards = [
    {
      title: "Multi-Format Resume Ingestion",
      desc: "Instant multi-page PDF and text resume parsing with automated contact, education, and experience extraction.",
      icon: UploadCloud,
      tag: "Automated Ingestion",
    },
    {
      title: "Dynamic Technical Skill Mining",
      desc: "Linguistic skill extraction across 100+ programming languages, frameworks, cloud tools, and databases.",
      icon: Layers,
      tag: "Skill Intelligence",
    },
    {
      title: "Deterministic Match Scoring",
      desc: "100% transparent and auditable candidate scoring: Match Score = (Matching Skills / Required Skills) × 100.",
      icon: ShieldCheck,
      tag: "Zero Hallucination",
    },
    {
      title: "Automated Ranking & Shortlisting",
      desc: "Instant candidate leaderboard ordered by score with customizable recruitment thresholds and Top-N filters.",
      icon: Trophy,
      tag: "Pipeline Management",
    },
    {
      title: "Side-by-Side Talent Comparison",
      desc: "Deep matrix comparison across candidate skill coverage, experience, and qualifications against open roles.",
      icon: Users,
      tag: "Decision Support",
    },
    {
      title: "Predictive Talent Analytics",
      desc: "Domain categorization and compensation index modeling for comprehensive recruiter workforce planning.",
      icon: LineChart,
      tag: "Talent Insights",
    },
  ];

  return (
    <div className="space-y-10 py-2">
      {/* SaaS Hero Section */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 border border-slate-800 p-8 md:p-14 text-white shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-3xl space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-xs font-semibold tracking-wide backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" /> Enterprise Recruitment & Screening Platform
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
              ResumeMatch
            </h1>
            <p className="text-xl md:text-2xl font-medium text-blue-200/90 tracking-tight">
              Find the right candidate faster.
            </p>
          </div>

          <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-2xl font-normal">
            Screen high-volume applicant pipelines with instant multi-format resume parsing,
            dynamic technical skill extraction, and transparent deterministic scoring.
          </p>

          <div className="flex flex-wrap items-center gap-3.5 pt-2">
            <Link
              href="/resumes"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-600/30 transition-all text-xs md:text-sm"
            >
              <UploadCloud className="w-4 h-4" />
              Upload Resumes
              <ArrowRight className="w-4 h-4 ml-0.5" />
            </Link>

            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-slate-800/90 hover:bg-slate-700/90 text-slate-100 font-semibold rounded-xl border border-slate-700/80 transition-all text-xs md:text-sm"
            >
              Recruiter Dashboard
            </Link>

            <Link
              href="/matching"
              className="inline-flex items-center gap-2 px-5 py-3.5 bg-slate-900/80 hover:bg-slate-800 text-slate-300 font-medium rounded-xl border border-slate-700/50 transition-all text-xs md:text-sm"
            >
              <Layers className="w-4 h-4 text-purple-400" />
              Skill Matcher
            </Link>
          </div>
        </div>
      </div>

      {/* Recruitment Funnel Workflow Banner */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Automated Hiring Pipeline
          </h2>
        </div>
        <WorkflowBanner currentStep={1} />
      </div>

      {/* Core Platform Capabilities Grid */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Built for High-Velocity Recruitment Teams
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Every tool required to process, score, rank, and shortlist technical talent with total precision
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {capabilityCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-3"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      {card.tag}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                      {card.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-1">
                      {card.desc}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Transparent Scoring Formula Banner */}
      <div className="p-6 rounded-2xl bg-slate-900 text-white border border-slate-800 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-400">
              <ShieldCheck className="w-4 h-4" /> Transparent & Auditable Scoring Engine
            </div>
            <h3 className="text-lg font-bold">Zero AI Hallucinations. 100% Objective Skill Verification.</h3>
            <p className="text-slate-300 text-xs max-w-2xl leading-relaxed">
              Every score is calculated directly from matched qualifications against job requirements,
              giving hiring managers complete confidence and regulatory compliance.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center font-mono shrink-0">
            <p className="text-[11px] text-slate-400 mb-1">Standardized Matching Index</p>
            <p className="text-sm font-bold text-emerald-400">
              Match Score = (Matching Skills / Required Skills) × 100
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
