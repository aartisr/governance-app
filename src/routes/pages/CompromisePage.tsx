import { Badge, Meter, PageHeader } from "../../components/ui";
import { Link } from "@tanstack/react-router";
import { InteractiveParetoSimulator } from "../../components/InteractiveParetoSimulator";
import { MonteCarloRiskSimulator } from "../../components/MonteCarloRiskSimulator";
import { bills, paretoScenario } from "../../data/governance-data";
import { computeParetoFrontier } from "../../services/governance-engine";

export function CompromisePage() {
  const frontier = computeParetoFrontier();
  const bill = bills.find((item) => item.id === paretoScenario.billId);

  return (
    <div className="page compromise-page">
      <PageHeader
        eyebrow="Compromise analysis · fictional scenario"
        title="Find a way forward for HR-104"
        description={`This fictional bill is marked ${bill?.status ?? "under review"}. Explore what each group needs, then test which amendment holds up when priorities change.`}
      />

      <section className="compromise-story" aria-labelledby="compromise-story-title">
        <div className="compromise-story-heading">
          <p className="eyebrow">The decision behind the score</p>
          <h2 id="compromise-story-title">One bridge. Three different stakes.</h2>
        </div>
        <p>Families need a safer bridge. Shopkeepers need customers during construction. Budget stewards need proof that spending works. HR-104’s four fictional amendments respond in different ways. Change the weights to see which group’s priorities move the modeled leader.</p>
      </section>

      <div className="compromise-token-link"><strong>Where do voice tokens fit?</strong><span>On Voter feedback, 3 priority points use 9 of 50 voice tokens in a practice exercise. This prototype does not feed those choices into the amendment scores below.</span><Link to="/feedback">Try voice tokens →</Link></div>

      <div data-tour="pareto-simulator">
        <InteractiveParetoSimulator />
      </div>

      <details className="quiet-details" data-tour="pareto-method">
        <summary>How does the Pareto engine work?</summary>
        <p>Each amendment has a preset utility from 0 to 1 for each group. An option is Pareto efficient when no other sample option scores at least as well for every group and better for one. Among those options, the displayed score is average group utility × (1 − 0.62 × risk) × (1 − 0.28 × complexity). The sliders change the ranking, not Pareto status. Feedback tokens, local impact estimates, and trust scores do not enter this ranking. These are illustrative inputs, not evidence of a real policy outcome.</p>
      </details>

      <details className="quiet-details" data-tour="pareto-scores">
        <summary>Compare scores for all four options</summary>
        <p>Green options are not outperformed for every group by another sample option.</p>
        <div className="frontier">
          {frontier.map((point) => (
            <article key={point.amendmentId} className={point.isParetoEfficient ? "frontier-point efficient" : "frontier-point subdued"}>
              <strong>{point.label}</strong>
              {point.isParetoEfficient && <Badge tone="green">Non-dominated</Badge>}
              <Meter value={point.totalUtility} label="Average utility" />
              <Meter value={point.minimumFactionUtility} label="Lowest group utility" color="#7c3aed" />
              <Meter value={point.riskAdjustedScore} label="Risk-adjusted score" color="#0f766e" />
            </article>
          ))}
        </div>
      </details>

      <details className="quiet-details" data-tour="pareto-risk">
        <summary>Explore assumed delivery risk</summary>
        <p>This separate simulation varies preset amendment scores. It does not predict real outcomes or validate the local impact estimates.</p>
        <MonteCarloRiskSimulator />
      </details>

      <div className="journey-choice"><Link to="/trust" className="button secondary journey-next">Next: inspect sample trust scores →</Link><Link to="/decision-brief" className="brief-inline-link">Skip to what we learned →</Link></div>

    </div>
  );
}
