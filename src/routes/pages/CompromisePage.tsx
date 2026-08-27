import { CheckCircle2, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { Badge, Card, Meter, PageHeader } from "../../components/ui";
import { factions, paretoScenario } from "../../data/governance-data";
import { computeParetoFrontier, getRecommendedCompromise } from "../../services/governance-engine";

export function CompromisePage() {
  const frontier = computeParetoFrontier();
  const recommendation = getRecommendedCompromise();
  const [selectedAmendmentId, setSelectedAmendmentId] = useState(recommendation.amendment?.id ?? paretoScenario.amendments[0].id);
  const selectedAmendment = paretoScenario.amendments.find((amendment) => amendment.id === selectedAmendmentId) ?? paretoScenario.amendments[0];

  return (
    <div className="page">
      <PageHeader
        eyebrow="Balanced compromise options"
        title={paretoScenario.name}
        description="Compare amendments by shared benefit, minimum stakeholder support, and delivery risk to find options that hold up across groups."
      />

      <section className="dashboard-grid">
        <Card className="span-2">
          <div className="section-title">
            <h2>Frontier map</h2>
            <Badge tone="green">{frontier.filter((point) => point.isParetoEfficient).length} strongest options</Badge>
          </div>
          <p className="card-helper">Green options deliver the strongest combined outcome. Higher is better: shared benefit reflects overall value, minimum support shows whether any group is left behind, and the final score accounts for delivery risk.</p>
          <div className="frontier">
            {frontier.map((point) => (
              <article key={point.amendmentId} className={point.isParetoEfficient ? "frontier-point efficient" : "frontier-point subdued"}>
                {point.isParetoEfficient ? <Badge tone="green">Strong option</Badge> : null}
                <strong>{point.label}</strong>
                <Meter value={point.totalUtility} label="Shared benefit" />
                <Meter value={point.minimumFactionUtility} label="Minimum support" color="#7c3aed" />
                <Meter value={point.riskAdjustedScore} label="Risk-adjusted score" color="#0f766e" />
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
          <div><h2>How one option serves each group</h2><p>Choose an amendment to compare the outcome across stakeholder groups.</p></div>
          <SlidersHorizontal size={20} />
        </div>
        <label className="matrix-selector">
          Amendment
          <select value={selectedAmendmentId} onChange={(event) => setSelectedAmendmentId(event.target.value)}>
            {paretoScenario.amendments.map((amendment) => <option key={amendment.id} value={amendment.id}>{amendment.title}</option>)}
          </select>
        </label>
        <div className="matrix">
          <article>
            <strong>{selectedAmendment.title}</strong>
            {factions.map((faction) => (
              <div key={faction.id} className="matrix-row">
                <span>{faction.name}</span>
                <Meter value={selectedAmendment.utility[faction.id]} color={faction.color} />
              </div>
            ))}
          </article>
        </div>
      </Card>
    </div>
  );
}
