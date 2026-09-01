import React from 'react';
import { 
  Scale, 
  Cpu, 
  FileText, 
  Coins, 
  CheckCircle2, 
  TrendingUp, 
  ArrowRight, 
  ShieldCheck, 
  Users, 
  Sparkles,
  Award
} from 'lucide-react';
import { GovernanceBill } from '../../types';

interface OverviewViewProps {
  bill: GovernanceBill;
  onNavigateTab: (tab: 'intelligence' | 'impact' | 'voicetokens' | 'evidence' | 'pareto' | 'audit') => void;
  highlightTargetId?: string;
  onOpenVideoModal?: () => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({ 
  bill, 
  onNavigateTab,
  highlightTargetId,
  onOpenVideoModal 
}) => {
  return (
    <div className="space-y-6">
      
      {/* Executive Hero Banner */}
      <div 
        id="overview-hero"
        className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 p-6 md:p-8 border ${
          highlightTargetId === 'highlight-title' 
            ? 'border-indigo-400 ring-4 ring-indigo-500/20 shadow-2xl shadow-indigo-500/30' 
            : 'border-slate-800'
        } transition-all duration-300`}
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Pareto Governance Engine • End-to-End Walkthrough</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-white tracking-tight leading-tight">
            Solving Partisan Deadlock via Multi-Objective Optimization
          </h1>
          
          <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed">
            Democratic deliberation often breaks down because complex bills force zero-sum trade-offs. 
            <strong className="text-indigo-300"> Civic Accord</strong> introduces a rigorous mathematical engine that captures preference intensity, validates empirical evidence, and synthesizes win-win <strong className="text-emerald-300">Pareto compromises</strong>.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            {onOpenVideoModal && (
              <button
                onClick={onOpenVideoModal}
                className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold transition-all shadow-lg shadow-amber-500/20 hover:scale-105 active:scale-95"
              >
                <Award className="w-4 h-4 text-slate-950" />
                <span>Watch Nobel Walkthrough (Video)</span>
              </button>
            )}
            <button
              onClick={() => onNavigateTab('intelligence')}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50"
            >
              <span>Explore Bill Intelligence</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigateTab('pareto')}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors"
            >
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>Simulate Pareto Frontier</span>
            </button>
          </div>
        </div>

        {/* Live KPI Quick Cards */}
        <div 
          id="overview-kpis"
          className={`grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 pt-6 border-t ${
            highlightTargetId === 'pulse-kpi' 
              ? 'border-indigo-400 bg-indigo-950/30 p-3 rounded-xl' 
              : 'border-slate-800/80'
          }`}
        >
          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Status Quo Utility</span>
            <div className="mt-1 flex items-baseline space-x-2">
              <span className="text-xl font-bold font-mono text-slate-400">40.0%</span>
              <span className="text-[10px] text-slate-500">Stagnant</span>
            </div>
          </div>

          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Unamended Skew</span>
            <div className="mt-1 flex items-baseline space-x-2">
              <span className="text-xl font-bold font-mono text-rose-400">24% vs 88%</span>
              <span className="text-[10px] text-rose-400/80">Polarized</span>
            </div>
          </div>

          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-emerald-900/40 bg-emerald-950/20">
            <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider block">Pareto Accord Score</span>
            <div className="mt-1 flex items-baseline space-x-2">
              <span className="text-xl font-bold font-mono text-emerald-300">84.0%</span>
              <span className="text-[10px] text-emerald-400">+44% Gain</span>
            </div>
          </div>

          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Evidence Rigor</span>
            <div className="mt-1 flex items-baseline space-x-2">
              <span className="text-xl font-bold font-mono text-indigo-400">{bill.confidenceScore}%</span>
              <span className="text-[10px] text-indigo-400/80">Audited</span>
            </div>
          </div>
        </div>
      </div>

      {/* Six Pillars of Civic Accord Architecture */}
      <div 
        id="overview-pillars"
        className={`p-6 rounded-2xl bg-slate-900/80 border ${
          highlightTargetId === 'spotlight-pillars' 
            ? 'border-indigo-400 ring-2 ring-indigo-500/30' 
            : 'border-slate-800'
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-serif font-bold text-white">
              The 6 Core Modules of the Governance Engine
            </h2>
            <p className="text-xs text-slate-400">
              Trace the end-to-end pipeline from bill drafting to consensus enactment
            </p>
          </div>
          <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/20">
            Version 2.4 Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          <div 
            onClick={() => onNavigateTab('intelligence')}
            className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800/40 cursor-pointer transition-all group"
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <FileText className="w-4 h-4 text-indigo-400" />
            </div>
            <h3 className="text-sm font-bold text-slate-200 group-hover:text-indigo-300 transition-colors">
              1. Bill Intelligence
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Automated clause decomposition, fiscal quantification, and identification of contested provisions.
            </p>
          </div>

          <div 
            onClick={() => onNavigateTab('impact')}
            className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800/40 cursor-pointer transition-all group"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Users className="w-4 h-4 text-emerald-400" />
            </div>
            <h3 className="text-sm font-bold text-slate-200 group-hover:text-emerald-300 transition-colors">
              2. District Impact Simulation
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Localized economic, demographic, and environmental projections with transparent confidence bounds.
            </p>
          </div>

          <div 
            onClick={() => onNavigateTab('voicetokens')}
            className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800/40 cursor-pointer transition-all group"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Coins className="w-4 h-4 text-amber-400" />
            </div>
            <h3 className="text-sm font-bold text-slate-200 group-hover:text-amber-300 transition-colors">
              3. Voice-Token Budgeting
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Quadratic preference intensity modeling (V = √Tokens) that measures genuine priority while curbing vote brigading.
            </p>
          </div>

          <div 
            onClick={() => onNavigateTab('evidence')}
            className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800/40 cursor-pointer transition-all group"
          >
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-4 h-4 text-purple-400" />
            </div>
            <h3 className="text-sm font-bold text-slate-200 group-hover:text-purple-300 transition-colors">
              4. Evidence & Trust Rubric
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Rigorous scoring of testimonies, datasets, and lobby submissions across reproducibility and conflicts of interest.
            </p>
          </div>

          <div 
            onClick={() => onNavigateTab('pareto')}
            className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800/40 cursor-pointer transition-all group"
          >
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
            </div>
            <h3 className="text-sm font-bold text-slate-200 group-hover:text-cyan-300 transition-colors">
              5. Pareto Compromise Engine
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Multi-objective optimization finding policy amendments that elevate all major stakeholder groups.
            </p>
          </div>

          <div 
            onClick={() => onNavigateTab('audit')}
            className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800/40 cursor-pointer transition-all group"
          >
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Award className="w-4 h-4 text-rose-400" />
            </div>
            <h3 className="text-sm font-bold text-slate-200 group-hover:text-rose-300 transition-colors">
              6. Immutable Audit Trail
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Cryptographic decision records and verifiable legislative outcome briefs ready for enactment.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
};
