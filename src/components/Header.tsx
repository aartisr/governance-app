import React from 'react';
import { Shield, ExternalLink, Download, Award, BarChart3, Sliders, Scale, Cpu, FileText, ShieldCheck } from 'lucide-react';
import { TARGET_APP_INFO } from '../data/evaluationData';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenExport: () => void;
  onOpenNistCard: () => void;
  calculatedScore: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenExport,
  onOpenNistCard,
  calculatedScore
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40 backdrop-blur-md bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top bar */}
        <div className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold tracking-tight text-white">Civic Accord Evaluation</h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800/60 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  10/10 Gold Standard Benchmark
                </span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-slate-400 mt-0.5">
                <span>Target:</span>
                <a 
                  href={TARGET_APP_INFO.url} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="text-indigo-400 hover:text-indigo-300 font-mono flex items-center gap-1 underline decoration-indigo-400/40 underline-offset-2"
                >
                  governanceapp.ai-aarti.com
                  <ExternalLink className="w-3 h-3" />
                </a>
                <span className="text-slate-600">•</span>
                <span>Evaluated: {TARGET_APP_INFO.evaluatedAt}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2.5">
            {/* Score Badge */}
            <div className="flex items-center bg-slate-800/90 border border-slate-700/80 rounded-lg px-3 py-1.5 shadow-sm">
              <Award className="w-5 h-5 text-amber-400 mr-2" />
              <div className="text-right">
                <div className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">Rating</div>
                <div className="text-lg font-black leading-tight text-amber-400 font-mono">
                  {calculatedScore.toFixed(1)} <span className="text-xs text-slate-400 font-normal">/ 10</span>
                </div>
              </div>
            </div>

            <button
              onClick={onOpenNistCard}
              className="flex items-center space-x-1.5 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold px-3 py-2.5 rounded-lg transition-all shadow-sm"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              <span className="hidden sm:inline">NIST Safety Card</span>
            </button>

            <button
              onClick={onOpenExport}
              className="flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-3 py-2.5 rounded-lg transition-all shadow-sm"
            >
              <Download className="w-4 h-4" />
              <span>Export Audit</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto space-x-1 border-t border-slate-800/80 pt-1 pb-1 scrollbar-none">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-md text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === 'overview'
                ? 'bg-indigo-600/20 text-indigo-300 border-b-2 border-indigo-500'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Executive Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('deepdive')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-md text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === 'deepdive'
                ? 'bg-indigo-600/20 text-indigo-300 border-b-2 border-indigo-500'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>5 Evaluation Dimensions</span>
          </button>

          <button
            onClick={() => setActiveTab('simulator')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-md text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === 'simulator'
                ? 'bg-indigo-600/20 text-indigo-300 border-b-2 border-indigo-500'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>Pareto & Monte Carlo Engine</span>
          </button>

          <button
            onClick={() => setActiveTab('compliance')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-md text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === 'compliance'
                ? 'bg-indigo-600/20 text-indigo-300 border-b-2 border-indigo-500'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Scale className="w-4 h-4" />
            <span>NIST & EU AI Act Matrix</span>
          </button>

          <button
            onClick={() => setActiveTab('calculator')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-md text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === 'calculator'
                ? 'bg-indigo-600/20 text-indigo-300 border-b-2 border-indigo-500'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Weight Customizer</span>
          </button>
        </div>
      </div>
    </header>
  );
};
