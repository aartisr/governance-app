import React from 'react';
import { 
  TrendingUp, 
  Sparkles, 
  CheckCircle2, 
  PlusCircle, 
  MinusCircle, 
  ShieldCheck, 
  Award, 
  Scale, 
  Zap, 
  ArrowRight,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { GovernanceBill, ParetoAmendment } from '../../types';

interface ParetoFrontierViewProps {
  bill: GovernanceBill;
  highlightTargetId?: string;
  activeAmendments?: Record<string, boolean>;
  onToggleAmendment?: (amendmentId: string) => void;
}

export const ParetoFrontierView: React.FC<ParetoFrontierViewProps> = ({
  bill,
  highlightTargetId,
  activeAmendments: propActiveAmendments,
  onToggleAmendment
}) => {
  const [amendmentsState, setAmendmentsState] = React.useState<Record<string, boolean>>(
    propActiveAmendments || {
      'am-1': true,
      'am-2': true,
      'am-3': true
    }
  );

  const activeMap = propActiveAmendments || amendmentsState;

  const handleToggle = (amendment: ParetoAmendment) => {
    const nextState = !activeMap[amendment.id];
    setAmendmentsState((prev) => ({ ...prev, [amendment.id]: nextState }));
    if (onToggleAmendment) onToggleAmendment(amendment.id);

    if (nextState) {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 }
      });
    }
  };

  // Compute live utilities based on active amendments
  const baseA = bill.baseBillUtility.groupA; // 88
  const baseB = bill.baseBillUtility.groupB; // 24
  const basePub = bill.baseBillUtility.generalPublic; // 56

  let deltaA = 0;
  let deltaB = 0;
  let deltaPub = 0;

  bill.amendments.forEach((am) => {
    if (activeMap[am.id]) {
      deltaA += am.stakeholderUtilityDelta['sh-1'] || 0;
      deltaB += am.stakeholderUtilityDelta['sh-2'] || 0;
      deltaPub += am.stakeholderUtilityDelta['sh-3'] || 0;
    }
  });

  const currentUtilityA = Math.min(100, Math.max(0, baseA + deltaA));
  const currentUtilityB = Math.min(100, Math.max(0, baseB + deltaB));
  const currentUtilityPub = Math.min(100, Math.max(0, basePub + deltaPub));

  const isParetoOptimal = currentUtilityA >= 80 && currentUtilityB >= 70;

  return (
    <div className="space-y-6">
      
      {/* Top Banner Header */}
      <div 
        id="pareto-header-card"
        className={`p-6 rounded-2xl bg-slate-900 border ${
          highlightTargetId === 'inspect-frontier-graph'
            ? 'border-cyan-400 ring-2 ring-cyan-500/30'
            : 'border-slate-800'
        }`}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono text-xs font-bold flex items-center space-x-1">
                <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
                <span>Pareto Efficiency Optimizer</span>
              </span>
              <span className="text-xs text-slate-400 font-serif">
                Multi-Objective Game Theory Engine
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-serif font-bold text-white mt-2">
              Synthesizing Positive-Sum Compromises
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl">
              The Pareto Frontier plots all policy configurations where neither group can be made better off without harming another. 
              By activating tailored amendments, we lift <strong className="text-indigo-300">Metro Freight Coalition</strong> from 24% to 78% utility without sacrificing clean air standards.
            </p>
          </div>

          {/* Pareto Consensus Status Badge */}
          <div className={`p-4 rounded-xl border shrink-0 text-right min-w-[200px] ${
            isParetoOptimal 
              ? 'bg-emerald-950/30 border-emerald-500/50' 
              : 'bg-amber-950/30 border-amber-500/50'
          }`}>
            <span className="text-[10px] uppercase font-semibold text-slate-400 block">Consensus Status</span>
            <div className="text-lg font-mono font-bold mt-0.5 flex items-center justify-end space-x-2">
              <span className={isParetoOptimal ? 'text-emerald-400' : 'text-amber-400'}>
                {isParetoOptimal ? 'Pareto Optimal Accord' : 'Sub-Optimal Friction'}
              </span>
            </div>
            <div className="text-xs text-slate-400 mt-1">
              Net Joint Satisfaction: <strong className="text-white">{Math.round((currentUtilityA + currentUtilityB + currentUtilityPub) / 3)}%</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Interactive 2D Frontier Chart vs Amendment Toggles */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: 2D Pareto Frontier Simulation Canvas (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          <div 
            id="pareto-frontier-canvas"
            className={`p-6 rounded-2xl bg-slate-900 border ${
              highlightTargetId === 'observe-pareto-shift'
                ? 'border-emerald-400 ring-2 ring-emerald-500/40 shadow-2xl shadow-emerald-950'
                : 'border-slate-800'
            } relative overflow-hidden`}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-serif font-bold uppercase tracking-wider text-slate-300">
                2D Trade-Off Utility Space
              </span>
              <div className="flex items-center space-x-3 text-[11px]">
                <span className="flex items-center space-x-1 text-slate-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-500"></span>
                  <span>Status Quo</span>
                </span>
                <span className="flex items-center space-x-1 text-rose-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                  <span>Unamended Bill</span>
                </span>
                <span className="flex items-center space-x-1 text-emerald-400 font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                  <span>Current Accord</span>
                </span>
              </div>
            </div>

            {/* Custom SVG Pareto Frontier Graph */}
            <div className="relative w-full aspect-[16/10] bg-slate-950 rounded-xl border border-slate-800/80 p-4">
              
              {/* Axes Labels */}
              <div className="absolute top-2 left-6 text-[10px] font-mono text-emerald-400">
                ▲ Environmental Clean Air Utility (0 → 100%)
              </div>
              <div className="absolute bottom-2 right-6 text-[10px] font-mono text-indigo-400">
                Commercial Freight & Business Utility (0 → 100%) ▶
              </div>

              <svg className="w-full h-full overflow-visible" viewBox="0 0 400 250">
                <defs>
                  {/* Pareto frontier curve gradient */}
                  <linearGradient id="frontierGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity="0.05" />
                  </linearGradient>
                </defs>

                {/* Grid Lines */}
                <line x1="40" y1="30" x2="40" y2="210" stroke="#334155" strokeWidth="1.5" />
                <line x1="40" y1="210" x2="380" y2="210" stroke="#334155" strokeWidth="1.5" />

                <line x1="40" y1="120" x2="380" y2="120" stroke="#1e293b" strokeDasharray="3 3" />
                <line x1="210" y1="30" x2="210" y2="210" stroke="#1e293b" strokeDasharray="3 3" />

                {/* Pareto Frontier Arc (The Theoretical Boundary) */}
                <path
                  d="M 60 50 Q 200 60, 320 90 T 360 190"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="2.5"
                  strokeDasharray="4 2"
                />

                {/* Win-Win Pareto Zone Shading */}
                <path
                  d="M 180 60 Q 270 70, 340 100 L 340 180 L 180 180 Z"
                  fill="url(#frontierGrad)"
                />

                {/* Point 1: Status Quo (42, 38) */}
                {/* SVG Coords: X = 40 + (38/100)*340 = 169.2, Y = 210 - (42/100)*180 = 134.4 */}
                <circle cx="169" cy="134" r="5" fill="#64748b" />
                <text x="176" y="138" fill="#94a3b8" fontSize="9" fontFamily="monospace">Status Quo (42, 38)</text>

                {/* Point 2: Unamended Bill (88, 24) */}
                {/* SVG Coords: X = 40 + (24/100)*340 = 121.6, Y = 210 - (88/100)*180 = 51.6 */}
                <circle cx="122" cy="52" r="6" fill="#f43f5e" />
                <text x="130" y="55" fill="#fb7185" fontSize="9" fontWeight="bold" fontFamily="monospace">Unamended (88, 24)</text>

                {/* Point 3: Live Current Accord Position */}
                {/* SVG Coords: X = 40 + (currentUtilityB/100)*340, Y = 210 - (currentUtilityA/100)*180 */}
                {(() => {
                  const cx = 40 + (currentUtilityB / 100) * 340;
                  const cy = 210 - (currentUtilityA / 100) * 180;
                  return (
                    <g>
                      {/* Pulse Ring */}
                      <circle cx={cx} cy={cy} r="12" fill="#10b981" fillOpacity="0.2" className="animate-ping" />
                      {/* Vector line from Unamended to Current Accord */}
                      <line x1="122" y1="52" x2={cx} y2={cy} stroke="#10b981" strokeWidth="2" strokeDasharray="2 2" />
                      {/* Point */}
                      <circle cx={cx} cy={cy} r="7" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
                      <text x={cx + 10} y={cy - 8} fill="#34d399" fontSize="10" fontWeight="bold" fontFamily="monospace">
                        Accord ({currentUtilityA}%, {currentUtilityB}%)
                      </text>
                    </g>
                  );
                })()}

              </svg>
            </div>

            {/* Live Utility Breakdown Bars below chart */}
            <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-slate-800">
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] uppercase text-emerald-400 font-semibold block">Clean Air Coalition</span>
                <span className="text-base font-mono font-bold text-white">{currentUtilityA}%</span>
                <span className="text-[10px] text-slate-400 block">Baseline: 88%</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] uppercase text-indigo-400 font-semibold block">Freight Alliance</span>
                <span className="text-base font-mono font-bold text-white">{currentUtilityB}%</span>
                <span className="text-[10px] text-emerald-400 block">+{currentUtilityB - 24}% Gain!</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] uppercase text-purple-400 font-semibold block">General Public</span>
                <span className="text-base font-mono font-bold text-white">{currentUtilityPub}%</span>
                <span className="text-[10px] text-emerald-400 block">+{currentUtilityPub - 56}% Gain</span>
              </div>
            </div>

          </div>
        </div>

        {/* Right Column: Interactive Amendment Toggles (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-serif font-bold uppercase tracking-wider text-slate-300">
              Synthesized Compromise Amendments ({bill.amendments.length})
            </span>
            <span className="text-[11px] text-slate-400">Toggle to shift frontier</span>
          </div>

          <div className="space-y-3">
            {bill.amendments.map((am) => {
              const isActive = activeMap[am.id];
              const isHighlight = highlightTargetId === 'toggle-amendment-1' && am.id === 'am-1';

              return (
                <div
                  key={am.id}
                  id={`amendment-card-${am.id}`}
                  onClick={() => handleToggle(am)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isActive
                      ? 'bg-emerald-950/20 border-emerald-500/60 shadow-lg shadow-emerald-950/40'
                      : 'bg-slate-900/80 border-slate-800 opacity-60 hover:opacity-100 hover:border-slate-700'
                  } ${isHighlight ? 'ring-2 ring-emerald-400' : ''}`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-mono font-semibold text-emerald-400">
                        {am.clauseTarget}
                      </span>
                      <h3 className="text-sm font-bold text-white mt-0.5">
                        {am.title}
                      </h3>
                    </div>

                    <button
                      className={`p-1 rounded-lg shrink-0 ${
                        isActive ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-500 bg-slate-800'
                      }`}
                    >
                      {isActive ? <CheckCircle2 className="w-5 h-5" /> : <PlusCircle className="w-5 h-5" />}
                    </button>
                  </div>

                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                    {am.description}
                  </p>

                  <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 font-mono">
                      Freight: <strong className="text-emerald-400">+{am.stakeholderUtilityDelta['sh-2']}%</strong>
                    </span>
                    <span className="text-indigo-300 font-mono">
                      Confidence {am.evidenceConfidence}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 flex items-start space-x-2.5">
            <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white">Pareto Principle in Action: </strong>
              Rather than forcing concessions, the engine invents structural policy mechanisms (e.g. night-shift off-peak toll waivers and upfront microgrid tax offsets) that generate mutual value.
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
