import { Link } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import type { Bill } from "../domain/types";

interface BillComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedBills: Bill[];
  onRemoveBill: (billId: string) => void;
}

export function BillComparisonModal({ isOpen, onClose, selectedBills, onRemoveBill }: BillComparisonModalProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!isOpen) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCloseRef.current();
      if (event.key !== "Tab") return;
      const focusable = [...(dialogRef.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled])') ?? [])];
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previousFocus?.focus();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="comparison-overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div ref={dialogRef} className="comparison-dialog" role="dialog" aria-modal="true" aria-labelledby="comparison-title">
        <div className="comparison-heading">
          <div>
            <h2 id="comparison-title">Compare sample bills</h2>
            <p>Compare the sample summaries, sections, and budget assumptions.</p>
          </div>
          <button ref={closeRef} type="button" className="text-button" onClick={onClose} aria-label="Close comparison">Close</button>
        </div>
        {selectedBills.length < 2 ? (
          <p>Select at least two bills to compare.</p>
        ) : (
          <div className="comparison-grid">
            {selectedBills.map((bill) => {
              const budgetChange = bill.sections.reduce((total, section) => total + section.budgetDeltaMillions, 0);
              return (
                <article key={bill.id} className="comparison-item">
                  <div className="bill-list-meta"><span>{bill.id.toUpperCase()}</span><span>{bill.status}</span></div>
                  <h3>{bill.title}</h3>
                  <p>{bill.summary}</p>
                  <dl>
                    <div><dt>Sponsor</dt><dd>{bill.sponsor}</dd></div>
                    <div><dt>Sections</dt><dd>{bill.sections.length}</dd></div>
                    <div><dt>Assumed budget change</dt><dd>{budgetChange >= 0 ? "+" : ""}${budgetChange}M</dd></div>
                  </dl>
                  <div className="comparison-actions">
                    <Link to="/bills/$billId" params={{ billId: bill.id }} className="button primary" onClick={onClose}>Read bill</Link>
                    <button type="button" className="text-button" onClick={() => onRemoveBill(bill.id)}>Remove</button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
