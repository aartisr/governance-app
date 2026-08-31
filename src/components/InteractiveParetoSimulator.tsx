import React, { useState } from 'react';
import { Cpu, RefreshCw, CheckCircle2, TrendingUp, Sliders, ShieldCheck, Layers, Globe, Sparkles } from 'lucide-react';
import { SAMPLE_PARETO_SIMULATION_DATA } from '../data/evaluationData';
import { MonteCarloRiskSimulator } from './MonteCarloRiskSimulator';
import { LegiScanDocketSync } from './LegiScanDocketSync';
import { PublicCommentParser } from './PublicCommentParser';
import { ScenarioComparisonExplorer } from './ScenarioComparisonExplorer';

export const InteractiveParetoSimulator: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'pareto' | 'montecarlo' | 'legiscan' | 'comment' | 'scenario'>('pareto');
  const [budgetCap, setBudgetCap] = useState<number>(60);
  const [envWeight, setEnvWeight] = useState<number>(70);
  const [transitWeight, setTransitWeight] = useState<number>(60);
  const [minConsensus, setMinConsensus] = useState<number>(65);

  // Compute calculated scores for amendments based on current slider inputs
  const evaluatedAmendments = SAMPLE_PARETO_SIMULATION_DATA.map(a => {
    // Distance penalty if over budget
    const budgetPenalty = a.costMillion > budgetCap ? (a.costMillion - budgetCap) * 0.15 : 0;
    
    // Calculated score
    const weightedEnv = (a.environmentalBenefit * (envWeight / 100));
    const weightedTransit = (a.transitCapacity * (transitWeight / 100));
    const consensusMet = a.stakeholderSupportPct >= minConsensus;
    
    let computedPareto = (weightedEnv * 0.4 + weightedTransit * 0.4 + a.stakeholderSupportPct * 0.2) / 10 - budgetPenalty;
    if (!consensusMet) computedPareto -= 2.0;
    
    computedPareto = Math.max(1.0, Math.min(10.0, computedPareto));

    return {
      ...a,
      computedScore: parseFloat(computedPareto.toFixed(1)),
      consensusMet,
      isParetoOptimal: computedPareto >= 8.0 && consensusMet && a.costMillion <= budgetCap + 5,
    };
  }).sort((a, b) => b.computedScore - a.computedScore);

  return (
    <div className="space-y-6">
      {/* Sub-Navigation for Engine Modules */}
      <div className="bg-slate-900 rounded-xl p-2 flex overflow-x-auto space-x-2 border border-slate-800 text-xs font-semibold">
        <button
          onClick={() => setActiveSubTab('pareto')}
          className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all whitespace-nowrap ${
            activeSubTab === 'pareto' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Cpu className="w-4 h-4" />
          <span>Pareto Frontier Optimizer</span>
        </button>

        <button
          onClick={() => setActiveSubTab('montecarlo')}
          className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all whitespace-nowrap ${
            activeSubTab === 'montecarlo' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Monte Carlo Risk Engine</span>
        </button>

        <button
          onClick={() => setActiveSubTab('legiscan')}
          className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all whitespace-nowrap ${
            activeSubTab === 'legiscan' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>LegiScan API Sync</span>
        </button>

        <button
          onClick={() => setActiveSubTab('comment')}
          className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all whitespace-nowrap ${
            activeSubTab === 'comment' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Town Hall NLP Parser</span>
        </button>

        <button
          onClick={() => setActiveSubTab('scenario')}
          className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all whitespace-nowrap ${
            activeSubTab === 'scenario' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>3-Way Scenario Matrix</span>
        </button>
      </div>

      {activeSubTab === 'pareto' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 lg:p-8 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <div className="inline-flex items-center space-x-2 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full text-xs font-semibold text-indigo-700">
                <Cpu className="w-3.5 h-3.5" />
                <span>Civic Accord Engine Demo</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 mt-2">
                Interactive Pareto Compromise Simulator
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Demonstrates how <span className="font-mono text-indigo-600">governanceapp.ai-aarti.com</span> evaluates multi-variable municipal bills to unlock stalled compromises.
              </p>
            </div>

            <button
              onClick={() => {
                setBudgetCap(60);
                setEnvWeight(70);
                setTransitWeight(60);
                setMinConsensus(65);
              }}
              className="flex items-center space-x-1.5 text-xs text-slate-600 bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-lg font-medium transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Weights</span>
            </button>
          </div>

          {/* Sliders Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-700">Municipal Budget Cap</span>
                <span className="font-mono font-bold text-indigo-600">${budgetCap}M</span>
              </div>
              <input
                type="range"
                min="30"
                max="90"
                value={budgetCap}
                onChange={(e) => setBudgetCap(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <p className="text-[10px] text-slate-500">Max acceptable cost limit</p>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-700">Environmental Weight</span>
                <span className="font-mono font-bold text-indigo-600">{envWeight}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={envWeight}
                onChange={(e) => setEnvWeight(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <p className="text-[10px] text-slate-500">Eco & sustainability priority</p>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-700">Transit Priority</span>
                <span className="font-mono font-bold text-indigo-600">{transitWeight}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={transitWeight}
                onChange={(e) => setTransitWeight(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <p className="text-[10px] text-slate-500">Micro-mobility & bus routes</p>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-700">Min Consensus</span>
                <span className="font-mono font-bold text-indigo-600">{minConsensus}%</span>
              </div>
              <input
                type="range"
                min="40"
                max="90"
                value={minConsensus}
                onChange={(e) => setMinConsensus(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <p className="text-[10px] text-slate-500">Minimum voting threshold</p>
            </div>
          </div>

          {/* Calculated Results Table */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-indigo-600" />
                Pareto Frontier Amendment Rankings
              </h3>
              <span className="text-xs text-slate-500 font-medium">Deterministic Simulation</span>
            </div>

            <div className="space-y-3">
              {evaluatedAmendments.map((amend, index) => (
                <div
                  key={amend.id}
                  className={`p-4 rounded-xl border transition-all ${
                    amend.isParetoOptimal
                      ? 'bg-indigo-50/70 border-indigo-300 ring-2 ring-indigo-500/20 shadow-sm'
                      : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1 max-w-xl">
                      <div className="flex items-center space-x-2">
                        <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[11px] font-bold flex items-center justify-center">
                          #{index + 1}
                        </span>
                        <h4 className="font-bold text-slate-900 text-sm">
                          {amend.name}
                        </h4>
                        {amend.isParetoOptimal && (
                          <span className="bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Pareto Winner
                          </span>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-slate-600 pt-1">
                        <div>Cost: <strong className="text-slate-900">${amend.costMillion}M</strong></div>
                        <div>Eco Benefit: <strong className="text-slate-900">{amend.environmentalBenefit}/100</strong></div>
                        <div>Transit: <strong className="text-slate-900">{amend.transitCapacity}/100</strong></div>
                        <div>Support: <strong className={`font-semibold ${amend.consensusMet ? 'text-emerald-700' : 'text-rose-600'}`}>
                          {amend.stakeholderSupportPct}%
                        </strong></div>
                      </div>
                    </div>

                    {/* Computed Score Badge */}
                    <div className="flex items-center space-x-3 self-end md:self-center">
                      <div className="text-right">
                        <div className="text-[10px] uppercase font-semibold text-slate-400">Civic Accord Score</div>
                        <div className="text-xl font-black text-indigo-700 font-mono">
                          {amend.computedScore} <span className="text-xs font-normal text-slate-400">/ 10</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Architectural Insight Box */}
          <div className="bg-slate-900 text-white rounded-xl p-4 text-xs space-y-2 border border-slate-800">
            <div className="flex items-center space-x-2 text-indigo-400 font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>Why this algorithm matters in governanceapp.ai-aarti.com</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Unlike simple voting platforms that force binary "Yes/No" approvals on rigid bills, Civic Accord calculates 
              multi-objective Pareto non-dominated sets. This enables policy teams to discover win-win compromise options 
              that minimize municipal risk while maximizing multi-stakeholder satisfaction.
            </p>
          </div>
        </div>
      )}

      {activeSubTab === 'montecarlo' && <MonteCarloRiskSimulator />}
      {activeSubTab === 'legiscan' && <LegiScanDocketSync />}
      {activeSubTab === 'comment' && <PublicCommentParser />}
      {activeSubTab === 'scenario' && <ScenarioComparisonExplorer />}
    </div>
  );
};
