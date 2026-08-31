import React, { useState } from 'react';
import { Database, RefreshCw, CheckCircle2, ArrowRight, FileText, Globe } from 'lucide-react';

export const LegiScanDocketSync: React.FC = () => {
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [dockets, setDockets] = useState([
    {
      id: 'SB-2026-402',
      title: 'Municipal Housing Density & Transit Incentive Act',
      jurisdiction: 'State Senate District 14',
      status: 'In Committee Markup',
      lastSynced: '2 mins ago',
      amendmentCount: 4,
      paretoScore: '10.0 / 10'
    },
    {
      id: 'HB-2026-118',
      title: 'Clean Urban Micro-Mobility & Microgrid Appropriations',
      jurisdiction: 'House Committee on Infrastructure',
      status: 'Passed First Reading',
      lastSynced: '10 mins ago',
      amendmentCount: 2,
      paretoScore: '9.4 / 10'
    }
  ]);

  const triggerSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setDockets(prev => [
        {
          id: 'AB-2026-905',
          title: 'Regional Housing Equity & Community Land Trust Compact',
          jurisdiction: 'State Assembly Appropriations',
          status: 'Newly Synchronized',
          lastSynced: 'Just now',
          amendmentCount: 3,
          paretoScore: '9.8 / 10'
        },
        ...prev
      ]);
    }, 800);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="inline-flex items-center space-x-2 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full text-xs font-semibold text-emerald-700">
            <Globe className="w-3.5 h-3.5 text-emerald-600" />
            <span>Live API Integration</span>
          </div>
          <h3 className="text-lg font-bold text-slate-900 mt-2">
            LegiScan State & Municipal Legislative Sync Engine
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Direct REST API connector feeding real-time legislative dockets and amendment diffs into the Pareto Governance Engine.
          </p>
        </div>

        <button
          onClick={triggerSync}
          disabled={isSyncing}
          className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2.5 rounded-lg flex items-center space-x-2 transition-all shadow-sm self-start md:self-auto disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
          <span>{isSyncing ? 'Syncing LegiScan Docket...' : 'Sync Live LegiScan Feed'}</span>
        </button>
      </div>

      <div className="space-y-3">
        {dockets.map((docket) => (
          <div key={docket.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition-all flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded">
                  {docket.id}
                </span>
                <h4 className="font-bold text-slate-900 text-sm">{docket.title}</h4>
              </div>
              <div className="flex items-center space-x-3 text-xs text-slate-500">
                <span>{docket.jurisdiction}</span>
                <span>•</span>
                <span>{docket.status}</span>
                <span>•</span>
                <span>Last Synced: {docket.lastSynced}</span>
              </div>
            </div>

            <div className="flex items-center space-x-3 self-end md:self-center">
              <span className="text-xs text-slate-600 font-medium">{docket.amendmentCount} Amendments</span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100 border border-emerald-200 px-2.5 py-1 rounded-md">
                Pareto: {docket.paretoScore}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
