"use client";

import { useState, useEffect } from "react";
import {
  LineChart,
  BrainCircuit,
  Calculator,
  Sparkles,
  RefreshCw,
  Play,
  Layers,
  ShieldCheck,
  TrendingUp,
  BarChart3,
  Cpu,
} from "lucide-react";
import { Week2RegressionData, Week3NLPData } from "@/lib/types";

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState<"regression" | "classification">("regression");

  // Regression States
  const [testSize, setTestSize] = useState<number>(0.25);
  const [regressionData, setRegressionData] = useState<Week2RegressionData | null>(null);
  const [loadingRegression, setLoadingRegression] = useState(false);

  // NLP Classification States
  const [nlpInputText, setNlpInputText] = useState<string>(
    "Experienced Data Scientist with hands-on skills in Python, Machine Learning, Pandas, Scikit-learn, and Deep Learning neural networks."
  );
  const [nlpData, setNlpData] = useState<Week3NLPData | null>(null);
  const [loadingNlp, setLoadingNlp] = useState(false);

  useEffect(() => {
    fetchRegressionExperiment();
    fetchNlpExperiment(nlpInputText);
  }, []);

  const fetchRegressionExperiment = async () => {
    setLoadingRegression(true);
    try {
      const res = await fetch(`/api/analytics?testSize=${testSize}`);
      const json = await res.json();
      if (json.success) {
        setRegressionData(json.data);
      }
    } catch (e) {
      console.error("Failed to run predictive analytics", e);
    } finally {
      setLoadingRegression(false);
    }
  };

  const fetchNlpExperiment = async (text: string) => {
    setLoadingNlp(true);
    try {
      const res = await fetch("/api/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const json = await res.json();
      if (json.success) {
        setNlpData(json.data);
      }
    } catch (e) {
      console.error("Failed to run classification analytics", e);
    } finally {
      setLoadingNlp(false);
    }
  };

  const sampleNlpPresets = [
    {
      label: "Data Science & AI",
      text: "Data Scientist proficient in Python, Pandas, Scikit-learn, Machine Learning, Deep Learning, and SQL database analytics.",
    },
    {
      label: "Full Stack Engineer",
      text: "Full Stack Software Engineer building modern responsive apps using React, Next.js, TypeScript, Node.js, Express, and PostgreSQL.",
    },
    {
      label: "Cloud & DevOps",
      text: "DevOps Engineer specialized in AWS cloud infrastructure, Docker containerization, Kubernetes clusters, Terraform IaC, and CI/CD pipelines.",
    },
    {
      label: "Cybersecurity Analyst",
      text: "Cybersecurity Specialist skilled in ethical hacking, penetration testing, network firewalls, Linux security, and cryptography.",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Talent Analytics & Predictive Intelligence
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Predictive talent assessment modeling, role specialization classification, and workforce compensation indices
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-1 rounded-2xl shadow-sm">
          <button
            onClick={() => setActiveTab("regression")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "regression"
                ? "bg-blue-600 text-white shadow-sm shadow-blue-600/20"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <LineChart className="w-3.5 h-3.5" />
            Assessment Index Predictor
          </button>
          <button
            onClick={() => setActiveTab("classification")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "classification"
                ? "bg-purple-600 text-white shadow-sm shadow-purple-600/20"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <BrainCircuit className="w-3.5 h-3.5" />
            Domain Classifier
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 1: ASSESSMENT INDEX PREDICTOR                                     */}
      {/* ========================================================================= */}
      {activeTab === "regression" && (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <LineChart className="w-4 h-4 text-blue-600" />
                Talent Assessment & Value Index Model
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Model: Supervised Ordinary Least Squares (OLS) • Target: Candidate Assessment Index
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-xs font-semibold">
                <span className="text-slate-400">Validation Split:</span>
                <select
                  value={testSize}
                  onChange={(e) => setTestSize(Number(e.target.value))}
                  className="px-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
                >
                  <option value={0.15}>15% Test Split (85% Train)</option>
                  <option value={0.20}>20% Test Split (80% Train)</option>
                  <option value={0.25}>25% Test Split (75% Train)</option>
                  <option value={0.30}>30% Test Split (70% Train)</option>
                </select>
              </div>

              <button
                onClick={fetchRegressionExperiment}
                disabled={loadingRegression}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm shadow-blue-600/20 disabled:opacity-50 transition-all"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingRegression ? "animate-spin" : ""}`} />
                Re-calibrate Model
              </button>
            </div>
          </div>

          {/* Metrics Overview Grid */}
          {regressionData && (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* R2 Score */}
                <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Model Accuracy (R² Score)
                  </span>
                  <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                    {regressionData.metrics.R2}
                  </div>
                  <p className="text-[10px] text-slate-400">Explains {(regressionData.metrics.R2 * 100).toFixed(1)}% of variance</p>
                </div>

                {/* MAE */}
                <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    MAE (Mean Absolute Error)
                  </span>
                  <div className="text-2xl font-black text-blue-600 dark:text-blue-400">
                    {regressionData.metrics.MAE}
                  </div>
                  <p className="text-[10px] text-slate-400">Average error margin</p>
                </div>

                {/* MSE */}
                <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    MSE (Mean Squared Error)
                  </span>
                  <div className="text-2xl font-black text-purple-600 dark:text-purple-400">
                    {regressionData.metrics.MSE}
                  </div>
                  <p className="text-[10px] text-slate-400">Variance penalty metric</p>
                </div>

                {/* RMSE */}
                <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    RMSE (Root Mean Square)
                  </span>
                  <div className="text-2xl font-black text-amber-600 dark:text-amber-400">
                    {regressionData.metrics.RMSE}
                  </div>
                  <p className="text-[10px] text-slate-400">In assessment score units</p>
                </div>
              </div>

              {/* Model Fitted Equation */}
              <div className="p-5 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-sm space-y-3">
                <h3 className="font-bold text-sm text-blue-400 flex items-center gap-2">
                  <Calculator className="w-4 h-4" /> Learned Value Estimation Formula
                </h3>
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs md:text-sm text-emerald-400 overflow-x-auto">
                  Score (ŷ) = {regressionData.coefficients.experience_years} × (Experience) + {regressionData.coefficients.skill_count} × (Skills) + {regressionData.coefficients.education_level} × (Education) + {regressionData.coefficients.intercept}
                </div>
                <div className="flex flex-wrap gap-4 text-xs text-slate-300 pt-1">
                  <span><strong>Evaluation Samples:</strong> {regressionData.total_samples} profiles</span>
                  <span>•</span>
                  <span><strong>Training Corpus:</strong> {regressionData.train_samples} samples</span>
                  <span>•</span>
                  <span><strong>Validation Set:</strong> {regressionData.test_samples} samples</span>
                </div>
              </div>

              {/* Sample Predictions Table */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl shadow-sm overflow-hidden space-y-3 p-5">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Model Predictions vs Actual Target Values ({regressionData.test_predictions.length} validation samples)
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-200/80 dark:border-slate-800 text-slate-400 uppercase font-bold text-[10px] tracking-wider">
                      <tr>
                        <th className="px-4 py-3">Exp (Yrs)</th>
                        <th className="px-4 py-3">Skills Count</th>
                        <th className="px-4 py-3">Education</th>
                        <th className="px-4 py-3">Actual Index</th>
                        <th className="px-4 py-3">Predicted Value (ŷ)</th>
                        <th className="px-4 py-3">Residual Error (y - ŷ)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                      {regressionData.test_predictions.map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                          <td className="px-4 py-2.5 text-slate-700 dark:text-slate-300">{row.experience} yrs</td>
                          <td className="px-4 py-2.5 text-slate-700 dark:text-slate-300">{row.skills} skills</td>
                          <td className="px-4 py-2.5 text-slate-700 dark:text-slate-300">Tier {row.education}</td>
                          <td className="px-4 py-2.5 font-bold text-slate-900 dark:text-white">{row.actual}</td>
                          <td className="px-4 py-2.5 font-bold text-blue-600 dark:text-blue-400">{row.predicted}</td>
                          <td className={`px-4 py-2.5 font-bold ${Math.abs(row.error) < 4 ? "text-emerald-600" : "text-amber-600"}`}>
                            {row.error > 0 ? `+${row.error}` : row.error}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 2: DOMAIN CLASSIFIER                                              */}
      {/* ========================================================================= */}
      {activeTab === "classification" && (
        <div className="space-y-6">
          {/* Input & Presets */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4">
            <div>
              <h2 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <BrainCircuit className="w-4 h-4 text-purple-600" />
                Applicant Domain & Specialization Classifier
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Automatically classifies candidate profiles and job roles into technical domain tracks with confidence probabilities
              </p>
            </div>

            {/* Presets */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Try Sample Applicant Profiles:
              </span>
              <div className="flex flex-wrap gap-2">
                {sampleNlpPresets.map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => {
                      setNlpInputText(preset.text);
                      fetchNlpExperiment(preset.text);
                    }}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200/80 dark:border-purple-800 hover:bg-purple-100 transition-all"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Input */}
            <div className="space-y-2">
              <textarea
                rows={3}
                value={nlpInputText}
                onChange={(e) => setNlpInputText(e.target.value)}
                placeholder="Paste candidate summary, responsibilities, or skills to categorize..."
                className="w-full p-3.5 text-xs rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <div className="flex justify-end">
                <button
                  onClick={() => fetchNlpExperiment(nlpInputText)}
                  disabled={loadingNlp || !nlpInputText.trim()}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-sm shadow-purple-600/20 disabled:opacity-50 transition-all"
                >
                  <Play className="w-3.5 h-3.5" />
                  {loadingNlp ? "Categorizing..." : "Classify Specialization"}
                </button>
              </div>
            </div>
          </div>

          {/* Classification Results */}
          {nlpData && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Predicted Category Card */}
              <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4 lg:col-span-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Predicted Technical Track
                  </span>
                  <div className="p-5 rounded-2xl bg-gradient-to-tr from-purple-900 to-indigo-800 text-white text-center shadow-lg space-y-1">
                    <Sparkles className="w-6 h-6 mx-auto text-purple-300" />
                    <h3 className="font-black text-lg tracking-tight">
                      {nlpData.predicted_category}
                    </h3>
                    <p className="text-[11px] text-purple-200 font-medium">Domain Track</p>
                  </div>

                  {/* Class Probabilities */}
                  <div className="space-y-2 pt-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Confidence Distribution
                    </span>
                    {nlpData.category_probabilities.map((item) => (
                      <div key={item.category} className="space-y-1">
                        <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                          <span>{item.category}</span>
                          <span>{item.probability}%</span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-purple-600 h-full rounded-full transition-all"
                            style={{ width: `${item.probability}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400">
                  Model Vocabulary: <strong>{nlpData.vocabulary_size} terms</strong>
                </div>
              </div>

              {/* Salient Feature Weights */}
              <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4 lg:col-span-2">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    Active Semantic Term Weights (TF × IDF)
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Keywords in the input profile that contributed most heavily to this domain classification
                  </p>
                </div>

                {nlpData.active_tfidf_terms.length === 0 ? (
                  <div className="text-xs text-slate-400 py-8 text-center">
                    No active vocabulary matches in input text.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-1">
                    {nlpData.active_tfidf_terms.map((t) => (
                      <div
                        key={t.term}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 text-xs"
                      >
                        <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                          {t.term}
                        </span>
                        <span className="font-mono text-purple-600 dark:text-purple-400 font-bold px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950">
                          {t.tfidf_weight}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Vocabulary Sample */}
                <div className="pt-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Indexed Vocabulary Sample
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {nlpData.top_vocabulary_sample.slice(0, 16).map((term) => (
                      <span
                        key={term}
                        className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                      >
                        {term}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
