import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { BarChart3, BookOpenText, GitBranch, Landmark, Menu, Scale, ShieldCheck, Vote, X } from "lucide-react";
import { useEffect, useState } from "react";

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
  const [isNavOpen, setIsNavOpen] = useState(false);

  useEffect(() => {
    setIsNavOpen(false);
  }, [pathname]);

  return (
    <div className={isNavOpen ? "app-shell nav-open" : "app-shell"}>
      <button
        type="button"
        className="mobile-nav-toggle"
        onClick={() => setIsNavOpen((current) => !current)}
        aria-expanded={isNavOpen}
        aria-controls="workspace-navigation"
        aria-label={isNavOpen ? "Close navigation" : "Open navigation"}
      >
        {isNavOpen ? <X size={18} /> : <Menu size={18} />}
        <span>{isNavOpen ? "Close" : "Menu"}</span>
      </button>
      <button type="button" className="sidebar-backdrop" aria-hidden={!isNavOpen} tabIndex={-1} onClick={() => setIsNavOpen(false)} />
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

        <nav id="workspace-navigation" className="nav-list" aria-label="Workspace navigation">
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
