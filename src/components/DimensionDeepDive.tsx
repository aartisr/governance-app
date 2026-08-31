import React, { useState } from 'react';
import { Cpu, ShieldCheck, LayoutDashboard, Briefcase, Scale, CheckCircle2, AlertCircle, ChevronRight } from 'lucide-react';
import { DimensionCategory } from '../types';

interface DimensionDeepDiveProps {
  dimensions: DimensionCategory[];
  selectedDimensionId: string;
  onSelectDimension: (id: string) => void;
}

export const DimensionDeepDive: React.FC<DimensionDeepDiveProps> = ({
  dimensions,
  selectedDimensionId,
  onSelectDimension
}) => {
  const currentDimension = dimensions.find(d => d.id === selectedDimensionId) || dimensions[0];

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Cpu': return <Cpu className="w-5 h-5" />;
      case 'ShieldCheck': return <ShieldCheck className="w-5 h-5" />;
      case 'LayoutDashboard': return <LayoutDashboard className="w-5 h-5" />;
      case 'Briefcase': return <Briefcase className="w-5 h-5" />;
      case 'Scale': return <Scale className="w-5 h-5" />;
      default: return <Cpu className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Category Selection Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {dimensions.map(dim => {
          const isSelected = dim.id === currentDimension.id;
          return (
            <button
              key={dim.id}
              onClick={() => onSelectDimension(dim.id)}
              className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between space-y-3 ${
                isSelected
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/20'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`p-2 rounded-lg ${isSelected ? 'bg-indigo-700 text-white' : 'bg-indigo-50 text-indigo-600'}`}>
                  {getIcon(dim.iconName)}
                </span>
                <span className={`text-xs font-black px-2 py-0.5 rounded-md ${
                  isSelected ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-slate-800'
                }`}>
                  {dim.score.toFixed(1)}
                </span>
              </div>
              <div>
                <h4 className="font-bold text-xs line-clamp-2 leading-tight">
                  {dim.title}
                </h4>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Dimension Focus Area */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 lg:p-8 space-y-6">
        {/* Dimension Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              {getIcon(currentDimension.iconName)}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-bold text-slate-900">{currentDimension.title}</h2>
                <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full font-medium">
                  Weight: {(currentDimension.weight * 100).toFixed(0)}%
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">{currentDimension.summary}</p>
            </div>
          </div>

          <div className="bg-indigo-50 border border-indigo-100 px-4 py-2 rounded-xl flex items-baseline space-x-1.5 self-start md:self-auto">
            <span className="text-xs text-indigo-700 font-medium">Dimension Score:</span>
            <span className="text-2xl font-black text-indigo-700">{currentDimension.score.toFixed(1)}</span>
            <span className="text-xs text-indigo-500">/ 10</span>
          </div>
        </div>

        {/* Criteria Breakdown */}
        <div className="space-y-6">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-slate-500">
            Detailed Criteria & Sub-Metric Audit
          </h3>

          <div className="space-y-6">
            {currentDimension.criteria.map((criterion) => (
              <div key={criterion.id} className="bg-slate-50 rounded-xl border border-slate-200 p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 pb-3">
                  <h4 className="font-bold text-slate-900 text-base flex items-center space-x-2">
                    <ChevronRight className="w-4 h-4 text-indigo-600" />
                    <span>{criterion.name}</span>
                  </h4>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-slate-500 font-medium">Criterion Score:</span>
                    <span className="text-sm font-black text-slate-900 bg-white border border-slate-200 px-2.5 py-1 rounded-md">
                      {criterion.score.toFixed(1)} / 10
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {criterion.summary}
                </p>

                {/* Sub-metrics Progress Bars */}
                <div className="space-y-3 pt-2">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Sub-Metric Performance</span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {criterion.subMetrics.map((sub, idx) => (
                      <div key={idx} className="bg-white p-3 rounded-lg border border-slate-200/80 space-y-1.5">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-semibold text-slate-800">{sub.name}</span>
                          <span className="font-mono font-bold text-indigo-600">{sub.score.toFixed(1)}</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                            style={{ width: `${(sub.score / 10) * 100}%` }}
                          />
                        </div>
                        <p className="text-[11px] text-slate-500">{sub.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Strengths & Improvements */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="bg-emerald-50/70 border border-emerald-100 rounded-lg p-3 space-y-1.5">
                    <div className="flex items-center space-x-1.5 text-xs font-bold text-emerald-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Key Highlights</span>
                    </div>
                    <ul className="space-y-1 text-[11px] text-emerald-900">
                      {criterion.strengths.map((str, sIdx) => (
                        <li key={sIdx} className="flex items-start space-x-1.5">
                          <span className="text-emerald-500 font-bold">•</span>
                          <span>{str}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-amber-50/70 border border-amber-100 rounded-lg p-3 space-y-1.5">
                    <div className="flex items-center space-x-1.5 text-xs font-bold text-amber-800">
                      <AlertCircle className="w-4 h-4 text-amber-600" />
                      <span>Recommended Upgrades</span>
                    </div>
                    <ul className="space-y-1 text-[11px] text-amber-900">
                      {criterion.improvements.map((imp, iIdx) => (
                        <li key={iIdx} className="flex items-start space-x-1.5">
                          <span className="text-amber-500 font-bold">•</span>
                          <span>{imp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
