import type { EvidenceSource } from "../domain/types";
import { Badge, Meter } from "./ui";

function confidenceTone(score: number) {
  if (score >= 0.85) return "green";
  if (score >= 0.7) return "amber";
  return "red";
}

function confidenceLabel(score: number) {
  if (score >= 0.85) return "High assumed score";
  if (score >= 0.7) return "Medium assumed score";
  return "Low assumed score";
}

export function EvidenceList({ evidence }: { evidence: EvidenceSource[] }) {
  return (
    <div className="evidence-list">
      {evidence.map((source) => (
          <article key={source.id} className="evidence-item">
              <div>
                <div className="evidence-title">
                  <strong>{source.title}</strong>
                  <div className="evidence-badges">
                    <Badge tone={confidenceTone(source.trustScore)}>{confidenceLabel(source.trustScore)}</Badge>
                    <Badge>{source.sourceType}</Badge>
                  </div>
                </div>
                <p>{source.excerpt}</p>
                <small>{source.publisher}</small>
              </div>
              <div className="evidence-score">
                <Meter value={source.trustScore} label="Assumed trust" />
                <Meter value={source.recencyScore} label="Assumed recency" color="#0f766e" />
              </div>
          </article>
      ))}
    </div>
  );
}
