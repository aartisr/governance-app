import { useState } from "react";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { Card, PageHeader } from "../../components/ui";
import { bills, districts } from "../../data/governance-data";
import { getLocalizedImpacts } from "../../services/governance-engine";

export function ImpactPage() {
  const { billId: requestedBillId } = useSearch({ from: "/impact" });
  const navigate = useNavigate();
  const billId = bills.some((item) => item.id === requestedBillId) ? requestedBillId! : "hr-104";
  const [districtId, setDistrictId] = useState("ca-12");
  const bill = bills.find((item) => item.id === billId);
  const district = districts.find((item) => item.id === districtId) ?? districts[0];
  const impacts = bill ? getLocalizedImpacts(bill, district) : [];

  return (
    <div className="page">
      <PageHeader
        eyebrow="Impact"
        title="Explore local impact"
        description="Choose a sample bill and district. See how assumed local factors change each section’s exposure estimate."
      />

      <Card>
        <div className="control-grid">
          <label>
            Bill
            <select value={billId} onChange={(event) => navigate({ to: "/impact", search: { billId: event.target.value }, replace: true })}>
              {bills.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}
            </select>
          </label>
          <label>
            District
            <select value={districtId} onChange={(event) => setDistrictId(event.target.value)}>
              {districts.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
            </select>
          </label>
        </div>
        <p className="control-helper">These exposure equivalents are illustrative, not forecasts of residents affected.</p>
      </Card>

      <section className="impact-grid">
        {impacts.map((impact) => (
          <Card key={impact.sectionId}>
            <div className="section-title">
              <h2>{impact.label}</h2>
            </div>
            <strong className="impact-number">{impact.delta}%</strong>
            <p>Illustrative exposure</p>
            <details className="inline-details"><summary>How is this calculated?</summary><p>{impact.explanation}</p></details>
          </Card>
        ))}
      </section>

      <Link to="/feedback" className="button secondary journey-next">Next: explore community priorities →</Link>
    </div>
  );
}

