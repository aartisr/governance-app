# Requirements Traceability

This app implements the combined requirements from:

- `/Users/rraviku2/Downloads/Elite_Nobel_Proposal_Aarti_Ravikumar.pdf`
- `/Users/rraviku2/Downloads/congressional_app.txt`

## Source Concepts

### Pareto Legislative Engine

Implemented as:

- `src/services/governance-engine.ts`
- `/compromise` route
- `/feedback` route
- `/impact` route

Capabilities:

- Mechanism-design framing for policy decisions.
- Quadratic voting through scarce weekly voice-token budgets.
- Pareto frontier scoring for amendments.
- Faction hard boundaries and negotiable zones.
- Risk-adjusted compromise recommendation.

### Adaptive Trust Networks

Implemented as:

- `scoreTrust()` in `src/services/governance-engine.ts`
- `/trust` route
- `TrustParticipant` model in `src/domain/types.ts`

Capabilities:

- Accuracy, expertise, consistency, and transparency scoring.
- Credibility-weighted governance participants.
- Visual trust meters for analysts, experts, constituents, offices, and civil society.

### Multi-Tenant RAG And Impact Mapping

Implemented as:

- Evidence source model in `src/domain/types.ts`
- `EvidenceList` virtualized component.
- `/bills/$billId` route.
- `/impact` route.

Capabilities:

- Source-grounded bill summaries.
- Evidence memory with trust and recency scoring.
- Localized district impact simulation.
- Section-level policy impact views.

## TanStack Usage

- TanStack Router: route-level application shell and workspaces.
- TanStack Query: resilient mock service loading and cache policy.
- TanStack Table: sortable, filterable bill corpus.
- TanStack Virtual: scalable evidence memory list.
- TanStack Form dependency is included for future production-grade data entry flows.

## Extension Points

The mock data layer can be replaced without changing UI contracts:

- Replace `listBills()` with live legislative APIs.
- Replace `getLocalizedImpacts()` with economic and census models.
- Replace `evidenceSources` with vector/RAG retrieval results.
- Replace `paretoScenario` with multi-agent optimization output.
- Replace `trustParticipants` with audited institutional trust data.
