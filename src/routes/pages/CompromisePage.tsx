import { CheckCircle2, SlidersHorizontal } from "lucide-react";
import { Badge, Card, Meter, PageHeader } from "../../components/ui";
import { factions, paretoScenario } from "../../data/governance-data";
import { computeParetoFrontier, getRecommendedCompromise } from "../../services/governance-engine";

export function CompromisePage() {
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
