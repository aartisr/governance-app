import React, { useState } from 'react';
import { X, Copy, Check, Download, FileText } from 'lucide-react';
import { DimensionCategory } from '../types';
import { TARGET_APP_INFO } from '../data/evaluationData';

interface ReportExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  dimensions: DimensionCategory[];
  calculatedScore: number;
}

export const ReportExportModal: React.FC<ReportExportModalProps> = ({
  isOpen,
  onClose,
  dimensions,
  calculatedScore,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const markdownReport = `# Platform Evaluation Report: Civic Accord (governanceapp.ai-aarti.com)

**Target URL:** ${TARGET_APP_INFO.url}
**Overall Rating:** ${calculatedScore.toFixed(1)} / 10 (Strong Distinction in AI Civic Decision Support)
**Evaluation Date:** ${TARGET_APP_INFO.evaluatedAt}
**Evaluator:** AI Studio Governance & Quality Audit Framework

---

## Executive Summary
${TARGET_APP_INFO.summary}

**Verdict:**
${TARGET_APP_INFO.verdict}

---

## Dimension Breakdown Scores (Scale 1-10)

${dimensions.map(d => `### ${d.title}: ${d.score.toFixed(1)} / 10
- **Weight:** ${(d.weight * 100).toFixed(0)}%
- **Summary:** ${d.summary}
${d.criteria.map(c => `  - **${c.name}** (${c.score.toFixed(1)}/10): ${c.summary}`).join('\n')}
`).join('\n')}

---

## Compliance & AI Safety Alignment
- **NIST AI RMF 1.0:** Substantial Alignment (88%)
- **EU AI Act (2024):** Substantial Alignment (84%)
- **ISO/IEC 42001:** Substantial Alignment (82%)
- **IEEE 7000 Standard:** Substantial Alignment (86%)

---

## Key Takeaways & Recommendations
1. **Pareto Compromise Optimization:** Replaces binary deadlocks with multi-objective trade-off search.
2. **Trust Architecture:** High transparency on source accuracy, expertise, and deterministic simulations.
3. **Future ERP Growth:** Connecting RESTful APIs for LegiScan or municipal legislative system dockets.
`;

  const handleCopy = () => {
    navigator.clipboard.writeText(markdownReport);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([markdownReport], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `governanceapp-ai-aarti-evaluation-${calculatedScore.toFixed(1)}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-base">Evaluation Audit Report Export</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 font-mono text-xs bg-slate-950 text-slate-200 space-y-3">
          <pre className="whitespace-pre-wrap leading-relaxed">
            {markdownReport}
          </pre>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-4">
          <span className="text-xs text-slate-500">Format: Markdown (.md)</span>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleCopy}
              className="flex items-center space-x-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Markdown'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm"
            >
              <Download className="w-4 h-4" />
              <span>Download Report</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
