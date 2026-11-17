import { Link } from "@tanstack/react-router";
import { ArrowRight, Download, Printer } from "lucide-react";
import { bills, paretoScenario } from "../../data/governance-data";
import { computeParetoFrontierWithWeights, getRecommendedCompromise } from "../../services/governance-engine";
import { PageHeader } from "../../components/ui";

export function DecisionBriefPage() {
  const bill = bills.find((item) => item.id === paretoScenario.billId)!;
  const baseline = getRecommendedCompromise();
  const changedWeights = computeParetoFrontierWithWeights({
    "growth-caucus": 0.2,
    "equity-bloc": 2.5,
    "fiscal-guardians": 1,
  });
  const changedLeader = [...changedWeights].sort((a, b) => b.riskAdjustedScore - a.riskAdjustedScore)[0];
  const options = [...baseline.frontier].sort((a, b) => b.riskAdjustedScore - a.riskAdjustedScore);

  return (
    <div className="page decision-brief-page">
      <PageHeader
        eyebrow="End of the sample bill journey"
        title="What we learned about HR-104"
        description="A short decision brief you can use to ask better questions. Every bill, number, and group here is fictional."
        actions={<button type="button" className="button secondary brief-print" onClick={() => window.print()}><Printer size={16} aria-hidden="true" /> Print this brief</button>}
      />

      <section className="brief-lead" aria-labelledby="brief-answer-title" data-tour="brief-answer">
        <p className="eyebrow">The answer, in one minute</p>
        <h2 id="brief-answer-title">A possible path forward, with its assumptions in view.</h2>
        <p>{bill.title} combines infrastructure guarantees, small-business support, and public reporting. Of four sample amendments, <strong>{baseline.amendment?.title}</strong> leads under equal group weights. It is a <strong>model result, not a vote or a real policy recommendation</strong>.</p>
      </section>

      <section className="brief-section" aria-labelledby="brief-learned-title" data-tour="brief-learned">
        <div className="brief-section-heading"><span className="brief-number">01</span><div><p className="eyebrow">What we learned</p><h2 id="brief-learned-title">Four things worth carrying forward</h2></div></div>
        <div className="brief-learnings">
          <article><strong>The proposal has several moving parts.</strong><p>Read each section before judging the bill as a whole. The sample evidence cards are prompts for verification, not verified sources.</p></article>
          <article><strong>Local effects depend on local inputs.</strong><p>Changing the district changes the displayed exposure estimates. These are assumed examples, not observed effects or forecasts.</p></article>
          <article><strong>People can value different outcomes.</strong><p>Voice tokens make priority intensity visible in a practice exercise. Those allocations are not saved and do not change the amendment ranking.</p></article>
          <article><strong>There is no automatic winner.</strong><p>All four amendments survive the Pareto comparison. A separate score picks a leader; changing group weights can pick a different one.</p></article>
        </div>
      </section>

      <section className="brief-section" aria-labelledby="brief-options-title" data-tour="brief-options">
        <div className="brief-section-heading"><span className="brief-number">02</span><div><p className="eyebrow">The options</p><h2 id="brief-options-title">Four ways to amend the sample bill</h2></div></div>
        <p className="brief-intro">These are alternatives to discuss, not choices made by the website. Scores use assumed group utilities, risk, and complexity.</p>
        <div className="brief-option-list">
          {options.map((option) => {
            const amendment = paretoScenario.amendments.find((item) => item.id === option.amendmentId)!;
            const isLeader = option.amendmentId === baseline.best.amendmentId;
            return <article key={option.amendmentId} className={isLeader ? "brief-option is-leader" : "brief-option"}>
              <div><h3>{amendment.title}</h3><p>{amendment.description}</p></div>
              <div className="brief-option-result"><strong>{option.riskAdjustedScore.toFixed(3)}</strong><span>{isLeader ? "Leads at equal weights" : "Modeled score"}</span></div>
            </article>;
          })}
        </div>
        <p className="brief-shift"><strong>What changes the answer?</strong> At Growth 0.2×, Equity 2.5×, and Fiscal 1×, <strong>{changedLeader.label}</strong> leads instead. The weights change the model result; they do not create new evidence.</p>
        <Link to="/compromise" className="brief-inline-link">Test the weights yourself <ArrowRight size={16} aria-hidden="true" /></Link>
      </section>

      <section className="brief-section" aria-labelledby="brief-next-title" data-tour="brief-next">
        <div className="brief-section-heading"><span className="brief-number">03</span><div><p className="eyebrow">What to do next</p><h2 id="brief-next-title">Choose the next useful step</h2></div></div>
        <div className="brief-next-grid">
          <Link to="/bills/$billId" params={{ billId: bill.id }} className="brief-next-action"><strong>Check the proposal</strong><span>Revisit each section. For a real bill, find and verify the primary text and sources.</span><ArrowRight size={18} aria-hidden="true" /></Link>
          <Link to="/impact" search={{ billId: bill.id }} className="brief-next-action"><strong>Question the local assumptions</strong><span>Compare districts and inspect how each example estimate is calculated.</span><ArrowRight size={18} aria-hidden="true" /></Link>
          <Link to="/compromise" className="brief-next-action"><strong>Compare trade-offs</strong><span>Change group weights and see where the leading option reverses.</span><ArrowRight size={18} aria-hidden="true" /></Link>
        </div>
        <details className="quiet-details brief-questions" data-tour="brief-questions">
          <summary>Questions to bring to a real discussion</summary>
          <ul>
            <li>Which bill provisions need better evidence or clearer language?</li>
            <li>Who might gain, who might bear costs, and whose perspective is missing?</li>
            <li>Which assumptions changed the leading amendment, and who should decide their weights?</li>
          </ul>
        </details>
      </section>

      <aside className="brief-boundary" data-tour="brief-boundary"><strong>Where this journey ends today</strong><p>This prototype helps you inspect a fictional decision. It does not submit a vote, contact an official, validate evidence, or establish that an amendment will work. A real decision needs verified sources, affected communities, and accountable human review.</p></aside>
      <section className="journey-report-card" aria-labelledby="journey-report-title" data-tour="journey-report">
        <div><p className="eyebrow">Take the journey with you</p><h2 id="journey-report-title">Sample HR-104 journey report</h2><p>A concise record of the six steps, four options, what changes the modeled leader, and questions to ask next. It describes the baseline example; it does not capture your personal selections.</p></div>
        <div className="journey-report-actions"><a href="/reports/Civic_Accord_HR104_Journey_Report.pdf" download className="button primary"><Download size={16} aria-hidden="true" /> Download PDF report</a><a href="/reports/Civic_Accord_HR104_Journey_Report.md" download className="brief-inline-link">Markdown version</a></div>
      </section>
      <div className="brief-footer-actions"><a href="/papers/From_Voice_to_Verifiable_Compromise_Aarti_S_Ravikumar.pdf" download className="brief-inline-link"><Download size={16} aria-hidden="true" /> Read the research paper</a><Link to="/bills" className="brief-inline-link">Explore another sample bill <ArrowRight size={16} aria-hidden="true" /></Link></div>
    </div>
  );
}
