import { useState, useEffect } from "react";
import { Sparkles, X, AlertTriangle, ShieldCheck, Cpu, ArrowRight, Copy, Check, RefreshCw } from "lucide-react";
import { Badge } from "./ui";

interface AiPolicyInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  billTitle: string;
  billSummary: string;
  topic?: string;
}

interface AnalysisResult {
  source: string;
  summary: string;
  keyRisks: string[];
  opportunities: string[];
  stakeholderImpact: {
    consumers: string;
    enterprises: string;
    governanceBody: string;
  };
  recommendedAmendment: string;
}

export function AiPolicyInspectorModal({
  isOpen,
  onClose,
  billTitle,
  billSummary,
  topic = "Policy Analysis",
}: AiPolicyInspectorModalProps) {
  const [userQuery, setUserQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalysis = async (promptOverride?: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/gemini/analyze-policy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          billTitle,
          billSummary,
          topic,
          userPrompt: promptOverride ?? userQuery,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      console.error("Analysis error:", err);
      setError(err.message || "Failed to analyze policy");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && !result && !loading) {
      fetchAnalysis();
    }
  }, [isOpen, billTitle]);

  if (!isOpen) return null;

  const handleCopy = () => {
    if (!result) return;
    const textToCopy = `AI Policy Intelligence Report for ${billTitle}:
Summary: ${result.summary}
Key Risks: ${result.keyRisks.join("; ")}
Opportunities: ${result.opportunities.join("; ")}
Recommendation: ${result.recommendedAmendment}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden text-slate-900 dark:text-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <Sparkles size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold leading-snug">Gemini Policy Intelligence</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Real-time risk, Pareto compliance, and stakeholder impact evaluation
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5 text-sm">
          
          {/* Target Bill Overview */}
          <div className="p-4 rounded-lg bg-slate-100 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/50">
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Analyzing Proposal</span>
              {result && (
                <Badge tone={result.source === "gemini_api" ? "violet" : "neutral"}>
                  {result.source === "gemini_api" ? "Gemini 3.6 Flash Live (Free Tier)" : "Simulated Free Tier Engine"}
                </Badge>
              )}
            </div>
            <h3 className="font-semibold text-base mb-1">{billTitle}</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">{billSummary}</p>
          </div>

          {/* Interactive Question Input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={userQuery}
              onChange={(e) => setUserQuery(e.target.value)}
              placeholder="Ask custom question (e.g., 'What is the compliance burden on healthcare providers?')"
              className="flex-1 px-3.5 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onKeyDown={(e) => e.key === "Enter" && fetchAnalysis()}
            />
            <button
              type="button"
              onClick={() => fetchAnalysis()}
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs flex items-center gap-1.5 transition disabled:opacity-50"
            >
              {loading ? <RefreshCw size={14} className="animate-spin" /> : <Sparkles size={14} />}
              <span>Analyze</span>
            </button>
          </div>

          {error && (
            <div className="p-3.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
              <AlertTriangle size={16} />
              <span>{error}</span>
            </div>
          )}

          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center text-center gap-3">
              <RefreshCw size={28} className="animate-spin text-indigo-600 dark:text-indigo-400" />
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Evaluating policy sections, district trade-offs, and compliance vectors...
              </p>
            </div>
          ) : result ? (
            <div className="space-y-4">
              
              {/* Executive Summary */}
              <div className="p-4 rounded-lg bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40">
                <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300 mb-1 flex items-center gap-1.5">
                  <Cpu size={14} /> Executive Summary
                </h4>
                <p className="text-slate-800 dark:text-slate-200 leading-relaxed text-xs sm:text-sm">
                  {result.summary}
                </p>
              </div>

              {/* Risks & Opportunities Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-4 rounded-lg bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/30">
                  <h4 className="text-xs font-bold text-amber-800 dark:text-amber-300 mb-2 flex items-center gap-1.5">
                    <AlertTriangle size={14} /> Key Policy Risks
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                    {result.keyRisks.map((risk, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-amber-500 font-bold">•</span>
                        <span>{risk}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/30">
                  <h4 className="text-xs font-bold text-emerald-800 dark:text-emerald-300 mb-2 flex items-center gap-1.5">
                    <ShieldCheck size={14} /> Strategic Opportunities
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                    {result.opportunities.map((opp, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-emerald-500 font-bold">•</span>
                        <span>{opp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Stakeholder Impact Matrix */}
              <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2">
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Stakeholder Impact Matrix
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <div className="p-2.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <strong className="block text-indigo-600 dark:text-indigo-400 mb-1">Citizens / Consumers</strong>
                    <span className="text-slate-600 dark:text-slate-400">{result.stakeholderImpact.consumers}</span>
                  </div>
                  <div className="p-2.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <strong className="block text-indigo-600 dark:text-indigo-400 mb-1">Enterprises & SMBs</strong>
                    <span className="text-slate-600 dark:text-slate-400">{result.stakeholderImpact.enterprises}</span>
                  </div>
                  <div className="p-2.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <strong className="block text-indigo-600 dark:text-indigo-400 mb-1">Oversight Body</strong>
                    <span className="text-slate-600 dark:text-slate-400">{result.stakeholderImpact.governanceBody}</span>
                  </div>
                </div>
              </div>

              {/* Recommended Amendment */}
              <div className="p-4 rounded-lg bg-teal-50/60 dark:bg-teal-950/30 border border-teal-200/60 dark:border-teal-900/40">
                <h4 className="text-xs font-bold text-teal-800 dark:text-teal-300 mb-1 flex items-center gap-1.5">
                  <ArrowRight size={14} /> Recommended Refinement
                </h4>
                <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                  {result.recommendedAmendment}
                </p>
              </div>

            </div>
          ) : null}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            AI Studio Powered Model • Non-binding Decision Support
          </span>
          <div className="flex items-center gap-2">
            {result && (
              <button
                type="button"
                onClick={handleCopy}
                className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-medium hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5 transition"
              >
                {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                <span>{copied ? "Copied" : "Copy Brief"}</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-slate-800 text-white hover:bg-slate-900 text-xs font-medium transition"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
