import React from 'react';
import { X, Play, Award, Layers, SlidersHorizontal, ArrowRight, ExternalLink } from 'lucide-react';
import { VideoScene, GovernanceBill, SubtitleItem } from '../../types';
import { VideoPlayer } from '../VideoPlayer/VideoPlayer';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  scenes: VideoScene[];
  subtitles: SubtitleItem[];
  activeBill: GovernanceBill;
  onSwitchToSandbox: (tab?: string) => void;
  onOpenExportModal: () => void;
}

export const VideoModal: React.FC<VideoModalProps> = ({
  isOpen,
  onClose,
  scenes,
  subtitles,
  activeBill,
  onSwitchToSandbox,
  onOpenExportModal
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/90 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-7xl max-h-[96vh] bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Modal Top Floating Header */}
        <div className="p-4 bg-gradient-to-r from-slate-950 via-indigo-950/80 to-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Play className="w-4 h-4 fill-indigo-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300">
                  Interactive Video Walkthrough
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {activeBill.code}
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-serif font-bold text-white mt-0.5">
                Civic Accord: Evidence-Based Governance Walkthrough
              </h3>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                onClose();
                onSwitchToSandbox('overview');
              }}
              className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-semibold transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Back to Sandbox</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              title="Close Video Popup"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Video Player Container */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-6 bg-slate-950/60">
          <VideoPlayer
            scenes={scenes}
            subtitles={subtitles}
            activeBill={activeBill}
            onSwitchToSandbox={(tab) => {
              onClose();
              onSwitchToSandbox(tab);
            }}
            onOpenExportModal={onOpenExportModal}
          />
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Civic Accord • Created by Aarti S Ravikumar (ai-aarti.com)</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
          >
            Close Walkthrough
          </button>
        </div>

      </div>
    </div>
  );
};
