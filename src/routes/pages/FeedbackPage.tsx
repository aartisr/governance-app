import { useState } from "react";
import { Badge, Card, PageHeader } from "../../components/ui";
import { Link } from "@tanstack/react-router";
import { PublicCommentParser } from "../../components/PublicCommentParser";
import { factions, publicComments } from "../../data/governance-data";
import type { Faction, VoiceAllocation } from "../../domain/types";
import { calculateQuadraticCost, summarizeVoiceBudget } from "../../services/governance-engine";

export function FeedbackPage() {
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
        eyebrow="Voter feedback · voice tokens"
        title="Spend voice tokens on what matters"
        description="Choose a sample group, then move an issue slider. Every issue draws from the same 50 voice-token budget; stronger priorities cost more."
      />

      <section className="dashboard-grid feedback-grid">
        <Card>
          <h2>Choose a sample group</h2>
          <div className="segmented">
            {factions.map((faction) => (
              <button key={faction.id} type="button" aria-pressed={faction.id === selectedFactionId} className={faction.id === selectedFactionId ? "active" : ""} onClick={() => switchFaction(faction)}>
                {faction.name}
              </button>
            ))}
          </div>
          <details className="inline-details">
            <summary>See {selectedFaction.name}'s stated boundaries</summary>
            <div className="boundary-box">
              <small>The recommendation does not enforce these preferences.</small>
              {selectedFaction.hardBoundaries.map((boundary) => <span key={boundary}>{boundary}</span>)}
            </div>
          </details>
        </Card>

        <Card className="span-2">
          <div className="section-title">
            <div>
              <h2>50 voice tokens</h2>
              <p>Voice tokens are a practice budget, not a real vote or submission.</p>
            </div>
            <Badge tone={budget.overBudget ? "red" : "green"}>{budget.overBudget ? `${budget.spent - 50} over budget` : `${budget.remaining} left`}</Badge>
          </div>
          <div className="token-rule" data-tour="token-explainer"><strong>How voice tokens are spent: points × points = cost</strong><span>For example: 3 priority points use 9 voice tokens.</span></div>
          <div className="token-budget-visual" data-tour="token-budget-visual">
            <div className="token-budget-labels"><strong>{budget.spent} used</strong><span>{budget.overBudget ? "50 available" : `${budget.remaining} left`}</span></div>
            <div className="token-budget-track" role="meter" aria-label="Voice tokens used" aria-valuemin={0} aria-valuemax={50} aria-valuenow={Math.min(budget.spent, 50)} aria-valuetext={`${budget.spent} of 50 voice tokens used${budget.overBudget ? `, ${budget.spent - 50} over budget` : ""}`}><span className={budget.overBudget ? "over-budget" : ""} style={{ width: `${Math.min(100, budget.spent * 2)}%` }} /></div>
          </div>
          {budget.overBudget && <p role="status">This example exceeds the 50 voice-token budget by {budget.spent - 50} voice tokens. Adjust the sliders to compare an in-budget allocation.</p>}
          <div className="allocation-list">
            {allocations.map((allocation, index) => (
              <label key={allocation.issueId} className="allocation-row">
                <div>
                  <strong>{allocation.label}</strong>
                  <span>{{ support: "Support", oppose: "Oppose", condition: "Conditional" }[allocation.sentiment]}</span>
                </div>
                <input
                  type="range"
                  aria-label={`${allocation.label} priority points`}
                  min="0"
                  max="7"
                  value={allocation.votes}
                  onChange={(event) => {
                    const votes = Number(event.target.value);
                    setAllocations((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, votes } : item));
                  }}
                />
                <output className="token-cost"><strong>{allocation.votes} priority points</strong><span>{allocation.votes} × {allocation.votes} = {calculateQuadraticCost(allocation.votes)} voice tokens</span></output>
              </label>
            ))}
          </div>
          <p className="token-connection">These choices are only for practice; they are not saved and do not change the compromise ranking. <Link to="/compromise">See how compromises are ranked →</Link></p>
        </Card>
      </section>

      <details className="quiet-details">
        <summary>Browse {publicComments.length} sample comments</summary>
        <PublicCommentParser />
      </details>
    </div>
  );
}

