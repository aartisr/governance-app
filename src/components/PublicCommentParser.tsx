import React, { useState } from 'react';
import { MessageSquare, Sparkles, ShieldCheck, CheckCircle2, Search } from 'lucide-react';

export const PublicCommentParser: React.FC = () => {
  const [commentInput, setCommentInput] = useState<string>(
    "As a resident of District 4, I strongly support the transit-oriented housing compromise. The MIT urban planning study shows it will reduce traffic congestion by 18% while building 1,950 units without exceeding local noise ordinances."
  );

  const [parsedEvidence, setParsedEvidence] = useState<{
    sentiment: string;
    trustScore: number;
    extractedFacts: string[];
    district: string;
    voiceTokenWeight: number;
  } | null>({
    sentiment: 'Strong Support (+0.84)',
    trustScore: 9.6,
    extractedFacts: [
      'Cites peer-reviewed MIT Urban Planning Study',
      'Quantified 18% traffic congestion reduction estimate',
      'Validated 1,950 housing unit output',
      'Confirms local noise ordinance compliance'
    ],
    district: 'District 4 (Constituent Verified)',
    voiceTokenWeight: 8.5
  });

  const analyzeComment = () => {
    if (!commentInput.trim()) return;
    setParsedEvidence({
      sentiment: 'Positive Evidence Contribution (+0.78)',
      trustScore: 9.2,
      extractedFacts: [
        'Extracted verifiable demographic & traffic impact parameters',
        'Cross-referenced with verified local municipal code',
        'Verified constituent identity token'
      ],
      district: 'District 4',
      voiceTokenWeight: 7.8
    });
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
      <div className="border-b border-slate-100 pb-4">
        <div className="inline-flex items-center space-x-2 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full text-xs font-semibold text-indigo-700">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Town Hall NLP Parser</span>
        </div>
        <h3 className="text-lg font-bold text-slate-900 mt-2">
          Automated Public Comment Evidence & Sentiment Ingestion
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Converts raw public hearing transcripts and citizen comments into structured evidence vectors with credibility scoring.
        </p>
      </div>

      <div className="space-y-3">
        <label className="text-xs font-semibold text-slate-700">Sample Public Hearing Comment</label>
        <div className="flex flex-col sm:flex-row gap-3">
          <textarea
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            rows={3}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={analyzeComment}
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-3 rounded-xl flex items-center justify-center space-x-2 transition-all self-stretch sm:self-auto whitespace-nowrap"
          >
            <Search className="w-4 h-4" />
            <span>Extract Evidence Vector</span>
          </button>
        </div>
      </div>

      {parsedEvidence && (
        <div className="bg-slate-900 text-white rounded-xl p-4 space-y-3 border border-slate-800 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="font-bold text-white">Parsed Evidence Vector Output</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="bg-indigo-950 text-indigo-300 border border-indigo-800 px-2 py-0.5 rounded font-mono text-[11px]">
                {parsedEvidence.district}
              </span>
              <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded font-mono font-bold text-[11px]">
                Trust Score: {parsedEvidence.trustScore} / 10
              </span>
            </div>
          </div>

          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold text-slate-400">Verifiable Claims Extracted:</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {parsedEvidence.extractedFacts.map((fact, idx) => (
                <div key={idx} className="bg-slate-950 p-2 rounded border border-slate-800 flex items-center space-x-2 text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="text-slate-200">{fact}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
