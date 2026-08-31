import { useState } from "react";
import { Badge, Card } from "./ui";
import { paretoScenario } from "../data/governance-data";
import { runMonteCarloSimulation, type MonteCarloResult } from "../services/governance-engine";
import { Activity, Play, RefreshCw, ShieldAlert } from "lucide-react";

export function MonteCarloRiskSimulator() {
  const [selectedAmendmentId, setSelectedAmendmentId] = useState<string>(
    paretoScenario.amendments[0].id
  );

  const selectedAmendment =
    paretoScenario.amendments.find((a) => a.id === selectedAmendmentId) ??
    paretoScenario.amendments[0];

  const [simResult, setSimResult] = useState<MonteCarloResult>(() =>
    runMonteCarloSimulation(selectedAmendment, 1000)
  );

  const [isSimulating, setIsSimulating] = useState(false);

  const handleRunSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setSimResult(runMonteCarloSimulation(selectedAmendment, 1000));
      setIsSimulating(false);
    }, 280);
  };

  const maxBinCount = Math.max(...simResult.distribution.map((d) => d.count), 1);

  return (
    <Card className="monte-carlo-simulator-card">
      <div className="section-title">
        <div>
          <div className="flex items-center gap-2">
            <Activity size={18} className="text-teal-600" />
            <p className="eyebrow mb-0">Uncertainty & Risk Modeling</p>
          </div>
          <h2>1,000-Run Monte Carlo Simulation</h2>
        </div>
        <button
          type="button"
          onClick={handleRunSimulation}
          disabled={isSimulating}
          className="button primary text-xs flex items-center gap-1.5"
        >
          {isSimulating ? (
            <RefreshCw size={14} className="animate-spin" />
          ) : (
            <Play size={14} />
          )}
          {isSimulating ? "Simulating..." : "Run 1,000 Scenarios"}
        </button>
      </div>

      <p className="card-helper">
        Models implementation shocks, macroeconomic volatility, and district adoption rates across 1,000 stochastic iterations to generate probabilistic percentile distributions.
      </p>

      {/* Select Amendment to Simulate */}
      <div className="flex items-center gap-3 mb-6 bg-slate-50 p-3 rounded-lg border border-slate-200">
        <label className="text-xs font-semibold text-slate-700 whitespace-nowrap">
          Target Amendment:
        </label>
        <select
          value={selectedAmendmentId}
          onChange={(e) => {
            setSelectedAmendmentId(e.target.value);
            const target = paretoScenario.amendments.find((a) => a.id === e.target.value);
            if (target) setSimResult(runMonteCarloSimulation(target, 1000));
          }}
          className="text-xs bg-white border border-slate-300 rounded-md p-2 w-full max-w-md font-medium text-slate-900"
        >
          {paretoScenario.amendments.map((a) => (
            <option key={a.id} value={a.id}>
              {a.title} (Risk: {(a.risk * 100).toFixed(0)}%, Complexity: {(a.implementationComplexity * 100).toFixed(0)}%)
            </option>
          ))}
        </select>
      </div>

      {/* Stats Line */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-center">
          <span className="text-[11px] font-bold text-slate-500 uppercase">P10 (Pessimistic)</span>
          <p className="text-lg font-bold font-mono text-amber-700 mt-0.5 mb-0">
            {(simResult.p10 * 100).toFixed(1)}%
          </p>
        </div>
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-center">
          <span className="text-[11px] font-bold text-emerald-800 uppercase">P50 (Expected)</span>
          <p className="text-lg font-bold font-mono text-emerald-900 mt-0.5 mb-0">
            {(simResult.p50 * 100).toFixed(1)}%
          </p>
        </div>
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-center">
          <span className="text-[11px] font-bold text-slate-500 uppercase">P90 (Optimistic)</span>
          <p className="text-lg font-bold font-mono text-teal-700 mt-0.5 mb-0">
            {(simResult.p90 * 100).toFixed(1)}%
          </p>
        </div>
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-center">
          <span className="text-[11px] font-bold text-slate-500 uppercase">Volatility (StdDev)</span>
          <p className="text-lg font-bold font-mono text-slate-800 mt-0.5 mb-0">
            {(simResult.stdDev * 100).toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Frequency Distribution Chart */}
      <div className="border border-slate-200 rounded-xl p-4 bg-white">
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Outcome Frequency Histogram (1,000 Runs)
          </span>
          <Badge tone="violet">Normal Distribution Fit</Badge>
        </div>

        <div className="h-44 w-full flex items-end gap-1.5 pt-4 pb-2 px-2 bg-slate-50 rounded-lg border border-slate-200">
          {simResult.distribution.map((d, idx) => {
            const heightPct = Math.max(6, (d.count / maxBinCount) * 100);
            const isP50Bin =
              simResult.p50 >= d.min && simResult.p50 <= d.max;

            return (
              <div
                key={idx}
                className="flex-1 flex flex-col items-center h-full justify-end group relative"
              >
                {/* Tooltip */}
                <div className="absolute -top-9 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] py-1 px-2 rounded whitespace-nowrap z-10 pointer-events-none">
                  {d.count} runs ({((d.count / 1000) * 100).toFixed(1)}%)
                </div>

                <div
                  style={{ height: `${heightPct}%` }}
                  className={`w-full rounded-t transition-all duration-300 ${
                    isP50Bin
                      ? "bg-emerald-600 shadow-xs"
                      : "bg-teal-500/70 hover:bg-teal-600"
                  }`}
                />
                <span className="text-[9px] font-mono text-slate-500 mt-1 truncate w-full text-center">
                  {d.min.toFixed(1)}
                </span>
              </div>
            );
          })}
        </div>
        <div className="flex justify-between items-center mt-2 text-[11px] text-slate-500 px-1">
          <span>0.0 (Policy Failure)</span>
          <span>1.0 (Optimal Delivery)</span>
        </div>
      </div>
    </Card>
  );
}
