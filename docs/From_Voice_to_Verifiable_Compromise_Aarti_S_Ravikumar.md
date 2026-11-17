---
title: "From Voice to Verifiable Compromise"
subtitle: "An Inspectable Mathematics for Civic Decision Support"
author: "Aarti S Ravikumar · Pioneer Charter School of Science II"
date: "November 2026"
lang: en-US
---

<div class="paper-meta">CIVIC ACCORD RESEARCH PAPERS · METHODS ARTICLE · WORKING PROTOTYPE</div>

## Abstract

Public decisions are often presented as a single contest between winners and losers, even when the underlying disagreement concerns several negotiable design choices. This paper develops **Civic Accord**, an inspectable decision-support framework that separates five questions: what a proposal says; how assumed effects vary by place; how strongly groups prioritize issues; which amendments are non-dominated across groups; and how a declared risk-sensitive rule ranks those amendments. A **working interactive website** implements these components using fictional bills, districts, comments, and stakeholder values. The implemented mathematics includes quadratic voice-token costs, bounded local exposure equivalents, a displayed trust index, Pareto dominance, and an adjustable weighted-utility score. In the illustrative HR-104 case, all four candidate amendments are non-dominated, and changing declared group weights reverses the leading amendment. An exact pairwise crossing occurs at an Equity Bloc weight of approximately 2.132 when Growth and Fiscal weights are fixed at 0.2 and 1.0. This is a sensitivity result about assumed inputs, not evidence that the policy would succeed or that a community prefers it. The contribution is an operational design for **contestability**: every displayed recommendation can be traced to explicit assumptions and challenged without handing decision authority to the model. The larger legislative, participatory, and evidence-verification system described in the original proposal remains a funding-dependent research agenda. [1, 2, 11]

**Keywords:** civic decision support; Pareto frontier; quadratic voting; multi-criteria analysis; sensitivity analysis; public accountability; prototype.

## 1. The democratic problem is not a missing score

Consider a fictional town rebuilding a bridge. Families want a safer route. Shopkeepers fear losing customers during construction. Budget stewards want public proof that spending works. All may favor repair while disagreeing about financing, eligibility, oversight, and timing. A yes-or-no ballot compresses these concerns into one direction; a single aggregate score can compress them again. Social-choice theory warns that no general aggregation rule can dissolve every conflict among individual orderings [3]. Work on collective governance likewise emphasizes the importance of rules, local knowledge, and accountable institutions [4].

The research question is therefore narrower and more useful than “Can software choose the best law?” It is: **Can a civic interface expose the assumptions under which one amendment looks preferable, while preserving human authority over the choice?** Multi-attribute decision analysis provides a way to articulate trade-offs [5]. Pareto comparison identifies alternatives that are unambiguously weaker under a declared utility vector [6]. Neither supplies democratic legitimacy by itself. Civic Accord combines these established ideas in a transparent, screen-by-screen workflow. The originality claimed here lies in the inspectable integration and the explicit boundary between demonstration and evidence, not in inventing Pareto efficiency or quadratic voting.

The two earlier manuscripts named the Pareto Legislative Engine and Adaptive Trust Networks and envisioned a unified optimization pipeline [1, 2]. They also asserted improved utility and reduced polarization without a documented evaluation. This paper treats those assertions as hypotheses. It reports only what the current software computes and what can be reproduced from its fictional inputs. [11]

## 2. System boundary: a working website and a future system

The **Civic Accord website is implemented and interactive**. A visitor can browse three sample bills, inspect sections and example evidence cards, select among three fictional district profiles, change voice-token allocations, examine four amendment options, adjust group weights, view the Pareto frontier, run a sample score simulation, and inspect assumed trust components. The guided tour shows these actions in the live interface. The code is a React application with typed domain data and a separate calculation module; tests exercise key model boundaries and ranking sensitivity. [11]

Implementation must not be confused with empirical deployment. The bill texts, evidence excerpts, local inputs, participant attributes, amendment utilities, and penalty coefficients are fictional or declared examples. Feedback is page-local; it is neither recorded as a vote nor connected to amendment utilities. The trust index and local impact estimates also do not enter the amendment ranking. The app does not ingest official legislation, verify sources, enforce stakeholder hard boundaries, or measure policy outcomes. Optional AI text analysis may be simulated when no key is configured; it is not a verified evidence engine. [11]

| Question shown to the visitor | Implemented calculation or display | Present boundary |
|:--|:--|:--|
| What does the bill propose? | Searchable sample corpus; section and source cards | No official or current bill feed |
| Who might be affected locally? | District-adjusted exposure equivalent | Assumed inputs; no causal estimate |
| What matters most? | 50-token quadratic priority exercise | No identity, submission, or effect on ranking |
| Which amendments trade benefits? | Group utility vectors and Pareto flags | Utilities supplied by the scenario |
| Which option leads under stated weights? | Risk-adjusted score and interactive weights | Normative weights and penalties unvalidated |
| Can the inputs be trusted? | Separate four-part trust display | No measured credibility or influence on ranking |

This separation is a design result. It prevents a polished interface from implying that a complete democratic decision pipeline already exists. A full implementation of the original vision is a **future, funding-dependent program** requiring authoritative data partnerships, privacy-preserving participation, source verification, independent model assessment, and institutional governance. [1, 2, 9]

## 3. Mathematical method

### 3.1 Preference intensity without a false vote

For each issue $i$, a visitor chooses a nonnegative integer priority $v_i$. The displayed voice-token cost is

$$
c_i=v_i^2,\qquad C=\sum_{i=1}^{m}v_i^2,\qquad B=50.
$$

The screen shows $B-C$ when $C\leq B$ and an over-budget warning otherwise. Three priority points cost nine tokens; six cost thirty-six. This quadratic price reflects the established quadratic-voting idea that stronger expression should consume disproportionately more of a limited budget [7]. Here it is strictly an **educational simulation**. The website does not verify identity, accept a ballot, save allocations, or route these values into the Pareto engine. A budget display is not an election system. [7, 11]

### 3.2 Local context as an inspectable, bounded transformation

For bill section $s$ and district $d$, let $P_s$ be an assumed base exposure percentage, $q_d$ the rural share, $b_d$ the small-business share, and $m_d$ median income. The website computes

$$
M_r=\begin{cases}1+0.35q_d,&\text{health or infrastructure,}\\1,&\text{otherwise,}\end{cases}
\quad
M_b=\begin{cases}1+0.70b_d,&\text{tax,}\\1,&\text{otherwise,}\end{cases}
$$

$$
N_m=\min\{1.28,\max\{0.72,m_d/85000\}\},\qquad
D_{sd}=\operatorname{round}_{0.1}\!\left[\min\{100,\max\{0,P_sM_rM_b/N_m\}\}\right].
$$

These coefficients are scenario constants, not fitted parameters. For the sample infrastructure section in Bay Civic District, $P_s=42$, $q_d=0.04$, and $m_d=113{,}200$. Thus $M_r=1.014$, $N_m=1.28$, and $D_{sd}=33.3\%$. The separate displayed confidence is $\operatorname{round}_{0.01}(0.82\times0.62)=0.51$, a product of two stored assumptions, not a statistical confidence interval. A raw value above 100% is capped for display; capping prevents an impossible label but does not make the model empirically valid. [11]

### 3.3 An explanation index for trust

For a fictional participant, four normalized inputs—accuracy $A$, expertise $E$, consistency $K$, and transparency $T$—produce

$$
S_{\mathrm{trust}}=0.36A+0.28E+0.22K+0.14T.
$$

The coefficients sum to one, so valid inputs in $[0,1]$ yield a score in $[0,1]$. For the stored example $(0.90,0.93,0.84,0.88)$, the result is $0.892$. This is a visible arithmetic index over invented attributes, **not** a measure of a person's civic worth or a reason to discount an unfamiliar voice. A real trust system would need provenance, validation, correction, appeal, and tests for bias and feedback loops; the prototype supplies none of these. Its trust score is deliberately separate from the amendment ranking. [9, 11]

### 3.4 Pareto filtering and a separate ranking rule

Let $A$ denote a finite set of amendments and $G$ the declared stakeholder groups. Every amendment $a\in A$ has an assumed utility $U_g(a)\in[0,1]$ for each $g\in G$. Option $a$ dominates $b$ when

$$
U_g(a)\geq U_g(b)\ \forall g\in G,\qquad
U_h(a)>U_h(b)\ \text{for at least one }h\in G.
$$

The Pareto frontier $F$ is the set of amendments not dominated by another candidate. This is a partial order: several options can survive because one helps one group while another helps a different group. The website displays mean utility $\bar U(a)=|G|^{-1}\sum_gU_g(a)$ and lowest-group utility $U_{\min}(a)=\min_gU_g(a)$ to expose that tension. [5, 6, 11]

The prototype then applies a separate, declared ranking rule to non-dominated options:

$$
R(a;w)=\underbrace{\frac{\sum_{g\in G}w_gU_g(a)}{\sum_{g\in G}w_g}}_{\text{weighted assumed utility}}
\underbrace{(1-0.62r_a)(1-0.28k_a)}_{\text{declared risk and complexity penalties}},\quad w_g>0.
$$

Here $r_a$ and $k_a$ are stored values in $[0,1]$. In the website, slider weights run from 0.2 to 2.5; equal weights reproduce the baseline mean. The constants 0.62 and 0.28 are not estimated from outcomes. The fixed recommendation card uses equal weights, while the interactive simulator recalculates the leader when weights move. Neither changes Pareto status, which still depends on the original utility vectors. Listed stakeholder boundaries are displayed but not enforced by this calculation. [11]

## 4. Reproducible demonstration: HR-104

Four fictional amendments to the sample Community Resilience and Enterprise Act illustrate why a frontier is a conversation starter rather than an answer. The table is computed from the stored scenario and rounded as the website rounds it. Every option is non-dominated across the three utility coordinates. [11]

| Amendment | Growth | Equity | Fiscal | Lowest group | Baseline $R$ |
|:--|--:|--:|--:|--:|--:|
| Automatic audit trigger | .58 | .66 | .88 | .58 | .562 |
| Targeted continuity credit | .89 | .61 | .72 | .61 | .527 |
| Transparent need-weighted formula | .70 | .92 | .69 | .69 | .581 |
| Five-year sunset with renewal vote | .76 | .73 | .84 | .73 | **.642** |

At equal weights, the five-year sunset leads. For that option, $\bar U=(.76+.73+.84)/3=.776\overline6$ and the penalty product is $(1-.62\cdot.18)(1-.28\cdot.25)=.826212$, giving $R\approx.642$. This is a reproducible software result, not a measured social benefit. [11]

The slider also permits a precise sensitivity test. Hold Growth weight at $0.2$ and Fiscal weight at $1.0$; call the Equity weight $x$. The transparent formula overtakes the sunset option when

$$
.75424896\frac{.2(.70)+x(.92)+.69}{1.2+x}
>
.826212\frac{.2(.76)+x(.73)+.84}{1.2+x}.
$$

Solving the pairwise inequality gives $x>2.13249\ldots$. At $x=2.5$, the transparent formula scores about $.638$ and the sunset scores about $.629$; the leading option flips. The result reveals **where a normative weight changes the recommendation**. It does not tell us which weight is fair. Sensitivity analysis is essential when a model output depends on contested assumptions [8].

Two further failure demonstrations matter. First, the frontier contains all four options; Pareto filtering alone cannot choose one. Second, changing voice tokens, local exposure factors, or trust scores does not change this ranking because those streams are not connected in the current code. A visitor must not infer a relationship the software does not implement. The 1,000-run Monte Carlo panel samples assumed score shocks without calibration against observed outcomes; its percentiles are illustrative distributions, not policy forecasts. [11]

## 5. What the results establish—and what they do not

The demonstrated result is **computational inspectability**. A visitor can reproduce a token cost, open a local-impact explanation, inspect a participant score's four terms, see every amendment's group utilities, and change weights to expose a ranking reversal. The code rejects several malformed numerical inputs, and automated tests cover representative boundary cases. These are software properties. They do not establish improved deliberation, reduced polarization, higher welfare, fairness, safety, or adoption in real institutions. The earlier manuscripts' stronger outcome claims remain untested [1, 2, 11].

The next research phase should therefore pre-register evaluations rather than announce success. One study could randomly assign participants to a conventional bill summary or the inspectable workflow and measure comprehension of assumptions, ability to identify a losing group, calibration of confidence, and quality of deliberation. Another could evaluate whether real stakeholder-elicitation methods yield stable utility vectors across groups and time. A third must test accessibility, manipulation resistance, privacy, and whether marginalized groups can contest source and trust claims. Sensitivity auditing should vary all consequential parameters, not only the weights that are convenient to display [8]. Reproducible code and an independent replication protocol are prerequisites for credible claims about performance [10].

The broader original vision could, **if funded and governed with communities**, add verified legislative feeds, attributable evidence lineage, privacy-preserving participation, explicit non-negotiable constraints, reviewed impact models, appeals, and outcome monitoring. Funding is a condition for that work, not evidence that it has been built. NIST's AI risk framework is a useful governance reference for mapping and managing such risks, but following a framework would not certify this civic system [9].

## 6. Conclusion

The purpose of Civic Accord is to make disagreement more intelligible without pretending it has disappeared. Its working website offers a concrete, mathematically inspectable prototype: voice tokens reveal the cost of intensity; local factors reveal assumptions behind example exposure; Pareto comparison keeps distinct interests visible; and weight sensitivity reveals how a recommendation can reverse. The strongest conclusion is modest and consequential: **a recommendation can be made answerable to the people whose lives it would affect**. The real test is still ahead—verified data, accountable institutions, community participation, and empirical evaluation. [4, 9–11]

## Research transparency

**Author and affiliation.** Aarti S Ravikumar, Pioneer Charter School of Science II. This is an independent research manuscript and has not been represented as peer reviewed or accepted by a journal.

**Materials.** The supplied archival proposal and journal PDFs are cited as unpublished source manuscripts [1, 2]. The current implementation and calculations were checked against the local Civic Accord source, especially `src/data/governance-data.ts`, `src/services/governance-engine.ts`, and the associated tests and route pages [11]. This paper does not claim that the local repository state is identical to any public deployment.

**Data and ethics.** All people, bills, districts, comments, scores, and results in the worked case are fictional examples. No human-subject data or field experiment is reported. No causal or real-policy effect is estimated.

## References

1. Ravikumar, A. S. *Governance App Proposal*. Unpublished proposal PDF supplied with the Civic Accord project, `docs/Governance_App_Proposal_Aarti_Ravikumar.pdf`, undated.
2. Ravikumar, A. S. *A Computational Framework for Optimal Democratic Governance*. Unpublished three-page journal draft supplied with the project, `docs/Final_Complete_Journal_Aarti_Ravikumar.pdf`, undated.
3. Arrow, K. J. *Social Choice and Individual Values*. Yale University Press, 1951. [Publisher record](https://yalebooks.yale.edu/book/9780300179316/social-choice-and-individual-values/).
4. Ostrom, E. *Governing the Commons: The Evolution of Institutions for Collective Action*. Cambridge University Press, 1990. [Publisher record](https://www.cambridge.org/core/books/governing-the-commons/7AB7AE11BADA84409C34815CC288CD79/listing). doi:10.1017/CBO9780511807763.
5. Keeney, R. L., and Raiffa, H. *Decisions with Multiple Objectives: Preferences and Value Tradeoffs*. Wiley, 1976. [Bibliographic record](https://books.google.com/books/about/Decisions_with_Multiple_Objectives.html?id=k_x9AAAAIAAJ).
6. Pareto, V. *Manuale di economia politica con una introduzione alla scienza sociale*. Società Editrice Libraria, 1906. [Digitized bibliographic record](https://books.google.com/books?id=2jSYdhaOmMEC).
7. Lalley, S. P., and Weyl, E. G. “Quadratic Voting: How Mechanism Design Can Radicalize Democracy.” *AEA Papers and Proceedings* 108 (2018): 33–37. [doi:10.1257/pandp.20181002](https://www.aeaweb.org/articles?id=10.1257/pandp.20181002).
8. Saltelli, A., and Annoni, P. “How to Avoid a Perfunctory Sensitivity Analysis.” *Environmental Modelling & Software* 25, no. 12 (2010): 1508–1517. [doi:10.1016/j.envsoft.2010.04.012](https://doi.org/10.1016/j.envsoft.2010.04.012).
9. Tabassi, E. *Artificial Intelligence Risk Management Framework (AI RMF 1.0).* NIST AI 100-1, 2023. [doi:10.6028/NIST.AI.100-1](https://doi.org/10.6028/NIST.AI.100-1).
10. National Academies of Sciences, Engineering, and Medicine. *Reproducibility and Replicability in Science*. National Academies Press, 2019. [doi:10.17226/25303](https://doi.org/10.17226/25303).
11. Ravikumar, A. S. *Civic Accord: Working Prototype and Source Code*. Local project snapshot reviewed November 17, 2026. `src/data/governance-data.ts`; `src/services/governance-engine.ts`; `src/routes/pages/`; `tests/`. [Public repository](https://github.com/aartisr/governance-app) (may lag the local snapshot).
