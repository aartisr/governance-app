# What can break in the Civic Accord prototype

These are reproducible counterexamples to treating the current model as a real-world recommendation. The app uses fictional bills, districts, participants, utilities, risk values, and coefficients. Passing software tests does not establish that those inputs represent a community.

| Failure mode | Reproducible evidence | Consequence and current guard |
| --- | --- | --- |
| An exposure formula exceeds 100% | For the sample outcome dashboard in IA-04, `100 × 1 ÷ 0.755… = 132.4%` before rounding. | The displayed estimate is now capped at 100% and the raw value is shown in its explanation. The cap fixes the display range, not the underlying validity of the estimate. |
| A normative weight changes the preferred amendment | With equal group weights, the five-year sunset scores **0.642** and the transparent formula **0.581**. Setting Growth to **0.2**, Equity to **2.5**, and Fiscal to **1.0** changes those scores to **0.629** and **0.638**, respectively. | The leading option flips. The tour demonstrates the sliders and the simulator names the new leader. Stakeholder weights require public justification. |
| Pareto efficiency fails to choose one answer | All four sample amendments are non-dominated under the preset utility vectors. | The frontier leaves all four options in play. The single recommended card depends on the separate risk-adjusted score and its assumptions. |
| Feedback appears connected to the decision when it is not | Changing token allocations does not alter amendment utilities or the recommendation. Impact and trust scores are also absent from the ranking formula. | The tour and each relevant screen now say this explicitly. No real preference or trust evidence should be inferred from the ranking. |
| Simulation percentiles look like measured certainty | The 1,000-run chart samples distributions chosen in code, with no outcome dataset used to calibrate them. | The chart is labelled as an amendment-score simulation. Its percentiles cannot establish real-world confidence or validate local impact. |
| Malformed inputs produce plausible-looking numbers | Negative or non-integer token votes, non-finite utility or weight values, unmatched stakeholder sets, and invalid simulation counts could previously pass into calculations. | The engine now rejects these cases with range errors; automated tests cover representative cases. This does not validate the fixed sample inputs themselves. |

## How to reproduce

Run `npm test` for the boundary and ranking sensitivity checks in `tests/governance-engine.test.ts`. On the website, open **Video Demo** and play **Stress-test the recommendation** to see the weight change. The **Impact** screen shows the raw and capped calculation in **How is this calculated?** The **Compromise analysis** screen shows the ranking formula in **How does the Pareto engine work?**

Before any use for a real civic decision, independently verify source documents and outcomes, specify how utilities and weights are elicited, test uncertainty against observed data, assess fairness across affected groups, and make corrections and appeals possible. The current prototype does none of that validation.
