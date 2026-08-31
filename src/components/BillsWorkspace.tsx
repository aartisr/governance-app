import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Badge, Card } from "./ui";
import { BillComparisonModal } from "./BillComparisonModal";
import { LegiScanDocketSyncModal } from "./LegiScanDocketSyncModal";
import type { Bill } from "../domain/types";
import { evidenceSources } from "../data/governance-data";
import {
  ArrowRight,
  Check,
  Columns,
  DollarSign,
  FileCode,
  Filter,
  Layers,
  LayoutGrid,
  Radio,
  RotateCcw,
  Search,
  ShieldCheck,
  Sparkles,
  Table as TableIcon,
  X,
  SlidersHorizontal,
} from "lucide-react";

interface BillsWorkspaceProps {
  bills: Bill[];
}

export function BillsWorkspace({ bills }: BillsWorkspaceProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDomain, setSelectedDomain] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [activePreset, setActivePreset] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"split" | "table">("split");
  const [activeBillId, setActiveBillId] = useState<string>(bills[0]?.id ?? "");
  const [comparedBillIds, setComparedBillIds] = useState<string[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [isLegiScanModalOpen, setIsLegiScanModalOpen] = useState(false);

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
        if (!matchesTitle && !matchesId && !matchesSponsor && !matchesSummary && !matchesDomain) {
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
    return bills.find((b) => b.id === activeBillId) ?? filteredBills[0] ?? bills[0];
  }, [bills, activeBillId, filteredBills]);

  // High-level workspace KPIs
  const totalNetBudget = useMemo(() => {
    return bills.reduce(
      (sum, b) => sum + b.sections.reduce((s, sec) => s + sec.budgetDeltaMillions, 0),
      0
    );
  }, [bills]);

  const avgConfidence = useMemo(() => {
    let totalConf = 0;
    let totalSecs = 0;
    bills.forEach((b) => {
      b.sections.forEach((sec) => {
        totalConf += sec.confidence;
        totalSecs += 1;
      });
    });
    return totalSecs > 0 ? totalConf / totalSecs : 0;
  }, [bills]);

  const uniqueDomainsCount = useMemo(() => {
    return new Set(bills.map((b) => b.domain)).size;
  }, [bills]);

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
      {/* Executive KPI Summary Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Active Legislative Corpus
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-serif font-bold text-slate-900">{bills.length}</span>
            <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
              {bills.filter((b) => b.status === "ready").length} Ready
            </span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Indexed legislative bills</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Net Fiscal Budget Delta
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-serif font-bold text-emerald-900">
              +${totalNetBudget}M
            </span>
            <DollarSign size={16} className="text-emerald-600" />
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Across all statutory clauses</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Mean Source Provenance
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-serif font-bold text-teal-900">
              {(avgConfidence * 100).toFixed(0)}%
            </span>
            <ShieldCheck size={16} className="text-teal-600" />
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Audited evidence confidence</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Policy Domain Coverage
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-serif font-bold text-indigo-900">
              {uniqueDomainsCount}
            </span>
            <Layers size={16} className="text-indigo-600" />
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Infrastructure, Health, Tax, AI</span>
        </div>
      </div>

      {/* ULTRA-MODERN DISCOVERY & FILTER SUITE */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
        {/* Row 1: Prominent Search Input */}
        <div className="relative">
          <Search className="absolute left-4 top-3.5 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search legislative bills by title, bill number, sponsor, or statutory clause..."
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
              >
                <X size={16} />
              </button>
            ) : (
              <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono font-semibold text-slate-400 bg-slate-200/60 rounded border border-slate-300">
                /
              </kbd>
            )}
          </div>
        </div>

        {/* Row 2: Policy Domain Navigation Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none border-b border-slate-100 text-xs">
          {[
            { id: "all", label: "All Policy Domains" },
            { id: "infrastructure", label: "Infrastructure" },
            { id: "health", label: "Public Health" },
            { id: "tax", label: "Tax & Fiscal" },
            { id: "climate", label: "Climate & Energy" },
            { id: "security", label: "Security & Tech" },
            { id: "civil-rights", label: "Civil Rights" },
          ].map((domain) => {
            const count = domainCounts[domain.id] || 0;
            const isSelected = selectedDomain === domain.id;
            return (
              <button
                key={domain.id}
                type="button"
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
          <div className="flex flex-wrap items-center gap-2">
            {/* Status Dropdown */}
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5">
              <Filter size={13} className="text-slate-400" />
              <span className="text-slate-500 font-medium text-[11px]">Status:</span>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="bg-transparent text-slate-900 font-semibold text-xs focus:outline-none cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="ready">Ready (3)</option>
                <option value="negotiating">Negotiating (1)</option>
                <option value="stalled">Stalled (1)</option>
                <option value="committee">Committee (0)</option>
              </select>
            </div>

            {/* Impact Preset Dropdown */}
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5">
              <SlidersHorizontal size={13} className="text-slate-400" />
              <span className="text-slate-500 font-medium text-[11px]">Quick Filter:</span>
              <select
                value={activePreset}
                onChange={(e) => setActivePreset(e.target.value)}
                className="bg-transparent text-slate-900 font-semibold text-xs focus:outline-none cursor-pointer"
              >
                <option value="all">All Proposals</option>
                <option value="high-impact">High Impact ($200M+)</option>
                <option value="high-confidence">High Confidence (85%+)</option>
                <option value="needs-compromise">Needs Compromise</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            {/* LegiScan API Sync Modal Trigger */}
            <button
              type="button"
              onClick={() => setIsLegiScanModalOpen(true)}
              className="bg-emerald-50 text-emerald-900 hover:bg-emerald-100 border border-emerald-200 rounded-lg px-3 py-1.5 font-semibold text-xs flex items-center gap-1.5 transition-colors"
            >
              <Radio size={13} className="text-emerald-600 animate-pulse" /> LegiScan Live Feed
            </button>

            {/* View Mode Segmented Control */}
            <div className="flex items-center gap-0.5 bg-slate-100 p-1 rounded-lg border border-slate-200">
              <button
                type="button"
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
                onClick={() => setViewMode("table")}
                className={`px-3 py-1 rounded-md text-xs font-medium flex items-center gap-1.5 transition-all ${
                  viewMode === "table"
                    ? "bg-white text-blue-950 shadow-xs font-semibold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
                title="Corpus Table View"
              >
                <TableIcon size={13} /> Corpus Table
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
                  <button type="button" onClick={() => setSearchTerm("")} className="hover:text-blue-950">
                    <X size={12} />
                  </button>
                </span>
              )}

              {selectedDomain !== "all" && (
                <span className="bg-indigo-50 text-indigo-800 border border-indigo-200 px-2 py-0.5 rounded-full font-medium text-[11px] flex items-center gap-1">
                  Domain: {selectedDomain.toUpperCase()}
                  <button type="button" onClick={() => setSelectedDomain("all")} className="hover:text-indigo-950">
                    <X size={12} />
                  </button>
                </span>
              )}

              {selectedStatus !== "all" && (
                <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full font-medium text-[11px] flex items-center gap-1">
                  Status: {selectedStatus.toUpperCase()}
                  <button type="button" onClick={() => setSelectedStatus("all")} className="hover:text-emerald-950">
                    <X size={12} />
                  </button>
                </span>
              )}

              {activePreset !== "all" && (
                <span className="bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded-full font-medium text-[11px] flex items-center gap-1">
                  Preset: {activePreset}
                  <button type="button" onClick={() => setActivePreset("all")} className="hover:text-amber-950">
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
          <h3 className="font-serif font-bold text-slate-800 text-base mb-1">No legislative bills match your search</h3>
          <p className="text-xs text-slate-500 mb-4">Try clearing your search query or selecting a different policy domain filter.</p>
          <button
            type="button"
            onClick={clearAllFilters}
            className="button secondary text-xs"
          >
            Clear All Filters
          </button>
        </Card>
      ) : viewMode === "split" ? (
        /* Split Inspector Workspace Layout */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Bill Cards List */}
          <div className="lg:col-span-5 space-y-3">
            {filteredBills.map((bill) => {
              const isActive = bill.id === activeBill.id;
              const isCompared = comparedBillIds.includes(bill.id);
              const netBudget = bill.sections.reduce((s, sec) => s + sec.budgetDeltaMillions, 0);

              return (
                <div
                  key={bill.id}
                  onClick={() => setActiveBillId(bill.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer relative group ${
                    isActive
                      ? "bg-white border-blue-600 ring-2 ring-blue-600/20 shadow-md"
                      : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                        {bill.id.toUpperCase()}
                      </span>
                      <Badge tone={bill.status === "ready" ? "green" : bill.status === "stalled" ? "red" : "amber"}>
                        {bill.status}
                      </Badge>
                    </div>

                    {/* Compare Checkbox */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleCompare(bill.id);
                      }}
                      className={`text-[11px] font-semibold flex items-center gap-1 px-2 py-0.5 rounded transition-all ${
                        isCompared
                          ? "bg-blue-600 text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {isCompared ? <Check size={12} /> : <Columns size={12} />}
                      {isCompared ? "Comparing" : "Compare"}
                    </button>
                  </div>

                  <h3 className="font-serif font-bold text-slate-900 text-sm mb-1 line-clamp-2">
                    {bill.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mb-3 leading-relaxed">
                    {bill.summary}
                  </p>

                  <div className="flex items-center justify-between text-[11px] pt-2 border-t border-slate-100 text-slate-500">
                    <span>Sponsor: {bill.sponsor}</span>
                    <span className={`font-mono font-bold ${netBudget > 0 ? "text-emerald-700" : "text-slate-700"}`}>
                      {netBudget > 0 ? `+$${netBudget}M` : `$${netBudget}M`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Selected Bill Inspector Pane */}
          <div className="lg:col-span-7 sticky top-4">
            <Card className="p-6 bg-white border border-slate-200 shadow-sm rounded-2xl space-y-6">
              {/* Header */}
              <div>
                <div className="flex items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md">
                      {activeBill.id.toUpperCase()}
                    </span>
                    <Badge tone="violet">{activeBill.domain.toUpperCase()}</Badge>
                    <Badge tone={activeBill.status === "ready" ? "green" : activeBill.status === "stalled" ? "red" : "amber"}>
                      {activeBill.status}
                    </Badge>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">Introduced: {activeBill.introduced}</span>
                </div>

                <h2 className="font-serif font-bold text-2xl text-slate-900 mb-2">
                  {activeBill.title}
                </h2>
                <div className="text-xs text-slate-600 flex items-center gap-3">
                  <span><strong>Sponsor:</strong> {activeBill.sponsor}</span>
                  <span>·</span>
                  <span><strong>Statutory Clauses:</strong> {activeBill.sections.length}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <Link
                  to="/bills/$billId"
                  params={{ billId: activeBill.id }}
                  className="button primary text-xs flex items-center gap-1.5"
                >
                  Inspect Full Detail Page <ArrowRight size={14} />
                </Link>
                <Link
                  to="/impact"
                  className="button secondary text-xs flex items-center gap-1.5"
                >
                  See District Impact
                </Link>
                <Link
                  to="/compromise"
                  className="button secondary text-xs flex items-center gap-1.5"
                >
                  Model Pareto Compromise
                </Link>
              </div>

              {/* Executive Plain-English Brief */}
              <div className="bg-blue-50/60 border border-blue-200 rounded-xl p-4 text-blue-950 text-xs leading-relaxed space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-blue-900 text-xs mb-1">
                  <Sparkles size={15} className="text-blue-700" /> Executive Plain-English Summary
                </div>
                <p>{activeBill.summary}</p>
              </div>

              {/* Statutory Clauses Heatmap */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center justify-between">
                  <span>Statutory Clauses & Impact Deltas</span>
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
                        <span>{sec.affectedPopulationPercent}% local population affected</span>
                        <Badge tone="green">{(sec.confidence * 100).toFixed(0)}% Confidence</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Linked Evidence Sources */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                  <ShieldCheck size={15} className="text-teal-600" /> Linked Primary Sources
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {activeBill.evidenceIds.map((evId) => {
                    const ev = evidenceSources.find((s) => s.id === evId);
                    if (!ev) return null;
                    return (
                      <div key={ev.id} className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-slate-900">{ev.publisher}</span>
                          <Badge tone="violet">{(ev.trustScore * 100).toFixed(0)}% Trust</Badge>
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
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-slate-900 text-white rounded-2xl p-4 shadow-2xl border border-slate-700 flex items-center gap-4 animate-rise-in max-w-xl w-full">
          <div className="flex items-center gap-2">
            <Columns className="text-blue-400" size={20} />
            <div>
              <span className="text-xs font-bold text-white block">
                {comparedBillIds.length} Bill{comparedBillIds.length > 1 ? "s" : ""} Selected for Comparison
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
            <button
              type="button"
              onClick={() => setIsCompareModalOpen(true)}
              className="button primary text-xs flex items-center gap-1 px-4 py-2"
            >
              Compare Matrix <ArrowRight size={14} />
            </button>
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

      {/* LegiScan API Sync Modal */}
      <LegiScanDocketSyncModal
        isOpen={isLegiScanModalOpen}
        onClose={() => setIsLegiScanModalOpen(false)}
      />
    </div>
  );
}
