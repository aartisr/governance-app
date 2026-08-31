import { useState } from "react";
import { Badge, Card } from "./ui";
import { publicComments, districts, type PublicComment } from "../data/governance-data";
import { MessageSquare, Filter, Quote, ThumbsUp, AlertTriangle } from "lucide-react";

export function PublicCommentParser() {
  const [selectedSentiment, setSelectedSentiment] = useState<string>("all");
  const [selectedTheme, setSelectedTheme] = useState<string>("all");

  const filtered = publicComments.filter((c) => {
    if (selectedSentiment !== "all" && c.sentiment !== selectedSentiment) return false;
    if (selectedTheme !== "all" && c.theme !== selectedTheme) return false;
    return true;
  });

  return (
    <Card className="public-comment-card">
      <div className="section-title">
        <div>
          <div className="flex items-center gap-2">
            <MessageSquare size={18} className="text-indigo-600" />
            <p className="eyebrow mb-0">Constituent Intelligence</p>
          </div>
          <h2>Town Hall & Testimony Parser</h2>
        </div>
        <Badge tone="violet">{publicComments.length} Audited Submissions</Badge>
      </div>

      <p className="card-helper">
        Real-time constituent commentary extracted from public hearings and digital feedback portals, weighted by source credibility and local relevance.
      </p>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6 bg-slate-50 p-3 rounded-xl border border-slate-200">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
          <Filter size={14} /> Filter Testimony:
        </div>

        <select
          value={selectedSentiment}
          onChange={(e) => setSelectedSentiment(e.target.value)}
          className="text-xs bg-white border border-slate-300 rounded-lg p-2 font-medium"
        >
          <option value="all">All Sentiments</option>
          <option value="support">Support</option>
          <option value="condition">Conditional Support</option>
          <option value="oppose">Oppose</option>
        </select>

        <select
          value={selectedTheme}
          onChange={(e) => setSelectedTheme(e.target.value)}
          className="text-xs bg-white border border-slate-300 rounded-lg p-2 font-medium"
        >
          <option value="all">All Priority Themes</option>
          <option value="Small Business">Small Business</option>
          <option value="Travel Time">Travel Time</option>
          <option value="Oversight">Oversight</option>
          <option value="Budget">Budget</option>
          <option value="Equity">Equity</option>
        </select>
      </div>

      {/* List of Comments */}
      <div className="space-y-3">
        {filtered.map((c) => {
          const district = districts.find((d) => d.id === c.districtId);
          return (
            <div
              key={c.id}
              className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all shadow-xs"
            >
              <div className="flex justify-between items-start gap-3 mb-2">
                <div>
                  <h4 className="font-semibold text-sm text-slate-900 mb-0.5">{c.author}</h4>
                  <span className="text-xs text-slate-500">
                    {c.role} {district && `· ${district.name}`}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-semibold">
                    {c.theme}
                  </span>
                  <Badge
                    tone={
                      c.sentiment === "support"
                        ? "green"
                        : c.sentiment === "condition"
                        ? "amber"
                        : "red"
                    }
                  >
                    {c.sentiment}
                  </Badge>
                </div>
              </div>

              <div className="flex gap-2 text-slate-700 text-xs italic bg-slate-50 p-3 rounded-lg border border-slate-100">
                <Quote size={14} className="text-slate-400 shrink-0 mt-0.5" />
                <span>"{c.quote}"</span>
              </div>

              <div className="mt-2 text-[11px] text-slate-400 flex justify-between items-center">
                <span>Verification Weight: {(c.trustWeight * 100).toFixed(0)}%</span>
                <span className="font-mono">Record #{c.id}</span>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
