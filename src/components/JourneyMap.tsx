import { Check, Flag } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

const steps = [
  { id: "bill", label: "Read the bill", path: "/bills/hr-104", help: "What does it propose?" },
  { id: "impact", label: "See local impact", path: "/impact", help: "Which assumptions matter?" },
  { id: "voice", label: "Set priorities", path: "/feedback", help: "What matters most?" },
  { id: "compromise", label: "Compare options", path: "/compromise", help: "Where are the trade-offs?" },
  { id: "trust", label: "Inspect trust", path: "/trust", help: "What supports each score?" },
  { id: "brief", label: "Decision brief", path: "/decision-brief", help: "What did we learn?" },
] as const;

const storageKey = "civic-accord-visited-journey-steps";

function stepForPath(pathname: string) {
  if (pathname.startsWith("/bills")) return 0;
  if (pathname === "/impact") return 1;
  if (pathname === "/feedback") return 2;
  if (pathname === "/compromise") return 3;
  if (pathname === "/trust") return 4;
  if (pathname === "/decision-brief") return 5;
  return -1;
}

export function JourneyMap({ pathname }: { pathname: string }) {
  const current = stepForPath(pathname);
  const [visited, setVisited] = useState<string[]>([]);
  const defaultExpanded = (pathname === "/" || pathname === "/decision-brief") && typeof window !== "undefined" && window.matchMedia("(min-width: 761px)").matches;

  useEffect(() => {
    const currentId = current >= 0 ? steps.at(current)?.id : undefined;
    try {
      const previous = JSON.parse(sessionStorage.getItem(storageKey) || "[]") as unknown;
      const valid = Array.isArray(previous) ? previous.filter((id): id is string => typeof id === "string" && steps.some((step) => step.id === id)) : [];
      const next = currentId ? [...new Set([...valid, currentId])] : valid;
      sessionStorage.setItem(storageKey, JSON.stringify(next));
      setVisited(next);
    } catch {
      setVisited(currentId ? [currentId] : []);
    }
  }, [current]);

  const activeIndex = current >= 0 ? current : 0;
  const active = steps.at(activeIndex)!;

  return (
    <details key={pathname} className="journey-map" open={defaultExpanded}>
      <summary>
        <span><strong>Your bill journey</strong><small>One clear route from a sample proposal to questions worth asking.</small></span>
        <span className="journey-map-summary-status">{current < 0 ? "Start with the bill" : `Step ${current + 1} of ${steps.length} · ${active.label}`}</span>
      </summary>
      <p className="journey-map-note">Choose any step. A check means you opened that screen during this visit; it does not mean the analysis is complete.</p>
      <ol className="journey-map-steps" aria-label="Sample bill journey steps">
        {steps.map((step, index) => {
          const isCurrent = index === current;
          const isStart = current < 0 && index === 0;
          const isVisited = visited.includes(step.id) && !isCurrent && !isStart;
          const destination = step.path === "/bills/hr-104"
            ? { to: "/bills/$billId" as const, params: { billId: "hr-104" } }
            : step.path === "/impact"
              ? { to: "/impact" as const, search: { billId: "hr-104" } }
              : { to: step.path };
          return <li key={step.id} className={isCurrent || isStart ? "is-current" : isVisited ? "is-visited" : ""}>
            <Link {...destination} aria-current={isCurrent ? "step" : undefined}>
              <span className="journey-map-node" aria-hidden="true">{isVisited ? <Check size={18} /> : index === steps.length - 1 ? <Flag size={17} /> : index + 1}</span>
              <span className="journey-map-label">{step.label}</span>
              <span className="journey-map-help">{step.help}</span>
              {(isCurrent || isStart) && <span className="journey-map-state">{isStart ? "Start here" : "Current"}</span>}
              {isVisited && <span className="journey-map-state">Visited</span>}
            </Link>
          </li>;
        })}
      </ol>
    </details>
  );
}
