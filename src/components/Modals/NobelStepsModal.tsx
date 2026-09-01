import React from 'react';
import { 
  Award, 
  X, 
  CheckCircle2, 
  BookOpen, 
  Layers, 
  Cpu, 
  Sparkles, 
  Scale, 
  SlidersHorizontal, 
  ShieldCheck, 
  TrendingUp, 
  ArrowRight,
  Play
} from 'lucide-react';
import { VIDEO_SCENES } from '../../data/videoScenes';

interface NobelStepsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectScene: (sceneIndex: number) => void;
  currentSceneIndex: number;
}

export const NobelStepsModal: React.FC<NobelStepsModalProps> = ({
  isOpen,
  onClose,
  onSelectScene,
  currentSceneIndex
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-5xl max-h-[92vh] bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Modal Top Header */}
        <div className="p-6 bg-gradient-to-r from-slate-950 via-indigo-950/80 to-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300">
                  Nobel Prize-Caliber Framework
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  All 21 Discrete Democratic Steps
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-serif font-bold text-white mt-1">
                Complete Step-by-Step Mathematical Formulation
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Step Cards */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-xs text-slate-300 leading-relaxed">
            <p>
              <strong className="text-indigo-200">The Theoretical Architecture of Civic Accord:</strong> Created by Aarti S Ravikumar, this platform solves democratic deadlocks by decomposing complex governance into seven progressive stages and 21 discrete analytical steps. Every step replaces political guesswork with verifiable mechanism design.
            </p>
          </div>

          <div className="space-y-6">
            {VIDEO_SCENES.map((scene, idx) => {
              const isCurrent = idx === currentSceneIndex;
              return (
                <div 
                  key={scene.id}
                  className={`p-5 rounded-2xl border transition-all ${
                    isCurrent 
                      ? 'bg-indigo-950/20 border-indigo-500 shadow-lg shadow-indigo-950/50' 
                      : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {/* Chapter Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                    <div className="space-y-0.5">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-indigo-600/30 text-indigo-300">
                          CHAPTER {scene.sceneNumber}
                        </span>
                        <h3 className="text-sm font-serif font-bold text-white">
                          {scene.title.split(': ')[1] || scene.title}
                        </h3>
                      </div>
                      <p className="text-xs text-slate-400">
                        {scene.subtitle}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        onSelectScene(idx);
                        onClose();
                      }}
                      className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                        isCurrent 
                          ? 'bg-emerald-600 text-white' 
                          : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20'
                      }`}
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>{isCurrent ? 'Currently Playing' : `Play Chapter ${scene.sceneNumber}`}</span>
                    </button>
                  </div>

                  {/* Problem & Outcome Badges */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 my-3 text-xs">
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                      <span className="text-rose-400 font-bold uppercase text-[10px] block mb-0.5">
                        Democratic Dilemma Solved:
                      </span>
                      <span className="text-slate-300 text-[11px]">
                        {scene.democraticProblemSolved}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                      <span className="text-emerald-400 font-bold uppercase text-[10px] block mb-0.5">
                        Mathematical Mechanism & Outcome:
                      </span>
                      <span className="text-emerald-300 font-mono text-[11px]">
                        {scene.governanceOutcome}
                      </span>
                    </div>
                  </div>

                  {/* Sub-steps Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                    {scene.nobelSteps?.map((step, sIdx) => (
                      <div 
                        key={sIdx}
                        className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between space-y-2 hover:border-indigo-500/30 transition-colors"
                      >
                        <div>
                          <div className="flex items-center space-x-1.5 text-indigo-400 font-mono text-xs font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                            <span>{step.stepNumber}: {step.stepTitle}</span>
                          </div>
                          <div className="mt-2 text-[11px] text-slate-300 leading-relaxed">
                            <strong className="text-slate-400 block text-[10px] uppercase tracking-wider mb-0.5">
                              Academic Insight:
                            </strong>
                            {step.academicInsight}
                          </div>
                        </div>

                        <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-300">
                          <strong className="text-indigo-300 block text-[10px] uppercase tracking-wider mb-0.5">
                            Practical Execution:
                          </strong>
                          {step.practicalImplementation}
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              );
            })}
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Civic Accord • Making Democratic Governance Rigorous, Measurable, and Positive-Sum</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
          >
            Close Steps Explorer
          </button>
        </div>

      </div>
    </div>
  );
};
