# Governance App Design System

This document defines the visual tokens and the modular app extension flow.

## Theme Modes

The app ships with three patriotic profiles that can be switched from the sidebar:

- Executive: high-contrast authority style for leadership briefings
- Legislative: balanced institutional style for committee and chamber work
- Public Service: calmer civic style for outreach and constituent operations

Theme choice is persisted in `localStorage` using the key `governance-theme-mode`.

## Core Tokens

Global tokens are defined in `src/styles.css` and consumed across all components.

- `--bg`: app background field
- `--surface`: default card surface
- `--surface-2`: subtle panel surface
- `--ink`: primary text color
- `--muted`: secondary text color
- `--line`: border and divider color
- `--accent`: primary interactive color
- `--accent-2`: secondary accent (alerts, eyebrow labels)
- `--gold`: ceremonial highlight accent
- `--shadow`: base elevation shadow

Sidebar-specific variables:

- `--sidebar-start`
- `--sidebar-mid`
- `--sidebar-end`
- `--flag-red`
- `--flag-blue`

Mode overrides are set on:

- `.app-shell.theme-executive`
- `.app-shell.theme-legislative`
- `.app-shell.theme-public-service`

Body background presets are set on:

- `body.theme-executive`
- `body.theme-legislative`
- `body.theme-public-service`

## Add a New Page

1. Create a page component in `src/routes/pages`.
2. Register a typed route in `src/routes/router.tsx` with `createAppChildRoute`.
3. Add a nav entry in `src/routes/navigation.ts` if it should appear in sidebar navigation.

This split keeps page logic isolated and navigation behavior declarative.

## Component Styling Rules

- Use token variables instead of hardcoded colors whenever possible.
- Reuse existing utility blocks (`card`, `badge`, `meter`, `section-title`) before creating new patterns.
- Preserve responsive breakpoints already defined in `src/styles.css`.
- Keep animation purposeful and low-motion (`rise-in`, short durations, no infinite loops).

## Accessibility Notes

- Maintain color contrast for each theme mode.
- Ensure keyboard-accessible controls for theme switching and navigation.
- Prefer text labels with icons, not icon-only controls.
