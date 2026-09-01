import React from 'react';
import { 
  Award, 
  ShieldCheck, 
  Download, 
  FileText, 
  CheckCircle2, 
  Hash, 
  Lock, 
  Printer,
  Copy,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { GovernanceBill } from '../../types';

interface AuditDecisionViewProps {
  bill: GovernanceBill;
  highlightTargetId?: string;
  onOpenExportModal?: () => void;
}

export const AuditDecisionView: React.FC<AuditDecisionViewProps> = ({
  bill,
  highlightTargetId,
  onOpenExportModal
}) => {
  const [copiedHash, setCopiedHash] = React.useState(false);
  const auditDigest = '0x8f2b...9a41c2e40188b3901ca7';

  React.useEffect(() => {
    if (highlightTargetId === 'celebrate-enactment') {
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [highlightTargetId]);

  const copyHashToClipboard = () => {
    navigator.clipboard.writeText('0x8f2b7401c904128ef31a9a41c2e40188b3901ca7d8194bfa29810');
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2500);
  };

  return (
    <div className="space-y-6">
      
      {/* Enactment Certificate Banner */}
      <div 
        id="enactment-banner"
        className={`p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-slate-900 via-emerald-950/20 to-slate-900 border ${
          highlightTargetId === 'celebrate-enactment'
            ? 'border-emerald-400 ring-4 ring-emerald-500/20 shadow-2xl shadow-emerald-500/30'
            : 'border-slate-800'
        } relative overflow-hidden`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-mono text-xs font-bold flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Legislation Ready for Enactment</span>
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Ratification Index: 92/100
              </span>
            </div>

            <h2 className="text-xl sm:text-3xl font-serif font-bold text-white mt-2">
              Verified Governance Decision Record
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              An immutable cryptographic log synthesizing token preferences, peer-reviewed evidence audits, and the optimized Pareto compromise package.
            </p>
          </div>

          <button
            onClick={onOpenExportModal}
            className={`px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold transition-all shadow-lg shadow-emerald-600/30 hover:shadow-emerald-600/50 flex items-center space-x-2 shrink-0 ${
              highlightTargetId === 'click-export-brief' ? 'ring-2 ring-white animate-pulse' : ''
            }`}
          >
            <Download className="w-4 h-4" />
            <span>Export Verified Brief</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Cryptographic Ledger vs Executive Accord Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Cryptographic Ledger (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div 
            id="audit-ledger-card"
            className={`p-5 rounded-2xl bg-slate-900 border ${
              highlightTargetId === 'view-audit-ledger'
                ? 'border-indigo-400 ring-2 ring-indigo-500/30'
                : 'border-slate-800'
            } space-y-4`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-serif font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-1.5">
                <Hash className="w-4 h-4 text-indigo-400" />
                <span>Cryptographic Digest</span>
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                Immutable
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 break-all space-y-2">
              <div className="text-[10px] text-slate-500 uppercase">SHA-256 Decision Hash:</div>
              <div className="text-indigo-300 font-bold">{auditDigest}</div>
              <button
                onClick={copyHashToClipboard}
                className="inline-flex items-center space-x-1 text-[11px] text-slate-400 hover:text-white transition-colors"
              >
                <Copy className="w-3 h-3" />
                <span>{copiedHash ? 'Copied to Clipboard!' : 'Copy Full Hash'}</span>
              </button>
            </div>

            {/* Audit Proof Elements */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
                <span className="text-slate-400">Timestamp:</span>
                <span className="font-mono text-slate-200">{new Date().toLocaleDateString()} • Block #149,820</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
                <span className="text-slate-400">Voice Tokens Cast:</span>
                <span className="font-mono text-amber-400">148,290 Verified Tokens</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
                <span className="text-slate-400">Evidence Citations:</span>
                <span className="font-mono text-purple-400">14 Peer-Reviewed Datasets</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
                <span className="text-slate-400">Engine Algorithm:</span>
                <span className="font-mono text-cyan-400">Pareto Opt v2.4 (Deterministic)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Executive Scorecard & Key Amendments Enacted (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-base font-serif font-bold text-white">
              Enacted Policy Accord Package ({bill.code})
            </h3>

            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-emerald-900/40 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">
                    Amendment 204-A (Off-Peak Freight Toll Waiver)
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">Ratified</span>
                </div>
                <p className="text-xs text-slate-400">
                  Freight coalition utility boosted by +38% while shifting logistics to night hours, cutting peak bottleneck emissions.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-emerald-900/40 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">
                    Amendment 308-B (Accelerated Municipal Tax Credit)
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">Ratified</span>
                </div>
                <p className="text-xs text-slate-400">
                  Unlocks $620M in private battery storage co-investment to protect the power grid against brownouts.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-emerald-900/40 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">
                    Amendment 402-C (Smart Transit Mobility Dividend)
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">Ratified</span>
                </div>
                <p className="text-xs text-slate-400">
                  Zero-fare transit credits directly integrated with municipal digital IDs without bureaucratic overhead.
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>Primary Sponsor Signature: <strong className="text-white">Sen. Elena Rostova</strong></span>
              <span className="text-emerald-400 font-semibold">Civic Accord Verified ✓</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
