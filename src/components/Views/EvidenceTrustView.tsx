import React from 'react';
import { 
  ShieldCheck, 
  Award, 
  FileCheck, 
  ExternalLink, 
  AlertCircle, 
  UserCheck, 
  Building, 
  Lock,
  CheckCircle2
} from 'lucide-react';
import { GovernanceBill, Stakeholder } from '../../types';

interface EvidenceTrustViewProps {
  bill: GovernanceBill;
  highlightTargetId?: string;
  selectedStakeholderId?: string;
  onSelectStakeholder?: (id: string) => void;
}

export const EvidenceTrustView: React.FC<EvidenceTrustViewProps> = ({
  bill,
  highlightTargetId,
  selectedStakeholderId: propSelectedStakeholderId,
  onSelectStakeholder
}) => {
  const [internalSelectedId, setInternalSelectedId] = React.useState<string>(
    propSelectedStakeholderId || bill.stakeholders[0]?.id
  );

  const selectedStakeholderId = propSelectedStakeholderId || internalSelectedId;

  const currentStakeholder = bill.stakeholders.find((s) => s.id === selectedStakeholderId) || bill.stakeholders[0];

  const handleSelect = (s: Stakeholder) => {
    setInternalSelectedId(s.id);
    if (onSelectStakeholder) onSelectStakeholder(s.id);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div 
        id="evidence-header-card"
        className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 font-mono text-xs font-bold flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
              <span>Evidence Trust & Credibility Matrix</span>
            </span>
            <span className="text-xs text-slate-400 font-serif">
              Aarti S Ravikumar Verification Protocol
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-serif font-bold text-white mt-2">
            Multi-Stakeholder Evidence Auditing
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Democratic decisions should be steered by verified data, not lobbying spend. 
            Civic Accord evaluates all stakeholder submissions across four rigorous empirical dimensions.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-slate-950 px-4 py-3 rounded-xl border border-slate-800 shrink-0">
          <FileCheck className="w-5 h-5 text-emerald-400" />
          <div>
            <div className="text-xs font-mono font-bold text-emerald-400">100% Audited</div>
            <div className="text-[10px] text-slate-400">Conflict Filings Verified</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Stakeholder List vs Rubric Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Stakeholder Cards (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-serif font-bold uppercase tracking-wider text-slate-300">
              Audited Stakeholder Entities ({bill.stakeholders.length})
            </span>
            <span className="text-[11px] text-slate-400">Select to inspect rubric</span>
          </div>

          <div className="space-y-2.5">
            {bill.stakeholders.map((sh) => {
              const isSelected = sh.id === selectedStakeholderId;
              const isHighlight = highlightTargetId === 'select-stakeholder-jenk' && sh.id === 'sh-1';

              return (
                <div
                  key={sh.id}
                  id={`stakeholder-card-${sh.id}`}
                  onClick={() => handleSelect(sh)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-purple-950/30 border-purple-500 shadow-lg shadow-purple-950/40'
                      : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                  } ${isHighlight ? 'ring-2 ring-purple-400' : ''}`}
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={sh.avatar}
                      alt={sh.name}
                      className="w-11 h-11 rounded-full object-cover border-2 border-slate-700 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-white truncate">
                          {sh.name}
                        </h3>
                        <span className="text-xs font-mono font-bold text-emerald-400">
                          {sh.credibilityScore}/100
                        </span>
                      </div>
                      <p className="text-xs text-indigo-300 truncate">{sh.role}</p>
                      <p className="text-[11px] text-slate-400 truncate">{sh.organization}</p>
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                    <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[10px] font-semibold">
                      {sh.category}
                    </span>
                    <span className="text-slate-400 font-mono">
                      Token Allocation: <strong className="text-amber-400">{sh.voiceTokensAllocated}T</strong>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: 4-Factor Rubric Deep Dive (7 cols) */}
        <div className="lg:col-span-7">
          <div 
            id="rubric-deep-dive"
            className={`p-6 rounded-2xl bg-slate-900 border ${
              highlightTargetId === 'show-rubric-breakdown' || highlightTargetId === 'conflict-check'
                ? 'border-purple-400 ring-2 ring-purple-500/30'
                : 'border-slate-800'
            } space-y-5`}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-purple-400 uppercase tracking-wider">
                  Credibility Audit Profile
                </span>
                <h3 className="text-lg font-serif font-bold text-white mt-1">
                  {currentStakeholder.name} • {currentStakeholder.organization}
                </h3>
              </div>

              <div className="text-right">
                <span className="text-[10px] uppercase text-slate-400 block">Composite Trust Score</span>
                <span className="text-xl font-mono font-bold text-emerald-400">
                  {currentStakeholder.credibilityScore}%
                </span>
              </div>
            </div>

            {/* 4 Rubric Factor Bars */}
            <div className="space-y-3.5 pt-2">
              
              {/* Factor 1: Empirical Rigor */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-semibold">1. Empirical Rigor & Methodological Soundness</span>
                  <span className="font-mono text-purple-300 font-bold">
                    {currentStakeholder.credibilityBreakdown.empiricalRigor}%
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div 
                    className="h-full bg-purple-500 rounded-full" 
                    style={{ width: `${currentStakeholder.credibilityBreakdown.empiricalRigor}%` }}
                  ></div>
                </div>
                <span className="text-[10px] text-slate-400">
                  Peer-reviewed models, transparent sample sizes, reproducible data pipelines.
                </span>
              </div>

              {/* Factor 2: Domain Expertise */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-semibold">2. Domain Expertise & Accreditation</span>
                  <span className="font-mono text-purple-300 font-bold">
                    {currentStakeholder.credibilityBreakdown.domainExpertise}%
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div 
                    className="h-full bg-indigo-500 rounded-full" 
                    style={{ width: `${currentStakeholder.credibilityBreakdown.domainExpertise}%` }}
                  ></div>
                </div>
                <span className="text-[10px] text-slate-400">
                  Relevant academic degrees, institutional leadership, direct field operating experience.
                </span>
              </div>

              {/* Factor 3: Financial Transparency */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-semibold">3. Financial & Conflict-of-Interest Transparency</span>
                  <span className="font-mono text-purple-300 font-bold">
                    {currentStakeholder.credibilityBreakdown.financialTransparency}%
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 rounded-full" 
                    style={{ width: `${currentStakeholder.credibilityBreakdown.financialTransparency}%` }}
                  ></div>
                </div>
                <span className="text-[10px] text-slate-400">
                  Full disclosure of donor sources, commercial interests, and lobbying disclosures.
                </span>
              </div>

              {/* Factor 4: Historical Accuracy */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-semibold">4. Historical Prediction Track Record</span>
                  <span className="font-mono text-purple-300 font-bold">
                    {currentStakeholder.credibilityBreakdown.historicalAccuracy}%
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div 
                    className="h-full bg-cyan-500 rounded-full" 
                    style={{ width: `${currentStakeholder.credibilityBreakdown.historicalAccuracy}%` }}
                  ></div>
                </div>
                <span className="text-[10px] text-slate-400">
                  Accuracy of previous legislative projections tested against real post-enactment data.
                </span>
              </div>

            </div>

            {/* Core Stakeholder Demands */}
            <div className="pt-3 border-t border-slate-800">
              <span className="text-xs font-semibold text-slate-300 block mb-2">
                Core Registered Demands & Priorities:
              </span>
              <div className="space-y-1.5">
                {currentStakeholder.keyDemands.map((demand, i) => (
                  <div key={i} className="flex items-center space-x-2 text-xs text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{demand}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
