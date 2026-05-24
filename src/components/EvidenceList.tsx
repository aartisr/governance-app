import { useVirtualizer } from "@tanstack/react-virtual";
import { useRef } from "react";
import type { EvidenceSource } from "../domain/types";
import { Badge, Meter } from "./ui";

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
                  <Badge>{source.sourceType}</Badge>
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
