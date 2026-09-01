import React from 'react';
import { 
  SAMPLE_BILLS 
} from './data/sampleBills';
import { 
  VIDEO_SCENES, 
  SUBTITLE_TRACK 
} from './data/videoScenes';
import { 
  Navbar 
} from './components/Navigation/Navbar';
import { 
  VideoPlayer 
} from './components/VideoPlayer/VideoPlayer';
import { 
  SandboxDashboard 
} from './components/InteractiveApp/SandboxDashboard';
import { 
  CustomWalkthroughGenerator 
} from './components/AIStudio/CustomWalkthroughGenerator';
import { 
  ExportModal 
} from './components/Modals/ExportModal';
import { 
  VideoModal 
} from './components/Modals/VideoModal';
import { 
  GovernanceBill, 
  VideoScene 
} from './types';
import { 
  Sparkles, 
  Scale, 
  Github, 
  ExternalLink,
  BookOpen,
  Info,
  Play
} from 'lucide-react';

export default function App() {
  // Live website defaults to interactive sandbox with direct "Watch Walkthrough" modal triggers
  const [activeMode, setActiveMode] = React.useState<'video' | 'sandbox' | 'studio'>('sandbox');
  const [activeBill, setActiveBill] = React.useState<GovernanceBill>(SAMPLE_BILLS[0]);
  const [scenes, setScenes] = React.useState<VideoScene[]>(VIDEO_SCENES);
  const [tokenBudget, setTokenBudget] = React.useState({ remaining: 64, total: 100 });
  const [sandboxInitialTab, setSandboxInitialTab] = React.useState<string>('overview');
  const [isExportModalOpen, setIsExportModalOpen] = React.useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = React.useState(false);

  const handleSwitchToSandbox = (tab?: string) => {
    if (tab) setSandboxInitialTab(tab);
    setActiveMode('sandbox');
  };

  const handleSwitchToVideo = () => {
    setActiveMode('video');
  };

  const handleLoadCustomWalkthrough = (newBill: GovernanceBill, newScenes: VideoScene[]) => {
    setActiveBill(newBill);
    setScenes(newScenes);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col selection:bg-indigo-500 selection:text-white">
      
      {/* Top Universal Navigation Bar with Watch Walkthrough Button */}
      <Navbar
        currentMode={activeMode}
        setCurrentMode={setActiveMode}
        activeBill={activeBill}
        setActiveBill={setActiveBill}
        allBills={SAMPLE_BILLS}
        voiceTokenBudget={tokenBudget.total}
        tokensUsed={tokenBudget.total - tokenBudget.remaining}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        onOpenVideoModal={() => setIsVideoModalOpen(true)}
      />

      {/* Official Prototype & Research Attribution Banner */}
      <div className="bg-gradient-to-r from-indigo-950/90 via-slate-900 to-indigo-950/90 border-b border-indigo-500/20 px-4 py-2 text-center text-xs text-slate-300">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>
              <strong>Civic Accord</strong>: Evidence-Based Civic Decision Support & Pareto Governance System.
            </span>
          </div>

          <div className="flex items-center space-x-3 text-slate-400 text-[11px]">
            <button
              onClick={() => setIsVideoModalOpen(true)}
              className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 transition-colors font-semibold"
            >
              <Play className="w-3 h-3 fill-amber-300" />
              <span>Watch Video Walkthrough</span>
            </button>
            <span className="hidden md:inline text-slate-600">•</span>
            <span className="hidden sm:inline">
              By <a href="https://ai-aarti.com" target="_blank" rel="noreferrer" className="text-indigo-300 hover:text-white underline font-semibold">Aarti S Ravikumar</a> (<a href="https://ai-aarti.com" target="_blank" rel="noreferrer" className="text-indigo-300 hover:text-white underline">ai-aarti.com</a>)
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        
        {/* Mode: Interactive Sandbox (Live Deployed View Default) */}
        {activeMode === 'sandbox' && (
          <SandboxDashboard
            activeBill={activeBill}
            initialTab={sandboxInitialTab}
            onSwitchToVideo={handleSwitchToVideo}
            onOpenExportModal={() => setIsExportModalOpen(true)}
            onOpenVideoModal={() => setIsVideoModalOpen(true)}
          />
        )}

        {/* Mode: Video Walkthrough Page */}
        {activeMode === 'video' && (
          <VideoPlayer
            scenes={scenes}
            subtitles={SUBTITLE_TRACK}
            activeBill={activeBill}
            onSwitchToSandbox={handleSwitchToSandbox}
            onOpenExportModal={() => setIsExportModalOpen(true)}
          />
        )}

        {/* Mode: AI Walkthrough Studio */}
        {activeMode === 'studio' && (
          <CustomWalkthroughGenerator
            onLoadCustomWalkthrough={handleLoadCustomWalkthrough}
            onSwitchToVideo={handleSwitchToVideo}
          />
        )}

      </main>

      {/* Footer & Theoretical Attribution */}
      <footer className="mt-auto border-t border-slate-800/80 bg-slate-950/90 py-6 px-4 sm:px-6 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2 text-slate-300">
            <Scale className="w-4 h-4 text-indigo-400" />
            <span className="font-serif font-bold">Civic Accord (Pareto Governance Engine)</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400">Created by Aarti S Ravikumar (Founder & CEO, ai-aarti.com)</span>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsVideoModalOpen(true)}
              className="flex items-center space-x-1 text-amber-300 hover:text-amber-200 transition-colors font-medium"
            >
              <Play className="w-3.5 h-3.5 fill-amber-300" />
              <span>Watch Video Walkthrough</span>
            </button>
            <a
              href="https://ai-aarti.com"
              target="_blank"
              rel="noreferrer"
              className="flex items-center space-x-1 text-indigo-300 hover:text-white transition-colors font-medium"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>ai-aarti.com</span>
            </a>
            <a
              href="https://github.com/aartisr/governance-app"
              target="_blank"
              rel="noreferrer"
              className="flex items-center space-x-1 hover:text-white transition-colors"
            >
              <Github className="w-3.5 h-3.5" />
              <span>aartisr/governance-app</span>
            </a>
            <a
              href="https://github.com/aartisr/governance-app/tree/main/docs"
              target="_blank"
              rel="noreferrer"
              className="flex items-center space-x-1 hover:text-white transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
              <span>Framework Docs</span>
            </a>
          </div>
        </div>
      </footer>

      {/* Video Popup Modal (Option 1 Integration) */}
      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        scenes={scenes}
        subtitles={SUBTITLE_TRACK}
        activeBill={activeBill}
        onSwitchToSandbox={handleSwitchToSandbox}
        onOpenExportModal={() => setIsExportModalOpen(true)}
      />

      {/* Export Options Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        bill={activeBill}
      />

    </div>
  );
}
