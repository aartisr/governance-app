import React from 'react';
import { Sliders, RefreshCw, Award, Calculator } from 'lucide-react';
import { DimensionCategory } from '../types';

interface CustomWeightCalculatorProps {
  dimensions: DimensionCategory[];
  weights: Record<string, number>;
  onWeightChange: (id: string, newWeight: number) => void;
  onResetWeights: () => void;
  calculatedScore: number;
}

export const CustomWeightCalculator: React.FC<CustomWeightCalculatorProps> = ({
  dimensions,
  weights,
  onWeightChange,
  onResetWeights,
  calculatedScore,
}) => {
  const totalWeightSum = (Object.values(weights) as number[]).reduce((a: number, b: number) => a + b, 0);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 lg:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="inline-flex items-center space-x-2 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full text-xs font-semibold text-indigo-700">
              <Calculator className="w-3.5 h-3.5" />
              <span>Dynamic Scoring Customizer</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-2">
              Custom Weight Recalculator
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Adjust dimension importance weights based on your organization's specific evaluation criteria.
            </p>
          </div>

          <button
            onClick={onResetWeights}
            className="flex items-center space-x-1.5 text-xs text-slate-600 bg-slate-100 hover:bg-slate-200 px-3.5 py-2 rounded-lg font-medium transition-colors self-start md:self-auto"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Default Weights</span>
          </button>
        </div>

        {/* Current Score Display Card */}
        <div className="bg-slate-900 text-white rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 border border-slate-800">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-base font-bold text-white flex items-center gap-2 justify-center sm:justify-start">
              <Award className="w-5 h-5 text-amber-400" />
              Recalculated Evaluation Rating
            </h3>
            <p className="text-xs text-slate-400">
              Weighted rating based on custom priority profile. (Total weight sum: {totalWeightSum}%)
            </p>
          </div>

          <div className="bg-slate-800 px-6 py-3 rounded-xl border border-slate-700 text-center min-w-[160px]">
            <span className="text-3xl font-black text-amber-400 font-mono">{calculatedScore.toFixed(2)}</span>
            <span className="text-xs text-slate-400 font-normal"> / 10</span>
          </div>
        </div>

        {/* Sliders List */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-slate-500 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-indigo-600" />
            Dimension Weight Allocation
          </h3>

          <div className="space-y-4">
            {dimensions.map((dim) => {
              const currentW = weights[dim.id] || (dim.weight * 100);
              return (
                <div key={dim.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      <span className="w-6 h-6 rounded-md bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center">
                        {dim.score.toFixed(1)}
                      </span>
                      <h4 className="font-bold text-slate-800 text-xs">{dim.title}</h4>
                    </div>

                    <div className="flex items-center space-x-3 text-xs">
                      <span className="text-slate-500">Weight:</span>
                      <span className="font-mono font-bold text-indigo-600 bg-white border border-slate-200 px-2 py-0.5 rounded">
                        {currentW}%
                      </span>
                      <span className="text-slate-400">| Contribution: </span>
                      <span className="font-mono font-bold text-slate-900">
                        {((dim.score * currentW) / 100).toFixed(2)} pts
                      </span>
                    </div>
                  </div>

                  <input
                    type="range"
                    min="5"
                    max="50"
                    step="5"
                    value={currentW}
                    onChange={(e) => onWeightChange(dim.id, Number(e.target.value))}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
