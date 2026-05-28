import { useState } from "react";
import { Badge, Card, PageHeader } from "../../components/ui";
import { factions } from "../../data/governance-data";
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
