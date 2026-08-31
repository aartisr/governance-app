import { useState } from "react";
import { Badge } from "./ui";
import { CheckCircle2, FileText, Lock, Scale, ShieldCheck, X } from "lucide-react";

interface NistSafetyCardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NistSafetyCardModal({ isOpen, onClose }: NistSafetyCardModalProps) {
  const [activeTab, setActiveTab] = useState<
    "intended" | "bias" | "provenance" | "safeguards"
  >("intended");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-3xl overflow-hidden animate-rise-in">
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="text-emerald-400" size={20} />
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
                NIST AI RMF 1.0 Safety & Transparency Card
              </span>
            </div>
            <h2 className="text-xl font-serif font-bold text-white mb-0">
              Civic Accord Policy Decision Model Card
            </h2>
            <p className="text-xs text-slate-300 mt-1 mb-0">
              Standardized Model Auditing, Bias Mitigation & Human-in-the-Loop Safeguards
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
            aria-label="Close safety card"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6">
          {[
            { id: "intended", label: "Intended Scope" },
            { id: "bias", label: "Bias & Fairness" },
            { id: "provenance", label: "Evidence Lineage" },
            { id: "safeguards", label: "Human Safeguards" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 px-4 text-xs font-semibold border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-emerald-600 text-emerald-950 bg-white"
                  : "border-transparent text-slate-600 hover:text-slate-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="p-6 text-slate-700 text-xs leading-relaxed space-y-4 max-h-[60vh] overflow-y-auto">
          {activeTab === "intended" && (
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 text-sm">System Purpose & Boundaries</h4>
              <p>
                Civic Accord provides deterministic trade-off modeling and multi-stakeholder Pareto optimization to support legislative staffers and community advisory boards.
              </p>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-amber-900 space-y-1">
                <strong className="block text-xs">Out of Scope / Prohibited Uses:</strong>
                <ul className="list-disc pl-4 space-y-1 text-[11px]">
                  <li>Automated enactment or binding vote determination without human legislative review.</li>
                  <li>Direct entitlement disqualification of individual citizens.</li>
                  <li>Unweighted aggregation of unverified third-party polling or uncurated sentiment streams.</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === "bias" && (
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 text-sm">Quadratic Preference Constraints & Faction Balance</h4>
              <p>
                To prevent loud minority factions or high-resource interest groups from dominating policy recommendations, Civic Accord enforces quadratic voice token pricing:
              </p>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 font-mono text-[11px] text-slate-800">
                Cost(Votes) = Votes² (e.g., 1 vote = 1 token, 7 votes = 49 tokens)
              </div>
              <p>
                This mathematical friction forces participants to reveal true intensity across multiple issues rather than concentrating influence on a single clause.
              </p>
            </div>
          )}

          {activeTab === "provenance" && (
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 text-sm">Verifiable Evidence Lineage & Recency</h4>
              <p>
                Every impact score and section confidence estimate links directly to primary sources (Congressional Clerk legislative text, Census Bureau demographic surveys, and CBO budgetary models).
              </p>
              <div className="space-y-2">
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex justify-between items-center">
                  <span>Census Bureau Economic Survey</span>
                  <Badge tone="green">Trust: 90%</Badge>
                </div>
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex justify-between items-center">
                  <span>Congressional Clerk Official Text</span>
                  <Badge tone="green">Trust: 96%</Badge>
                </div>
              </div>
            </div>
          )}

          {activeTab === "safeguards" && (
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 text-sm">Human-in-the-Loop Verification Requirements</h4>
              <p>
                Recommendations generated by Civic Accord serve strictly as inspectable scenarios. Final legislative text drafting, committee amendments, and floor votes require explicit human sign-off by elected officials.
              </p>
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-950 flex items-center gap-2">
                <CheckCircle2 className="text-emerald-700" size={18} />
                <span>Audited for Compliance with NIST AI RMF 1.0 (GOVERN & MAP Functions)</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-between items-center">
          <span className="text-[11px] text-slate-500 font-mono">
            Model Version: 2026.4-PARETO
          </span>
          <button
            type="button"
            onClick={onClose}
            className="button primary text-xs"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
}
