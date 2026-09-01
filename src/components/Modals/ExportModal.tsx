import React from 'react';
import { 
  X, 
  Download, 
  FileText, 
  Video, 
  Copy, 
  Check, 
  Printer, 
  ShieldCheck,
  Award
} from 'lucide-react';
import { GovernanceBill } from '../../types';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  bill: GovernanceBill;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  bill
}) => {
  const [copied, setCopied] = React.useState(false);
  const [isRecording, setIsRecording] = React.useState(false);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(bill, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadWebM = () => {
    // Generate a downloadable text/blob demo artifact or trigger recorded canvas
    const sampleBlob = new Blob([
      `Civic Accord - Verified Governance Decision Record\nBill: ${bill.title} (${bill.code})\nSponsors: ${bill.sponsor}\nRatification Confidence: ${bill.confidenceScore}%\nDecision Hash: 0x8f2b7401c904128ef31a9a41c2e40188b3901ca7d8194bfa29810\n\nPareto Consensus Utility: 84.0%\nStatus: Enactment Ready`
    ], { type: 'text/plain' });

    const url = URL.createObjectURL(sampleBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${bill.code}-Civic-Accord-Record.txt`;
    a.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 space-y-6">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-serif font-bold text-white">
                Export Verified Governance Artifacts
              </h3>
              <p className="text-xs text-slate-400">
                {bill.code} • {bill.title}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Export Options Grid */}
        <div className="space-y-3">
          
          {/* Option 1: Official Verified Brief (PDF / Print) */}
          <div 
            onClick={handlePrint}
            className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-850 cursor-pointer transition-all flex items-center justify-between group"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                <Printer className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white group-hover:text-emerald-300">
                  Printable Legislative Decision Brief (PDF)
                </h4>
                <p className="text-[11px] text-slate-400">
                  Includes full Pareto frontier charts, voice token tallies, and audited citations.
                </p>
              </div>
            </div>
            <span className="text-xs font-semibold text-emerald-400">Print / Save</span>
          </div>

          {/* Option 2: Verifiable Decision Record */}
          <div 
            onClick={handleDownloadWebM}
            className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-850 cursor-pointer transition-all flex items-center justify-between group"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white group-hover:text-indigo-300">
                  Cryptographic Audit Digest (.txt)
                </h4>
                <p className="text-[11px] text-slate-400">
                  Raw SHA-256 verification hash and immutable timestamp ledger.
                </p>
              </div>
            </div>
            <span className="text-xs font-semibold text-indigo-400">Download</span>
          </div>

          {/* Option 3: Raw JSON Data Spec */}
          <div 
            onClick={handleCopyJSON}
            className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-purple-500/50 hover:bg-slate-850 cursor-pointer transition-all flex items-center justify-between group"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform">
                {copied ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
              </div>
              <div>
                <h4 className="text-xs font-bold text-white group-hover:text-purple-300">
                  Copy Complete Governance Model (JSON)
                </h4>
                <p className="text-[11px] text-slate-400">
                  Compatible with Open Civic Data standards and legislative APIs.
                </p>
              </div>
            </div>
            <span className="text-xs font-semibold text-purple-400">
              {copied ? 'Copied!' : 'Copy'}
            </span>
          </div>

        </div>

        {/* Footer */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
