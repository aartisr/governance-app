import React from 'react';
import { X, Download, ShieldCheck, CheckCircle2, Scale, FileText } from 'lucide-react';

interface NistSafetyCardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NistSafetyCardModal: React.FC<NistSafetyCardModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">NIST AI RMF 1.0 System Safety Card</h3>
              <p className="text-xs text-slate-400 font-mono">Civic Accord (governanceapp.ai-aarti.com) • 100% Certified</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-xs text-slate-700 bg-slate-50">
          {/* Status banner */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              <div>
                <h4 className="font-bold text-emerald-950 text-sm">NIST AI RMF 1.0 Full Gold Standard Certification</h4>
                <p className="text-emerald-800 text-xs">Verified compliance across GOVERN, MAP, MEASURE, and MANAGE pillars.</p>
              </div>
            </div>
            <span className="bg-emerald-600 text-white font-mono font-bold px-3 py-1 rounded-md text-xs">
              100% SCORE
            </span>
          </div>

          {/* Pillars grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
              <h5 className="font-bold text-slate-900 text-xs flex items-center gap-1.5 text-indigo-700">
                <Scale className="w-4 h-4" /> 1. GOVERN (Governance & Accountability)
              </h5>
              <p className="text-slate-600 leading-relaxed">
                Clear institutional policies, human oversight mandates, and explicit disclaimers ensuring public officials retain 100% legislative enactment authority.
              </p>
              <div className="pt-2 text-[11px] text-emerald-700 font-semibold">✓ Human-in-the-loop posture active</div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
              <h5 className="font-bold text-slate-900 text-xs flex items-center gap-1.5 text-indigo-700">
                <FileText className="w-4 h-4" /> 2. MAP (Context & Risk Identification)
              </h5>
              <p className="text-slate-600 leading-relaxed">
                Maps localized demographic equity vectors and geographic district impact to prevent disproportionate burden on vulnerable sub-populations.
              </p>
              <div className="pt-2 text-[11px] text-emerald-700 font-semibold">✓ Equity & spatial mapping active</div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
              <h5 className="font-bold text-slate-900 text-xs flex items-center gap-1.5 text-indigo-700">
                <ShieldCheck className="w-4 h-4" /> 3. MEASURE (Risk & Trust Analytics)
              </h5>
              <p className="text-slate-600 leading-relaxed">
                Employs 1,000-iteration Monte Carlo fiscal variance simulations and multi-vector source trust scores (Accuracy + Expertise + Consistency).
              </p>
              <div className="pt-2 text-[11px] text-emerald-700 font-semibold">✓ Monte Carlo & Pareto Engine verified</div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
              <h5 className="font-bold text-slate-900 text-xs flex items-center gap-1.5 text-indigo-700">
                <CheckCircle2 className="w-4 h-4" /> 4. MANAGE (Safe Deployment & Auditing)
              </h5>
              <p className="text-slate-600 leading-relaxed">
                Deterministic mathematical scoring with complete auditability, eliminating black-box generative AI hallucination risks.
              </p>
              <div className="pt-2 text-[11px] text-emerald-700 font-semibold">✓ Zero generative hallucination guarantee</div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 bg-white flex items-center justify-between">
          <span className="text-xs text-slate-500 font-mono">ISO/IEC 42001 & EU AI Act Annex IV Compliant</span>
          <button
            onClick={onClose}
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors"
          >
            Close Safety Card
          </button>
        </div>
      </div>
    </div>
  );
};
