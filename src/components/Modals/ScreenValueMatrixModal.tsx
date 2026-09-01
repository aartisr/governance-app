import React from 'react';
import { 
  Award, 
  X, 
  CheckCircle2, 
  Cpu, 
  Sparkles, 
  Layers, 
  ShieldCheck, 
  Scale, 
  SlidersHorizontal, 
  FileText, 
  TrendingUp, 
  ExternalLink,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { VIDEO_SCENES } from '../../data/videoScenes';

interface ScreenValueMatrixModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectScene: (index: number) => void;
}

export const ScreenValueMatrixModal: React.FC<ScreenValueMatrixModalProps> = ({
  isOpen,
  onClose,
  onSelectScene
}) => {
  if (!isOpen) return null;

  const screens = [
    {
      sceneIndex: 0,
      title: 'Screen 1: Executive Paradigm & Theoretical Foundation',
      appUrlSection: 'Overview / Problem Statement',
      category: 'Social Choice Theory',
      icon: Scale,
      color: 'indigo',
      democraticFailureSolved: "Arrow's Impossibility Theorem & 51/49 Zero-Sum Polarized Deadlock",
      mathematicalInnovation: 'Multi-Objective Cardinal Utility Manifold & Pareto Frontier Optimization',
      constituentValue: 'Transforms adversarial legislative warfare into positive-sum cooperation where no faction is forced into zero-sum defeat.',
      keyMetrics: ['+44% Consensus Gain', '100% Legible Trade-offs', 'Multi-Stakeholder Welfare']
    },
    {
      sceneIndex: 1,
      title: 'Screen 2: Bill Intelligence & Clause Decomposition',
      appUrlSection: 'Bill Decomposition & AI Synthesis',
      category: 'Statutory Transparency',
      icon: FileText,
      color: 'blue',
      democraticFailureSolved: 'Statutory Opacity, 500-Page Omnibus Bills & Hidden Special-Interest Riders',
      mathematicalInnovation: 'Atomic NLP Provision Parsing, Isolated Fiscal Trajectory Modeling & Conflict Heatmapping',
      constituentValue: 'Translates complex legalese into plain English while isolating the exact fiscal and statutory consequence of every single clause.',
      keyMetrics: ['Clause-level Fiscal Deltas', 'Friction Point Spotlighting', 'Plain-Language Summaries']
    },
    {
      sceneIndex: 2,
      title: 'Screen 3: Local & District Impact Micro-Simulation',
      appUrlSection: 'Geographic & Demographic Projections',
      category: 'Econometric Forecasting',
      icon: Layers,
      color: 'amber',
      democraticFailureSolved: 'One-Size-Fits-All Policy Blindspots & Geographic Disparity Disasters',
      mathematicalInnovation: 'Bayesian Econometric Micro-Simulation with Explicit Statistical Confidence Intervals',
      constituentValue: 'Enables constituents and local representatives to see exact district-by-district deltas across air quality, jobs, and transit costs.',
      keyMetrics: ['94% Empirical Confidence', 'Socioeconomic Equity Scoring', 'District Variance Analysis']
    },
    {
      sceneIndex: 3,
      title: 'Screen 4: Quadratic Voice-Token Preference Budgeting',
      appUrlSection: 'Voice Budget / Preference Intensity',
      category: 'Mechanism Design',
      icon: SlidersHorizontal,
      color: 'purple',
      democraticFailureSolved: 'Binary Vote Distortion (Treating Minor Opinions Equal to Existential Stakes) & Astroturfing',
      mathematicalInnovation: 'Quadratic Voting Function: Voice = √(Tokens Allocated) across a 100-Token Weekly Budget',
      constituentValue: 'Imposes an exponential cost on vote-buying while empowering vulnerable minorities to signal non-negotiable existential priorities.',
      keyMetrics: ['Convex Cost Barrier (8 Votes = 64 Tokens)', 'Anti-Brigading Armor', 'Preference Intensity Vector']
    },
    {
      sceneIndex: 4,
      title: 'Screen 5: Stakeholder Trust & Epistemic Credibility Matrix',
      appUrlSection: 'Evidence Quality & Trust Scoring',
      category: 'Epistemic Governance',
      icon: ShieldCheck,
      color: 'emerald',
      democraticFailureSolved: 'Post-Truth Lobbying Echo Chambers & Subsidized Corporate Disinformation',
      mathematicalInnovation: 'Multi-Vector Epistemic Credibility Index (Empirical Rigor, Domain Credentials, Disclosures, Accuracy)',
      constituentValue: 'Weights policy arguments by scientific reproducibility and verified financial disclosures rather than lobbying spend.',
      keyMetrics: ['0-100 Credibility Vector', 'Mandatory Financial Registry Auditing', 'Open Source Data Provenance']
    },
    {
      sceneIndex: 5,
      title: 'Screen 6: The Pareto Compromise Engine',
      appUrlSection: 'Common Ground & Trade-Off Matrix',
      category: 'Algorithmic Optimization',
      icon: TrendingUp,
      color: 'rose',
      democraticFailureSolved: 'Partisan Impasse, Endless Gridlock & Mutual Sabotage',
      mathematicalInnovation: 'Algorithmic Pareto Frontier Synthesis Generating Positive-Sum Compensatory Amendment Packages',
      constituentValue: 'The mathematical crown jewel: Discovers amendments (e.g. off-peak toll credits) that elevate both environmentalists and freight industry simultaneously.',
      keyMetrics: ['84% Pareto Consensus', 'Real-Time 2D Frontier Manifold', 'Zero Unilateral Concessions']
    },
    {
      sceneIndex: 6,
      title: 'Screen 7: Immutable Audit Trail & Verified Enactment Ledger',
      appUrlSection: 'Decision Record & Legislative Brief Export',
      category: 'Cryptographic Provenance',
      icon: Award,
      color: 'teal',
      democraticFailureSolved: 'Post-Enactment Regulatory Erosion, Backdoor Reversals & Loss of Democratic Trust',
      mathematicalInnovation: 'Cryptographic SHA-256 State Ledger Hashing & Provable Multi-Factor Citation Graph',
      constituentValue: 'Produces an exportable, tamper-evident Legislative Brief that establishes permanent democratic legitimacy and public trust.',
      keyMetrics: ['SHA-256 Digest Certification', 'One-Click PDF/JSON Briefs', 'Complete Epistemic Provenance']
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-5xl max-h-[90vh] bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Modal Top Header */}
        <div className="p-6 bg-gradient-to-r from-slate-950 via-indigo-950/60 to-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300">
                  Nobel-Caliber Paradigm
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  governanceapp.ai-aarti.com
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-serif font-bold text-white mt-1">
                The 7 Breakthrough Screen Values of Civic Accord
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

        {/* Scrollable Screen Value Cards */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/20 text-xs text-slate-300 leading-relaxed">
            <strong className="text-indigo-300">Framework Overview:</strong> Created by Aarti S Ravikumar, Civic Accord is an evidence-based civic decision support system that transforms democratic deliberation into measurable, multi-objective Pareto optimization. Below is the exact academic, mathematical, and civic value articulated across each screen.
          </div>

          <div className="grid grid-cols-1 gap-4">
            {screens.map((screen, idx) => {
              const Icon = screen.icon;
              return (
                <div 
                  key={idx}
                  className="p-5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-indigo-500/40 transition-all group"
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="space-y-2 max-w-2xl">
                      <div className="flex items-center space-x-2">
                        <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                          <Icon className="w-4 h-4" />
                        </div>
                        <h3 className="text-sm font-bold text-white">
                          {screen.title}
                        </h3>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                          {screen.category}
                        </span>
                      </div>

                      {/* Democratic Problem Solved */}
                      <div className="text-xs space-y-1">
                        <div className="flex items-baseline space-x-2">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-rose-400 shrink-0">
                            Problem Solved:
                          </span>
                          <span className="text-slate-300">
                            {screen.democraticFailureSolved}
                          </span>
                        </div>

                        {/* Mathematical Mechanism */}
                        <div className="flex items-baseline space-x-2">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400 shrink-0">
                            Innovation:
                          </span>
                          <span className="text-indigo-200 font-mono text-[11px]">
                            {screen.mathematicalInnovation}
                          </span>
                        </div>

                        {/* Constituent & Lawmaker Value */}
                        <div className="flex items-baseline space-x-2">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 shrink-0">
                            Civic Value:
                          </span>
                          <span className="text-slate-300">
                            {screen.constituentValue}
                          </span>
                        </div>
                      </div>

                      {/* Key Metric Tags */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {screen.keyMetrics.map((metric, mIdx) => (
                          <span 
                            key={mIdx}
                            className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-400 font-medium"
                          >
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            <span>{metric}</span>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="shrink-0 flex items-center md:flex-col justify-end gap-2">
                      <button
                        onClick={() => {
                          onSelectScene(screen.sceneIndex);
                          onClose();
                        }}
                        className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-md shadow-indigo-600/20"
                      >
                        <span>Jump to Scene {screen.sceneIndex + 1}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
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
            <span>Civic Accord • Making Democratic Trade-Offs Transparent, Measurable, and Positive-Sum</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
          >
            Close Matrix
          </button>
        </div>

      </div>
    </div>
  );
};
