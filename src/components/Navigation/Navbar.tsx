import React from 'react';
import { 
  PlayCircle, 
  Layers, 
  Sparkles, 
  Download, 
  Coins, 
  Scale, 
  CheckCircle2, 
  SlidersHorizontal,
  ChevronDown,
  Play
} from 'lucide-react';
import { GovernanceBill } from '../../types';

interface NavbarProps {
  currentMode: 'video' | 'sandbox' | 'studio';
  setCurrentMode: (mode: 'video' | 'sandbox' | 'studio') => void;
  activeBill: GovernanceBill;
  setActiveBill: (bill: GovernanceBill) => void;
  allBills: GovernanceBill[];
  voiceTokenBudget: number;
  tokensUsed: number;
  onOpenExportModal: () => void;
  onOpenVideoModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentMode,
  setCurrentMode,
  activeBill,
  setActiveBill,
  allBills,
  voiceTokenBudget,
  tokensUsed,
  onOpenExportModal,
  onOpenVideoModal
}) => {
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Platform Info */}
          <div className="flex items-center space-x-3">
            <a 
              href="https://ai-aarti.com" 
              target="_blank" 
              rel="noreferrer"
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-emerald-400 p-0.5 shadow-lg shadow-indigo-500/20 hover:scale-105 transition-transform"
              title="Visit ai-aarti.com by Aarti S Ravikumar"
            >
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Scale className="w-5 h-5 text-indigo-400" />
              </div>
            </a>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-serif font-bold text-lg text-white tracking-wide">
                  CIVIC ACCORD
                </span>
                <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  Pareto Engine
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Evidence-Based Civic Decision Support • by Aarti S Ravikumar
              </p>
            </div>
          </div>

          {/* Active Bill Switcher */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 text-xs font-medium text-slate-200 transition-colors"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-slate-400">Bill:</span>
              <span className="font-semibold text-white">{activeBill.code}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {dropdownOpen && (
              <div className="absolute left-0 mt-2 w-80 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl p-2 z-50">
                <div className="text-[11px] font-semibold text-slate-400 px-3 py-1 uppercase tracking-wider">
                  Select Active Legislative Proposal
                </div>
                {allBills.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => {
                      setActiveBill(b);
                      setDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors flex flex-col space-y-0.5 ${
                      activeBill.id === b.id
                        ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                        : 'hover:bg-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold">{b.code}: {b.title}</span>
                      <span className="text-[10px] text-emerald-400 font-mono">{b.category}</span>
                    </div>
                    <span className="text-[11px] text-slate-400 line-clamp-1">{b.summary}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Center: Prominent Watch Walkthrough Button & Navigation Tabs */}
          <div className="flex items-center space-x-2">
            
            {/* Direct Option 1: Watch Walkthrough Pop-up Button */}
            <button
              onClick={onOpenVideoModal}
              className="flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all hover:scale-105 active:scale-95 animate-pulse"
              title="Watch full narrated walkthrough of Civic Accord in a video popup"
            >
              <div className="w-5 h-5 rounded-full bg-slate-950/20 flex items-center justify-center">
                <Play className="w-3 h-3 fill-slate-950 text-slate-950 ml-0.5" />
              </div>
              <span className="whitespace-nowrap">Watch Walkthrough</span>
            </button>

            {/* Mode Switchers */}
            <div className="hidden sm:flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setCurrentMode('sandbox')}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  currentMode === 'sandbox'
                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Live App</span>
              </button>
              <button
                onClick={() => setCurrentMode('video')}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  currentMode === 'video'
                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <PlayCircle className="w-3.5 h-3.5" />
                <span>Video Page</span>
              </button>
              <button
                onClick={() => setCurrentMode('studio')}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  currentMode === 'studio'
                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>AI Studio</span>
              </button>
            </div>

          </div>

          {/* Right Action Widgets */}
          <div className="flex items-center space-x-3">
            {/* Voice Token Quick Badge */}
            <div className="hidden lg:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-indigo-950/40 border border-indigo-800/40 text-xs">
              <Coins className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-slate-400">Tokens:</span>
              <span className="font-mono font-bold text-amber-300">
                {voiceTokenBudget - tokensUsed}/{voiceTokenBudget}
              </span>
            </div>

            {/* Export Video / Report Button */}
            <button
              onClick={onOpenExportModal}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-colors shadow-sm"
              title="Download presentation video, slides, or verified legislative brief"
            >
              <Download className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">Export Brief</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
