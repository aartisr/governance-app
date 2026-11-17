# How Civic Accord Works

This guide follows one **fictional** bill through the current prototype. The app's records and outputs are examples. They do not describe legislation before Congress or predict real outcomes.

## Start with a sample bill

Open [Bills](https://governanceapp.ai-aarti.com/bills) and select **Community Resilience and Enterprise Act**. The sample record has three sections: an infrastructure bond guarantee, a small-business continuity credit, and an outcome reporting requirement. Its sponsor, status, dates, budget figures, and summaries are written into the app's [sample dataset](../src/data/governance-data.ts).

The bill page shows source cards with titles and excerpts. These are also sample records. There are no links to the actual text of a real bill, and the displayed source scores have not been independently verified. Use them to understand the interface, not as citations in a real debate.

## Compare district profiles

Open [Impact](https://governanceapp.ai-aarti.com/impact), choose the bill, and switch between the three sample districts. For every section, the app starts with a stored affected-population percentage and adjusts it using the district's rural share, small-business share for tax sections, and median income. It displays the result as an **exposure equivalent**.

For the infrastructure section in Bay Civic District, the stored base is 42%. The formula produces 33.3%; the displayed confidence is 51%, calculated from two stored values. Neither number has been calibrated against observed policy outcomes. A value above 100% is mathematically possible, another reason not to read this as a literal share of residents.

## Explore priority costs

Open [Voter feedback](https://governanceapp.ai-aarti.com/feedback). Choose a preset group and move an issue slider. Each issue's token cost is the square of its vote count: three votes cost nine tokens and five cost 25. The page shows a 50-token budget and flags overspending. It does not block an over-budget choice, verify a voter, save input, or send it to a public body. Slider choices do not change the compromise recommendation.

The comment panel filters fictional testimony by theme and sentiment. It is not receiving public submissions.

## Compare assumed amendments

Open [Compromise analysis](https://governanceapp.ai-aarti.com/compromise). The page compares four preset amendments, each with assumed utilities for three groups plus risk and complexity values. The app calculates average utility, lowest group utility, and a risk-adjusted score. It marks options that are not dominated across the three groups' utilities and shows the highest risk-adjusted score among those options as a discussion starting point.

The group's listed hard boundaries are **not** encoded as constraints in this calculation. The interactive simulator lets you change weights for a separate comparison; it does not amend the fixed recommendation card. The numbers express assumptions in a toy model, not negotiated consent.

## Read trust scores in context

Open [Stakeholder trust](https://governanceapp.ai-aarti.com/trust). The app combines four stored attributes—accuracy, expertise, consistency, and transparency—into a score for each sample participant. No real track record has been measured, and these scores do not weight the amendment calculation.

## What to take away

Civic Accord makes a possible review sequence visible: inspect a claim, compare assumptions, state priorities, and discuss alternatives. A real civic decision would require authoritative bill text, attributable evidence, validated impact methods, consent from affected communities, and accountable public processes.

For the exact equations, see [Methods and Mathematics](pareto-governance-engine-and-math.md).
