# Pareto Governance Engine: Methods and Mathematics

Civic Accord is the public-facing civic workspace. The **Pareto Governance Engine** is its internal, explainable decision-support method. It does not decide policy, rank people, or replace public deliberation. It organizes a small set of declared inputs so that people can inspect trade-offs, question assumptions, and compare possible amendments.

> **Prototype boundary:** The current application uses illustrative bills, district profiles, evidence summaries, stakeholder utilities, confidence values, and fixed model constants. The equations below describe what the software currently calculates. They are not calibrated forecasts, legal advice, or a basis for real public decisions.

## Why a Pareto method?

Many policy conversations are represented as a single yes-or-no vote. That representation loses important information:

- People can agree about a goal while disagreeing about the mechanism.
- A group may accept one option but regard another as an unacceptable loss.
- A proposal can increase average benefit while leaving one group significantly worse off.
- Delivery risk and administrative complexity can make an otherwise attractive policy difficult to realize.

The Pareto Governance Engine keeps several objectives visible at the same time. It asks whether one amendment is clearly better than another across all of the declared measures, rather than hiding the choice inside one opaque total.

An amendment $a$ **Pareto dominates** amendment $b$ when it is at least as good on every selected objective and strictly better on at least one. A dominated option is not automatically immoral or impossible. It is simply not the strongest option under the current model inputs.

## The model in one view

For each candidate amendment $a$, the engine starts with group utility values:

$$
U_g(a) \in [0, 1]
$$

where $g$ is a stakeholder group and $U_g(a)$ is the modelled value of the amendment for that group. The prototype then calculates:

$$
\bar{U}(a) = \frac{1}{|G|}\sum_{g \in G} U_g(a)
$$

$$
U_{\min}(a) = \min_{g \in G} U_g(a)
$$

$$
R(a) = \bar{U}(a)\bigl(1 - 0.62r(a)\bigr)\bigl(1 - 0.28c(a)\bigr)
$$

where:

- $\bar{U}(a)$ is **shared benefit**, the unweighted average value across the declared groups.
- $U_{\min}(a)$ is **minimum support**, the lowest group utility. It makes the least-served group visible.
- $R(a)$ is the **risk-adjusted score** used to rank non-dominated options in the current prototype.
- $r(a)$ is the declared delivery risk, from $0$ to $1$.
- $c(a)$ is the declared implementation complexity, from $0$ to $1$.
- $0.62$ and $0.28$ are prototype penalty weights, not empirically calibrated policy constants.

The engine computes a Pareto frontier using $\bar{U}(a)$, $U_{\min}(a)$, and $R(a)$. It then presents the frontier and selects the frontier option with the highest $R(a)$ as the current recommendation.

## 1. Voice tokens: measuring priority intensity

The feedback workflow uses a quadratic budget. A participant can assign an integer number of votes $v_i$ to issue $i$, but the cost rises quadratically:

$$
C_i = \max(0, v_i)^2
$$

For a set of allocations $I$ and weekly budget $B$, the total cost is:

$$
C_{\text{total}} = \sum_{i \in I} C_i
$$

The allocation is over budget when:

$$
C_{\text{total}} > B
$$

### What quadratic cost changes

With a linear cost, assigning five votes would cost five tokens. With a quadratic cost, it costs twenty-five tokens:

| Votes on one issue | Token cost |
| ---: | ---: |
| 1 | 1 |
| 2 | 4 |
| 3 | 9 |
| 4 | 16 |
| 5 | 25 |

This makes intensity visible while making it increasingly expensive to place maximum emphasis on every issue. It does **not** decide whether a priority is ethically correct, and the current prototype does not feed these allocations directly into amendment utilities. They are displayed as an accountable input for deliberation.

### Important limitations

Quadratic voting has meaningful design questions in a real civic setting: identity verification, accessibility, unequal time or information, strategic behavior, coercion, and whether a token budget fairly represents affected communities. A real implementation would require public governance, privacy protections, independent audit, and careful empirical evaluation before using this mechanism beyond demonstration.

## 2. Stakeholder trust: a visible weighted score

The Trust workspace calculates a trust score for each participant or source from four normalized inputs, each in $[0,1]$:

- accuracy: $A$
- expertise: $E$
- consistency: $K$
- transparency: $T$

The exact prototype formula is:

$$
S_{\text{trust}} = 0.36A + 0.28E + 0.22K + 0.14T
$$

The weights sum to one:

$$
0.36 + 0.28 + 0.22 + 0.14 = 1
$$

Accuracy receives the largest weight, then expertise, consistency, and transparency. For example, a participant with $A=0.90$, $E=0.93$, $K=0.84$, and $T=0.88$ receives:

$$
S_{\text{trust}} = 0.36(0.90) + 0.28(0.93) + 0.22(0.84) + 0.14(0.88) = 0.892
$$

or approximately $89\%$.

### What the trust score means, and what it does not

The score is an explanation aid. It makes the model's weighting assumptions inspectable. It should not be interpreted as a measure of a person's civic worth, a license to silence a new voice, or a replacement for evidence review. In the current prototype, trust scores are shown as context; they do not directly modify the compromise utility calculation.

A production system would need clear definitions, provenance for every input, appeal and correction processes, group-fairness evaluation, versioned scoring rules, and strict safeguards against feedback loops that permanently disadvantage less-resourced participants.

## 3. Local impact estimates: making a national proposal legible locally

For each bill section and district, the Impact workspace calculates an illustrative exposure estimate. Let:

- $P$ be the section's base affected-population percentage.
- $q$ be district rural share.
- $s$ be district small-business share.
- $m$ be district median income.

The model applies a rural multiplier to health and infrastructure sections:

$$
M_r =
\begin{cases}
1 + 0.35q & \text{for health or infrastructure} \\
1 & \text{otherwise}
\end{cases}
$$

It applies a business multiplier to tax sections:

$$
M_s =
\begin{cases}
1 + 0.70s & \text{for tax} \\
1 & \text{otherwise}
\end{cases}
$$

The income normalizer is bounded to prevent extreme results:

$$
N_m = \min\bigl(1.28, \max(0.72, m / 85000)\bigr)
$$

The displayed local exposure estimate is:

$$
D = \operatorname{round}_{0.1}\left(\frac{P M_r M_s}{N_m}\right)
$$

The impact confidence is separately calculated from the section confidence $C_s$ and district trust baseline $C_d$:

$$
C_{\text{impact}} = \operatorname{round}_{0.01}(C_s C_d)
$$

### Worked local-impact example

Suppose an infrastructure section has $P=42$, a district has rural share $q=0.04$, median income $m=113200$, and the section has confidence $C_s=0.82$ while district trust baseline is $C_d=0.62$.

$$
M_r = 1 + 0.35(0.04) = 1.014
$$

$$
N_m = \min(1.28, \max(0.72, 113200/85000)) = 1.28
$$

$$
D = \operatorname{round}_{0.1}\left(42(1.014)/1.28\right) = 33.3
$$

$$
C_{\text{impact}} = \operatorname{round}_{0.01}(0.82 \times 0.62) = 0.51
$$

The app therefore displays a $33.3\%$ illustrative exposure estimate with $51\%$ confidence for that section-district pair.

These percentages do not predict individual outcomes or estimate causal effects. They are deterministic demonstrations of how explicitly declared local context can affect an estimate.

## 4. Amendment utilities: comparing possible designs

Every candidate amendment stores one declared utility value for each stakeholder group. The current data model has three groups. The values are normalized to the $[0,1]$ range and are illustrative assumptions, not survey findings.

For an amendment with utilities:

$$
(0.76, 0.73, 0.84)
$$

the shared benefit is:

$$
\bar{U} = (0.76 + 0.73 + 0.84) / 3 = 0.777
$$

and its minimum support is:

$$
U_{\min} = \min(0.76, 0.73, 0.84) = 0.73
$$

Average utility captures broad gain, but it can hide a serious loss. Minimum support counterbalances that tendency by keeping the lowest group outcome visible.

## 5. Risk-adjusted score: retaining delivery reality

A policy option can look attractive in principle but be fragile, expensive to administer, or difficult to implement. The prototype therefore reduces shared benefit using the declared risk and complexity values:

$$
R = \bar{U}(1 - 0.62r)(1 - 0.28c)
$$

For the example above, with $r=0.18$ and $c=0.25$:

$$
R = 0.777(1 - 0.62(0.18))(1 - 0.28(0.25))
$$

$$
R = 0.777(0.8884)(0.93) = 0.642
$$

The app rounds this to $0.642$. Higher is better **only under the declared utility, risk, and complexity assumptions**. The formula does not establish moral legitimacy, statutory feasibility, or public consent.

## 6. Pareto frontier: eliminating clearly weaker options

Each amendment is represented by a vector of the three model objectives:

$$
\mathbf{x}(a) = \bigl(\bar{U}(a), U_{\min}(a), R(a)\bigr)
$$

Amendment $a$ dominates amendment $b$ when:

$$
\bar{U}(a) \geq \bar{U}(b)
$$

$$
U_{\min}(a) \geq U_{\min}(b)
$$

$$
R(a) \geq R(b)
$$

and at least one of these inequalities is strict. The **Pareto frontier** contains every amendment that is not dominated by another candidate.

This is deliberately weaker than saying “the frontier option is the correct answer.” Frontier options can represent real, transparent trade-offs. One may deliver higher average benefit, while another protects the least-served group more strongly. The current prototype takes one additional step and ranks frontier options by $R(a)$ for a clear starting recommendation. That ranking is a convenience choice, not a democratic mandate.

## From calculation to accountable deliberation

The engine is useful only when users can see and challenge its inputs. A responsible workflow is:

1. Read the bill text and the evidence linked to each section.
2. Inspect the district factors and confidence values behind local estimates.
3. State priorities and hard boundaries openly.
4. Review each amendment's group utilities, risk, and complexity assumptions.
5. Compare the Pareto frontier rather than accepting a single score blindly.
6. Debate, amend, vote, and record outcomes through accountable human institutions.
7. Evaluate whether later reality supports or contradicts the model assumptions.

## What a production-grade engine would require

Before any system like this could responsibly influence real policy, it would need substantially more than the current prototype:

- authoritative, current, and attributable source data;
- formal definitions for every input and outcome;
- published calibration and uncertainty methodology;
- sensitivity analysis showing how conclusions change when assumptions change;
- mechanisms for public correction, disagreement, and appeal;
- privacy, accessibility, and anti-coercion protections;
- independent security, fairness, and model-governance review;
- explicit legal and constitutional constraints that cannot be traded away by a score;
- human decision authority and complete public audit trails.

The mathematical purpose of the Pareto Governance Engine is modest but important: make competing objectives visible, identify options that are clearly weaker under stated assumptions, and leave the final judgment where it belongs, with accountable people and democratic institutions.

---

Created with care for community by [Aarti S Ravikumar](https://ai-aarti.com/)
