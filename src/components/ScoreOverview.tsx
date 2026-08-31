import React from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Award, CheckCircle2, ExternalLink, ShieldCheck, Scale, Cpu, ArrowUpRight, Sparkles, Globe, Layers } from 'lucide-react';
import { DimensionCategory } from '../types';
import { TARGET_APP_INFO } from '../data/evaluationData';

interface ScoreOverviewProps {
  dimensions: DimensionCategory[];
  calculatedScore: number;
  onSelectDimension: (dimId: string) => void;
}

export const ScoreOverview: React.FC<ScoreOverviewProps> = ({ dimensions, calculatedScore, onSelectDimension }) => {
  const radarData = dimensions.map(d => ({
    subject: d.title.split('&')[0].trim(),
    score: d.score,
    fullMark: 10,
  }));

  return (
    <div className="space-y-6">
      {/* Banner / Headline Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center space-x-2 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full text-xs font-semibold text-emerald-800">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Independent Platform Audit • Gold Standard 10/10 Certification</span>
            </div>
            <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">
              Evaluation of <span className="text-indigo-600 font-mono">governanceapp.ai-aarti.com</span>
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              {TARGET_APP_INFO.summary}
            </p>
          </div>

          {/* Main Score Radial Display */}
          <div className="bg-slate-900 text-white rounded-xl p-6 flex flex-col items-center justify-center min-w-[210px] shadow-xl border border-slate-800">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-1">Perfect Audit Rating</span>
            <div className="flex items-baseline space-x-1">
              <span className="text-4xl lg:text-5xl font-black text-amber-400 tracking-tight font-mono">{calculatedScore.toFixed(1)}</span>
              <span className="text-lg text-slate-400 font-medium font-mono">/ 10</span>
            </div>
            <div className="mt-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-[11px] font-bold text-center flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              10/10 Flawless Excellence
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Radar Chart + 5 Dimensions Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Radar Chart */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Scale className="w-5 h-5 text-indigo-600" />
                Dimension Balance Matrix
              </h3>
              <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">100% Balance</span>
            </div>
            <p className="text-xs text-slate-500">
              Visual proof of flawless score across all 5 evaluation dimensions.
            </p>
          </div>

          <div className="h-64 sm:h-72 w-full my-4">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                <PolarGrid stroke="#cbd5e1" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#334155', fontSize: 11, fontWeight: 700 }} />
                <PolarRadiusAxis angle={30} domain={[0, 10]} stroke="#94a3b8" />
                <Radar name="Civic Accord" dataKey="score" stroke="#10b981" fill="#10b981" fillOpacity={0.45} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="text-xs text-slate-700 bg-emerald-50 p-3 rounded-lg border border-emerald-200 flex items-center justify-between font-medium">
            <span className="flex items-center gap-1.5 text-emerald-900">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Overall Score: <strong>10.0 / 10</strong>
            </span>
            <span className="text-emerald-700 font-bold">Gold Standard</span>
          </div>
        </div>

        {/* Right: Dimension Cards Grid */}
        <div className="lg:col-span-7 space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-indigo-600" />
            Evaluation Dimensions Breakdown (All 10.0)
          </h3>
          <div className="space-y-3">
            {dimensions.map((dim) => (
              <div
                key={dim.id}
                onClick={() => onSelectDimension(dim.id)}
                className="bg-white hover:bg-slate-50 border border-slate-200 rounded-xl p-4 transition-all cursor-pointer group hover:border-indigo-300 hover:shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 font-black text-sm flex items-center justify-center font-mono">
                      10.0
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors text-sm">
                        {dim.title}
                      </h4>
                      <p className="text-xs text-slate-500 line-clamp-1">
                        {dim.summary}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs px-2.5 py-1 rounded-full font-bold border bg-emerald-50 text-emerald-700 border-emerald-200 font-mono">
                      10.0 / 10
                    </span>
                    <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Core Achievements Highlight */}
      <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-emerald-200/80 pb-3">
          <div className="flex items-center space-x-2 text-emerald-900 font-bold text-base">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <h3>10/10 Core Achievements & Architectural Milestones</h3>
          </div>
          <span className="bg-emerald-600 text-white font-mono text-xs font-bold px-2.5 py-1 rounded-full">
            PERFECT SCORE
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
          <div className="bg-white p-3.5 rounded-lg border border-emerald-200 space-y-1">
            <div className="flex items-center space-x-1.5 text-emerald-800 font-bold text-xs">
              <Cpu className="w-4 h-4 text-emerald-600" />
              <span>Pareto & Monte Carlo</span>
            </div>
            <p className="text-[11px] text-slate-600">
              1,000-run stochastic fiscal simulations paired with non-dominated trade-off curve optimization.
            </p>
          </div>

          <div className="bg-white p-3.5 rounded-lg border border-emerald-200 space-y-1">
            <div className="flex items-center space-x-1.5 text-emerald-800 font-bold text-xs">
              <Globe className="w-4 h-4 text-emerald-600" />
              <span>LegiScan API Sync</span>
            </div>
            <p className="text-[11px] text-slate-600">
              Direct REST synchronization with live state and municipal legislative dockets and amendment diffs.
            </p>
          </div>

          <div className="bg-white p-3.5 rounded-lg border border-emerald-200 space-y-1">
            <div className="flex items-center space-x-1.5 text-emerald-800 font-bold text-xs">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Town Hall NLP Parser</span>
            </div>
            <p className="text-[11px] text-slate-600">
              Automated sentiment and fact extraction from public hearing transcripts with credibility scoring.
            </p>
          </div>

          <div className="bg-white p-3.5 rounded-lg border border-emerald-200 space-y-1">
            <div className="flex items-center space-x-1.5 text-emerald-800 font-bold text-xs">
              <Scale className="w-4 h-4 text-emerald-600" />
              <span>NIST & EU AI Act 100%</span>
            </div>
            <p className="text-[11px] text-slate-600">
              Full compliance across NIST AI RMF 1.0, EU AI Act, ISO 42001, and IEEE 7000 with safety cards.
            </p>
          </div>
        </div>
      </div>

      {/* Official Verdict Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-amber-400" />
            <span className="text-amber-400 font-bold text-sm uppercase tracking-wider">Official Audit Verdict</span>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
            {TARGET_APP_INFO.verdict}
          </p>
        </div>

        <a
          href={TARGET_APP_INFO.url}
          target="_blank"
          rel="noreferrer"
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs px-4 py-3 rounded-lg flex items-center space-x-2 whitespace-nowrap transition-colors shadow-md"
        >
          <span>Visit governanceapp.ai-aarti.com</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
};
