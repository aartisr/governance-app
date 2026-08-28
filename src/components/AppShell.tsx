import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { Info, Menu, Scale, X } from "lucide-react";
import { useEffect, useState } from "react";
import { primaryNavigationItems } from "../routes/navigation";
import { updatePageMetadata } from "../seo";

export function AppShell() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const [isNavOpen, setIsNavOpen] = useState(false);

  useEffect(() => {
    setIsNavOpen(false);
  }, [pathname]);

  useEffect(() => {
    updatePageMetadata(pathname);
  }, [pathname]);

  return (
    <div className={`app-shell${isNavOpen ? " nav-open" : ""}`}>
      <button
        type="button"
        className="mobile-nav-toggle"
        onClick={() => setIsNavOpen((current) => !current)}
        aria-expanded={isNavOpen ? "true" : "false"}
        aria-controls="workspace-navigation"
        aria-label={isNavOpen ? "Close navigation" : "Open navigation"}
      >
        {isNavOpen ? <X size={18} /> : <Menu size={18} />}
        <span>{isNavOpen ? "Close" : "Menu"}</span>
      </button>
      <button
        type="button"
        className="sidebar-backdrop"
        aria-hidden={isNavOpen ? "false" : "true"}
        aria-label="Close navigation"
        tabIndex={-1}
        onClick={() => setIsNavOpen(false)}
      />
      <aside className="sidebar">
        <div className="flag-band" aria-hidden="true" />
        <div className="brand">
          <div className="brand-mark">
            <Scale size={22} />
          </div>
          <div>
            <strong>Civic Accord</strong>
            <span>Powered by Pareto Governance Engine</span>
          </div>
        </div>

        <nav id="workspace-navigation" className="nav-list" aria-label="Workspace navigation">
          {primaryNavigationItems.map((item) => {
            const Icon = item.icon;
            const active = item.match === "exact" ? pathname === item.path : pathname.startsWith(item.path);
            return (
              <Link key={item.id} to={item.path} className={active ? "nav-item active" : "nav-item"}>
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
        <aside className="prototype-notice" aria-label="Prototype data notice">
          <Info size={17} aria-hidden="true" />
          <p><strong>Prototype demonstration.</strong> All bills, districts, sources, scores, and recommendations in this version are illustrative mock data and deterministic simulations. Verify primary sources before using any result in a real decision.</p>
        </aside>
        <Outlet />
        <footer className="app-credit">
          Created with care for community by <a href="https://ai-aarti.com/">Aarti S Ravikumar</a>
        </footer>
      </main>
    </div>
  );
}
