import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Brain, GitMerge, Network, Vote, type LucideIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge, Card, Meter, PageHeader, StatCard } from "../../components/ui";
import { districts, trustParticipants } from "../../data/governance-data";
import { getGovernanceSnapshot, getRecommendedCompromise, scoreTrust } from "../../services/governance-engine";
import { emitThemeChangeRequest, getThemeModeFromBody, subscribeThemeChanged, type ThemeMode } from "../../theme/theme-mode";

export function CommandCenterPage() {
  const snapshot = useQuery({ queryKey: ["governance-snapshot"], queryFn: getGovernanceSnapshot });
  const recommendation = getRecommendedCompromise();
  const activeBills = snapshot.data?.bills ?? [];
  const trustAverage = trustParticipants.reduce((sum, item) => sum + scoreTrust(item), 0) / trustParticipants.length;
  const [activeTheme, setActiveTheme] = useState<ThemeMode>(getThemeModeFromBody);

  useEffect(() => {
    setActiveTheme(getThemeModeFromBody());
    return subscribeThemeChanged((mode) => setActiveTheme(mode));
  }, []);

  return (
    <div className="page">
      <PageHeader
        eyebrow="Pareto Legislative Engine"
        title="Computational governance command center"
        description="A neutral workspace that converts public preference intensity, evidence quality, localized policy impact, and factional boundaries into measurable legislative options."
        actions={(
          <>
            <Link to="/bills" className="button secondary">Review bills</Link>
            <Link to="/compromise" className="button primary">Run Pareto engine</Link>
          </>
        )}
      />

      <section className="stat-grid">
        <StatCard label="Active bills" value={activeBills.length || "—"} detail="multi-tenant policy corpus" intent="strong" />
        <StatCard label="District models" value={districts.length} detail="localized impact overlays" />
        <StatCard label="Trust network" value={`${Math.round(trustAverage * 100)}%`} detail="weighted credibility" intent="good" />
        <StatCard label="Best compromise" value={recommendation.best.riskAdjustedScore.toFixed(2)} detail={recommendation.amendment?.title} intent="warn" />
      </section>

      <section className="dashboard-grid">
        <Card className="span-2">
          <div className="section-title">
            <div>
              <p className="eyebrow">Closed-loop architecture</p>
              <h2>From sentiment to governed optimization</h2>
            </div>
            <Badge tone="green">Resilient</Badge>
          </div>
          <div className="flow-grid">
            {([
              ["Preference", "Quadratic feedback reveals intensity, not only direction.", Vote],
              ["Evidence", "RAG-style source grounding removes rhetoric and exposes assumptions.", Brain],
              ["Trust", "Adaptive Trust Networks weight credibility by accuracy and consistency.", Network],
              ["Optimization", "Pareto search identifies amendments that improve utility without violating boundaries.", GitMerge],
            ] satisfies Array<[string, string, LucideIcon]>).map(([title, body, IconComponent]) => {
              return (
                <article key={title} className="flow-card">
                  <IconComponent size={20} />
                  <strong>{title}</strong>
                  <p>{body}</p>
                </article>
              );
            })}
          </div>
        </Card>

        <Card>
          <p className="eyebrow">Recommended action</p>
          <h2>{recommendation.amendment?.title}</h2>
          <p>{recommendation.amendment?.description}</p>
          <div className="stack">
            <Meter value={recommendation.best.totalUtility} label="Total utility" />
            <Meter value={recommendation.best.minimumFactionUtility} label="Minimum faction utility" color="#7c3aed" />
            <Meter value={recommendation.best.riskAdjustedScore} label="Risk-adjusted score" color="#0f766e" />
          </div>
        </Card>
      </section>

      <Card>
        <div className="section-title">
          <div>
            <p className="eyebrow">Theme preview</p>
            <h2>Chamber-ready visual modes</h2>
          </div>
          <Badge tone="amber">Policy UX</Badge>
        </div>
        <div className="theme-preview-grid">
          <button
            type="button"
            className={activeTheme === "executive" ? "theme-mode-tile executive active" : "theme-mode-tile executive"}
            onClick={() => emitThemeChangeRequest("executive")}
            aria-pressed={activeTheme === "executive"}
          >
            <div className="theme-mode-flag" aria-hidden="true" />
            <strong>Executive</strong>
            <p>High-contrast briefings for fast decision velocity and command readability.</p>
            <div className="theme-mode-swatch" aria-label="Executive palette swatches">
              <span />
              <span />
              <span />
            </div>
          </button>

          <button
            type="button"
            className={activeTheme === "legislative" ? "theme-mode-tile legislative active" : "theme-mode-tile legislative"}
            onClick={() => emitThemeChangeRequest("legislative")}
            aria-pressed={activeTheme === "legislative"}
          >
            <div className="theme-mode-flag" aria-hidden="true" />
            <strong>Legislative</strong>
            <p>Balanced institutional styling optimized for committees, drafts, and deliberation.</p>
            <div className="theme-mode-swatch" aria-label="Legislative palette swatches">
              <span />
              <span />
              <span />
            </div>
          </button>

          <button
            type="button"
            className={activeTheme === "public-service" ? "theme-mode-tile public-service active" : "theme-mode-tile public-service"}
            onClick={() => emitThemeChangeRequest("public-service")}
            aria-pressed={activeTheme === "public-service"}
          >
            <div className="theme-mode-flag" aria-hidden="true" />
            <strong>Public Service</strong>
            <p>Calmer civic presentation for constituent briefings and outreach transparency.</p>
            <div className="theme-mode-swatch" aria-label="Public Service palette swatches">
              <span />
              <span />
              <span />
            </div>
          </button>
        </div>
      </Card>
    </div>
  );
}
