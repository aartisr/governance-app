import React from 'react';
import { 
  FileText, 
  DollarSign, 
  AlertTriangle, 
  CheckCircle2, 
  ChevronRight, 
  Search, 
  Sparkles, 
  BookOpen, 
  ArrowUpRight,
  ShieldAlert
} from 'lucide-react';
import { GovernanceBill, BillClause } from '../../types';

interface BillIntelligenceViewProps {
  bill: GovernanceBill;
  highlightTargetId?: string;
  selectedClauseId?: string;
  onSelectClause?: (clauseId: string) => void;
}

export const BillIntelligenceView: React.FC<BillIntelligenceViewProps> = ({
  bill,
  highlightTargetId,
  selectedClauseId: propSelectedClauseId,
  onSelectClause
}) => {
  const [internalSelectedClause, setInternalSelectedClause] = React.useState<string>(
    propSelectedClauseId || bill.clauses[1]?.id || bill.clauses[0]?.id
  );

  const selectedClauseId = propSelectedClauseId || internalSelectedClause;

  const handleClauseClick = (clause: BillClause) => {
    setInternalSelectedClause(clause.id);
    if (onSelectClause) onSelectClause(clause.id);
  };

  const currentClause = bill.clauses.find((c) => c.id === selectedClauseId) || bill.clauses[0];

  return (
    <div className="space-y-6">
      
      {/* Bill Meta Summary Header */}
      <div 
        id="bill-header-card"
        className={`p-6 rounded-2xl bg-slate-900 border ${
          highlightTargetId === 'select-bill' 
            ? 'border-indigo-400 ring-2 ring-indigo-500/30' 
            : 'border-slate-800'
        }`}
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-1 rounded-md bg-indigo-500/20 text-indigo-300 font-mono text-xs font-bold">
                {bill.code}
              </span>
              <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 text-xs font-semibold">
                {bill.status}
              </span>
              <span className="text-xs text-slate-400">
                Sponsors: <strong className="text-slate-200">{bill.sponsor}</strong>
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-serif font-bold text-white mt-2">
              {bill.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed max-w-4xl">
              {bill.summary}
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex sm:flex-col gap-2 shrink-0 border-t lg:border-t-0 lg:border-l border-slate-800 pt-4 lg:pt-0 lg:pl-6">
            <div>
              <span className="text-[10px] uppercase font-semibold text-slate-400 block">Est. Budget</span>
              <span className="text-sm font-mono font-bold text-slate-200">{bill.budgetEst}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-semibold text-slate-400 block">Target Timeline</span>
              <span className="text-sm font-bold text-slate-200">{bill.timeline}</span>
            </div>
          </div>
        </div>

        {/* Problem Statement Callout */}
        <div className="mt-4 p-3.5 rounded-xl bg-amber-950/20 border border-amber-800/30 text-xs text-amber-200/90 flex items-start space-x-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong className="font-semibold text-amber-300">Legislative Friction Context: </strong>
            {bill.problemStatement}
          </div>
        </div>
      </div>

      {/* Main Clause Decomposition Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Clause List */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-serif font-bold uppercase tracking-wider text-slate-300">
              Decomposed Bill Clauses ({bill.clauses.length})
            </span>
            <span className="text-[11px] text-slate-400">Click clause to inspect</span>
          </div>

          <div className="space-y-2">
            {bill.clauses.map((clause) => {
              const isSelected = clause.id === selectedClauseId;
              const isHighContested = clause.contestedLevel === 'high';

              return (
                <div
                  key={clause.id}
                  id={`clause-${clause.id}`}
                  onClick={() => handleClauseClick(clause)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-indigo-950/40 border-indigo-500 shadow-lg shadow-indigo-950/50'
                      : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                  } ${
                    highlightTargetId === 'expand-clause' && clause.number.includes('204')
                      ? 'ring-2 ring-indigo-400'
                      : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-indigo-400">
                      {clause.number}
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        isHighContested
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          : clause.contestedLevel === 'medium'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      }`}
                    >
                      {clause.contestedLevel} friction
                    </span>
                  </div>

                  <h3 className="text-sm font-semibold text-white mt-1.5 line-clamp-1">
                    {clause.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                    {clause.summary}
                  </p>

                  <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 flex items-center space-x-1">
                      <DollarSign className="w-3 h-3 text-emerald-400" />
                      <span>{clause.fiscalImpact}</span>
                    </span>
                    <ChevronRight className={`w-3.5 h-3.5 ${isSelected ? 'text-indigo-400' : 'text-slate-500'}`} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Clause Deep-Dive Inspector */}
        <div className="lg:col-span-7">
          <div 
            id="clause-deep-dive"
            className={`p-6 rounded-2xl bg-slate-900 border ${
              highlightTargetId === 'show-contested-signal'
                ? 'border-indigo-400 ring-2 ring-indigo-500/30'
                : 'border-slate-800'
            } space-y-5`}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-indigo-400">
                  Detailed Clause Breakdown • {currentClause.number}
                </span>
                <h3 className="text-lg font-serif font-bold text-white mt-1">
                  {currentClause.title}
                </h3>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase text-slate-400 block">Fiscal Impact</span>
                <span className="text-xs font-mono font-bold text-emerald-400">
                  {currentClause.fiscalImpact}
                </span>
              </div>
            </div>

            {/* Plain Language Synthesis */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <div className="flex items-center space-x-2 text-xs font-semibold text-indigo-300 mb-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>AI Plain-Language Synthesis</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {currentClause.summary}
              </p>
            </div>

            {/* Stakeholder Conflicting Positions */}
            <div>
              <h4 className="text-xs font-serif font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center justify-between">
                <span>Multi-Stakeholder Perspectives & Redlines</span>
                <span className="text-[10px] text-slate-400">Audited Feedbacks</span>
              </h4>

              <div className="space-y-2.5">
                {currentClause.stakeholderPositions.map((pos, idx) => (
                  <div 
                    key={idx}
                    className={`p-3 rounded-xl border text-xs ${
                      pos.stance === 'oppose'
                        ? 'bg-rose-950/20 border-rose-800/40 text-rose-200'
                        : pos.stance === 'support'
                        ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-200'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between font-semibold">
                      <span className="text-white">{pos.group}</span>
                      <span className={`text-[10px] uppercase px-2 py-0.5 rounded-full font-bold ${
                        pos.stance === 'oppose' ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'
                      }`}>
                        {pos.stance}
                      </span>
                    </div>
                    <p className="mt-1 text-slate-400 leading-normal">
                      "{pos.reason}"
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Citations and Evidence Footnote */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center space-x-1.5">
                <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                <span>Primary Document: Legislative Reference Bureau Text (verified)</span>
              </span>
              <span className="text-emerald-400 font-mono font-semibold">
                Confidence 96%
              </span>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
