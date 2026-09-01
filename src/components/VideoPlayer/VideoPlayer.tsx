import React from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Minimize2, 
  Captions, 
  SkipForward, 
  SkipBack, 
  Sparkles, 
  CheckCircle2, 
  SlidersHorizontal, 
  Video, 
  Download,
  Info,
  ChevronRight,
  ChevronDown,
  Award,
  BookOpen,
  Layers,
  Scale,
  ShieldAlert,
  Mic,
  Settings,
  HelpCircle
} from 'lucide-react';
import { VideoScene, GovernanceBill, SubtitleItem } from '../../types';
import { narrator, VoiceOption } from '../../utils/audioNarrator';
import { OverviewView } from '../Views/OverviewView';
import { BillIntelligenceView } from '../Views/BillIntelligenceView';
import { LocalImpactView } from '../Views/LocalImpactView';
import { VoiceTokenAllocationView } from '../Views/VoiceTokenAllocationView';
import { EvidenceTrustView } from '../Views/EvidenceTrustView';
import { ParetoFrontierView } from '../Views/ParetoFrontierView';
import { AuditDecisionView } from '../Views/AuditDecisionView';
import { ScreenValueMatrixModal } from '../Modals/ScreenValueMatrixModal';
import { NobelStepsModal } from '../Modals/NobelStepsModal';

interface VideoPlayerProps {
  scenes: VideoScene[];
  activeBill: GovernanceBill;
  subtitles: SubtitleItem[];
  onSwitchToSandbox: (tab: any) => void;
  onOpenExportModal: () => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  scenes,
  activeBill,
  subtitles,
  onSwitchToSandbox,
  onOpenExportModal
}) => {
  const [currentSceneIndex, setCurrentSceneIndex] = React.useState(0);
  const [isPlaying, setIsPlaying] = React.useState(true);
  const [isMuted, setIsMuted] = React.useState(false);
  const [speechRate, setSpeechRate] = React.useState(1.0);
  const [selectedVoiceName, setSelectedVoiceName] = React.useState<string>('');
  const [availableVoices, setAvailableVoices] = React.useState<VoiceOption[]>([]);
  const [sceneProgressSec, setSceneProgressSec] = React.useState(0);
  const [showCaptions, setShowCaptions] = React.useState(true);
  const [isStepByStepMode, setIsStepByStepMode] = React.useState(false);
  const [showStepsAccordion, setShowStepsAccordion] = React.useState(true);
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [cursorPos, setCursorPos] = React.useState<{ x: number; y: number; text?: string } | null>(null);
  const [activeHighlightId, setActiveHighlightId] = React.useState<string | undefined>(undefined);
  const [isMatrixModalOpen, setIsMatrixModalOpen] = React.useState(false);
  const [isNobelStepsModalOpen, setIsNobelStepsModalOpen] = React.useState(false);
  const [showValueOverlay, setShowValueOverlay] = React.useState(true);
  const [showAudioSettings, setShowAudioSettings] = React.useState(false);

  const videoContainerRef = React.useRef<HTMLDivElement>(null);
  const tickerRef = React.useRef<any>(null);
  const isAdvancingRef = React.useRef(false);

  const currentScene = scenes[currentSceneIndex] || scenes[0];

  // Initialize available voices from Web Speech API
  React.useEffect(() => {
    const updateVoices = () => {
      const v = narrator.getVoices();
      setAvailableVoices(v);
      const defaultVoice = v.find((x) => x.default) || v[0];
      if (defaultVoice && !selectedVoiceName) {
        setSelectedVoiceName(defaultVoice.name);
      }
    };

    updateVoices();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }, [selectedVoiceName]);

  // Calculate total duration & global elapsed time
  const totalDurationSeconds = React.useMemo(() => {
    return scenes.reduce((acc, s) => acc + s.durationSeconds, 0);
  }, [scenes]);

  const globalElapsedSeconds = React.useMemo(() => {
    let sum = 0;
    for (let i = 0; i < currentSceneIndex; i++) {
      sum += scenes[i].durationSeconds;
    }
    return sum + sceneProgressSec;
  }, [currentSceneIndex, sceneProgressSec, scenes]);

  // Current subtitle based on global time
  const activeSubtitle = React.useMemo(() => {
    return subtitles.find(
      (sub) => globalElapsedSeconds >= sub.startTime && globalElapsedSeconds <= sub.endTime
    );
  }, [globalElapsedSeconds, subtitles]);

  // Synchronized Narration & Video Progression Handler
  React.useEffect(() => {
    narrator.setMuted(isMuted);
    narrator.setRate(speechRate);
    if (selectedVoiceName) {
      narrator.setVoiceByName(selectedVoiceName);
    }

    if (!isPlaying) {
      narrator.stop();
      if (tickerRef.current) clearInterval(tickerRef.current);
      return;
    }

    narrator.startAmbientBgm();
    narrator.playSoundEffect('chime');
    isAdvancingRef.current = false;

    // Speak current scene narration with completion callback
    narrator.speak(currentScene.narrationScript, {
      onEnd: () => {
        // When speech finishes cleanly, pause briefly and proceed if in Continuous Mode
        if (!isStepByStepMode && !isAdvancingRef.current) {
          isAdvancingRef.current = true;
          setTimeout(() => {
            if (currentSceneIndex < scenes.length - 1) {
              setCurrentSceneIndex((idx) => idx + 1);
              setSceneProgressSec(0);
              setCursorPos(null);
              setActiveHighlightId(undefined);
            } else {
              setIsPlaying(false);
              setSceneProgressSec(currentScene.durationSeconds);
            }
          }, 1400);
        }
      }
    });

    return () => {
      narrator.stop();
    };
  }, [currentSceneIndex, isPlaying, isMuted, speechRate, selectedVoiceName, isStepByStepMode]);

  // Progress ticker for interactive cursor animations and smooth time bar
  React.useEffect(() => {
    if (!isPlaying) {
      if (tickerRef.current) clearInterval(tickerRef.current);
      return;
    }

    tickerRef.current = setInterval(() => {
      setSceneProgressSec((prev) => {
        const step = 0.5 * speechRate;
        const next = Math.min(prev + step, currentScene.durationSeconds);

        // Check interactive cues for the scene
        const matchingCue = currentScene.interactiveCues.find(
          (cue) => Math.abs(cue.time - next) < 0.6
        );

        if (matchingCue) {
          setCursorPos({ x: matchingCue.cursorPosition.x, y: matchingCue.cursorPosition.y, text: matchingCue.tipText });
          setActiveHighlightId(matchingCue.action);
          narrator.playSoundEffect('click');
        }

        // If audio is muted, handle time-based completion
        if (isMuted && next >= currentScene.durationSeconds && !isAdvancingRef.current) {
          isAdvancingRef.current = true;
          if (!isStepByStepMode && currentSceneIndex < scenes.length - 1) {
            setTimeout(() => {
              setCurrentSceneIndex((idx) => idx + 1);
              setSceneProgressSec(0);
              setCursorPos(null);
              setActiveHighlightId(undefined);
            }, 600);
          } else if (currentSceneIndex === scenes.length - 1) {
            setIsPlaying(false);
          }
        }

        return next;
      });
    }, 500);

    return () => {
      if (tickerRef.current) clearInterval(tickerRef.current);
    };
  }, [isPlaying, currentSceneIndex, currentScene, speechRate, isMuted, isStepByStepMode, scenes.length]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    narrator.playSoundEffect('click');
  };

  const handleSeekScene = (index: number) => {
    narrator.stop();
    setCurrentSceneIndex(index);
    setSceneProgressSec(0);
    setCursorPos(null);
    setActiveHighlightId(undefined);
    setIsPlaying(true);
    narrator.playSoundEffect('click');
  };

  const handleToggleFullscreen = () => {
    if (!videoContainerRef.current) return;
    if (!document.fullscreenElement) {
      videoContainerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      
      {/* Top Video Header & Scene Title Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-900/70 p-4 rounded-2xl border border-slate-800 backdrop-blur-md">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded bg-indigo-600/30 text-indigo-300 font-mono text-[10px] font-bold">
                CHAPTER {currentScene.sceneNumber} OF {scenes.length}
              </span>
              <span className="text-xs font-serif font-bold text-white">
                {currentScene.title}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {currentScene.subtitle}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Mode Selector: Step-by-Step vs Continuous */}
          <button
            onClick={() => setIsStepByStepMode(!isStepByStepMode)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
              isStepByStepMode 
                ? 'bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-900/40' 
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
            }`}
            title="Toggle between guided step-by-step pauses or continuous playback"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{isStepByStepMode ? 'Guided Step Mode: ON' : 'Continuous Mode'}</span>
          </button>

          {/* View All 21 Nobel Steps */}
          <button
            onClick={() => setIsNobelStepsModalOpen(true)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-semibold transition-colors"
          >
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <span>All 21 Nobel Steps</span>
          </button>

          {/* Screen Value Matrix */}
          <button
            onClick={() => setIsMatrixModalOpen(true)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold transition-colors"
          >
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>Screen Value Matrix</span>
          </button>

          {/* Sandbox Switch */}
          <button
            onClick={() => onSwitchToSandbox(currentScene.activeTab)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-semibold transition-colors"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Try in Sandbox</span>
          </button>

          {/* Export Brief */}
          <button
            onClick={onOpenExportModal}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-indigo-400" />
            <span>Export WebM</span>
          </button>
        </div>
      </div>

      {/* Primary 16:9 Video Canvas & Live Screen Player */}
      <div 
        ref={videoContainerRef}
        id="video-player-viewport"
        className="relative aspect-[16/9.6] w-full rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl overflow-hidden flex flex-col group select-none"
      >
        
        {/* Top Left Watermark / Status Overlay */}
        <div className="absolute top-4 left-4 z-30 flex items-center space-x-2 bg-slate-950/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-[11px]">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-mono font-bold text-white">CIVIC ACCORD DEMO</span>
          <span className="text-slate-500">•</span>
          <span className="text-indigo-400 font-mono">{activeBill.code}</span>
        </div>

        {/* Top Right Floating Screen Value & Paradigm Innovation Badge */}
        {showValueOverlay && currentScene.screenValueSummary && (
          <div className="absolute top-4 right-4 z-30 max-w-sm hidden sm:block">
            <div className="bg-slate-950/90 backdrop-blur-md p-3 rounded-xl border border-indigo-500/40 shadow-xl text-[11px] space-y-1.5 animate-fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1 text-amber-300 font-bold">
                  <Award className="w-3 h-3" />
                  <span className="uppercase text-[9px] tracking-wider">Screen Value Proposition</span>
                </div>
                <button 
                  onClick={() => setShowValueOverlay(false)}
                  className="text-slate-500 hover:text-slate-300 text-[10px]"
                >
                  ✕
                </button>
              </div>
              <p className="text-slate-200 font-medium leading-tight">
                {currentScene.screenValueSummary}
              </p>
              {currentScene.democraticProblemSolved && (
                <div className="text-[10px] text-rose-300/90 pt-1 border-t border-slate-800/80 flex items-center space-x-1">
                  <span className="font-semibold text-rose-400">Solves:</span>
                  <span className="truncate">{currentScene.democraticProblemSolved}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Video Screen Body: Live Interactive View Snapshot */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 relative z-10 pb-24">
          {currentScene.activeTab === 'overview' && (
            <OverviewView 
              bill={activeBill} 
              onNavigateTab={(t) => onSwitchToSandbox(t)}
              highlightTargetId={activeHighlightId}
            />
          )}

          {currentScene.activeTab === 'intelligence' && (
            <BillIntelligenceView 
              bill={activeBill} 
              highlightTargetId={activeHighlightId}
            />
          )}

          {currentScene.activeTab === 'impact' && (
            <LocalImpactView 
              bill={activeBill} 
              highlightTargetId={activeHighlightId}
            />
          )}

          {currentScene.activeTab === 'voicetokens' && (
            <VoiceTokenAllocationView 
              bill={activeBill} 
              highlightTargetId={activeHighlightId}
            />
          )}

          {currentScene.activeTab === 'evidence' && (
            <EvidenceTrustView 
              bill={activeBill} 
              highlightTargetId={activeHighlightId}
            />
          )}

          {currentScene.activeTab === 'pareto' && (
            <ParetoFrontierView 
              bill={activeBill} 
              highlightTargetId={activeHighlightId}
            />
          )}

          {currentScene.activeTab === 'audit' && (
            <AuditDecisionView 
              bill={activeBill} 
              highlightTargetId={activeHighlightId}
              onOpenExportModal={onOpenExportModal}
            />
          )}
        </div>

        {/* Simulated Animated Mouse Cursor */}
        {cursorPos && (
          <div
            className="absolute z-40 pointer-events-none transition-all duration-700 ease-out"
            style={{ left: `${Math.min(90, Math.max(10, (cursorPos.x / 1000) * 100))}%`, top: `${Math.min(85, Math.max(15, (cursorPos.y / 600) * 100))}%` }}
          >
            <div className="w-7 h-7 rounded-full bg-indigo-500/30 -ml-2 -mt-2 animate-ping absolute"></div>
            <svg className="w-6 h-6 text-indigo-400 drop-shadow-md" viewBox="0 0 24 24" fill="currentColor">
              <path d="M4 2l16 11-7 1-4 8L4 2z" />
            </svg>
            {cursorPos.text && (
              <div className="absolute left-6 top-0 bg-indigo-950/90 text-indigo-200 border border-indigo-500/40 text-[11px] px-2.5 py-1 rounded-lg shadow-xl font-medium whitespace-nowrap backdrop-blur-sm animate-fade-in">
                {cursorPos.text}
              </div>
            )}
          </div>
        )}

        {/* Closed Captions / Subtitle Bar */}
        {showCaptions && activeSubtitle && (
          <div className="absolute bottom-16 left-0 right-0 z-30 flex justify-center px-6 pointer-events-none">
            <div className="bg-slate-950/95 backdrop-blur-md px-5 py-2.5 rounded-xl border border-indigo-500/30 text-center max-w-2xl shadow-2xl animate-fade-in">
              <span className="text-xs sm:text-sm font-medium text-slate-100 leading-snug">
                {activeSubtitle.text}
              </span>
            </div>
          </div>
        )}

        {/* Master Video Bottom Controls Bar */}
        <div className="absolute bottom-0 left-0 right-0 z-30 bg-slate-950/95 backdrop-blur-md border-t border-slate-800/90 px-4 py-2.5 flex flex-col space-y-2">
          
          {/* Scrubber & Chapter Markers */}
          <div className="relative w-full h-2 bg-slate-800 rounded-full cursor-pointer overflow-hidden group/bar">
            {/* Overall Progress */}
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 transition-all duration-300"
              style={{ width: `${(globalElapsedSeconds / totalDurationSeconds) * 100}%` }}
            ></div>

            {/* Chapter Ticks */}
            {scenes.map((scene, idx) => {
              let tickTime = 0;
              for (let i = 0; i < idx; i++) tickTime += scenes[i].durationSeconds;
              const leftPercent = (tickTime / totalDurationSeconds) * 100;
              return (
                <div
                  key={scene.id}
                  onClick={() => handleSeekScene(idx)}
                  className="absolute top-0 bottom-0 w-0.5 bg-slate-950 hover:w-1 hover:bg-white transition-all cursor-pointer z-10"
                  style={{ left: `${leftPercent}%` }}
                  title={`${scene.title} (${scene.timestamp})`}
                ></div>
              );
            })}
          </div>

          {/* Controls Row */}
          <div className="flex items-center justify-between text-xs text-slate-300">
            
            {/* Left Play/Pause & Step Buttons */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              <button
                onClick={() => {
                  if (currentSceneIndex > 0) handleSeekScene(currentSceneIndex - 1);
                }}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                title="Previous Step / Chapter"
              >
                <SkipBack className="w-4 h-4" />
              </button>

              <button
                onClick={handlePlayPause}
                className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md shadow-indigo-600/30"
                title={isPlaying ? 'Pause' : 'Play Narration'}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
              </button>

              <button
                onClick={() => {
                  if (currentSceneIndex < scenes.length - 1) handleSeekScene(currentSceneIndex + 1);
                }}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                title="Next Step / Chapter"
              >
                <SkipForward className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleSeekScene(currentSceneIndex)}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                title="Replay Current Chapter"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              <div className="font-mono text-[11px] text-slate-400 pl-1 sm:pl-2">
                <span className="text-white">{formatTime(globalElapsedSeconds)}</span>
                <span> / {formatTime(totalDurationSeconds)}</span>
              </div>
            </div>

            {/* Right Controls: Speed, Voice Settings, Volume, Captions, Fullscreen */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              
              {/* Playback Speed Multiplier */}
              <div className="flex items-center space-x-1 bg-slate-900 px-1.5 py-0.5 rounded-lg border border-slate-800 text-[10px] sm:text-[11px]">
                {[0.85, 1.0, 1.25].map((rate) => (
                  <button
                    key={rate}
                    onClick={() => setSpeechRate(rate)}
                    className={`px-1.5 py-0.5 rounded font-mono ${
                      speechRate === rate ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {rate}x
                  </button>
                ))}
              </div>

              {/* Audio & Voice Settings Popover */}
              <div className="relative">
                <button
                  onClick={() => setShowAudioSettings(!showAudioSettings)}
                  className={`p-1.5 rounded-lg hover:bg-slate-800 transition-colors ${
                    showAudioSettings ? 'text-indigo-400 bg-slate-800' : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="Voice & Speech Settings"
                >
                  <Mic className="w-4 h-4" />
                </button>

                {showAudioSettings && (
                  <div className="absolute right-0 bottom-8 w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-3 z-50 text-xs space-y-2 animate-fade-in">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <span className="font-bold text-white flex items-center space-x-1.5">
                        <Mic className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Speech & Voice Engine</span>
                      </span>
                      <button 
                        onClick={() => setShowAudioSettings(false)}
                        className="text-slate-500 hover:text-slate-300 text-[10px]"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 uppercase tracking-wider block">
                        Select Narrator Voice:
                      </label>
                      <select
                        value={selectedVoiceName}
                        onChange={(e) => setSelectedVoiceName(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
                      >
                        {availableVoices.map((v) => (
                          <option key={v.name} value={v.name}>
                            {v.name} ({v.lang})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="pt-1 text-[10px] text-slate-400 leading-tight">
                      Narration is synchronized to ensure full articulated delivery without skipping.
                    </div>
                  </div>
                )}
              </div>

              {/* Mute Toggle */}
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`p-1.5 rounded-lg hover:bg-slate-800 transition-colors ${
                  isMuted ? 'text-rose-400' : 'text-slate-300'
                }`}
                title={isMuted ? 'Unmute Audio Narration' : 'Mute Audio Narration'}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>

              {/* Captions Toggle */}
              <button
                onClick={() => setShowCaptions(!showCaptions)}
                className={`p-1.5 rounded-lg hover:bg-slate-800 transition-colors ${
                  showCaptions ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-400'
                }`}
                title="Toggle Subtitles"
              >
                <Captions className="w-4 h-4" />
              </button>

              {/* Fullscreen Toggle */}
              <button
                onClick={handleToggleFullscreen}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 transition-colors"
                title="Toggle Fullscreen Viewport"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>

            </div>

          </div>
        </div>

      </div>

      {/* Discrete Nobel-Caliber Step Breakdown Section */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-serif font-bold text-white flex items-center space-x-2">
                <span>Chapter {currentScene.sceneNumber}: Nobel Prize-Winning Steps & Theses</span>
                <span className="text-[10px] font-mono font-normal text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  Aarti S Ravikumar Paradigm
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                All 3 mathematical sub-steps for this active stage
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsNobelStepsModalOpen(true)}
              className="text-xs text-indigo-400 hover:text-indigo-300 underline font-medium"
            >
              View Full 21-Step Matrix
            </button>
            <button
              onClick={() => setShowStepsAccordion(!showStepsAccordion)}
              className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              {showStepsAccordion ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {showStepsAccordion && (
          <div className="space-y-4 animate-fade-in">
            
            {/* 3 Discrete Sub-Steps for the Current Active Scene */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {currentScene.nobelSteps?.map((step, sIdx) => (
                <div 
                  key={sIdx}
                  className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-500/40 transition-all flex flex-col justify-between space-y-2.5 group"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-indigo-400 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-500/30">
                        {step.stepNumber}
                      </span>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 opacity-70 group-hover:opacity-100" />
                    </div>
                    <h4 className="text-xs font-bold text-white mt-2">
                      {step.stepTitle}
                    </h4>
                    <div className="mt-2 text-xs text-slate-300 leading-relaxed">
                      <strong className="text-slate-400 block text-[10px] uppercase tracking-wider mb-0.5">
                        Academic Insight:
                      </strong>
                      {step.academicInsight}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 text-xs text-slate-300">
                    <strong className="text-emerald-400 block text-[10px] uppercase tracking-wider mb-0.5">
                      Implementation:
                    </strong>
                    {step.practicalImplementation}
                  </div>
                </div>
              ))}
            </div>

            {/* Current Scene Democratic Dilemma & Governance Outcome */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-rose-400 font-bold uppercase text-[10px] block mb-1">
                  Democratic Failure Solved:
                </span>
                <span className="text-slate-200">
                  {currentScene.democraticProblemSolved}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-emerald-400 font-bold uppercase text-[10px] block mb-1">
                  Governance Impact & Pareto Result:
                </span>
                <span className="text-emerald-300 font-mono">
                  {currentScene.governanceOutcome}
                </span>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* Video Chapter Playlist Navigation Bar */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-serif font-bold text-white uppercase tracking-wider">
            Video Scene Chapters & Full Curriculum
          </h3>
          <span className="text-xs text-slate-400">Click any chapter to jump directly</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {scenes.map((scene, idx) => {
            const isCurrent = idx === currentSceneIndex;
            return (
              <div
                key={scene.id}
                onClick={() => handleSeekScene(idx)}
                className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                  isCurrent
                    ? 'bg-indigo-950/40 border-indigo-500 shadow-md shadow-indigo-950 ring-1 ring-indigo-500/50'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-indigo-400">
                      CH {scene.sceneNumber} • {scene.timestamp}
                    </span>
                    {isCurrent && (
                      <span className="text-[9px] font-bold uppercase bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded">
                        Active Chapter
                      </span>
                    )}
                  </div>
                  <h4 className="text-xs font-bold text-white mt-1 line-clamp-1">
                    {scene.title.split(': ')[1] || scene.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                    {scene.subtitle}
                  </p>
                </div>

                <div className="mt-2 pt-1.5 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-500">
                  <span>{scene.durationSeconds}s duration</span>
                  <ChevronRight className="w-3 h-3 text-slate-500" />
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Screen Value Matrix Modal */}
      <ScreenValueMatrixModal
        isOpen={isMatrixModalOpen}
        onClose={() => setIsMatrixModalOpen(false)}
        onSelectScene={(idx) => handleSeekScene(idx)}
      />

      {/* Nobel Steps Modal */}
      <NobelStepsModal
        isOpen={isNobelStepsModalOpen}
        onClose={() => setIsNobelStepsModalOpen(false)}
        onSelectScene={(idx) => handleSeekScene(idx)}
        currentSceneIndex={currentSceneIndex}
      />

    </div>
  );
};
