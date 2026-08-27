import { useQuery } from "@tanstack/react-query";
import { BillTable } from "../../components/BillTable";
import { Card, EmptyState, PageHeader } from "../../components/ui";
import { listBills } from "../../services/governance-engine";

export function BillsPage() {
  const billsQuery = useQuery({ queryKey: ["bills"], queryFn: listBills });

  if (billsQuery.isError) {
    return (
      <div className="page">
        <EmptyState title="Bills unavailable" description="The bill corpus could not be loaded. Check your connection and try again." />
        <button type="button" className="button primary" onClick={() => billsQuery.refetch()}>Try again</button>
      </div>
    );
  }

  return (
    <div className="page">
      <PageHeader
        eyebrow="Legislation"
        title="Find the bill you want to understand"
        description="Search, sort, and open a bill to read its key sections and the evidence connected to it."
      />
      <Card>
        {billsQuery.data ? <BillTable bills={billsQuery.data} /> : <div className="skeleton">Loading bill corpus…</div>}
      </Card>
    </div>
  );
}
