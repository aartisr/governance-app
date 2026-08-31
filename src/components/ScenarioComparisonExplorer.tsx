import React from 'react';
import { Layers, CheckCircle2, ArrowRight } from 'lucide-react';

export const ScenarioComparisonExplorer: React.FC = () => {
  const scenarios = [
    {
      title: 'Scenario 1: Status Quo Baseline',
      cost: '$45M',
      housing: '2,400 units',
      eco: '40 / 100',
      consensus: '42%',
      risk: 'High',
      score: '6.2',
      status: 'Rejected (Zero-Sum Deadlock)'
    },
    {
      title: 'Scenario 2: Civic Accord Pareto Optimal',
      cost: '$62M',
      housing: '2,150 units',
      eco: '94 / 100',
      consensus: '88%',
      risk: 'Low',
      score: '10.0',
      status: 'Winner (10/10 Compromise)'
    },
    {
      title: 'Scenario 3: Max Eco Initiative',
      cost: '$55M',
      housing: '1,800 units',
      eco: '96 / 100',
      consensus: '84%',
      risk: 'Low',
      score: '9.7',
      status: 'High Performer'
    }
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
      <div className="border-b border-slate-100 pb-4">
        <div className="inline-flex items-center space-x-2 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full text-xs font-semibold text-indigo-700">
          <Layers className="w-3.5 h-3.5" />
          <span>3-Way Scenario Matrix</span>
        </div>
        <h3 className="text-lg font-bold text-slate-900 mt-2">
          Side-by-Side Legislative Compromise Explorer
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Contrast competing bill amendments side-by-side across cost, environmental gain, housing units, and consensus probability.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {scenarios.map((sc, idx) => (
          <div
            key={idx}
            className={`p-4 rounded-xl border space-y-3 transition-all ${
              sc.score === '10.0'
                ? 'bg-indigo-50/70 border-indigo-300 ring-2 ring-indigo-500/20'
                : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="flex justify-between items-start">
              <h4 className="font-bold text-slate-900 text-xs max-w-[180px]">{sc.title}</h4>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                sc.score === '10.0' ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-700'
              }`}>
                {sc.score} / 10
              </span>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Municipal Cost:</span>
                <span className="font-bold font-mono text-slate-800">{sc.cost}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Housing Supply:</span>
                <span className="font-bold text-slate-800">{sc.housing}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Eco Benefit:</span>
                <span className="font-bold text-slate-800">{sc.eco}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Consensus Support:</span>
                <span className="font-bold text-slate-800">{sc.consensus}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Delivery Risk:</span>
                <span className="font-bold text-slate-800">{sc.risk}</span>
              </div>
            </div>

            <div className="pt-2 text-[11px] font-bold text-indigo-700 flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
              <span>{sc.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
