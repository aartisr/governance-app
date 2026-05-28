import { useQuery } from "@tanstack/react-query";
import { BillTable } from "../../components/BillTable";
import { Card, EmptyState, PageHeader } from "../../components/ui";
import { listBills } from "../../services/governance-engine";

export function BillsPage() {
  const billsQuery = useQuery({ queryKey: ["bills"], queryFn: listBills });

  if (billsQuery.isError) {
    return <EmptyState title="Bills unavailable" description="The bill corpus could not be loaded. Retry or connect another data provider." />;
  }

  return (
    <div className="page">
      <PageHeader
        eyebrow="Legislative intelligence"
        title="Bill corpus"
        description="A generic, sortable, filterable table powered by TanStack Table. Swap the mock service for live Congress, statehouse, or organizational governance data."
      />
      <Card>
        {billsQuery.data ? <BillTable bills={billsQuery.data} /> : <div className="skeleton">Loading bill corpus…</div>}
      </Card>
    </div>
  );
}
