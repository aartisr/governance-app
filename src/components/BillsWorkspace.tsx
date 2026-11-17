import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Badge, Card } from "./ui";
import { BillComparisonModal } from "./BillComparisonModal";
import type { Bill } from "../domain/types";
import { evidenceSources, paretoScenario } from "../data/governance-data";
import {
  ArrowRight,
  Check,
  Columns,
  FileCode,
  Filter,
  LayoutGrid,
  RotateCcw,
  Search,
  ShieldCheck,
  Table as TableIcon,
  X,
  SlidersHorizontal,
} from "lucide-react";

interface BillsWorkspaceProps {
  bills: Bill[];
}

const domainLabels: Record<string, string> = {
  infrastructure: "Infrastructure",
  health: "Public Health",
  tax: "Tax & Fiscal",
  "civil-rights": "Civil Rights",
  climate: "Climate",
  education: "Education",
  security: "Security",
};

export function BillsWorkspace({ bills }: BillsWorkspaceProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDomain, setSelectedDomain] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [activePreset, setActivePreset] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"split" | "table">("split");
  const [activeBillId, setActiveBillId] = useState<string>(bills[0]?.id ?? "");
  const [comparedBillIds, setComparedBillIds] = useState<string[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  // Compute domain counts for navigation tabs
  const domainCounts = useMemo(() => {
    const counts: Record<string, number> = { all: bills.length };
    bills.forEach((b) => {
      counts[b.domain] = (counts[b.domain] || 0) + 1;
    });
    return counts;
  }, [bills]);

  // Filter logic
  const filteredBills = useMemo(() => {
    return bills.filter((bill) => {
      // Search term
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesTitle = bill.title.toLowerCase().includes(query);
        const matchesId = bill.id.toLowerCase().includes(query);
        const matchesSponsor = bill.sponsor.toLowerCase().includes(query);
        const matchesSummary = bill.summary.toLowerCase().includes(query);
        const matchesDomain = bill.domain.toLowerCase().includes(query);
        const matchesSection = bill.sections.some((section) => `${section.title} ${section.summary}`.toLowerCase().includes(query));
        if (!matchesTitle && !matchesId && !matchesSponsor && !matchesSummary && !matchesDomain && !matchesSection) {
          return false;
        }
      }

      // Domain filter
      if (selectedDomain !== "all" && bill.domain !== selectedDomain) {
        return false;
      }

      // Status filter
      if (selectedStatus !== "all" && bill.status !== selectedStatus) {
        return false;
      }

      // Presets
      if (activePreset === "high-impact") {
        const netBudget = bill.sections.reduce((s, sec) => s + Math.abs(sec.budgetDeltaMillions), 0);
        if (netBudget < 200) return false;
      } else if (activePreset === "high-confidence") {
        const avgConf = bill.sections.reduce((s, sec) => s + sec.confidence, 0) / (bill.sections.length || 1);
        if (avgConf < 0.85) return false;
      } else if (activePreset === "needs-compromise") {
        if (bill.status !== "stalled" && bill.status !== "negotiating") return false;
      }

      return true;
    });
  }, [bills, searchTerm, selectedDomain, selectedStatus, activePreset]);

  // Selected Bill for Inspector
  const activeBill = useMemo(() => {
    return filteredBills.find((b) => b.id === activeBillId) ?? filteredBills[0];
  }, [activeBillId, filteredBills]);

  const toggleCompare = (billId: string) => {
    setComparedBillIds((prev) =>
      prev.includes(billId) ? prev.filter((id) => id !== billId) : [...prev, billId].slice(0, 3)
    );
  };

  const comparedBills = useMemo(() => {
    return bills.filter((b) => comparedBillIds.includes(b.id));
  }, [bills, comparedBillIds]);

  const isFilterActive =
    searchTerm.trim() !== "" ||
    selectedDomain !== "all" ||
    selectedStatus !== "all" ||
    activePreset !== "all";

  const clearAllFilters = () => {
    setSearchTerm("");
    setSelectedDomain("all");
    setSelectedStatus("all");
    setActivePreset("all");
  };

  return (
    <div className="space-y-6">
      <div className="bill-discovery bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="bill-discovery-heading"><div><p className="eyebrow">Find a proposal</p><h2>Choose a bill to inspect</h2></div><span>{filteredBills.length} of {bills.length} sample bills</span></div>
        {/* Row 1: Prominent Search Input */}
        <div className="relative">
          <Search className="absolute left-4 top-3.5 text-slate-400" size={18} />
          <input
            type="search"
            aria-label="Search sample bills"
            placeholder="Search sample bills by title, ID, sponsor, or section"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-20 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all font-medium"
          />
          <div className="absolute right-3 top-3 flex items-center gap-1.5">
            {searchTerm ? (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
                title="Clear search"
                aria-label="Clear search"
              >
                <X size={16} />
              </button>
            ) : null}
          </div>
        </div>

        {/* Row 2: Policy Domain Navigation Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none border-b border-slate-100 text-xs">
          {[
            { id: "all", label: "All areas" },
            ...Object.keys(domainCounts).filter((id) => id !== "all").map((id) => ({ id, label: domainLabels[id] ?? id })),
          ].map((domain) => {
            const count = domainCounts[domain.id] || 0;
            const isSelected = selectedDomain === domain.id;
            return (
              <button
                key={domain.id}
                data-tour={`domain-${domain.id}`}
                type="button"
                aria-pressed={isSelected}
                onClick={() => setSelectedDomain(domain.id)}
                className={`px-3 py-2 rounded-lg font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-slate-900 text-white shadow-xs font-semibold"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <span>{domain.label}</span>
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                    isSelected ? "bg-slate-700 text-white" : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Row 3: Filter Controls & Tools Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-1">
          <details className="bill-advanced-filters">
            <summary>More filters{selectedStatus !== "all" || activePreset !== "all" ? " · Active" : ""}</summary>
            <div className="bill-filter-fields">
            {/* Status Dropdown */}
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5">
              <Filter size={13} className="text-slate-400" />
              <span className="text-slate-500 font-medium text-[11px]">Status:</span>
              <select
                aria-label="Filter bills by status"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="bg-transparent text-slate-900 font-semibold text-xs focus:outline-none cursor-pointer"
              >
                <option value="all">All Statuses</option>
                {[...new Set(bills.map((bill) => bill.status))].map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
            </div>

            {/* Sample-data filter */}
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5">
              <SlidersHorizontal size={13} className="text-slate-400" />
              <span className="text-slate-500 font-medium text-[11px]">Quick Filter:</span>
              <select
                aria-label="Quick filter sample bills"
                value={activePreset}
                onChange={(e) => setActivePreset(e.target.value)}
                className="bg-transparent text-slate-900 font-semibold text-xs focus:outline-none cursor-pointer"
              >
                <option value="all">All Proposals</option>
                <option value="high-impact">Large budget change ($200M+)</option>
                <option value="high-confidence">High assumed score (85%+)</option>
                <option value="needs-compromise">Needs Compromise</option>
              </select>
            </div>
            </div>
          </details>

          <div className="flex items-center gap-2 ml-auto">
            {/* View Mode Segmented Control */}
            <div className="flex items-center gap-0.5 bg-slate-100 p-1 rounded-lg border border-slate-200">
              <button
                type="button"
                aria-pressed={viewMode === "split"}
                onClick={() => setViewMode("split")}
                className={`px-3 py-1 rounded-md text-xs font-medium flex items-center gap-1.5 transition-all ${
                  viewMode === "split"
                    ? "bg-white text-blue-950 shadow-xs font-semibold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
                title="Split Inspector View"
              >
                <LayoutGrid size={13} /> Split View
              </button>
              <button
                type="button"
                aria-pressed={viewMode === "table"}
                onClick={() => setViewMode("table")}
                className={`px-3 py-1 rounded-md text-xs font-medium flex items-center gap-1.5 transition-all ${
                  viewMode === "table"
                    ? "bg-white text-blue-950 shadow-xs font-semibold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
                title="Table view"
              >
                <TableIcon size={13} /> Table
              </button>
            </div>
          </div>
        </div>

        {/* Row 4: Active Filter Tags & Count Summary (Only visible when filters are applied) */}
        {isFilterActive && (
          <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100 text-xs animate-fade-in">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
                Active Filters:
              </span>

              {searchTerm.trim() !== "" && (
                <span className="bg-blue-50 text-blue-800 border border-blue-200 px-2 py-0.5 rounded-full font-medium text-[11px] flex items-center gap-1">
                  Query: "{searchTerm}"
                  <button type="button" aria-label="Remove search filter" onClick={() => setSearchTerm("")} className="hover:text-blue-950">
                    <X size={12} />
                  </button>
                </span>
              )}

              {selectedDomain !== "all" && (
                <span className="bg-indigo-50 text-indigo-800 border border-indigo-200 px-2 py-0.5 rounded-full font-medium text-[11px] flex items-center gap-1">
                  Domain: {selectedDomain.toUpperCase()}
                  <button type="button" aria-label="Remove policy area filter" onClick={() => setSelectedDomain("all")} className="hover:text-indigo-950">
                    <X size={12} />
                  </button>
                </span>
              )}

              {selectedStatus !== "all" && (
                <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full font-medium text-[11px] flex items-center gap-1">
                  Status: {selectedStatus.toUpperCase()}
                  <button type="button" aria-label="Remove status filter" onClick={() => setSelectedStatus("all")} className="hover:text-emerald-950">
                    <X size={12} />
                  </button>
                </span>
              )}

              {activePreset !== "all" && (
                <span className="bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded-full font-medium text-[11px] flex items-center gap-1">
                  Preset: {activePreset}
                  <button type="button" aria-label="Remove quick filter" onClick={() => setActivePreset("all")} className="hover:text-amber-950">
                    <X size={12} />
                  </button>
                </span>
              )}

              <button
                type="button"
                onClick={clearAllFilters}
                className="text-[11px] text-slate-500 hover:text-slate-900 underline font-medium ml-1 flex items-center gap-1"
              >
                <RotateCcw size={11} /> Reset all filters
              </button>
            </div>

            <span className="text-[11px] text-slate-500 font-mono">
              Showing {filteredBills.length} of {bills.length} bills
            </span>
          </div>
        )}
      </div>

      {/* Main Workspace View */}
      {filteredBills.length === 0 ? (
        <Card className="p-12 text-center text-slate-500 bg-white border border-slate-200 rounded-2xl">
          <FileCode size={36} className="mx-auto text-slate-300 mb-3" />
          <h3 className="font-serif font-bold text-slate-800 text-base mb-1">No sample bills match your search</h3>
          <p className="text-xs text-slate-500 mb-4">Try clearing your search query or selecting a different policy domain filter.</p>
          <button
            type="button"
            onClick={clearAllFilters}
            className="button secondary text-xs"
          >
            Clear All Filters
          </button>
        </Card>
      ) : viewMode === "split" && activeBill ? (
        /* Split Inspector Workspace Layout */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Bill Cards List */}
          <div className="lg:col-span-5 space-y-3">
            {filteredBills.map((bill) => {
              const isActive = bill.id === activeBill.id;
              const isCompared = comparedBillIds.includes(bill.id);
              const netBudget = bill.sections.reduce((s, sec) => s + sec.budgetDeltaMillions, 0);

              return (
                <article
                  key={bill.id}
                  className={`bill-choice-card rounded-xl border transition-all relative group ${
                    isActive
                      ? "bg-white border-blue-600 ring-2 ring-blue-600/20 shadow-md"
                      : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs"
                  }`}
                >
                  <button type="button" data-tour={`bill-${bill.id}`} onClick={() => setActiveBillId(bill.id)} aria-pressed={isActive} aria-label={`Inspect ${bill.title}`} className="bill-choice-main">
                    <span className="bill-choice-tags"><span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">{bill.id.toUpperCase()}</span><Badge tone={bill.status === "ready" ? "green" : bill.status === "stalled" ? "red" : "amber"}>{bill.status}</Badge></span>
                    <span className="bill-choice-title">{bill.title}</span>
                    <span className="bill-choice-summary">{bill.summary}</span>
                    <span className="bill-choice-footer"><span>Sponsor: {bill.sponsor}</span><strong>{netBudget > 0 ? `+$${netBudget}M` : `$${netBudget}M`}</strong></span>
                  </button>
                  <button type="button" onClick={() => toggleCompare(bill.id)} aria-pressed={isCompared} aria-label={`${isCompared ? "Remove" : "Add"} ${bill.title} ${isCompared ? "from" : "to"} comparison`} className={`bill-compare-toggle ${isCompared ? "is-compared" : ""}`}>
                    {isCompared ? <Check size={14} /> : <Columns size={14} />}{isCompared ? "Comparing" : "Compare"}
                  </button>
                </article>
              );
            })}
          </div>

          {/* Right Column: Selected Bill Inspector Pane */}
          <div className="lg:col-span-7 sticky top-4">
            <Card className="p-6 bg-white border border-slate-200 shadow-sm rounded-2xl space-y-6" data-tour="bill-inspector">
              {/* Header */}
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex flex-wrap items-center gap-2 min-w-0">
                    <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md">
                      {activeBill.id.toUpperCase()}
                    </span>
                    <Badge tone="violet">{activeBill.domain.toUpperCase()}</Badge>
                    <Badge tone={activeBill.status === "ready" ? "green" : activeBill.status === "stalled" ? "red" : "amber"}>
                      {activeBill.status}
                    </Badge>
                  </div>
                  <span className="text-xs text-slate-500 font-mono">Introduced: {activeBill.introduced}</span>
                </div>

                <h2 className="font-serif font-bold text-2xl text-slate-900 mb-2">
                  {activeBill.title}
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed mb-3">{activeBill.summary}</p>
                <div className="text-xs text-slate-600 flex flex-wrap items-center gap-2">
                  <span><strong>Sponsor:</strong> {activeBill.sponsor}</span>
                  <span>·</span>
                  <span><strong>Sample sections:</strong> {activeBill.sections.length}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <Link
                  to="/bills/$billId"
                  params={{ billId: activeBill.id }}
                  data-tour="read-selected-bill"
                  className="button primary text-xs flex items-center gap-1.5"
                >
                  Read bill <ArrowRight size={14} />
                </Link>
                <Link
                  to="/impact"
                  search={{ billId: activeBill.id }}
                  className="button secondary text-xs flex items-center gap-1.5"
                >
                  See District Impact
                </Link>
                {activeBill.id === paretoScenario.billId && <Link
                  to="/compromise"
                  className="button secondary text-xs flex items-center gap-1.5"
                >
                  Compare HR-104 compromises
                </Link>}
              </div>

              {/* Statutory Clauses Heatmap */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center justify-between">
                  <span>Sample Sections & Assumed Budget Changes</span>
                  <span className="text-[11px] font-mono text-slate-400">
                    Net: +${activeBill.sections.reduce((s, sec) => s + sec.budgetDeltaMillions, 0)}M
                  </span>
                </h4>

                <div className="space-y-3">
                  {activeBill.sections.map((sec) => (
                    <div
                      key={sec.id}
                      className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2 hover:border-slate-300 transition-all"
                    >
                      <div className="flex justify-between items-start gap-2">
                        <h5 className="font-bold text-xs text-slate-900 mb-0">{sec.title}</h5>
                        <span className="font-mono text-xs font-bold text-emerald-700 shrink-0">
                          {sec.budgetDeltaMillions > 0 ? `+$${sec.budgetDeltaMillions}M` : `$${sec.budgetDeltaMillions}M`}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 mb-0 leading-relaxed">{sec.summary}</p>
                      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-200/60">
                        <span>{sec.affectedPopulationPercent}% base exposure input</span>
                        <Badge tone="green">{(sec.confidence * 100).toFixed(0)}% assumed score</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Linked Evidence Sources */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                  <ShieldCheck size={15} className="text-teal-600" /> Sample Evidence Cards
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {activeBill.evidenceIds.map((evId) => {
                    const ev = evidenceSources.find((s) => s.id === evId);
                    if (!ev) return null;
                    return (
                      <div key={ev.id} className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-slate-900">{ev.publisher}</span>
                          <Badge tone="violet">Sample excerpt</Badge>
                        </div>
                        <p className="text-[11px] text-slate-600 line-clamp-2 italic">"{ev.excerpt}"</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Card>
          </div>
        </div>
      ) : (
        /* Structured Data Table Mode */
        <Card className="p-4 bg-white border border-slate-200 shadow-xs rounded-2xl overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <th className="p-3 w-10 text-center">Compare</th>
                <th className="p-3">Bill ID</th>
                <th className="p-3">Title</th>
                <th className="p-3">Sponsor</th>
                <th className="p-3">Domain</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Budget Delta</th>
                <th className="p-3 text-right">Clauses</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {filteredBills.map((bill) => {
                const isCompared = comparedBillIds.includes(bill.id);
                const netBudget = bill.sections.reduce((s, sec) => s + sec.budgetDeltaMillions, 0);

                return (
                  <tr key={bill.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3 text-center">
                      <input
                        type="checkbox"
                        checked={isCompared}
                        onChange={() => toggleCompare(bill.id)}
                        className="rounded border-slate-300 accent-blue-600 cursor-pointer"
                      />
                    </td>
                    <td className="p-3 font-mono font-bold text-blue-700">{bill.id.toUpperCase()}</td>
                    <td className="p-3 font-semibold text-slate-900 max-w-xs truncate">{bill.title}</td>
                    <td className="p-3 text-slate-600">{bill.sponsor}</td>
                    <td className="p-3">
                      <Badge tone="violet">{bill.domain}</Badge>
                    </td>
                    <td className="p-3">
                      <Badge tone={bill.status === "ready" ? "green" : bill.status === "stalled" ? "red" : "amber"}>
                        {bill.status}
                      </Badge>
                    </td>
                    <td className={`p-3 font-mono text-right font-bold ${netBudget > 0 ? "text-emerald-700" : "text-slate-700"}`}>
                      {netBudget > 0 ? `+$${netBudget}M` : `$${netBudget}M`}
                    </td>
                    <td className="p-3 font-mono text-right">{bill.sections.length}</td>
                    <td className="p-3 text-center">
                      <Link
                        to="/bills/$billId"
                        params={{ billId: bill.id }}
                        className="text-xs text-blue-700 font-semibold hover:underline inline-flex items-center gap-1"
                      >
                        Inspect <ArrowRight size={12} />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      )}

      {/* Floating Comparison Action Bar */}
      {comparedBillIds.length > 0 && (
        <div className="bills-compare-bar fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-slate-900 text-white rounded-2xl p-4 shadow-2xl border border-slate-700 flex items-center gap-4 animate-rise-in max-w-xl w-full">
          <div className="flex items-center gap-2">
            <Columns className="text-blue-400" size={20} />
            <div>
              <span className="text-xs font-bold text-white block">
                {comparedBillIds.length < 2 ? "Choose one more bill to compare" : `${comparedBillIds.length} bills selected`}
              </span>
              <span className="text-[11px] text-slate-300">
                {comparedBills.map((b) => b.id.toUpperCase()).join(", ")}
              </span>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              onClick={() => setComparedBillIds([])}
              className="text-xs text-slate-400 hover:text-white px-2 py-1"
            >
              Clear
            </button>
            {comparedBillIds.length >= 2 && <button
              type="button"
              onClick={() => setIsCompareModalOpen(true)}
              className="button primary text-xs flex items-center gap-1 px-4 py-2"
            >
              Compare bills <ArrowRight size={14} />
            </button>}
          </div>
        </div>
      )}

      {/* Comparison Modal */}
      <BillComparisonModal
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        selectedBills={comparedBills}
        onRemoveBill={(id) => setComparedBillIds((prev) => prev.filter((item) => item !== id))}
      />

    </div>
  );
}
