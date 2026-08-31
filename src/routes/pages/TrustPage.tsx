import { useMemo, useState } from "react";
import { ShieldCheck, Download } from "lucide-react";
import { Badge, Card, Meter, PageHeader } from "../../components/ui";
import { NistSafetyCardModal } from "../../components/NistSafetyCardModal";
import { ReportExportModal } from "../../components/ReportExportModal";
import { trustParticipants } from "../../data/governance-data";
import { scoreTrust } from "../../services/governance-engine";

export function TrustPage() {
  const ranked = useMemo(() => [...trustParticipants].sort((a, b) => scoreTrust(b) - scoreTrust(a)), []);
  const [isNistModalOpen, setIsNistModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  return (
    <div className="page">
      <PageHeader
        eyebrow="Stakeholder trust"
        title="Understand source credibility"
        description="Scores range from 0 to 100. Accuracy carries the most weight, followed by expertise, consistency, and transparency. They add context to public input; they do not replace it."
        actions={(
          <>
            <button
              type="button"
              onClick={() => setIsNistModalOpen(true)}
              className="button primary flex items-center gap-1.5 text-xs"
            >
              <ShieldCheck size={16} /> NIST AI Safety Card
            </button>
            <button
              type="button"
              onClick={() => setIsReportModalOpen(true)}
              className="button secondary flex items-center gap-1.5 text-xs"
            >
              <Download size={15} /> Export Audit Report
            </button>
          </>
        )}
      />

      <p className="page-helper">Trust score: 36% accuracy, 28% expertise, 22% consistency, and 14% transparency.</p>

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

      <NistSafetyCardModal isOpen={isNistModalOpen} onClose={() => setIsNistModalOpen(false)} />
      <ReportExportModal isOpen={isReportModalOpen} onClose={() => setIsReportModalOpen(false)} />
    </div>
  );
}

