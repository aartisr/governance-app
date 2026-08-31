import { useState } from "react";
import { Badge } from "./ui";
import type { Bill } from "../domain/types";
import { evidenceSources } from "../data/governance-data";
import { ArrowRight, Check, Columns, DollarSign, Layers, Scale, ShieldCheck, X } from "lucide-react";
import { Link } from "@tanstack/react-router";

interface BillComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedBills: Bill[];
  onRemoveBill: (billId: string) => void;
}

export function BillComparisonModal({
  isOpen,
  onClose,
  selectedBills,
  onRemoveBill,
}: BillComparisonModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-5xl overflow-hidden animate-rise-in">
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Columns className="text-blue-400" size={20} />
              <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">
                Legislative Side-by-Side Comparison Matrix
              </span>
            </div>
            <h2 className="text-xl font-serif font-bold text-white mb-0">
              Comparing {selectedBills.length} Selected Bills
            </h2>
            <p className="text-xs text-slate-300 mt-1 mb-0">
              Evaluate statutory scope, fiscal deltas, evidence trust, and policy trade-offs across proposals.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {selectedBills.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <p className="text-sm mb-2">No bills selected for comparison.</p>
            <p className="text-xs text-slate-400">Select at least 2 bills from the workspace to view their side-by-side matrix.</p>
          </div>
        ) : (
          <div className="p-6 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="p-3 text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-200 w-48">
                    Metric / Attribute
                  </th>
                  {selectedBills.map((bill) => (
                    <th key={bill.id} className="p-3 border-b border-slate-200 min-w-[240px]">
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <span className="font-mono text-xs font-bold text-blue-600 block">
                            {bill.id.toUpperCase()}
                          </span>
                          <h4 className="font-bold text-sm text-slate-900 line-clamp-1">{bill.title}</h4>
                        </div>
                        {selectedBills.length > 1 && (
                          <button
                            type="button"
                            onClick={() => onRemoveBill(bill.id)}
                            className="text-slate-400 hover:text-red-600 p-1"
                            title="Remove from comparison"
                          >
                            <X size={14} />
                          </button>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {/* Sponsor & Status */}
                <tr>
                  <td className="p-3 font-semibold text-slate-500 bg-slate-50/60">Status & Sponsor</td>
                  {selectedBills.map((bill) => (
                    <td key={bill.id} className="p-3">
                      <div className="flex items-center gap-2">
                        <Badge tone={bill.status === "ready" ? "green" : bill.status === "stalled" ? "red" : "amber"}>
                          {bill.status}
                        </Badge>
                        <span className="text-slate-600 font-medium">{bill.sponsor}</span>
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Policy Domain */}
                <tr>
                  <td className="p-3 font-semibold text-slate-500 bg-slate-50/60">Policy Domain</td>
                  {selectedBills.map((bill) => (
                    <td key={bill.id} className="p-3">
                      <Badge tone="violet">{bill.domain}</Badge>
                    </td>
                  ))}
                </tr>

                {/* Net Fiscal Budget Delta */}
                <tr>
                  <td className="p-3 font-semibold text-slate-500 bg-slate-50/60">Total Budget Impact</td>
                  {selectedBills.map((bill) => {
                    const netDelta = bill.sections.reduce((sum, s) => sum + s.budgetDeltaMillions, 0);
                    return (
                      <td key={bill.id} className="p-3 font-mono font-bold text-slate-900">
                        <span className={netDelta > 0 ? "text-emerald-700" : netDelta < 0 ? "text-amber-700" : "text-slate-600"}>
                          {netDelta > 0 ? `+$${netDelta}M` : `$${netDelta}M`}
                        </span>
                      </td>
                    );
                  })}
                </tr>

                {/* Statutory Sections Count */}
                <tr>
                  <td className="p-3 font-semibold text-slate-500 bg-slate-50/60">Statutory Sections</td>
                  {selectedBills.map((bill) => (
                    <td key={bill.id} className="p-3 font-mono">
                      {bill.sections.length} Clauses Enacted
                    </td>
                  ))}
                </tr>

                {/* Mean Section Confidence */}
                <tr>
                  <td className="p-3 font-semibold text-slate-500 bg-slate-50/60">Mean Section Confidence</td>
                  {selectedBills.map((bill) => {
                    const avgConf =
                      bill.sections.reduce((sum, s) => sum + s.confidence, 0) / (bill.sections.length || 1);
                    return (
                      <td key={bill.id} className="p-3">
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-slate-100 rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-teal-600 h-full rounded-full"
                              style={{ width: `${avgConf * 100}%` }}
                            />
                          </div>
                          <span className="font-mono font-semibold">{(avgConf * 100).toFixed(0)}%</span>
                        </div>
                      </td>
                    );
                  })}
                </tr>

                {/* Linked Primary Evidence */}
                <tr>
                  <td className="p-3 font-semibold text-slate-500 bg-slate-50/60">Linked Evidence Sources</td>
                  {selectedBills.map((bill) => (
                    <td key={bill.id} className="p-3">
                      <div className="space-y-1">
                        {bill.evidenceIds.map((evId) => {
                          const ev = evidenceSources.find((e) => e.id === evId);
                          if (!ev) return null;
                          return (
                            <div key={ev.id} className="text-[11px] bg-slate-50 p-1.5 rounded border border-slate-200">
                              <span className="font-bold text-slate-900">{ev.publisher}</span>
                              <span className="text-slate-500 ml-1">({(ev.trustScore * 100).toFixed(0)}% trust)</span>
                            </div>
                          );
                        })}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Key Summary */}
                <tr>
                  <td className="p-3 font-semibold text-slate-500 bg-slate-50/60">Executive Intent</td>
                  {selectedBills.map((bill) => (
                    <td key={bill.id} className="p-3 text-slate-600 text-xs leading-relaxed">
                      {bill.summary}
                    </td>
                  ))}
                </tr>

                {/* Deep-Dive Links */}
                <tr>
                  <td className="p-3 font-semibold text-slate-500 bg-slate-50/60">Actions</td>
                  {selectedBills.map((bill) => (
                    <td key={bill.id} className="p-3">
                      <Link
                        to="/bills/$billId"
                        params={{ billId: bill.id }}
                        className="button primary text-xs inline-flex items-center gap-1 w-full justify-center"
                        onClick={onClose}
                      >
                        Inspect Bill Details <ArrowRight size={13} />
                      </Link>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* Footer */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-end">
          <button type="button" onClick={onClose} className="button secondary text-xs">
            Close Comparison Matrix
          </button>
        </div>
      </div>
    </div>
  );
}
