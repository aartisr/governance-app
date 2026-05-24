# Pareto Governance Engine

An innovateive governance application prototype inspired by the Pareto Legislative Engine and Adaptive Trust Networks proposals.

## Core Capabilities

- Quadratic constituent feedback with weekly voice-token budgets.
- Neutral bill intelligence with section-level localized impact analysis.
- Pareto-efficient compromise simulation across factions, hard boundaries, and negotiable zones.
- Adaptive Trust Network scoring for evidence, participants, accuracy, expertise, and consistency.
- TanStack-powered architecture using Router, Query, Table, Virtual, and Form.

## Run

```bash
npm install
npm run dev
```

Open `http://127.0.0.1:5180`.

## Build

```bash
npm run build
```

## Design Principles

- Generic data contracts so bills, districts, factions, evidence sources, and simulations are replaceable.
- Local-first mock service layer that can be swapped for APIs without changing the UI.
- Dense, scan-friendly civic operations UI rather than a marketing landing page.
- Resilient engine functions with deterministic outputs and graceful empty states.
