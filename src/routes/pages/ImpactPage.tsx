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
        eyebrow="Local policy impact"
        title="See what this could mean where you live"
        description="Choose a bill and district profile to review section-level estimates, their assumptions, and the confidence behind them."
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
        <p className="control-helper">Estimates show the share of residents affected after accounting for local demographics, business density, and rural or urban context.</p>
      </Card>

      <section className="impact-grid">
        {impacts.map((impact) => (
          <Card key={impact.sectionId}>
            <div className="section-title">
              <h2>{impact.label}</h2>
              <Badge tone="green">{Math.round(impact.confidence * 100)}% confidence</Badge>
            </div>
            <strong className="impact-number">{impact.delta}%</strong>
            <p>{impact.explanation}</p>
          </Card>
        ))}
      </section>
    </div>
  );
}
