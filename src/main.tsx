import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { createRootRoute, createRoute, createRouter, Link, RouterProvider } from "@tanstack/react-router";
import { StrictMode, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { Brain, CheckCircle2, GitMerge, Network, SlidersHorizontal, Vote, type LucideIcon } from "lucide-react";
import { AppShell } from "./components/AppShell";
import { BillTable } from "./components/BillTable";
import { EvidenceList } from "./components/EvidenceList";
import { Badge, Card, EmptyState, Meter, PageHeader, StatCard } from "./components/ui";
import { districts, evidenceSources, factions, paretoScenario, trustParticipants } from "./data/governance-data";
import type { Faction, VoiceAllocation } from "./domain/types";
import {
  calculateQuadraticCost,
  computeParetoFrontier,
  getBill,
  getEvidenceForBill,
  getGovernanceSnapshot,
  getLocalizedImpacts,
  getRecommendedCompromise,
  listBills,
  scoreTrust,
  summarizeVoiceBudget,
} from "./services/governance-engine";
import "./styles.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      gcTime: 5 * 60_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const rootRoute = createRootRoute({ component: AppShell });

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: CommandCenter,
});

const billsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/bills",
  component: BillsPage,
});

const billDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/bills/$billId",
  component: BillDetailPage,
});

const feedbackRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/feedback",
  component: FeedbackPage,
});

const impactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/impact",
  component: ImpactPage,
});

const compromiseRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/compromise",
  component: CompromisePage,
});

const trustRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/trust",
  component: TrustPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  billsRoute,
  billDetailRoute,
  feedbackRoute,
  impactRoute,
  compromiseRoute,
  trustRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

function CommandCenter() {
  const snapshot = useQuery({ queryKey: ["governance-snapshot"], queryFn: getGovernanceSnapshot });
  const recommendation = getRecommendedCompromise();
  const activeBills = snapshot.data?.bills ?? [];
  const trustAverage = trustParticipants.reduce((sum, item) => sum + scoreTrust(item), 0) / trustParticipants.length;

  return (
    <div className="page">
      <PageHeader
        eyebrow="Pareto Legislative Engine"
        title="Computational governance command center"
        description="A neutral workspace that converts public preference intensity, evidence quality, localized policy impact, and factional boundaries into measurable legislative options."
        actions={(
          <>
            <Link to="/bills" className="button secondary">Review bills</Link>
            <Link to="/compromise" className="button primary">Run Pareto engine</Link>
          </>
        )}
      />

      <section className="stat-grid">
        <StatCard label="Active bills" value={activeBills.length || "—"} detail="multi-tenant policy corpus" intent="strong" />
        <StatCard label="District models" value={districts.length} detail="localized impact overlays" />
        <StatCard label="Trust network" value={`${Math.round(trustAverage * 100)}%`} detail="weighted credibility" intent="good" />
        <StatCard label="Best compromise" value={recommendation.best.riskAdjustedScore.toFixed(2)} detail={recommendation.amendment?.title} intent="warn" />
      </section>

      <section className="dashboard-grid">
        <Card className="span-2">
          <div className="section-title">
            <div>
              <p className="eyebrow">Closed-loop architecture</p>
              <h2>From sentiment to governed optimization</h2>
            </div>
            <Badge tone="green">Resilient</Badge>
          </div>
          <div className="flow-grid">
            {([
              ["Preference", "Quadratic feedback reveals intensity, not only direction.", Vote],
              ["Evidence", "RAG-style source grounding removes rhetoric and exposes assumptions.", Brain],
              ["Trust", "Adaptive Trust Networks weight credibility by accuracy and consistency.", Network],
              ["Optimization", "Pareto search identifies amendments that improve utility without violating boundaries.", GitMerge],
            ] satisfies Array<[string, string, LucideIcon]>).map(([title, body, IconComponent]) => {
              return (
                <article key={title} className="flow-card">
                  <IconComponent size={20} />
                  <strong>{title}</strong>
                  <p>{body}</p>
                </article>
              );
            })}
          </div>
        </Card>

        <Card>
          <p className="eyebrow">Recommended action</p>
          <h2>{recommendation.amendment?.title}</h2>
          <p>{recommendation.amendment?.description}</p>
          <div className="stack">
            <Meter value={recommendation.best.totalUtility} label="Total utility" />
            <Meter value={recommendation.best.minimumFactionUtility} label="Minimum faction utility" color="#7c3aed" />
            <Meter value={recommendation.best.riskAdjustedScore} label="Risk-adjusted score" color="#0f766e" />
          </div>
        </Card>
      </section>
    </div>
  );
}

function BillsPage() {
  const billsQuery = useQuery({ queryKey: ["bills"], queryFn: listBills });

  if (billsQuery.isError) {
    return <EmptyState title="Bills unavailable" description="The bill corpus could not be loaded. Retry or connect another data provider." />;
  }

  return (
    <div className="page">
      <PageHeader
        eyebrow="Legislative intelligence"
        title="Bill corpus"
        description="A generic, sortable, filterable table powered by TanStack Table. Swap the mock service for live Congress, statehouse, or organizational governance data."
      />
      <Card>
        {billsQuery.data ? <BillTable bills={billsQuery.data} /> : <div className="skeleton">Loading bill corpus…</div>}
      </Card>
    </div>
  );
}

function BillDetailPage() {
  const { billId } = billDetailRoute.useParams();
  const billQuery = useQuery({ queryKey: ["bill", billId], queryFn: () => getBill(billId) });
  const bill = billQuery.data;

  if (!bill) {
    return <EmptyState title="Loading bill" description="Retrieving the selected legislative record." />;
  }

  const evidence = getEvidenceForBill(bill);

  return (
    <div className="page">
      <PageHeader
        eyebrow={bill.id.toUpperCase()}
        title={bill.title}
        description={bill.summary}
        actions={<Link to="/impact" className="button primary">Simulate local impact</Link>}
      />

      <section className="dashboard-grid">
        <Card className="span-2">
          <div className="section-title">
            <h2>Section intelligence</h2>
            <Badge tone="violet">{bill.status}</Badge>
          </div>
          <div className="section-list">
            {bill.sections.map((section) => (
              <article key={section.id} className="section-row">
                <div>
                  <strong>{section.title}</strong>
                  <p>{section.summary}</p>
                </div>
                <div className="section-metrics">
                  <Badge>{section.domain}</Badge>
                  <span>{section.affectedPopulationPercent}% exposed</span>
                  <span>${section.budgetDeltaMillions}M</span>
                </div>
              </article>
            ))}
          </div>
        </Card>

        <Card>
          <h2>Neutral summary</h2>
          <p>
            Political claims are separated from bill text, budget assumptions, public testimony, and expert review. The interface keeps evidence visible beside every generated interpretation.
          </p>
          <div className="stack">
            <Meter value={0.84} label="Rhetoric removal confidence" />
            <Meter value={0.79} label="Evidence coverage" color="#0f766e" />
            <Meter value={0.72} label="Downstream model readiness" color="#b45309" />
          </div>
        </Card>
      </section>

      <Card>
        <div className="section-title">
          <h2>Evidence memory</h2>
          <Badge tone="green">Virtualized</Badge>
        </div>
        <EvidenceList evidence={evidence.length ? evidence : evidenceSources} />
      </Card>
    </div>
  );
}

function FeedbackPage() {
  const [selectedFactionId, setSelectedFactionId] = useState(factions[0].id);
  const selectedFaction = factions.find((faction) => faction.id === selectedFactionId) ?? factions[0];
  const [allocations, setAllocations] = useState<VoiceAllocation[]>(selectedFaction.tokenAllocations);
  const budget = summarizeVoiceBudget(allocations, 50);

  function switchFaction(faction: Faction) {
    setSelectedFactionId(faction.id);
    setAllocations(faction.tokenAllocations);
  }

  return (
    <div className="page">
      <PageHeader
        eyebrow="Quadratic constituent feedback"
        title="Voice-token allocation"
        description="Citizens spend scarce weekly voice tokens. Votes cost votes squared, forcing factions to reveal intensity and prioritize what truly matters."
      />

      <section className="dashboard-grid">
        <Card>
          <h2>Faction lens</h2>
          <div className="segmented">
            {factions.map((faction) => (
              <button key={faction.id} className={faction.id === selectedFactionId ? "active" : ""} onClick={() => switchFaction(faction)}>
                {faction.name}
              </button>
            ))}
          </div>
          <div className="boundary-box">
            <strong>Hard boundaries</strong>
            {selectedFaction.hardBoundaries.map((boundary) => <span key={boundary}>{boundary}</span>)}
          </div>
        </Card>

        <Card className="span-2">
          <div className="section-title">
            <div>
              <h2>Weekly budget</h2>
              <p>{budget.spent} spent from 50 voice tokens</p>
            </div>
            <Badge tone={budget.overBudget ? "red" : "green"}>{budget.remaining} remaining</Badge>
          </div>
          <div className="allocation-list">
            {allocations.map((allocation, index) => (
              <label key={allocation.issueId} className="allocation-row">
                <div>
                  <strong>{allocation.label}</strong>
                  <span>{allocation.sentiment} · cost {calculateQuadraticCost(allocation.votes)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="7"
                  value={allocation.votes}
                  onChange={(event) => {
                    const votes = Number(event.target.value);
                    setAllocations((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, votes } : item));
                  }}
                />
                <b>{allocation.votes}</b>
              </label>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
}

function ImpactPage() {
  const [billId, setBillId] = useState("hr-104");
  const [districtId, setDistrictId] = useState("ca-12");
  const billsQuery = useQuery({ queryKey: ["bills"], queryFn: listBills });
  const bill = billsQuery.data?.find((item) => item.id === billId);
  const district = districts.find((item) => item.id === districtId) ?? districts[0];
  const impacts = bill ? getLocalizedImpacts(bill, district) : [];

  return (
    <div className="page">
      <PageHeader
        eyebrow="Multi-tenant RAG and impact mapping"
        title="Localized downstream impact"
        description="Select any bill and district profile to see section-level estimates grounded in evidence, demographic context, and budget assumptions."
      />

      <Card>
        <div className="control-grid">
          <label>
            Bill
            <select value={billId} onChange={(event) => setBillId(event.target.value)}>
              {(billsQuery.data ?? []).map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}
            </select>
          </label>
          <label>
            District
            <select value={districtId} onChange={(event) => setDistrictId(event.target.value)}>
              {districts.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
            </select>
          </label>
        </div>
      </Card>

      <section className="impact-grid">
        {impacts.map((impact) => (
          <Card key={impact.sectionId}>
            <div className="section-title">
              <h2>{impact.label}</h2>
              <Badge tone="green">{Math.round(impact.confidence * 100)}%</Badge>
            </div>
            <strong className="impact-number">{impact.delta}{impact.unit.replace("% exposed population equivalent", "%")}</strong>
            <p>{impact.explanation}</p>
          </Card>
        ))}
      </section>
    </div>
  );
}

function CompromisePage() {
  const frontier = computeParetoFrontier();
  const recommendation = getRecommendedCompromise();

  return (
    <div className="page">
      <PageHeader
        eyebrow="Pareto-efficient compromise engine"
        title={paretoScenario.name}
        description="A deterministic simulation workbench that evaluates amendments against utility, minimum faction satisfaction, risk, and implementation complexity."
      />

      <section className="dashboard-grid">
        <Card className="span-2">
          <div className="section-title">
            <h2>Frontier map</h2>
            <Badge tone="green">{frontier.filter((point) => point.isParetoEfficient).length} efficient</Badge>
          </div>
          <div className="frontier">
            {frontier.map((point) => (
              <article key={point.amendmentId} className={point.isParetoEfficient ? "frontier-point efficient" : "frontier-point"}>
                <strong>{point.label}</strong>
                <Meter value={point.totalUtility} label="total utility" />
                <Meter value={point.minimumFactionUtility} label="floor utility" color="#7c3aed" />
                <Meter value={point.riskAdjustedScore} label="risk adjusted" color="#0f766e" />
              </article>
            ))}
          </div>
        </Card>

        <Card>
          <p className="eyebrow">Recommended compromise</p>
          <h2>{recommendation.amendment?.title}</h2>
          <p>{recommendation.amendment?.description}</p>
          <div className="recommendation-score">
            <CheckCircle2 size={28} />
            <strong>{recommendation.best.riskAdjustedScore.toFixed(3)}</strong>
            <span>risk-adjusted score</span>
          </div>
        </Card>
      </section>

      <Card>
        <div className="section-title">
          <h2>Faction utility matrix</h2>
          <SlidersHorizontal size={20} />
        </div>
        <div className="matrix">
          {paretoScenario.amendments.map((amendment) => (
            <article key={amendment.id}>
              <strong>{amendment.title}</strong>
              {factions.map((faction) => (
                <div key={faction.id} className="matrix-row">
                  <span>{faction.name}</span>
                  <Meter value={amendment.utility[faction.id]} color={faction.color} />
                </div>
              ))}
            </article>
          ))}
        </div>
      </Card>
    </div>
  );
}

function TrustPage() {
  const ranked = useMemo(() => [...trustParticipants].sort((a, b) => scoreTrust(b) - scoreTrust(a)), []);

  return (
    <div className="page">
      <PageHeader
        eyebrow="Adaptive Trust Networks"
        title="Credibility-weighted governance"
        description="Trust scores combine accuracy, expertise, consistency, and transparency so public decisions can incorporate reliable knowledge without silencing constituents."
      />

      <section className="trust-grid">
        {ranked.map((participant) => {
          const trust = scoreTrust(participant);
          return (
            <Card key={participant.id}>
              <div className="section-title">
                <div>
                  <h2>{participant.name}</h2>
                  <Badge>{participant.role}</Badge>
                </div>
                <strong>{Math.round(trust * 100)}</strong>
              </div>
              <div className="stack">
                <Meter value={participant.accuracy} label="Accuracy" />
                <Meter value={participant.expertise} label="Expertise" color="#7c3aed" />
                <Meter value={participant.consistency} label="Consistency" color="#0f766e" />
                <Meter value={participant.transparency} label="Transparency" color="#b45309" />
              </div>
            </Card>
          );
        })}
      </section>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>,
);
