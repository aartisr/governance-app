import React from 'react';
import { 
  Coins, 
  Sparkles, 
  HelpCircle, 
  TrendingUp, 
  Scale, 
  ShieldCheck, 
  CheckCircle2, 
  Info,
  Sliders
} from 'lucide-react';
import { GovernanceBill } from '../../types';

interface VoiceTokenAllocationViewProps {
  bill: GovernanceBill;
  highlightTargetId?: string;
  userAllocations?: Record<string, number>;
  onUpdateAllocation?: (issueKey: string, tokens: number) => void;
}

export const VoiceTokenAllocationView: React.FC<VoiceTokenAllocationViewProps> = ({
  bill,
  highlightTargetId,
  userAllocations: propUserAllocations,
  onUpdateAllocation
}) => {
  const [allocations, setAllocations] = React.useState<Record<string, number>>(
    propUserAllocations || {
      'clean-air': 36,
      'freight-relief': 42,
      'microgrid-resilience': 16,
      'transit-equity': 6
    }
  );

  const issueMeta = [
    {
      key: 'clean-air',
      title: 'Zero-Emission Bus Fleet & Rapid Corridor Priority',
      category: 'Environmental Health',
      description: 'Accelerates 100% electric bus conversion with dedicated priority corridors.',
      defaultGroup: 'Clean Air Coalition',
      color: 'emerald'
    },
    {
      key: 'freight-relief',
      title: 'Commercial Congestion Toll Relief & Off-Peak Waivers',
      category: 'Commercial Logistics',
      description: 'Mitigates toll impacts for independent truckers and small delivery fleets.',
      defaultGroup: 'Freight Alliance',
      color: 'indigo'
    },
    {
      key: 'microgrid-resilience',
      title: 'Commercial Battery Storage & Microgrid Tax Credits',
      category: 'Grid Reliability',
      description: 'Provides upfront property tax credits for commercial battery backups.',
      defaultGroup: 'Public Grid Operator',
      color: 'amber'
    },
    {
      key: 'transit-equity',
      title: 'Zero-Fare Transit Credits for Low-Income Commuters',
      category: 'Civic Equity',
      description: 'Automatic transit fare subsidies for households earning <80% AMI.',
      defaultGroup: 'Transit Justice League',
      color: 'purple'
    }
  ];

  const totalBudget = 100;
  const totalSpent = (Object.values(allocations) as number[]).reduce((a: number, b: number) => a + b, 0);
  const remainingBudget = totalBudget - totalSpent;

  const handleSliderChange = (key: string, value: number) => {
    const currentVal = allocations[key] || 0;
    const diff = value - currentVal;
    
    // Check if within budget
    if (diff > remainingBudget) {
      value = currentVal + remainingBudget;
    }
    
    const newMap = { ...allocations, [key]: value };
    setAllocations(newMap);
    if (onUpdateAllocation) onUpdateAllocation(key, value);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Budget Header Card */}
      <div 
        id="token-budget-card"
        className={`p-6 rounded-2xl bg-slate-900 border ${
          highlightTargetId === 'hover-token-budget'
            ? 'border-amber-400 ring-2 ring-amber-500/30'
            : 'border-slate-800'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-xs font-bold flex items-center space-x-1">
                <Coins className="w-3.5 h-3.5 text-amber-400" />
                <span>Quadratic Voice-Token Model</span>
              </span>
              <span className="text-xs text-slate-400 font-serif">
                Aarti S Ravikumar Civic Preference Framework
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-serif font-bold text-white mt-2">
              Preference Intensity Allocation
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Unlike simplistic yes/no votes, voice tokens quantify <strong className="text-amber-300">how much</strong> an issue matters to you. 
              Voting power scales as the square root of tokens spent (<span className="font-mono text-amber-300">Voice = √Tokens</span>), preventing special-interest brigading.
            </p>
          </div>

          {/* Live Token Gauge */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 shrink-0 text-right min-w-[200px]">
            <span className="text-[10px] uppercase font-semibold text-slate-400 block">Weekly Token Budget</span>
            <div className="text-2xl font-mono font-bold text-white mt-0.5 flex items-baseline justify-end space-x-1.5">
              <span className={remainingBudget < 10 ? 'text-amber-400' : 'text-emerald-400'}>
                {remainingBudget}
              </span>
              <span className="text-sm text-slate-500">/ {totalBudget} Remaining</span>
            </div>
            {/* Progress bar */}
            <div className="w-full h-2 rounded-full bg-slate-800 mt-2 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-amber-500 to-indigo-500 rounded-full transition-all duration-300"
                style={{ width: `${(totalSpent / totalBudget) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Interactive Token Allocation Sliders */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Interactive Sliders (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-serif font-bold uppercase tracking-wider text-slate-300">
              Distribute Tokens Across Competing Priorities
            </span>
            <span className="text-[11px] font-mono text-indigo-400">Total Spent: {totalSpent} / 100</span>
          </div>

          <div className="space-y-3">
            {issueMeta.map((issue) => {
              const tokens = allocations[issue.key] || 0;
              const voiceUnits = Math.sqrt(tokens).toFixed(2);
              const isHighlight = highlightTargetId === 'adjust-slider-freight' && issue.key === 'freight-relief';

              return (
                <div
                  key={issue.key}
                  id={`token-row-${issue.key}`}
                  className={`p-4 rounded-xl bg-slate-900 border transition-all ${
                    isHighlight
                      ? 'border-indigo-400 ring-2 ring-indigo-500/40 shadow-lg shadow-indigo-950'
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-indigo-400">
                        {issue.category}
                      </span>
                      <h3 className="text-sm font-bold text-white mt-0.5">
                        {issue.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                        {issue.description}
                      </p>
                    </div>

                    <div className="text-right shrink-0 ml-4">
                      <div className="text-xs font-mono font-bold text-amber-300">
                        {tokens} Tokens
                      </div>
                      <div className="text-[11px] font-mono text-emerald-400">
                        {voiceUnits} Voice Units (√T)
                      </div>
                    </div>
                  </div>

                  {/* Range Slider */}
                  <div className="mt-3 flex items-center space-x-3">
                    <span className="text-[10px] font-mono text-slate-500">0</span>
                    <input
                      type="range"
                      min={0}
                      max={64}
                      value={tokens}
                      onChange={(e) => handleSliderChange(issue.key, parseInt(e.target.value))}
                      className="w-full accent-indigo-500 cursor-pointer h-2 bg-slate-800 rounded-lg appearance-none"
                    />
                    <span className="text-[10px] font-mono text-slate-500">64</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Quadratic Voting Mathematics & Anti-Brigading Explanation */}
        <div className="lg:col-span-5 space-y-4">
          
          <div 
            id="quadratic-math-card"
            className={`p-6 rounded-2xl bg-slate-900 border ${
              highlightTargetId === 'quadratic-curve-pop'
                ? 'border-emerald-400 ring-2 ring-emerald-500/30'
                : 'border-slate-800'
            } space-y-4`}
          >
            <div className="flex items-center space-x-2 text-xs font-serif font-bold uppercase tracking-wider text-emerald-400">
              <Scale className="w-4 h-4" />
              <span>The Quadratic Math Advantage</span>
            </div>

            <h3 className="text-base font-bold text-white">
              Why Quadratic Token Budgeting Prevents Polarization
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed">
              In a binary vote, a participant who mildly cares has the same 1 vote as an affected worker whose livelihood is at stake. 
              Under Civic Accord's quadratic formula, signaling 8 units of voice requires <span className="font-mono text-amber-300 font-bold">64 tokens</span> (8²), while 4 units requires only <span className="font-mono text-amber-300 font-bold">16 tokens</span> (4²).
            </p>

            {/* Visual Quadratic Cost Table */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs font-mono">
              <div className="text-[11px] text-slate-400 font-sans font-semibold mb-1">
                Preference Intensity Scaling:
              </div>
              <div className="flex justify-between text-slate-300">
                <span>1 Voice Unit</span>
                <span className="text-amber-400">1 Token (1²)</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>3 Voice Units</span>
                <span className="text-amber-400">9 Tokens (3²)</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>5 Voice Units</span>
                <span className="text-amber-400">25 Tokens (5²)</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>8 Voice Units</span>
                <span className="text-amber-400">64 Tokens (8²)</span>
              </div>
            </div>

            <div className="pt-2 flex items-center space-x-2 text-[11px] text-emerald-400">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Anti-Brigading Shield Active • Verified Civic ID</span>
            </div>
          </div>

          {/* Takeaway note */}
          <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-800/30 text-xs text-indigo-200">
            <span className="font-bold text-white">Engine Output: </span>
            The aggregated voice token vectors feed directly into Chapter 6's Pareto Optimizer to calculate non-zero-sum compromise amendments.
          </div>

        </div>

      </div>

    </div>
  );
};
