import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Download, FileText, Landmark, Play, Sparkles, Vote } from "lucide-react";
import { AiPolicyInspectorModal } from "../../components/AiPolicyInspectorModal";
import { Badge, Card, PageHeader } from "../../components/ui";
import { bills } from "../../data/governance-data";
import { getRecommendedCompromise } from "../../services/governance-engine";

export function CommandCenterPage() {
  const featuredBill = bills[0];
  const recommendation = getRecommendedCompromise();
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  return (
    <div className="page home-page">
      <PageHeader
        eyebrow="Civic Accord"
        title="See what it takes to move a public decision forward"
        description="Follow a fictional bill from its text to local effects and possible compromises. See who benefits, what remains uncertain, and which assumptions change the answer."
        actions={<Link to="/demo" target="_top" className="button demo-cta"><Play size={16} aria-hidden="true" /> Watch Demo</Link>}
      />

      <section className="decision-brief" aria-labelledby="decision-brief-title">
        <div className="decision-brief-main">
          <p className="eyebrow">Start with the bill</p>
          <h2 id="decision-brief-title">{featuredBill.title}</h2>
          <p>{featuredBill.summary}</p>
          <Link to="/bills" className="button primary">Read sample bills <ArrowRight size={16} aria-hidden="true" /></Link>
        </div>
        <div className="recommendation-brief">
          <Badge tone="amber">Illustrative result</Badge>
          <h3>{recommendation.amendment?.title}</h3>
          <p>{recommendation.amendment?.description}</p>
          <Link to="/compromise" className="brief-text-link">See why this option ranks first <ArrowRight size={15} aria-hidden="true" /></Link>
        </div>
      </section>

      <section className="home-next" aria-label="Explore the workflow">
        <h2>Explore the next steps</h2>
        <div className="home-next-grid">
          <Link to="/impact" search={{ billId: featuredBill.id }} className="home-next-link"><Landmark size={20} aria-hidden="true" /><span>See local impact</span><ArrowRight size={16} aria-hidden="true" /></Link>
          <Link to="/feedback" className="home-next-link"><Vote size={20} aria-hidden="true" /><span>Set priorities</span><ArrowRight size={16} aria-hidden="true" /></Link>
        </div>
      </section>

      <section className="home-destination" aria-labelledby="home-destination-title">
        <div><p className="eyebrow">Where the journey leads</p><h2 id="home-destination-title">Leave with a clearer question.</h2><p>The sample decision brief gathers what we learned about HR-104, four amendment options, and what to check next.</p></div>
        <Link to="/decision-brief" className="brief-inline-link">Preview the decision brief <ArrowRight size={16} aria-hidden="true" /></Link>
      </section>

      <section className="research-paper-card" aria-labelledby="research-paper-title">
        <div>
          <p className="eyebrow">Research behind the prototype</p>
          <h2 id="research-paper-title">From Voice to Verifiable Compromise</h2>
          <p>Read the mathematics, worked examples, and limits of the live website. The paper also explains what the full civic vision would require when funding is available.</p>
          <span className="research-paper-byline">Aarti S Ravikumar · Pioneer Charter School of Science II</span>
        </div>
        <div className="research-paper-downloads" aria-label="Download the research paper">
          <a className="button primary" href="/papers/From_Voice_to_Verifiable_Compromise_Aarti_S_Ravikumar.pdf" download><Download size={16} aria-hidden="true" /> Download paper (PDF)</a>
          <a href="/papers/From_Voice_to_Verifiable_Compromise_Aarti_S_Ravikumar.docx" download><FileText size={16} aria-hidden="true" /> Word</a>
          <a href="/papers/From_Voice_to_Verifiable_Compromise_Aarti_S_Ravikumar.md" download><FileText size={16} aria-hidden="true" /> Markdown</a>
        </div>
      </section>

      <details className="quiet-details">
        <summary><Sparkles size={16} aria-hidden="true" /> Optional AI text analysis</summary>
        <p>This generates a draft for inspection. It may be simulated or inaccurate.</p>
        <button type="button" className="button secondary" onClick={() => setIsAiModalOpen(true)}>Open AI inspector</button>
      </details>

      <AiPolicyInspectorModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        billTitle={featuredBill.title}
        billSummary={featuredBill.summary}
        topic="Sample legislative briefing"
      />
    </div>
  );
}
