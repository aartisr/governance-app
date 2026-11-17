import { Link, useParams } from "@tanstack/react-router";
import { Badge, Card, EmptyState, PageHeader } from "../../components/ui";
import { EvidenceList } from "../../components/EvidenceList";
import { getEvidenceForBill } from "../../services/governance-engine";
import { bills } from "../../data/governance-data";

export function BillDetailPage() {
  const { billId } = useParams({ from: "/bills/$billId" });
  const bill = bills.find((item) => item.id === billId);

  if (!bill) {
    return <div className="page"><EmptyState title="Sample bill not found" description="This prototype has no bill with that identifier." /><Link to="/bills" className="button secondary journey-next">Browse sample bills →</Link></div>;
  }

  const evidence = getEvidenceForBill(bill);

  return (
    <div className="page">
      <PageHeader
        eyebrow={bill.id.toUpperCase()}
        title={bill.title}
        description={bill.summary}
        actions={<Link to="/bills" className="text-button">← All bills</Link>}
      />

      <section>
        <Card>
          <div className="section-title">
            <h2>What this bill changes</h2>
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
                  <span>{section.affectedPopulationPercent}% assumed exposure input</span>
                  <span>{section.budgetDeltaMillions >= 0 ? "+" : "−"}${Math.abs(section.budgetDeltaMillions)}M assumed budget change</span>
                </div>
              </article>
            ))}
          </div>
        </Card>

      </section>

      <details className="quiet-details">
        <summary>View {evidence.length} sample evidence cards</summary>
        <p>These excerpts are examples and do not link to verified documents.</p>
        {evidence.length ? <EvidenceList evidence={evidence} /> : <p>No evidence cards are attached.</p>}
      </details>
      <Link to="/impact" search={{ billId: bill.id }} className="button primary">See this bill’s local impact →</Link>
    </div>
  );
}
