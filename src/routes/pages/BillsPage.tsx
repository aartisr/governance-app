import { useQuery } from "@tanstack/react-query";
import { BillsWorkspace } from "../../components/BillsWorkspace";
import { EmptyState, PageHeader } from "../../components/ui";
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
        eyebrow="Legislative Intelligence Corpus"
        title="Explore Legislative Bills & Statutory Provenance"
        description="Search across legislative proposals, inspect section-by-section budget deltas, audit evidence lineage, and run side-by-side bill comparisons."
      />

      {billsQuery.data ? (
        <BillsWorkspace bills={billsQuery.data} />
      ) : (
        <div className="skeleton">Loading legislative bill corpus…</div>
      )}
    </div>
  );
}


