import { useState } from "react";
import { Badge, Card, Meter } from "./ui";
import { factions, paretoScenario } from "../data/governance-data";
import { computeParetoFrontierWithWeights } from "../services/governance-engine";
import { RotateCcw, Sliders, Sparkles, Trophy } from "lucide-react";

export function InteractiveParetoSimulator() {
  const [weights, setWeights] = useState<Record<string, number>>({
    "growth-caucus": 1.0,
    "equity-bloc": 1.0,
    "fiscal-guardians": 1.0,
  });

  const [selectedAmendmentId, setSelectedAmendmentId] = useState<string>(
    paretoScenario.amendments[0].id
  );

  const frontier = computeParetoFrontierWithWeights(weights);

  const bestOption = [...frontier].sort(
    (a, b) => b.riskAdjustedScore - a.riskAdjustedScore
  )[0];

  const selectedAmendment =
    paretoScenario.amendments.find((a) => a.id === selectedAmendmentId) ??
    paretoScenario.amendments[0];

  const handleWeightChange = (factionId: string, val: number) => {
    setWeights((prev) => ({ ...prev, [factionId]: val }));
  };

  const handleReset = () => {
    setWeights({
      "growth-caucus": 1.0,
      "equity-bloc": 1.0,
      "fiscal-guardians": 1.0,
    });
  };

  return (
    <Card className="pareto-simulator-card">
      <div className="section-title">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-amber-600" />
            <p className="eyebrow mb-0">Interactive Pareto Frontier</p>
          </div>
          <h2>Dynamic Weight & Compromise Simulator</h2>
        </div>
        <button
          type="button"
          onClick={handleReset}
          className="button secondary text-xs flex items-center gap-1"
        >
          <RotateCcw size={14} /> Reset Weights
        </button>
      </div>

      <p className="card-helper">
        Adjust stakeholder weights to see how changing governance priorities shifts the optimal Pareto frontier and recommended compromise amendment.
      </p>

      {/* Faction Weight Sliders */}
      <div className="control-grid mb-6 bg-slate-50 p-4 rounded-xl border border-slate-200">
        {factions.map((faction) => (
          <div key={faction.id} className="flex flex-col gap-1">
            <div className="flex justify-between text-xs font-semibold">
              <span style={{ color: faction.color }}>{faction.name}</span>
              <span>{(weights[faction.id] ?? 1.0).toFixed(1)}x Weight</span>
            </div>
            <input
              type="range"
              min="0.2"
              max="2.5"
              step="0.1"
              value={weights[faction.id] ?? 1.0}
              onChange={(e) => handleWeightChange(faction.id, parseFloat(e.target.value))}
              className="w-full cursor-pointer accent-slate-700"
            />
          </div>
        ))}
      </div>

      {/* Scatter Plot & Frontier Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Frontier Visualizer */}
        <div className="lg:col-span-2 border border-slate-200 rounded-xl p-4 bg-white shadow-xs">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Pareto Frontier Scatter (Min Support vs Total Utility)
            </span>
            <Badge tone="green">
              {frontier.filter((p) => p.isParetoEfficient).length} Efficient Points
            </Badge>
          </div>

          <div className="relative h-60 w-full bg-slate-50 rounded-lg border border-slate-200 p-4 flex flex-col justify-between">
            {/* SVG Plot */}
            <svg className="absolute inset-4 w-[calc(100%-32px)] h-[calc(100%-32px)] overflow-visible">
              {/* Grid Lines */}
              <line x1="0" y1="25%" x2="100%" y2="25%" stroke="#e2e8f0" strokeDasharray="3 3" />
              <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#e2e8f0" strokeDasharray="3 3" />
              <line x1="0" y1="75%" x2="100%" y2="75%" stroke="#e2e8f0" strokeDasharray="3 3" />

              {/* Connecting Frontier Line */}
              {frontier
                .filter((p) => p.isParetoEfficient)
                .sort((a, b) => a.minimumFactionUtility - b.minimumFactionUtility)
                .map((point, idx, arr) => {
                  if (idx === 0) return null;
                  const prev = arr[idx - 1];
                  const x1 = `${prev.minimumFactionUtility * 100}%`;
                  const y1 = `${(1 - prev.totalUtility) * 100}%`;
                  const x2 = `${point.minimumFactionUtility * 100}%`;
                  const y2 = `${(1 - point.totalUtility) * 100}%`;
                  return (
                    <line
                      key={`line-${point.amendmentId}`}
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke="#0f766e"
                      strokeWidth="2"
                    />
                  );
                })}

              {/* Data Points */}
              {frontier.map((point) => {
                const cx = `${point.minimumFactionUtility * 100}%`;
                const cy = `${(1 - point.totalUtility) * 100}%`;
                const isSelected = point.amendmentId === selectedAmendmentId;
                const isBest = point.amendmentId === bestOption.amendmentId;

                return (
                  <g key={point.amendmentId} onClick={() => setSelectedAmendmentId(point.amendmentId)} className="cursor-pointer">
                    <circle
                      cx={cx}
                      cy={cy}
                      r={isSelected ? 9 : isBest ? 7 : 5}
                      fill={point.isParetoEfficient ? "#0f766e" : "#94a3b8"}
                      stroke={isSelected ? "#1e293b" : "#ffffff"}
                      strokeWidth={isSelected ? 3 : 1.5}
                    />
                  </g>
                );
              })}
            </svg>

            {/* Axes Labels */}
            <div className="absolute top-2 left-4 text-[10px] text-slate-400 font-bold uppercase">
              High Total Utility (0.9+)
            </div>
            <div className="absolute bottom-2 right-4 text-[10px] text-slate-400 font-bold uppercase">
              High Min Support (0.9+) →
            </div>
          </div>

          {/* Point Selectors */}
          <div className="grid grid-cols-2 gap-2 mt-4">
            {frontier.map((point) => {
              const isSelected = point.amendmentId === selectedAmendmentId;
              return (
                <button
                  key={point.amendmentId}
                  type="button"
                  onClick={() => setSelectedAmendmentId(point.amendmentId)}
                  className={`text-left p-2.5 rounded-lg border text-xs transition-all ${
                    isSelected
                      ? "border-emerald-600 bg-emerald-50 text-emerald-950 font-semibold shadow-xs"
                      : "border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700"
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="truncate">{point.label}</span>
                    {point.isParetoEfficient && (
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-full font-bold">
                        Pareto
                      </span>
                    )}
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span>Score: {point.riskAdjustedScore}</span>
                    <span>Min: {point.minimumFactionUtility}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Option Inspection */}
        <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/70 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Selected Option
              </span>
              {bestOption.amendmentId === selectedAmendment.id && (
                <div className="flex items-center gap-1">
                  <Badge tone="green">
                    <span className="inline-flex items-center gap-1">
                      <Trophy size={12} /> Optimal Choice
                    </span>
                  </Badge>
                </div>
              )}
            </div>

            <h3 className="font-serif font-bold text-lg text-slate-900 mb-2">
              {selectedAmendment.title}
            </h3>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              {selectedAmendment.description}
            </p>

            {/* Utility Breakdown */}
            <div className="space-y-3 mb-4">
              <div className="text-xs font-semibold text-slate-700">Faction Support Under Current Weights:</div>
              {factions.map((f) => {
                const util = selectedAmendment.utility[f.id] ?? 0;
                return (
                  <div key={f.id} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span style={{ color: f.color }} className="font-semibold">{f.name}</span>
                      <span className="font-mono text-slate-700">{(util * 100).toFixed(0)}%</span>
                    </div>
                    <Meter value={util} color={f.color} />
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 text-xs text-slate-500 flex justify-between">
            <span>Risk Factor: {(selectedAmendment.risk * 100).toFixed(0)}%</span>
            <span>Complexity: {(selectedAmendment.implementationComplexity * 100).toFixed(0)}%</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
