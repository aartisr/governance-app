import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { Menu, Scale, X } from "lucide-react";
import { useEffect, useState } from "react";
import { primaryNavigationItems } from "../routes/navigation";
import {
  applyThemeModeToBody,
  emitThemeChanged,
  getInitialThemeMode,
  isThemeMode,
  THEME_CHANGE_REQUEST_EVENT,
  THEME_STORAGE_KEY,
  themeModes,
  type ThemeMode,
} from "../theme/theme-mode";

export function AppShell() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [themeMode, setThemeMode] = useState<ThemeMode>(getInitialThemeMode);
  const [isThemeAnimating, setIsThemeAnimating] = useState(false);

  useEffect(() => {
    setIsNavOpen(false);
  }, [pathname]);

  useEffect(() => {
    window.localStorage.setItem(THEME_STORAGE_KEY, themeMode);
    applyThemeModeToBody(themeMode);
    emitThemeChanged(themeMode);

    setIsThemeAnimating(true);
    const timeoutId = window.setTimeout(() => {
      setIsThemeAnimating(false);
    }, 360);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [themeMode]);

  useEffect(() => {
    const listener = (event: Event) => {
      const customEvent = event as CustomEvent<ThemeMode>;
      if (isThemeMode(customEvent.detail)) {
        setThemeMode(customEvent.detail);
      }
    };

    window.addEventListener(THEME_CHANGE_REQUEST_EVENT, listener);

    return () => {
      window.removeEventListener(THEME_CHANGE_REQUEST_EVENT, listener);
    };
  }, []);

  return (
    <div className={`app-shell theme-${themeMode}${isThemeAnimating ? " theme-animating" : ""}${isNavOpen ? " nav-open" : ""}`}>
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
        <div className="flag-band" aria-hidden="true" />
        <div className="brand">
          <div className="brand-mark">
            <Scale size={22} />
          </div>
          <div>
            <strong>Pareto Governance</strong>
            <span>Civic Operations Console</span>
          </div>
        </div>

        <section className="theme-switch" aria-label="Visual theme mode">
          <p>Chamber mode</p>
          <div className="theme-switch-buttons" role="group" aria-label="Theme selection">
            {themeModes.map((mode) => (
              <button
                key={mode.id}
                type="button"
                className={mode.id === themeMode ? "active" : ""}
                onClick={() => setThemeMode(mode.id)}
              >
                {mode.label}
              </button>
            ))}
          </div>
        </section>

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
        <Outlet />
      </main>
    </div>
  );
}
