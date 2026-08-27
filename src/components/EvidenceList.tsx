import { useVirtualizer } from "@tanstack/react-virtual";
import { useRef } from "react";
import type { EvidenceSource } from "../domain/types";
import { Badge, Meter } from "./ui";

function confidenceTone(score: number) {
  if (score >= 0.85) return "green";
  if (score >= 0.7) return "amber";
  return "red";
}

function confidenceLabel(score: number) {
  if (score >= 0.85) return "High confidence";
  if (score >= 0.7) return "Moderate confidence";
  return "Review carefully";
}

export function EvidenceList({ evidence }: { evidence: EvidenceSource[] }) {
  const parentRef = useRef<HTMLDivElement>(null);
  const virtualizer = useVirtualizer({
    count: evidence.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 122,
    overscan: 4,
  });

  return (
    <div ref={parentRef} className="evidence-virtual">
      <div style={{ height: virtualizer.getTotalSize(), position: "relative" }}>
        {virtualizer.getVirtualItems().map((item) => {
          const source = evidence[item.index];
          return (
            <article key={source.id} className="evidence-item" style={{ transform: `translateY(${item.start}px)` }}>
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
                <Meter value={source.trustScore} label="Trust" />
                <Meter value={source.recencyScore} label="Recency" color="#0f766e" />
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
