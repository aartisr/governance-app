# Civic Accord

Civic Accord is an interactive prototype for exploring how people might review legislation, compare illustrative local effects, express priorities, and discuss amendments. Its bills, districts, sources, comments, and scores are examples defined in [`src/data/governance-data.ts`](src/data/governance-data.ts). They are fictional, not official records or measured outcomes.

**Use the app to explore a method, not to make a real policy decision.** Verify any real bill against primary legislative sources. The app does not establish legal validity, public support, fairness, or compliance with a standard.

## Run locally

**Requirements:** Node.js **22.12 or newer in the 22.x line** and npm **10 or newer**. Check with `node --version` and `npm --version`. Vite does not support Node 22.6, even if some commands appear to work with it.

From a terminal:

```bash
git clone https://github.com/aartisr/governance-app.git
cd governance-app
npm ci --include=dev --include=optional
npm run dev
```

If the repository is already cloned, change into its root and run the last two commands. Open <http://localhost:3000> in your browser. Keep the terminal running while you use the app; press **Ctrl+C** to stop it. Check server health at <http://localhost:3000/api/health>. The local server uses port 3000, so stop anything else using that port first.

The app works without API keys. Its optional AI inspector returns a clearly labeled simulated response when no Gemini key is available. To try the upstream Gemini service, set `GEMINI_API_KEY` in the terminal **before** starting the server. For example, on macOS or Linux:

```bash
GEMINI_API_KEY=YOUR_KEY npm run dev
```

On PowerShell, set `$env:GEMINI_API_KEY = "YOUR_KEY"` and then run `npm run dev`. The development command does **not** automatically read `.env` files. Keep real keys out of Git.

### Check the project

Run these from the repository root:

```bash
npm run typecheck
npm test
npm run build
```

`npm run build` type-checks the code, builds the Vite client into `dist/`, and generates route and discovery files. To view that built client, stop `npm run dev` first, then run `npm run preview` and open **http://localhost:3000**. The preview is static; use `npm run dev` when you need the local Express API.

If the browser still shows an older screen or an error after a code change, restart `npm run dev` and refresh the tab. If npm reports a missing native binding, run `npm ci --include=dev --include=optional` again with a supported Node version. Keep the committed `package-lock.json` in place.

## Try the prototype

1. Open **Bills** and choose a sample bill. Its detail page shows stored section summaries, budget figures, and source cards. The source cards contain sample excerpts, not links to verified documents.
2. Open **Impact**. Choose a bill and one of three sample district profiles. The displayed percentage is a formula-based *exposure equivalent*, not a forecast of residents who will benefit or a causal impact estimate.
3. Open **Voter feedback**. Move the issue sliders to see quadratic token costs. The 50-token budget is displayed, but the interface does not prevent over-budget allocations. Changes are local to the page and are not submitted or saved.
4. Open **Compromise analysis**. Compare four preset amendments and their assumed group utilities. The recommendation uses a risk-adjusted score. The interactive simulator has separate weighting controls; these do not alter the fixed recommendation card.
5. Open **Stakeholder trust** to inspect four weighted score dimensions for sample participants. These scores do not change the amendment recommendation.

The [plain-language walkthrough](docs/how-the-governance-app-works.md) follows the sample Community Resilience and Enterprise Act. The [methods guide](docs/pareto-governance-engine-and-math.md) gives the implemented formulas and their limits. The [failure-mode audit](docs/model-failure-modes.md) gives reproducible cases where the model can mislead.

## What is implemented

| Area | Current behavior | Important limit |
| --- | --- | --- |
| Bills | Search, filter, compare, and inspect three locally defined bills | No official legislative feed or full statutory text |
| Evidence | Display source titles, excerpts, and assigned scores | No live retrieval or independent source verification |
| Impact | Calculate section-level exposure equivalents from sample district factors | No calibration, uncertainty study, or outcome tracking |
| Feedback | Show quadratic costs and a remaining budget for preset groups | No account, submission, persistence, or binding vote |
| Compromise | Score preset amendments and identify non-dominated options | Utilities and risks are assumptions; group boundaries are displayed but not enforced |
| Trust | Calculate a weighted score from four preset attributes | No observed accuracy history or effect on the recommendation |
| AI inspector | Request optional Gemini analysis through a server endpoint | Without a working key, or when a request fails, the endpoint returns a labeled simulated response |

The app also includes an optional sample comment filter, a Monte Carlo demonstration driven by assumed distributions, and a Markdown report download. Bills search uses local fictional data; it does not call LegiScan. The safety card is an informational UI, not an audit or certification. The guided tour displays the current app routes in a live frame with narrated captions; its fictional inputs and claims still require independent verification.

## Code map

- [`src/routes/router.tsx`](src/routes/router.tsx): app routes; page components are in `src/routes/pages/`.
- [`src/data/governance-data.ts`](src/data/governance-data.ts): sample bills, districts, evidence, groups, comments, and amendments.
- [`src/domain/types.ts`](src/domain/types.ts): shared data shapes.
- [`src/services/governance-engine.ts`](src/services/governance-engine.ts): token, trust, impact, and amendment calculations.
- [`server.ts`](server.ts) and [`api/gemini/analyze-policy.ts`](api/gemini/analyze-policy.ts): local and Vercel policy-analysis handlers.
- [`src/site-metadata.ts`](src/site-metadata.ts): page titles, descriptions, and origin selection.

The calculation paths currently use local data. For example, adjusting a feedback slider does not feed the result into the compromise score. See the [workflow map](docs/end-to-end-workflow.md) for what is connected today.

## Deployment and discovery files

[`vercel.json`](vercel.json) configures a Vite build, `dist` output, and client route fallback. The repository also contains a Vercel API handler for policy analysis. Set `GEMINI_API_KEY` as a server-side deployment secret only if you want to try upstream analysis; responses may still fail or be inaccurate.

The build generator writes static route HTML and discovery files such as `sitemap.xml`, `robots.txt`, and `llms.txt`. Give it the public origin with `PUBLIC_SITE_URL=https://your-domain.example` when building for a custom host. Without a deployment hostname, generated URLs fall back to `http://localhost:3000`. A deployed hostname and crawlable files do not guarantee indexing.

The GitHub Wiki source is in [`wiki/`](wiki/). The [Publish Wiki workflow](.github/workflows/publish-wiki.yml) requires Wikis to be enabled and a `WIKI_PUSH_TOKEN` repository secret with write access. [`published-wiki/`](published-wiki/) is a local copy, not the source used by that workflow. IndexNow submission is available through `npm run indexnow:submit` after the relevant public sites and verification key files are deployed; see [`scripts/submit-indexnow.mjs`](scripts/submit-indexnow.mjs) for the exact behavior.

## Documentation

- [Plain-language walkthrough](docs/how-the-governance-app-works.md)
- [Citizen journey](docs/citizen-journey.md)
- [Current workflow and proposed extensions](docs/end-to-end-workflow.md)
- [Methods and mathematics](docs/pareto-governance-engine-and-math.md)
- [Model failure modes](docs/model-failure-modes.md)
- [Design system](docs/design-system.md)
- [Quality roadmap and evidence criteria](docs/quality-roadmap.md)
- [Documentation map and archive note](docs/README.md)
- [Contributing](CONTRIBUTING.md), [support](SUPPORT.md), and [security reporting](SECURITY.md)

Longer narrative and proposal material in this repository describes a possible future system. Read those documents as concepts unless a capability is confirmed in the current implementation.

## Contribute

Start with [CONTRIBUTING.md](CONTRIBUTING.md). Keep new claims traceable to code or a verifiable source, label assumptions, and preserve the distinction between sample data and real evidence. For security issues, use the private reporting path in [SECURITY.md](SECURITY.md).

Created by [Aarti S Ravikumar](https://ai-aarti.com/) at [Pioneer Charter School of Science II](https://saugus.pioneercss.org). Licensed under [MIT](LICENSE).
