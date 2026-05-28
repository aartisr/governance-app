import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Badge, Card, PageHeader } from "../../components/ui";
import { districts } from "../../data/governance-data";
import { getLocalizedImpacts, listBills } from "../../services/governance-engine";

export function ImpactPage() {
  const [billId, setBillId] = useState("hr-104");
  const [districtId, setDistrictId] = useState("ca-12");
  const billsQuery = useQuery({ queryKey: ["bills"], queryFn: listBills });
  const bill = billsQuery.data?.find((item) => item.id === billId);
  const district = districts.find((item) => item.id === districtId) ?? districts[0];
  const impacts = bill ? getLocalizedImpacts(bill, district) : [];

  return (
    <div className="page">
      <PageHeader
        eyebrow="Multi-tenant RAG and impact mapping"
        title="Localized downstream impact"
        description="Select any bill and district profile to see section-level estimates grounded in evidence, demographic context, and budget assumptions."
      />

      <Card>
        <div className="control-grid">
          <label>
            Bill
            <select value={billId} onChange={(event) => setBillId(event.target.value)}>
              {(billsQuery.data ?? []).map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}
            </select>
          </label>
          <label>
            District
            <select value={districtId} onChange={(event) => setDistrictId(event.target.value)}>
              {districts.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
            </select>
          </label>
        </div>
      </Card>

      <section className="impact-grid">
        {impacts.map((impact) => (
          <Card key={impact.sectionId}>
            <div className="section-title">
              <h2>{impact.label}</h2>
              <Badge tone="green">{Math.round(impact.confidence * 100)}%</Badge>
            </div>
            <strong className="impact-number">{impact.delta}{impact.unit.replace("% exposed population equivalent", "%")}</strong>
            <p>{impact.explanation}</p>
          </Card>
        ))}
      </section>
    </div>
  );
}
