import React from 'react';
import { Scale, CheckCircle2, ShieldCheck, FileCheck, ExternalLink } from 'lucide-react';
import { COMPLIANCE_FRAMEWORKS } from '../data/evaluationData';

export const ComplianceMatrix: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 lg:p-8 space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <div className="inline-flex items-center space-x-2 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full text-xs font-semibold text-indigo-700">
            <Scale className="w-3.5 h-3.5" />
            <span>AI Safety & Policy Standards</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-2">
            Regulatory Compliance & Ethical Framework Alignment
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Evaluating <span className="font-mono text-indigo-600">governanceapp.ai-aarti.com</span> against international AI governance standards.
          </p>
        </div>

        {/* Framework Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {COMPLIANCE_FRAMEWORKS.map((fw) => (
            <div key={fw.code} className="bg-slate-50 rounded-xl border border-slate-200 p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200/60 pb-3">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                    <FileCheck className="w-4 h-4 text-indigo-600" />
                    <span>{fw.name}</span>
                  </h3>
                  <span className="text-xs text-slate-500 font-mono">{fw.code}</span>
                </div>
                <div className="text-right">
                  <div className="text-xs font-black text-emerald-700 bg-emerald-100 border border-emerald-200 px-2.5 py-1 rounded-md">
                    {fw.alignmentScore}% Aligned
                  </div>
                  <span className="text-[10px] text-slate-500">{fw.status}</span>
                </div>
              </div>

              {/* Pillars */}
              <div className="space-y-2.5">
                {fw.details.map((dt, idx) => (
                  <div key={idx} className="bg-white p-3 rounded-lg border border-slate-200/80 space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-800">{dt.pillar}</span>
                      <span className="font-mono text-indigo-600 font-semibold">{dt.score}%</span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-tight">
                      {dt.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Regulatory Governance Recommendation */}
        <div className="bg-indigo-950 text-indigo-100 rounded-xl p-5 border border-indigo-900 space-y-2 text-xs">
          <div className="flex items-center space-x-2 text-indigo-300 font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>Audit Recommendation for Enterprise & Municipal Deployment</span>
          </div>
          <p className="text-slate-300 leading-relaxed">
            Civic Accord achieves substantial alignment (82%-88%) across NIST AI RMF 1.0 and EU AI Act standards due to its human-in-the-loop decision-support posture and deterministic Pareto scoring architecture. To achieve 100% enterprise certification, the platform should publish standardized NIST safety documentation cards directly on its primary web domain.
          </p>
        </div>
      </div>
    </div>
  );
};
