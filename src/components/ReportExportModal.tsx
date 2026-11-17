import { useState } from "react";
import { Badge } from "./ui";
import { paretoScenario, districts, evidenceSources } from "../data/governance-data";
import { getRecommendedCompromise } from "../services/governance-engine";
import { Check, Copy, Download, FileText, X } from "lucide-react";

interface ReportExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ReportExportModal({ isOpen, onClose }: ReportExportModalProps) {
  const [copied, setCopied] = useState(false);
  const recommendation = getRecommendedCompromise();

  if (!isOpen) return null;

  const reportMarkdown = `# Civic Accord Sample Decision Report
**Bill ID:** ${paretoScenario.billId} (${paretoScenario.name})  
**Date Generated:** ${new Date().toISOString().split("T")[0]}  
**Method:** Illustrative stakeholder utility comparison

---

## Executive Summary
This report compares fictional amendments using preset group utilities and assumed risk factors. Stated group boundaries are not enforced.

### Top Recommended Compromise
- **Amendment:** ${recommendation.amendment?.title}
- **Description:** ${recommendation.amendment?.description}
- **Risk-Adjusted Score:** ${recommendation.best.riskAdjustedScore.toFixed(3)}
- **Minimum Group Utility:** ${recommendation.best.minimumFactionUtility.toFixed(3)}
- **Stakeholder Pareto Status:** ${recommendation.best.isParetoEfficient ? "Non-dominated among sample options" : "Dominated among sample options"}

---

## District Impact Profiles Evaluated
${districts.map((d) => `- **${d.name} (${d.state}):** Pop ${d.population.toLocaleString()}, Small Business Share ${(d.smallBusinessShare * 100).toFixed(0)}%, Rural Share ${(d.ruralShare * 100).toFixed(0)}%`).join("\n")}

---

## Sample Evidence Cards
${evidenceSources.map((e) => `- **[${e.publisher}]** ${e.title} (Trust Score: ${(e.trustScore * 100).toFixed(0)}%)`).join("\n")}

---
*Notice: This report is a prototype output, not an audit or a policy recommendation. Verify primary statutory sources before any real use.*
`;

  const handleCopy = () => {
    navigator.clipboard.writeText(reportMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([reportMarkdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Civic_Accord_Sample_Report_${paretoScenario.billId}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-2xl overflow-hidden animate-rise-in">
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <FileText className="text-teal-400" size={20} />
              <span className="text-xs font-bold text-teal-400 uppercase tracking-widest">
                Sample Decision Report
              </span>
            </div>
            <h2 className="text-lg font-serif font-bold text-white mb-0">
              Export Rationale & Decision Record
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Markdown Preview */}
        <div className="p-6 bg-slate-50 border-b border-slate-200 max-h-[50vh] overflow-y-auto font-mono text-xs leading-relaxed text-slate-800">
          <pre className="whitespace-pre-wrap font-sans">{reportMarkdown}</pre>
        </div>

        {/* Actions */}
        <div className="p-4 bg-white flex justify-between items-center gap-3">
          <button
            type="button"
            onClick={handleCopy}
            className="button secondary text-xs flex items-center gap-1.5"
          >
            {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
            {copied ? "Copied to Clipboard!" : "Copy Markdown"}
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="button secondary text-xs"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDownload}
              className="button primary text-xs flex items-center gap-1.5"
            >
              <Download size={14} /> Download .MD Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
