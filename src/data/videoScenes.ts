import { VideoScene, SubtitleItem } from '../types';

export const VIDEO_SCENES: VideoScene[] = [
  {
    id: 'scene-1',
    sceneNumber: 1,
    title: 'Chapter 1: The Pareto Governance Paradigm & Theoretical Foundation',
    subtitle: 'Resolving democratic gridlock by replacing zero-sum voting with multi-objective optimization',
    timestamp: '00:00',
    durationSeconds: 38,
    activeTab: 'overview',
    screenValueSummary: 'Replaces binary 51/49 winner-take-all democratic failure with a cardinal Pareto social welfare optimization engine.',
    democraticProblemSolved: "Arrow's Impossibility Theorem & Polarized Majority Tyranny",
    mathematicalMechanism: 'Multi-Objective Social Choice & Cardinal Pareto Frontier Mapping',
    governanceOutcome: '+44% Consensus Gain above Status Quo across all opposing factions',
    nobelSteps: [
      {
        stepNumber: 'Step 1.1',
        stepTitle: 'Overcoming Arrow’s Impossibility Boundary',
        academicInsight: 'Traditional voting compresses multidimensional human welfare into crude 1-bit binary ballots, guaranteeing cyclical majority tyranny and democratic impasse.',
        practicalImplementation: 'Civic Accord lifts decision-making into a continuous, cardinal multi-objective utility space where non-zero-sum trades become mathematically discoverable.'
      },
      {
        stepNumber: 'Step 1.2',
        stepTitle: 'Cardinal Welfare Quantification',
        academicInsight: 'Replaces ordinal rank ballots with cardinal welfare matrices that measure positive-sum social surplus across heterogeneous citizen cohorts.',
        practicalImplementation: 'Calculates real-time aggregate utility surfaces, providing instant visibility into win-win policy solutions.'
      },
      {
        stepNumber: 'Step 1.3',
        stepTitle: 'Empirical Pareto Gain Baseline',
        academicInsight: 'A policy is only ratified if it shifts the socio-economic equilibrium strictly above the status quo for all key democratic factions.',
        practicalImplementation: 'Enforces a verifiable +44% net consensus gain constraint before legislative recommendations are enacted.'
      }
    ],
    narrationScript: 'Welcome to Civic Accord, the pioneering framework created by Aarti S Ravikumar, powered by the Pareto Governance Engine. For centuries, democratic policy-making has been trapped in binary, zero-sum deadlock—where 51% majority votes alienate 49% of the population. Civic Accord solves this fundamental coordination failure. By transforming legislative negotiation into a transparent, multi-objective optimization manifold, we measure preference intensity, audit evidence credibility, and mathematically discover win-win Pareto compromises that elevate every stakeholder above the status quo.',
    actionType: 'calculate-pareto',
    interactiveCues: [
      { time: 3, action: 'highlight-title', cursorPosition: { x: 300, y: 120 }, tipText: 'Civic Accord: Cardinal Pareto Policy Optimization' },
      { time: 12, action: 'spotlight-pillars', cursorPosition: { x: 540, y: 340 }, tipText: '6 Mathematical Pillars: Decomposition to Cryptographic Ratification' },
      { time: 25, action: 'pulse-kpi', cursorPosition: { x: 800, y: 220 }, tipText: 'Pareto Consensus Gain: +44% Net Social Welfare' }
    ],
    keyTakeaways: [
      'Solves binary democratic failure via multi-dimensional social welfare optimization',
      'Makes hidden stakeholder trade-offs mathematically legible and verifiable',
      'Bridges deep policy polarization with transparent empirical mechanisms'
    ]
  },
  {
    id: 'scene-2',
    sceneNumber: 2,
    title: 'Chapter 2: Bill Intelligence & Clause Decomposition',
    subtitle: 'Eliminating statutory opacity through atomic clause parsing and fiscal impact isolation',
    timestamp: '00:38',
    durationSeconds: 36,
    activeTab: 'intelligence',
    screenValueSummary: 'Demystifies 500-page omnibus bills by isolating atomic provisions, fiscal consequences, and friction heatmaps.',
    democraticProblemSolved: 'Statutory Opacity & Backroom Legislative Riders',
    mathematicalMechanism: 'Natural Language Statutory Decomposition & Clause Fiscal Modeling',
    governanceOutcome: '100% Plain-Language Clause Legibility with friction-point pinpointing',
    nobelSteps: [
      {
        stepNumber: 'Step 2.1',
        stepTitle: 'Atomic Statutory Decomposition',
        academicInsight: 'Omnibus bills bundle dozens of unrelated riders to conceal regressive special-interest subsidies under popular titles.',
        practicalImplementation: 'Civic Accord ingests statutory text (like SB-402) and decomposes it into discrete, independently evaluable clauses with plain-language explanations.'
      },
      {
        stepNumber: 'Step 2.2',
        stepTitle: 'Isolated Fiscal Trajectory Modeling',
        academicInsight: 'Each legislative clause carries unique expenditure obligations, revenue streams, and macroeconomic feedback loops.',
        practicalImplementation: 'Computes isolated fiscal impacts per section, allowing lawmakers to isolate and stress-test specific spending vectors.'
      },
      {
        stepNumber: 'Step 2.3',
        stepTitle: 'Contested Friction Point Heatmapping',
        academicInsight: 'Partisan conflict originates in specific localized statutory sentences rather than the overarching legislative intent.',
        practicalImplementation: 'Automatically flags high-friction provisions—such as Section 204’s Commercial Congestion Levy—before floor debate begins.'
      }
    ],
    narrationScript: 'In Chapter 2, we examine Bill Intelligence. Massive 500-page omnibus proposals conceal regressive riders and opaque trade-offs. The value of this screen is complete legislative transparency: Civic Accord ingests complex statutory text, decomposes it into atomic computable clauses, models isolated fiscal trajectories, and translates legal jargon into plain language. Lawmakers and citizens can immediately pinpoint flashpoints—such as the contested Commercial Congestion Levy in Section 204.',
    actionType: 'zoom-clause',
    interactiveCues: [
      { time: 4, action: 'select-bill', cursorPosition: { x: 260, y: 200 }, tipText: 'Ingesting SB-402: Clean Transit & Grid Modernization' },
      { time: 15, action: 'expand-clause', cursorPosition: { x: 480, y: 390 }, tipText: 'Decomposing Section 204: Commercial Congestion Levy' },
      { time: 26, action: 'show-contested-signal', cursorPosition: { x: 780, y: 410 }, tipText: 'Contested Friction Point: Flagged Across 3 Economic Sectors' }
    ],
    keyTakeaways: [
      'Automated statutory decomposition into atomic, evaluable provisions',
      'Instant plain-language translation and fiscal trajectory modeling',
      'Proactive conflict heatmapping prior to committee deliberation'
    ]
  },
  {
    id: 'scene-3',
    sceneNumber: 3,
    title: 'Chapter 3: Local & District Impact Simulation',
    subtitle: 'Bridging macro-statutes to hyper-local empirical reality with Bayesian confidence bounds',
    timestamp: '01:14',
    durationSeconds: 36,
    activeTab: 'impact',
    screenValueSummary: 'Forecasts hyper-local economic, environmental, and transit impacts per district with statistical confidence.',
    democraticProblemSolved: 'One-Size-Fits-All Policy Blindspots & Local Disparity',
    mathematicalMechanism: 'Bayesian Econometric Micro-Simulation & Demographic Variance Modeling',
    governanceOutcome: '94% Empirical Confidence Projections for every geographic district',
    nobelSteps: [
      {
        stepNumber: 'Step 3.1',
        stepTitle: 'Spatial Econometric Micro-Simulation',
        academicInsight: 'National legislation produces asymmetric localized shocks across municipal boundaries and socioeconomic strata.',
        practicalImplementation: 'Projects district-specific outcomes for employment, particulate air emissions, and transit logistics.'
      },
      {
        stepNumber: 'Step 3.2',
        stepTitle: 'Bayesian Confidence Interval Enforcement',
        academicInsight: 'Political advocates routinely deploy point estimates to exaggerate policy benefits and conceal downside uncertainty.',
        practicalImplementation: 'Enforces explicit 94% Bayesian credible intervals on all model projections, penalizing speculative claims.'
      },
      {
        stepNumber: 'Step 3.3',
        stepTitle: 'Disproportionate Burden Mitigation',
        academicInsight: 'Sustainable governance requires that localized costs born by specific communities be balanced by targeted mitigation credits.',
        practicalImplementation: 'Surfaces the exact trade-off in Metropolitan Zone 4: +1,840 green jobs versus +14% freight transit friction.'
      }
    ],
    narrationScript: 'Chapter 3 introduces Local and District Impact Assessment. Federal and state policies frequently trigger unintended local crises because macro-models ignore geographic nuance. The value of this screen is hyper-local empirical foresight. Civic Accord projects district-specific economic, environmental, and transit metrics with explicit Bayesian confidence intervals. In Metropolitan Zone 4, lawmakers can directly see that air quality gains are counterbalanced by initial logistics burdens, enabling targeted localized protections.',
    actionType: 'verify-evidence',
    interactiveCues: [
      { time: 5, action: 'switch-district', cursorPosition: { x: 380, y: 180 }, tipText: 'Micro-Forecasting: Metropolitan Zone 4 Demographics' },
      { time: 16, action: 'inspect-confidence', cursorPosition: { x: 620, y: 290 }, tipText: 'Bayesian Confidence Score: 94% Empirical Backing' },
      { time: 27, action: 'highlight-metrics', cursorPosition: { x: 840, y: 360 }, tipText: 'Local Delta: +1,840 Green Jobs vs +14% Freight Transit Friction' }
    ],
    keyTakeaways: [
      'District-level econometric, demographic, and environmental micro-simulations',
      'Explicit confidence intervals eliminating unsubstantiated statistical rhetoric',
      'Equity scoring across vulnerable socioeconomic corridors'
    ]
  },
  {
    id: 'scene-4',
    sceneNumber: 4,
    title: 'Chapter 4: Quadratic Voice-Token Preference Intensity',
    subtitle: 'Capturing genuine constituent priority while rendering lobbying brigading mathematically impossible',
    timestamp: '01:50',
    durationSeconds: 46,
    activeTab: 'voicetokens',
    screenValueSummary: 'Applies quadratic voting (V = √T) across a finite budget to measure true priority intensity without vote buying.',
    democraticProblemSolved: 'Preference Intensity Blindness & Special-Interest Astroturfing',
    mathematicalMechanism: 'Quadratic Preference Cost Curve: Voice = √(Allocated Tokens)',
    governanceOutcome: 'Non-linear cost barrier neutralizing lobbying spam while protecting minority stakes',
    nobelSteps: [
      {
        stepNumber: 'Step 4.1',
        stepTitle: 'Finite Voice-Token Civic Budgeting',
        academicInsight: 'Unconstrained voting incentivizes free-riding and insincere signaling, skewing democratic feedback towards vocal extremists.',
        practicalImplementation: 'Allocates each citizen and stakeholder group an equal, non-tradable weekly budget of 100 Voice Tokens.'
      },
      {
        stepNumber: 'Step 4.2',
        stepTitle: 'The Quadratic Cost Manifold',
        academicInsight: 'Quadratic cost curves (Cost = Votes²) mathematically align marginal private cost with marginal social externality (Weyl & Posner).',
        practicalImplementation: 'Signaling 8 voice units requires 64 tokens, whereas 4 units requires only 16, making broad consensus far more efficient than narrow factional fixation.'
      },
      {
        stepNumber: 'Step 4.3',
        stepTitle: 'Existential Minority Protection',
        academicInsight: 'Allows intensely affected minority populations to out-signal indifferent majorities on issues central to their survival or livelihood.',
        practicalImplementation: 'Gives logistics workers and local residents the leverage to register existential redlines that traditional binary ballots erase.'
      }
    ],
    narrationScript: 'Chapter 4 demonstrates Voice-Token Budgeting. Traditional voting suffers from an incurable flaw: it treats a casual opinion identically to a life-or-death priority. The value of this screen is capturing genuine preference intensity. Citizens and stakeholders receive a finite budget of 100 Voice Tokens. Applying the quadratic formula—where Voice equals the square root of Tokens—signaling 8 units of voice costs 64 tokens, whereas 4 units costs only 16. This mathematical convex curve prevents wealthy special interests from dominating every vote, while giving vulnerable communities the leverage to protect what matters most.',
    actionType: 'slide-token',
    interactiveCues: [
      { time: 5, action: 'hover-token-budget', cursorPosition: { x: 320, y: 150 }, tipText: 'Constituent Budget: 100 Voice Tokens' },
      { time: 16, action: 'adjust-slider-freight', cursorPosition: { x: 520, y: 310 }, tipText: 'Allocating 42 Tokens to Freight Relief (Voice Intensity = 6.48)' },
      { time: 30, action: 'quadratic-curve-pop', cursorPosition: { x: 790, y: 280 }, tipText: 'Convex Cost Curve: Exponential Cost for Outsized Influence' }
    ],
    keyTakeaways: [
      'Quadratic token budgeting reflects cardinal preference intensity',
      'Mathematical barrier against astroturfing and lobbyist capture',
      'Surfaces critical redlines and flexible negotiation zones for lawmakers'
    ]
  },
  {
    id: 'scene-5',
    sceneNumber: 5,
    title: 'Chapter 5: Stakeholder Trust & Epistemic Evidence Matrix',
    subtitle: 'Eradicating disinformation by weighting claims through empirical rigor and conflict disclosures',
    timestamp: '02:36',
    durationSeconds: 38,
    activeTab: 'evidence',
    screenValueSummary: 'Weights public and expert testimony via peer-reviewed data, domain track record, and financial audits.',
    democraticProblemSolved: 'Post-Truth Disinformation & Subsidized Lobbying Echo Chambers',
    mathematicalMechanism: 'Multi-Vector Epistemic Credibility Scoring & Open Source Verification',
    governanceOutcome: 'Evidence-Weighted Deliberation filtering unsubstantiated rhetoric',
    nobelSteps: [
      {
        stepNumber: 'Step 5.1',
        stepTitle: 'Four-Vector Epistemic Auditing',
        academicInsight: 'Policy claims must be evaluated by reproducible scientific validity rather than the financial backing of the presenter.',
        practicalImplementation: 'Scores submissions across Empirical Rigor (40%), Domain Credentials (25%), Predictive Accuracy (20%), and Financial Disclosures (15%).'
      },
      {
        stepNumber: 'Step 5.2',
        stepTitle: 'Provenance Verification & Registry Auditing',
        academicInsight: 'Undisclosed corporate sponsorships corrupt democratic deliberation by manufacturing artificial scientific doubt.',
        practicalImplementation: 'Cross-checks testimony against public lobby registries and peer-reviewed open datasets in real time.'
      },
      {
        stepNumber: 'Step 5.3',
        stepTitle: 'Epistemic Weighting in Social Welfare Calculus',
        academicInsight: 'Arguments with verified empirical backing are weighted proportionally higher in the Pareto optimization model.',
        practicalImplementation: 'Dr. Jenkins’ peer-reviewed transit study (96/100) anchors the empirical baseline for subsequent policy synthesis.'
      }
    ],
    narrationScript: 'In Chapter 5, we inspect Evidence Trust and Stakeholder Scoring. In modern legislative hearings, money often buys manufactured doubt. The value of this screen is epistemic integrity: Civic Accord audits submitted testimony across four objective vectors—empirical rigor, domain credentials, historical predictive accuracy, and verified financial disclosures. Testimonies from experts like Dr. Sarah Jenkins and industry leaders receive transparent credibility scores, ensuring policy debates are grounded in peer-reviewed scientific fact rather than lobbying volume.',
    actionType: 'verify-evidence',
    interactiveCues: [
      { time: 5, action: 'select-stakeholder-jenk', cursorPosition: { x: 310, y: 260 }, tipText: 'Auditing Dr. Sarah Jenkins (Credibility Vector: 96/100)' },
      { time: 17, action: 'show-rubric-breakdown', cursorPosition: { x: 610, y: 350 }, tipText: 'Epistemic Vector: 98% Empirical Rigor, 95% Domain Credentials' },
      { time: 28, action: 'conflict-check', cursorPosition: { x: 860, y: 320 }, tipText: 'Public Disclosure Cross-Checked with Financial Registry' }
    ],
    keyTakeaways: [
      'Multi-factor epistemic credibility scoring across empirical rigor and track record',
      'Direct provenance linking claims to reproducible datasets and peer review',
      'Subsidized lobbying noise neutralized by transparent verification weights'
    ]
  },
  {
    id: 'scene-6',
    sceneNumber: 6,
    title: 'Chapter 6: The Pareto Compromise Engine',
    subtitle: 'Algorithmic multi-objective frontier synthesis discovering positive-sum win-win accords',
    timestamp: '03:14',
    durationSeconds: 46,
    activeTab: 'pareto',
    screenValueSummary: 'Discovers the Pareto Frontier to synthesize positive-sum amendments where all factions gain utility simultaneously.',
    democraticProblemSolved: 'Partisan Zero-Sum Deadlock & Coercive Legislative Warfare',
    mathematicalMechanism: 'Multi-Objective Pareto Optimization & Non-Zero-Sum Trade Synthesis',
    governanceOutcome: 'All Stakeholders Shift into the Positive-Sum Pareto Frontier (84% & 78% Utility)',
    nobelSteps: [
      {
        stepNumber: 'Step 6.1',
        stepTitle: 'Multi-Dimensional Utility Manifold Mapping',
        academicInsight: 'In an unamended zero-sum bill, one coalition’s gains force an unbearable deficit on another, causing legislative sabotage.',
        practicalImplementation: 'Plots Environmental Coalition (88%) versus Freight Logistics (24%), revealing the acute conflict coordinates.'
      },
      {
        stepNumber: 'Step 6.2',
        stepTitle: 'Algorithmic Compromise Synthesis',
        academicInsight: 'Identifies compensatory policy mechanisms that restore utility to disadvantaged groups at minimal marginal cost to others.',
        practicalImplementation: 'Synthesizes Amendment 204-A: off-peak toll waivers and clean fleet conversion tax credits.'
      },
      {
        stepNumber: 'Step 6.3',
        stepTitle: 'Convergence onto the Pareto-Optimal Frontier',
        academicInsight: 'Reaches a state where no stakeholder’s utility can be increased without decreasing another, achieving social Pareto optimality.',
        practicalImplementation: 'Freight utility surges to 78% while environmental utility holds strong at 84%, cementing durable bipartisan ratification.'
      }
    ],
    narrationScript: 'Now, the central breakthrough of Aarti S Ravikumar’s framework: The Pareto Compromise Engine. The unamended bill pushed Freight Logistics into severe opposition at only 24% utility, threatening a legislative collapse. The value of this screen is algorithmic win-win synthesis: Civic Accord searches the multi-objective utility space and generates targeted compromise amendments. Activating Amendment 204-A introduces off-peak toll exemptions and clean fleet subsidies. In real time, freight satisfaction jumps to 78% while environmental utility holds at 84%, moving the bill out of the conflict zone directly onto the Pareto Frontier.',
    actionType: 'toggle-amendment',
    interactiveCues: [
      { time: 5, action: 'inspect-frontier-graph', cursorPosition: { x: 420, y: 310 }, tipText: '2D Utility Manifold: Environmental vs Logistics Satisfaction' },
      { time: 17, action: 'toggle-amendment-1', cursorPosition: { x: 740, y: 250 }, tipText: 'Enabling Amendment 204-A: Freight Utility Surges (+38%)' },
      { time: 32, action: 'observe-pareto-shift', cursorPosition: { x: 490, y: 210 }, tipText: 'Optimal State Reached: Both Coalitions Enter Pareto Win-Win Zone' }
    ],
    keyTakeaways: [
      'Visualizes multi-dimensional stakeholder utility manifolds in real time',
      'Synthesizes positive-sum amendments that satisfy competing non-negotiable redlines',
      'Transforms adversarial zero-sum politics into collaborative mechanism design'
    ]
  },
  {
    id: 'scene-7',
    sceneNumber: 7,
    title: 'Chapter 7: Immutable Audit Trail & Verified Democratic Ratification',
    subtitle: 'Cryptographic state hashing and exportable legislative briefs for permanent public accountability',
    timestamp: '04:00',
    durationSeconds: 38,
    activeTab: 'audit',
    screenValueSummary: 'Provides a tamper-evident cryptographic record and comprehensive brief ensuring lasting democratic legitimacy.',
    democraticProblemSolved: 'Post-Enactment Regulatory Drift & Backdoor Special Interest Erosion',
    mathematicalMechanism: 'Cryptographic SHA-256 Ledger State Hashing & Provable Citation Graph',
    governanceOutcome: 'Verifiable Legislative Accord with 100% Epistemic Traceability',
    nobelSteps: [
      {
        stepNumber: 'Step 7.1',
        stepTitle: 'Cryptographic State Commitment',
        academicInsight: 'Democratic trust disintegrates when backroom regulators alter enacted legislation after public voting concludes.',
        practicalImplementation: 'Hashes all token allocations, evidence matrices, and utility scores into an immutable SHA-256 Decision Digest (#CA-9041-89B).'
      },
      {
        stepNumber: 'Step 7.2',
        stepTitle: 'Provable Citation & Deliberation Graph',
        academicInsight: 'Every policy mandate is permanently linked to the empirical study and stakeholder testimony that justified it.',
        practicalImplementation: 'Produces a tamper-proof epistemic lineage accessible to journalists, courts, and citizens alike.'
      },
      {
        stepNumber: 'Step 7.3',
        stepTitle: 'Comprehensive Legislative Brief Generation',
        academicInsight: 'Translates complex mathematical consensus into actionable statutory documents ready for immediate legislative enactment.',
        practicalImplementation: 'One-click export of verified executive policy briefs in PDF, Markdown, and JSON formats.'
      }
    ],
    narrationScript: 'Finally, in Chapter 7, the legislative accord achieves verifiable enactment. The value of this screen is permanent democratic legitimacy. Civic Accord produces an immutable, tamper-evident Decision Record—sealing token allocations, empirical citations, and final utility distributions with cryptographic SHA-256 hashes. Lawmakers, journalists, and citizens can export a comprehensive Legislative Brief, establishing a transparent, verifiable gold standard for 21st-century democracy.',
    actionType: 'export-record',
    interactiveCues: [
      { time: 5, action: 'view-audit-ledger', cursorPosition: { x: 340, y: 230 }, tipText: 'Cryptographic Ledger: SHA-256 Digest #CA-9041-89B' },
      { time: 16, action: 'celebrate-enactment', cursorPosition: { x: 560, y: 280 }, tipText: 'Democratic Accord Ratified: 84% Certified Pareto Consensus' },
      { time: 27, action: 'click-export-brief', cursorPosition: { x: 820, y: 160 }, tipText: 'Exporting Comprehensive Verified Legislative Brief' }
    ],
    keyTakeaways: [
      'Tamper-evident cryptographic ledger guaranteeing decision provenance',
      'One-click export of verifiable executive policy briefs with complete citation graphs',
      'Universal governance framework scalable from local councils to federal legislation'
    ]
  }
];

export const SUBTITLES_DATA: SubtitleItem[] = [
  { id: 'sub-1', startTime: 0, endTime: 11, speaker: 'Narrator', text: 'Welcome to Civic Accord, the pioneering framework created by Aarti S Ravikumar, powered by the Pareto Governance Engine.' },
  { id: 'sub-2', startTime: 11, endTime: 24, speaker: 'Narrator', text: 'For centuries, democratic policy-making has been trapped in binary, zero-sum deadlock—where 51% majority votes alienate 49% of the population.' },
  { id: 'sub-3', startTime: 24, endTime: 38, speaker: 'Narrator', text: 'Civic Accord transforms legislative negotiation into a transparent, multi-objective optimization manifold discovering win-win Pareto compromises.' },
  
  { id: 'sub-4', startTime: 38, endTime: 50, speaker: 'Narrator', text: 'In Chapter 2, we examine Bill Intelligence. Massive 500-page omnibus proposals conceal regressive riders and opaque trade-offs.' },
  { id: 'sub-5', startTime: 50, endTime: 62, speaker: 'Narrator', text: 'Civic Accord decomposes complex statutory text into atomic computable clauses, modeling isolated fiscal trajectories and translating legalese.' },
  { id: 'sub-6', startTime: 62, endTime: 74, speaker: 'Narrator', text: 'Lawmakers and citizens can immediately pinpoint contested friction points—such as Section 204’s Commercial Congestion Levy.' },

  { id: 'sub-7', startTime: 74, endTime: 86, speaker: 'Narrator', text: 'Chapter 3 introduces Local and District Impact Assessment, forecasting hyper-local economic and demographic consequences.' },
  { id: 'sub-8', startTime: 86, endTime: 98, speaker: 'Narrator', text: 'Civic Accord projects district-specific metrics with explicit 94% Bayesian confidence intervals, eliminating misleading point estimates.' },
  { id: 'sub-9', startTime: 98, endTime: 110, speaker: 'Narrator', text: 'In Metropolitan Zone 4, air quality gains are balanced against freight logistics friction, enabling targeted localized protections.' },

  { id: 'sub-10', startTime: 110, endTime: 124, speaker: 'Narrator', text: 'Chapter 4 demonstrates Voice-Token Budgeting—replacing binary votes with quadratic preference intensity modeling.' },
  { id: 'sub-11', startTime: 124, endTime: 139, speaker: 'Narrator', text: 'Constituents allocate 100 Voice Tokens with quadratic cost (Voice = √Tokens), making 8 units cost 64 tokens and 4 units cost 16.' },
  { id: 'sub-12', startTime: 139, endTime: 156, speaker: 'Narrator', text: 'This convex curve prevents special-interest vote buying while giving vulnerable communities the leverage to protect what matters most.' },

  { id: 'sub-13', startTime: 156, endTime: 168, speaker: 'Narrator', text: 'In Chapter 5, we inspect Evidence Trust & Stakeholder Scoring, eradicating manufactured doubt and post-truth lobbying.' },
  { id: 'sub-14', startTime: 168, endTime: 181, speaker: 'Narrator', text: 'Civic Accord audits submitted testimony across empirical rigor, domain credentials, predictive accuracy, and verified financial disclosures.' },
  { id: 'sub-15', startTime: 181, endTime: 194, speaker: 'Narrator', text: 'Testimonies from experts like Dr. Sarah Jenkins receive transparent credibility scores, ensuring debates are grounded in peer-reviewed science.' },

  { id: 'sub-16', startTime: 194, endTime: 208, speaker: 'Narrator', text: 'Now, the central breakthrough of Aarti S Ravikumar’s framework: The Pareto Compromise Engine, solving partisan zero-sum deadlock.' },
  { id: 'sub-17', startTime: 208, endTime: 224, speaker: 'Narrator', text: 'Activating Amendment 204-A introduces off-peak toll exemptions and clean fleet subsidies, elevating freight utility from 24% to 78%.' },
  { id: 'sub-18', startTime: 224, endTime: 240, speaker: 'Narrator', text: 'Environmental satisfaction holds at 84% as both coalitions enter the Pareto-Optimal Frontier, turning conflict into durable consensus.' },

  { id: 'sub-19', startTime: 240, endTime: 252, speaker: 'Narrator', text: 'Finally, in Chapter 7, the legislative accord achieves verifiable enactment with permanent democratic legitimacy.' },
  { id: 'sub-20', startTime: 252, endTime: 266, speaker: 'Narrator', text: 'Civic Accord seals token allocations, citations, and utility distributions with immutable cryptographic SHA-256 hashes.' },
  { id: 'sub-21', startTime: 266, endTime: 278, speaker: 'Narrator', text: 'Lawmakers export the verified Legislative Brief with full citation trails: Making democratic trade-offs transparent, measurable, and positive-sum.' }
];

export const SUBTITLE_TRACK = SUBTITLES_DATA;
