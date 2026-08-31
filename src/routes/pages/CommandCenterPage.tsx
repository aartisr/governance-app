import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, BookOpenText, CircleCheck, Download, GitMerge, Landmark, ShieldCheck, Vote, type LucideIcon } from "lucide-react";
import { Badge, Card, PageHeader, StatCard } from "../../components/ui";
import { NistSafetyCardModal } from "../../components/NistSafetyCardModal";
import { ReportExportModal } from "../../components/ReportExportModal";
import { districts, trustParticipants } from "../../data/governance-data";
import { getGovernanceSnapshot, getRecommendedCompromise, scoreTrust } from "../../services/governance-engine";

export function CommandCenterPage() {
  const snapshot = useQuery({ queryKey: ["governance-snapshot"], queryFn: getGovernanceSnapshot });
  const recommendation = getRecommendedCompromise();
  const activeBills = snapshot.data?.bills ?? [];
  const featuredBill = activeBills[0];
  const trustAverage = trustParticipants.reduce((sum, item) => sum + scoreTrust(item), 0) / trustParticipants.length;

  const [isNistModalOpen, setIsNistModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  return (
    <div className="page">
      <PageHeader
        eyebrow="Your civic briefing"
        title="Start with the decision that needs your attention"
        description="Read the proposal, understand who is affected, and compare a path forward without losing sight of the evidence."
        actions={(
          <>
            <button
              type="button"
              onClick={() => setIsNistModalOpen(true)}
              className="button secondary flex items-center gap-1.5 text-xs"
            >
              <ShieldCheck size={15} className="text-teal-600" /> NIST Safety Card
            </button>
            <button
              type="button"
              onClick={() => setIsReportModalOpen(true)}
              className="button secondary flex items-center gap-1.5 text-xs"
            >
              <Download size={15} className="text-blue-600" /> Export Audit Report
            </button>
            <Link to="/compromise" className="button primary">Review the recommendation <ArrowRight size={16} /></Link>
          </>
        )}
      />

      {/* Decision Briefing */}
      <section className="decision-brief" aria-labelledby="decision-brief-title">
        <div className="decision-brief-main">
          <div className="decision-brief-heading">
            <p className="eyebrow">Ready to examine</p>
            <Badge tone="amber">Negotiating</Badge>
          </div>
          <h2 id="decision-brief-title">{featuredBill?.title ?? "Loading current bill"}</h2>
          <p>{featuredBill?.summary ?? "Preparing the current legislative briefing."}</p>
          <div className="decision-brief-actions">
            <Link to="/bills" className="button primary">Read the bill <ArrowRight size={16} /></Link>
            <Link to="/impact" className="brief-text-link">See local impact</Link>
          </div>
        </div>
        <div className="recommendation-brief">
          <div className="recommendation-brief-label"><CircleCheck size={18} /><span>Model’s strongest option</span></div>
          <h3>{recommendation.amendment?.title}</h3>
          <p>{recommendation.amendment?.description}</p>
          <div className="recommendation-scoreline">
            <span>Risk-adjusted score</span>
            <strong>{recommendation.best.riskAdjustedScore.toFixed(2)}</strong>
          </div>
          <Link to="/compromise" className="brief-text-link">Inspect the trade-offs <ArrowRight size={15} /></Link>
        </div>
      </section>

      {/* Navigation Cards */}
      <section className="homepage-grid">
        <Card className="journey-card">
          <div className="section-title">
            <div>
              <p className="eyebrow">A clear path forward</p>
              <h2>Four steps to a more informed position</h2>
            </div>
            <Badge tone="green">Start anywhere</Badge>
          </div>
          <div className="journey-grid">
            {([
              ["Read the proposal", "See the plain-language sections and linked sources.", BookOpenText, "/bills"],
              ["Bring it home", "Compare likely outcomes for a district profile.", Landmark, "/impact"],
              ["Make priorities clear", "Show what matters most with a limited voice budget.", Vote, "/feedback"],
              ["Find common ground", "Inspect options, benefits, and risks side by side.", GitMerge, "/compromise"],
            ] satisfies Array<[string, string, LucideIcon, "/bills" | "/feedback" | "/impact" | "/compromise"]>).map(([title, body, IconComponent, path], index) => {
              return (
                <Link key={title} to={path} className="journey-step">
                  <span className="journey-step-number">0{index + 1}</span>
                  <IconComponent size={21} />
                  <strong>{title}</strong>
                  <p>{body}</p>
                  <span className="journey-step-link">Open <ArrowRight size={14} /></span>
                </Link>
              );
            })}
          </div>
        </Card>

        <Card className="transparency-card" tone="subtle">
          <div className="section-title">
            <div>
              <p className="eyebrow">Keep the system honest</p>
              <h2>What you can inspect</h2>
            </div>
            <ShieldCheck size={22} aria-hidden="true" />
          </div>
          <ul className="transparency-list">
            <li><CircleCheck size={16} /> Evidence stays connected to claims</li>
            <li><CircleCheck size={16} /> Local-impact assumptions are visible</li>
            <li><CircleCheck size={16} /> Trust scores show how they are weighted</li>
          </ul>
          <div className="flex flex-col gap-2 mt-4">
            <button
              type="button"
              onClick={() => setIsNistModalOpen(true)}
              className="text-xs font-semibold text-teal-800 hover:text-teal-950 flex items-center gap-1"
            >
              Open NIST AI Safety Card <ArrowRight size={14} />
            </button>
            <Link to="/trust" className="brief-text-link">Review source credibility <ArrowRight size={15} /></Link>
          </div>
        </Card>
      </section>

      {/* Stats Line */}
      <section className="stat-grid homepage-stats" aria-label="Current civic workspace context">
        <StatCard label="Bills ready to review" value={snapshot.isPending ? "..." : activeBills.length} detail="across the current briefing" intent="strong" />
        <StatCard label="District perspectives" value={districts.length} detail="available for impact comparison" />
        <StatCard label="Source trust signal" value={`${Math.round(trustAverage * 100)}%`} detail="weighted credibility context" intent="good" />
        <StatCard label="Recommendation status" value="Inspectable" detail="a simulation, never a final decision" intent="warn" />
      </section>

      {/* Modals */}
      <NistSafetyCardModal isOpen={isNistModalOpen} onClose={() => setIsNistModalOpen(false)} />
      <ReportExportModal isOpen={isReportModalOpen} onClose={() => setIsReportModalOpen(false)} />
    </div>
  );
}

