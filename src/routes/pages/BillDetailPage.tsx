import { Link, useParams } from "@tanstack/react-router";
import { Badge, Card, EmptyState, Meter, PageHeader } from "../../components/ui";
import { EvidenceList } from "../../components/EvidenceList";
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
        actions={(
          <>
            <Link to="/bills" className="button secondary">All bills</Link>
            <Link to="/impact" className="button primary">See local impact</Link>
          </>
        )}
      />

      <section className="dashboard-grid">
        <Card className="span-2">
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
                  <span>{section.affectedPopulationPercent}% locally affected</span>
                  <span>${section.budgetDeltaMillions}M estimated change</span>
                </div>
              </article>
            ))}
          </div>
        </Card>

        <Card>
          <h2>How to read this</h2>
          <p>
            The summary separates bill text from claims about it. Check the linked sources below before treating any estimate as settled.
          </p>
          <div className="stack">
            <Meter value={0.84} label="Clarity of bill summary" />
            <Meter value={0.79} label="Supporting evidence coverage" color="#0f766e" />
            <Meter value={0.72} label="Ready for impact analysis" color="#b45309" />
          </div>
        </Card>
      </section>

      <Card>
        <div className="section-title">
          <h2>Evidence</h2>
          <Badge tone="green">{evidence.length} sources</Badge>
        </div>
        {evidence.length ? (
          <EvidenceList evidence={evidence} />
        ) : (
          <EmptyState title="No linked evidence" description="This bill does not yet have supporting sources attached." />
        )}
      </Card>
    </div>
  );
}
