import { useState } from "react";
import { Badge } from "./ui";
import { bills, evidenceSources } from "../data/governance-data";
import { FileCode, Search, ShieldCheck, X, RefreshCw, Radio } from "lucide-react";

interface LegiScanDocketSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LegiScanDocketSyncModal({ isOpen, onClose }: LegiScanDocketSyncModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBillId, setSelectedBillId] = useState(bills[0].id);
  const [isRefreshing, setIsRefreshing] = useState(false);

  if (!isOpen) return null;

  const selectedBill = bills.find((b) => b.id === selectedBillId) ?? bills[0];

  const filteredBills = bills.filter(
    (b) =>
      b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.sponsor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-5xl overflow-hidden animate-rise-in">
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Radio size={16} className="text-emerald-400 animate-pulse" />
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
                LegiScan API & State Legislative Docket Feed
              </span>
              <Badge tone="green">Sync Active</Badge>
            </div>
            <h2 className="text-xl font-serif font-bold text-white mb-0">
              Live State Legislative Corpus & Evidence Sync
            </h2>
            <p className="text-xs text-slate-300 mt-1 mb-0">
              Real-time synchronization with state legislative dockets, statutory section changes, and primary evidence sources.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleRefresh}
              className="text-slate-300 hover:text-white p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors text-xs flex items-center gap-1.5 font-medium"
            >
              <RefreshCw size={14} className={isRefreshing ? "animate-spin" : ""} /> Sync Feed
            </button>
            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Search Bar inside Modal */}
        <div className="p-4 bg-slate-50 border-b border-slate-200">
          <div className="relative">
            <Search className="absolute left-3.5 top-2.5 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search docket by bill ID, title, sponsor, or domain..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium"
            />
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 max-h-[70vh] overflow-y-auto">
          {/* Bill Docket List */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Synced Legislative Dockets ({filteredBills.length})
            </span>
            {filteredBills.map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => setSelectedBillId(b.id)}
                className={`w-full text-left p-3 rounded-xl border transition-all text-xs ${
                  b.id === selectedBillId
                    ? "border-blue-600 bg-blue-50/70 text-blue-950 font-semibold shadow-xs"
                    : "border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="font-mono text-[11px] text-blue-700 font-bold">{b.id.toUpperCase()}</span>
                  <Badge tone={b.status === "ready" ? "green" : b.status === "stalled" ? "red" : "amber"}>
                    {b.status}
                  </Badge>
                </div>
                <h4 className="font-bold text-slate-900 text-xs mb-1 line-clamp-1">{b.title}</h4>
                <p className="text-[11px] text-slate-500 line-clamp-2 mb-0">{b.summary}</p>
              </button>
            ))}
          </div>

          {/* Selected Bill Inspector */}
          <div className="lg:col-span-2 border border-slate-200 rounded-xl p-5 bg-white space-y-5">
            <div>
              <div className="flex justify-between items-start mb-2">
                <span className="font-mono text-xs font-bold text-blue-600 uppercase">
                  {selectedBill.id.toUpperCase()} · Introduced {selectedBill.introduced}
                </span>
                <span className="text-xs text-slate-500 font-medium">Sponsor: {selectedBill.sponsor}</span>
              </div>
              <h3 className="font-serif font-bold text-xl text-slate-900 mb-2">{selectedBill.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-0">{selectedBill.summary}</p>
            </div>

            {/* Statutory Sections */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                Statutory Sections Breakdown
              </h4>
              <div className="space-y-2">
                {selectedBill.sections.map((sec) => (
                  <div
                    key={sec.id}
                    className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex flex-col sm:flex-row justify-between sm:items-center gap-2"
                  >
                    <div>
                      <h5 className="font-bold text-xs text-slate-900 mb-0.5">{sec.title}</h5>
                      <p className="text-[11px] text-slate-500 mb-0">{sec.summary}</p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0 text-xs font-mono">
                      <span className="text-emerald-700 font-bold">
                        {sec.budgetDeltaMillions > 0 ? `+$${sec.budgetDeltaMillions}M` : `$${sec.budgetDeltaMillions}M`}
                      </span>
                      <Badge tone="green">{(sec.confidence * 100).toFixed(0)}% Confidence</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Linked Evidence Sources */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-teal-600" /> Linked Evidence Sources
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {selectedBill.evidenceIds.map((evId) => {
                  const ev = evidenceSources.find((s) => s.id === evId);
                  if (!ev) return null;
                  return (
                    <div key={ev.id} className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs">
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-bold text-slate-900 truncate">{ev.publisher}</span>
                        <Badge tone="violet">{(ev.trustScore * 100).toFixed(0)}% Trust</Badge>
                      </div>
                      <p className="text-[11px] text-slate-600 line-clamp-2 mb-1">"{ev.excerpt}"</p>
                      <span className="text-[10px] text-slate-400 font-mono">ID: {ev.id}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-between items-center text-xs text-slate-500">
          <span>LegiScan API Gateway v2.4 · Auto-syncing every 15 minutes</span>
          <button type="button" onClick={onClose} className="button secondary text-xs">
            Close Docket Window
          </button>
        </div>
      </div>
    </div>
  );
}
