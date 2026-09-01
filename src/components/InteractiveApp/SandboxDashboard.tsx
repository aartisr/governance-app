import React from 'react';
import { 
  FileText, 
  Users, 
  Coins, 
  ShieldCheck, 
  TrendingUp, 
  Award, 
  Layers, 
  PlayCircle,
  Download
} from 'lucide-react';
import { GovernanceBill } from '../../types';
import { OverviewView } from '../Views/OverviewView';
import { BillIntelligenceView } from '../Views/BillIntelligenceView';
import { LocalImpactView } from '../Views/LocalImpactView';
import { VoiceTokenAllocationView } from '../Views/VoiceTokenAllocationView';
import { EvidenceTrustView } from '../Views/EvidenceTrustView';
import { ParetoFrontierView } from '../Views/ParetoFrontierView';
import { AuditDecisionView } from '../Views/AuditDecisionView';

interface SandboxDashboardProps {
  activeBill: GovernanceBill;
  initialTab?: string;
  onSwitchToVideo: () => void;
  onOpenExportModal: () => void;
  onOpenVideoModal?: () => void;
}

export const SandboxDashboard: React.FC<SandboxDashboardProps> = ({
  activeBill,
  initialTab = 'overview',
  onSwitchToVideo,
  onOpenExportModal,
  onOpenVideoModal
}) => {
  const [activeTab, setActiveTab] = React.useState<string>(initialTab);

  React.useEffect(() => {
    if (initialTab) setActiveTab(initialTab);
  }, [initialTab]);

  const tabs = [
    { id: 'overview', label: 'Executive Overview', icon: Layers },
    { id: 'intelligence', label: '1. Bill Intelligence', icon: FileText },
    { id: 'impact', label: '2. District Impact', icon: Users },
    { id: 'voicetokens', label: '3. Voice Tokens', icon: Coins },
    { id: 'evidence', label: '4. Evidence & Trust', icon: ShieldCheck },
    { id: 'pareto', label: '5. Pareto Frontier', icon: TrendingUp },
    { id: 'audit', label: '6. Decision Ledger', icon: Award },
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Sandbox Header with Tabs */}
      <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-400"></span>
            <h2 className="text-base font-serif font-bold text-white">
              Civic Accord Interactive Sandbox • {activeBill.code}
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Freely interact with all parameters, voice token allocations, and Pareto compromise models.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {onOpenVideoModal && (
            <button
              onClick={onOpenVideoModal}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold transition-all shadow-md shadow-amber-500/20 hover:scale-105 active:scale-95"
            >
              <PlayCircle className="w-4 h-4 fill-slate-950 text-slate-950" />
              <span>Watch Video Walkthrough</span>
            </button>
          )}
          <button
            onClick={onOpenExportModal}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-indigo-400" />
            <span>Export Brief</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-2 border-b border-slate-800 scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800/80'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active Tab View Body */}
      <div className="pt-2">
        {activeTab === 'overview' && (
          <OverviewView 
            bill={activeBill} 
            onNavigateTab={(t) => setActiveTab(t)}
            onOpenVideoModal={onOpenVideoModal}
          />
        )}
        {activeTab === 'intelligence' && (
          <BillIntelligenceView bill={activeBill} />
        )}
        {activeTab === 'impact' && (
          <LocalImpactView bill={activeBill} />
        )}
        {activeTab === 'voicetokens' && (
          <VoiceTokenAllocationView bill={activeBill} />
        )}
        {activeTab === 'evidence' && (
          <EvidenceTrustView bill={activeBill} />
        )}
        {activeTab === 'pareto' && (
          <ParetoFrontierView bill={activeBill} />
        )}
        {activeTab === 'audit' && (
          <AuditDecisionView 
            bill={activeBill} 
            onOpenExportModal={onOpenExportModal}
          />
        )}
      </div>

    </div>
  );
};
