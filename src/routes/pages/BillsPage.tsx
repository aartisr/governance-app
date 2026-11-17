import { BillsWorkspace } from "../../components/BillsWorkspace";
import { PageHeader } from "../../components/ui";
import { bills } from "../../data/governance-data";

export function BillsPage() {
  return (
    <div className="page">
      <PageHeader
        eyebrow="Sample bills"
        title="Explore bills and their evidence"
        description={`Search ${bills.length} fictional proposals, inspect their sections, and compare them side by side.`}
      />

      <BillsWorkspace bills={bills} />
    </div>
  );
}


