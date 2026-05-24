import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { BarChart3, BookOpenText, GitBranch, Landmark, Scale, ShieldCheck, Vote } from "lucide-react";

const navItems = [
  { to: "/", label: "Command", icon: BarChart3 },
  { to: "/bills", label: "Bills", icon: BookOpenText },
  { to: "/feedback", label: "Voice Tokens", icon: Vote },
  { to: "/impact", label: "Impact", icon: Landmark },
  { to: "/compromise", label: "Pareto Engine", icon: GitBranch },
  { to: "/trust", label: "Trust Network", icon: ShieldCheck },
];

export function AppShell() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">
            <Scale size={22} />
          </div>
          <div>
            <strong>Pareto Governance</strong>
            <span>Legislative Engine</span>
          </div>
        </div>

        <nav className="nav-list" aria-label="Workspace navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
            return (
              <Link key={item.to} to={item.to} className={active ? "nav-item active" : "nav-item"}>
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-note">
          <strong>System thesis</strong>
          <span>Governance becomes measurable: preference intensity, evidence quality, trust, and Pareto gain.</span>
        </div>
      </aside>

      <main className="workspace">
        <Outlet />
      </main>
    </div>
  );
}
