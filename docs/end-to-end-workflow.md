# Current Workflow and Proposed Extensions

This page separates the **implemented prototype** from the larger civic system described in proposal material. All current bills, districts, evidence cards, comments, participant attributes, and amendment inputs are local examples in [governance-data.ts](../src/data/governance-data.ts).

## What the app connects today

| Step | Input | Output |
| --- | --- | --- |
| Bill review | Three stored sample bills and linked source IDs | Searchable list, section summaries, and source cards |
| Local impact | Stored section and district values | Formula-based exposure equivalent and confidence value |
| Priority exercise | Preset group allocations and page-local slider changes | Quadratic cost and remaining budget |
| Trust display | Four stored attributes per sample participant | Weighted score and ranking |
| Amendment comparison | Four stored options with assumed utilities, risk, and complexity | Scores, Pareto flags, and fixed recommendation |

These steps are available from the navigation, but they are **not one connected decision pipeline**. Feedback choices do not change amendment utilities. Trust scores do not weight those utilities. Listed faction boundaries are visible text, not enforced constraints. The app does not ingest live bills, generate amendments, record votes, track enactment, or update scores from observed outcomes.

## Optional demonstrations

The policy inspector calls a server endpoint. If a valid Gemini key is configured and the request succeeds, it returns model-generated text; otherwise the endpoint returns labeled simulated text. The docket panel filters local bills and does not sync LegiScan. The Monte Carlo panel samples from assumed distributions, not validated policy uncertainty. The Markdown report exports the current sample scenario and is not an independent audit.

## What a real deployment would need

An operational civic system would need authoritative bill intake; links to verifiable source documents; calibrated and reviewed impact estimates; identity, privacy, accessibility, and anti-coercion safeguards for participation; explicit, reviewable constraints; public correction and appeal; and an audit trail from inputs to decisions and observed results. These are requirements to investigate, not claims about the present app.

See [Methods and Mathematics](pareto-governance-engine-and-math.md) for the implemented calculations and [How Civic Accord Works](how-the-governance-app-works.md) for a user walkthrough.
