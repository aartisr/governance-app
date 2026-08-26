import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Brain, GitMerge, Vote, type LucideIcon } from "lucide-react";
import { Badge, Card, Meter, PageHeader, StatCard } from "../../components/ui";
import { districts, trustParticipants } from "../../data/governance-data";
import { getGovernanceSnapshot, getRecommendedCompromise, scoreTrust } from "../../services/governance-engine";

export function CommandCenterPage() {
  const snapshot = useQuery({ queryKey: ["governance-snapshot"], queryFn: getGovernanceSnapshot });
  const recommendation = getRecommendedCompromise();
  const activeBills = snapshot.data?.bills ?? [];
  const trustAverage = trustParticipants.reduce((sum, item) => sum + scoreTrust(item), 0) / trustParticipants.length;

  return (
    <div className="page">
      <PageHeader
        eyebrow="Governance overview"
        title="Decide with evidence and local context"
        description="Review legislation, understand local impact, and compare workable compromise options from one focused workspace."
        actions={(
          <>
            <Link to="/bills" className="button secondary">Review bills</Link>
            <Link to="/compromise" className="button primary">Run Pareto engine</Link>
          </>
        )}
      />

      <section className="stat-grid">
        <StatCard label="Active bills" value={snapshot.isPending ? "…" : activeBills.length} detail="ready to review" intent="strong" />
        <StatCard label="District profiles" value={districts.length} detail="available for impact analysis" />
        <StatCard label="Trust signal" value={`${Math.round(trustAverage * 100)}%`} detail="weighted source credibility" intent="good" />
        <StatCard label="Recommended option" value={recommendation.best.riskAdjustedScore.toFixed(2)} detail={recommendation.amendment?.title} intent="warn" />
      </section>

      <section className="dashboard-grid">
        <Card className="span-2">
          <div className="section-title">
            <div>
              <p className="eyebrow">How to use this workspace</p>
              <h2>Move from bill text to an informed decision</h2>
            </div>
            <Badge tone="green">3 steps</Badge>
          </div>
          <div className="flow-grid">
            {([
              ["Review", "Start with the bill and its linked evidence.", Brain],
              ["Understand impact", "Compare local outcomes across district profiles.", Vote],
              ["Compare options", "See which compromise protects the most shared value.", GitMerge],
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
