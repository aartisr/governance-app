import type { ReactNode } from "react";

export function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <header className="page-header">
      <div>
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h1>{title}</h1>
        {description ? <p className="page-description">{description}</p> : null}
      </div>
      {actions ? <div className="header-actions">{actions}</div> : null}
    </header>
  );
}

export function Card({
  children,
  className,
  tone = "default",
}: {
  children: ReactNode;
  className?: string;
  tone?: "default" | "strong" | "subtle";
}) {
  return <section className={cx("card", `card-${tone}`, className)}>{children}</section>;
}

export function StatCard({
  label,
  value,
  detail,
  intent = "neutral",
}: {
  label: string;
  value: ReactNode;
  detail?: ReactNode;
  intent?: "neutral" | "good" | "warn" | "strong";
}) {
  return (
    <Card className={cx("stat-card", `stat-${intent}`)}>
      <p>{label}</p>
      <strong>{value}</strong>
      {detail ? <span>{detail}</span> : null}
    </Card>
  );
}

export function Badge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "green" | "violet" | "amber" | "red";
}) {
  return <span className={cx("badge", `badge-${tone}`)}>{children}</span>;
}

export function Meter({
  value,
  label,
  color = "var(--accent)",
}: {
  value: number;
  label?: string;
  color?: string;
}) {
  const percent = Math.max(0, Math.min(100, value * 100));
  return (
    <div className="meter-wrap" aria-label={label}>
      <div className="meter">
        <span style={{ width: `${percent}%`, background: color }} />
      </div>
      {label ? <small>{label}</small> : null}
    </div>
  );
}

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <Card className="empty-state">
      <h2>{title}</h2>
      <p>{description}</p>
    </Card>
  );
}
