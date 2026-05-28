export type ThemeMode = "executive" | "legislative" | "public-service";

export const THEME_STORAGE_KEY = "governance-theme-mode";
export const THEME_CHANGE_REQUEST_EVENT = "governance:theme-change-request";
export const THEME_CHANGED_EVENT = "governance:theme-changed";

export const themeModes: Array<{ id: ThemeMode; label: string }> = [
  { id: "executive", label: "Executive" },
  { id: "legislative", label: "Legislative" },
  { id: "public-service", label: "Public Service" },
];

export function isThemeMode(value: unknown): value is ThemeMode {
  return value === "executive" || value === "legislative" || value === "public-service";
}

export function getInitialThemeMode(): ThemeMode {
  if (typeof window === "undefined") {
    return "legislative";
  }

  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
  return isThemeMode(stored) ? stored : "legislative";
}

export function applyThemeModeToBody(mode: ThemeMode) {
  if (typeof document === "undefined") {
    return;
  }

  document.body.classList.remove("theme-executive", "theme-legislative", "theme-public-service");
  document.body.classList.add(`theme-${mode}`);
}

export function getThemeModeFromBody(): ThemeMode {
  if (typeof document === "undefined") {
    return "legislative";
  }

  if (document.body.classList.contains("theme-executive")) {
    return "executive";
  }

  if (document.body.classList.contains("theme-public-service")) {
    return "public-service";
  }

  return "legislative";
}

export function emitThemeChangeRequest(mode: ThemeMode) {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new CustomEvent<ThemeMode>(THEME_CHANGE_REQUEST_EVENT, { detail: mode }));
}

export function emitThemeChanged(mode: ThemeMode) {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new CustomEvent<ThemeMode>(THEME_CHANGED_EVENT, { detail: mode }));
}

export function subscribeThemeChanged(handler: (mode: ThemeMode) => void) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const listener = (event: Event) => {
    const customEvent = event as CustomEvent<ThemeMode>;
    if (isThemeMode(customEvent.detail)) {
      handler(customEvent.detail);
    }
  };

  window.addEventListener(THEME_CHANGED_EVENT, listener);

  return () => {
    window.removeEventListener(THEME_CHANGED_EVENT, listener);
  };
}
