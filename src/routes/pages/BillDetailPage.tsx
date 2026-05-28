import { Link, useParams } from "@tanstack/react-router";
import { Badge, Card, EmptyState, Meter, PageHeader } from "../../components/ui";
import { EvidenceList } from "../../components/EvidenceList";
import { evidenceSources } from "../../data/governance-data";
import { getBill, getEvidenceForBill } from "../../services/governance-engine";
import { useQuery } from "@tanstack/react-query";

export function BillDetailPage() {
  const { billId } = useParams({ from: "/bills/$billId" });
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
