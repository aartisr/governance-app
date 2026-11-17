import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Badge, Card, Meter, PageHeader } from "../../components/ui";
import { NistSafetyCardModal } from "../../components/NistSafetyCardModal";
import { trustParticipants } from "../../data/governance-data";
import { scoreTrust } from "../../services/governance-engine";

export function TrustPage() {
  const ranked = useMemo(() => [...trustParticipants].sort((a, b) => scoreTrust(b) - scoreTrust(a)), []);
  const [isNistModalOpen, setIsNistModalOpen] = useState(false);

  return (
    <div className="page">
      <PageHeader
        eyebrow="Stakeholder trust"
        title="Explore stakeholder trust"
        description="Compare assumed scores for fictional participants. Open a card to see its four inputs. These scores do not affect the amendment ranking."
      />

      <details className="quiet-details">
        <summary>How are these scores calculated?</summary>
        <p>Trust score: 36% accuracy, 28% expertise, 22% consistency, and 14% transparency. Inputs are assumed for this prototype.</p>
      </details>

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
                <strong className="trust-score" aria-label={`${Math.round(trust * 100)} percent assumed score`}>{Math.round(trust * 100)}%</strong>
              </div>
              <details className="inline-details"><summary>See score breakdown</summary><div className="stack">
                <Meter value={participant.accuracy} label="Accuracy" />
                <Meter value={participant.expertise} label="Expertise" color="#7c3aed" />
                <Meter value={participant.consistency} label="Consistency" color="#0f766e" />
                <Meter value={participant.transparency} label="Transparency" color="#b45309" />
              </div></details>
            </Card>
          );
        })}
      </section>

      <section className="journey-finish" aria-labelledby="journey-finish-title">
        <div><p className="eyebrow">Finish the sample bill journey</p><h2 id="journey-finish-title">Bring the findings together</h2><p>See what HR-104 taught us, compare its amendment options, and choose a useful next step.</p></div>
        <Link to="/decision-brief" className="button primary journey-next" data-tour="finish-journey">See what we learned →</Link>
      </section>

      <details className="quiet-details">
        <summary>Safety reference</summary>
        <div className="quiet-actions">
          <button type="button" className="button secondary" onClick={() => setIsNistModalOpen(true)}>Read safety card</button>
        </div>
      </details>

      <NistSafetyCardModal isOpen={isNistModalOpen} onClose={() => setIsNistModalOpen(false)} />
    </div>
  );
}

