import type {
  Bill,
  District,
  EvidenceSource,
  Faction,
  ParetoScenario,
  TrustParticipant,
} from "../domain/types";

export const districts: District[] = [
  { id: "ca-12", name: "Bay Civic District", state: "CA", population: 761432, medianIncome: 113200, smallBusinessShare: 0.34, ruralShare: 0.04, trustBaseline: 0.62 },
  { id: "ia-04", name: "Heartland Production District", state: "IA", population: 702891, medianIncome: 64200, smallBusinessShare: 0.22, ruralShare: 0.58, trustBaseline: 0.55 },
  { id: "ga-05", name: "Metro Resilience District", state: "GA", population: 789221, medianIncome: 72800, smallBusinessShare: 0.29, ruralShare: 0.08, trustBaseline: 0.58 },
];

export const evidenceSources: EvidenceSource[] = [
  {
    id: "ev-bill-104",
    title: "Section-by-section legislative text",
    publisher: "Congressional Clerk",
    sourceType: "bill-text",
    trustScore: 0.96,
    recencyScore: 0.91,
    excerpt: "Authorizes a targeted small-business credit, infrastructure bond guarantees, and outcome-based reporting.",
  },
  {
    id: "ev-census-smb",
    title: "Small business density by district",
    publisher: "Census Economic Survey",
    sourceType: "census",
    trustScore: 0.9,
    recencyScore: 0.82,
    excerpt: "District small-business share varies from 22% to 34%, changing projected credit absorption.",
  },
  {
    id: "ev-cbo-bridge",
    title: "Ten-year bridge resilience budget model",
    publisher: "Budget Office Model",
    sourceType: "budget",
    trustScore: 0.88,
    recencyScore: 0.79,
    excerpt: "Bond guarantees reduce near-term fiscal pressure but increase oversight requirements.",
  },
  {
    id: "ev-comment-care",
    title: "Constituent testimony on clinic access",
    publisher: "Public Comment Corpus",
    sourceType: "public-comment",
    trustScore: 0.71,
    recencyScore: 0.94,
    excerpt: "Rural caregivers emphasize travel time and continuity of care as non-negotiable policy outcomes.",
  },
  {
    id: "ev-expert-mechanism",
    title: "Mechanism design and quadratic voting review",
    publisher: "Independent Expert Panel",
    sourceType: "expert",
    trustScore: 0.86,
    recencyScore: 0.72,
    excerpt: "Quadratic costs reveal intensity while constraining factional overstatement through scarce voice budgets.",
  },
];

export const bills: Bill[] = [
  {
    id: "hr-104",
    title: "Community Resilience and Enterprise Act",
    sponsor: "Rep. Elena Marquez",
    status: "negotiating",
    domain: "infrastructure",
    introduced: "2026-04-12",
    summary: "A district-targeted resilience package combining infrastructure bonds, small-business credits, and public reporting.",
    evidenceIds: ["ev-bill-104", "ev-census-smb", "ev-cbo-bridge", "ev-expert-mechanism"],
    sections: [
      { id: "hr-104-s1", title: "Infrastructure bond guarantee", summary: "Creates federal guarantees for bridge, water, and grid hardening projects.", domain: "infrastructure", budgetDeltaMillions: 1240, affectedPopulationPercent: 42, confidence: 0.82 },
      { id: "hr-104-s2", title: "Small-business continuity credit", summary: "Offsets tax liability for businesses disrupted by resilience construction.", domain: "tax", budgetDeltaMillions: -430, affectedPopulationPercent: 18, confidence: 0.76 },
      { id: "hr-104-s3", title: "Outcome transparency dashboard", summary: "Requires district-level progress, spending, and impact reporting.", domain: "civil-rights", budgetDeltaMillions: 38, affectedPopulationPercent: 100, confidence: 0.9 },
    ],
  },
  {
    id: "s-219",
    title: "Rural Care Access Compact",
    sponsor: "Sen. Malik Hart",
    status: "stalled",
    domain: "health",
    introduced: "2026-03-28",
    summary: "A rural health access bill that funds clinic networks, mobile care, and outcome-based Medicare reimbursements.",
    evidenceIds: ["ev-comment-care", "ev-expert-mechanism"],
    sections: [
      { id: "s-219-s1", title: "Mobile clinic grants", summary: "Funds regionally shared mobile care fleets.", domain: "health", budgetDeltaMillions: 620, affectedPopulationPercent: 28, confidence: 0.81 },
      { id: "s-219-s2", title: "Outcome-based reimbursements", summary: "Links reimbursements to access, continuity, and preventable hospitalization outcomes.", domain: "health", budgetDeltaMillions: 210, affectedPopulationPercent: 36, confidence: 0.68 },
    ],
  },
  {
    id: "hr-332",
    title: "Civic Information Integrity Act",
    sponsor: "Rep. Simone Albright",
    status: "committee",
    domain: "civil-rights",
    introduced: "2026-05-02",
    summary: "Creates transparent provenance, public evidence scoring, and safeguards against algorithmic misinformation.",
    evidenceIds: ["ev-expert-mechanism"],
    sections: [
      { id: "hr-332-s1", title: "Public evidence provenance", summary: "Requires provenance metadata for public-impact policy summaries.", domain: "civil-rights", budgetDeltaMillions: 155, affectedPopulationPercent: 100, confidence: 0.84 },
      { id: "hr-332-s2", title: "Independent audit grants", summary: "Funds third-party audits for high-reach civic information systems.", domain: "security", budgetDeltaMillions: 96, affectedPopulationPercent: 74, confidence: 0.78 },
    ],
  },
];

export const factions: Faction[] = [
  {
    id: "growth-caucus",
    name: "Growth Caucus",
    color: "#0f766e",
    priorities: { "hr-104-s1": 0.72, "hr-104-s2": 0.88, "hr-104-s3": 0.46, "s-219-s1": 0.38 },
    hardBoundaries: ["No open-ended entitlement expansion", "Protect district small businesses"],
    negotiables: ["Infrastructure oversight cadence", "Sunset periods", "Credit eligibility thresholds"],
    tokenAllocations: [
      { issueId: "hr-104-s2", label: "Small-business continuity", votes: 5, sentiment: "support" },
      { issueId: "hr-104-s1", label: "Bond guarantee", votes: 3, sentiment: "condition" },
      { issueId: "s-219-s1", label: "Mobile clinic grants", votes: 1, sentiment: "oppose" },
    ],
  },
  {
    id: "equity-bloc",
    name: "Equity Bloc",
    color: "#7c3aed",
    priorities: { "hr-104-s1": 0.63, "hr-104-s2": 0.52, "hr-104-s3": 0.91, "s-219-s1": 0.86 },
    hardBoundaries: ["No opaque allocation formulas", "Protect high-need communities"],
    negotiables: ["Funding mix", "Reporting burden", "Implementation sequence"],
    tokenAllocations: [
      { issueId: "hr-104-s3", label: "Transparency dashboard", votes: 5, sentiment: "support" },
      { issueId: "s-219-s1", label: "Mobile clinic grants", votes: 4, sentiment: "support" },
      { issueId: "hr-104-s2", label: "Small-business continuity", votes: 2, sentiment: "condition" },
    ],
  },
  {
    id: "fiscal-guardians",
    name: "Fiscal Guardians",
    color: "#b45309",
    priorities: { "hr-104-s1": 0.44, "hr-104-s2": 0.61, "hr-104-s3": 0.77, "s-219-s1": 0.31 },
    hardBoundaries: ["No spending without measurable offsets", "Mandatory audit triggers"],
    negotiables: ["Pilot size", "Match requirements", "Implementation timing"],
    tokenAllocations: [
      { issueId: "hr-104-s3", label: "Transparency dashboard", votes: 4, sentiment: "support" },
      { issueId: "hr-104-s1", label: "Bond guarantee", votes: 2, sentiment: "condition" },
      { issueId: "hr-104-s2", label: "Small-business continuity", votes: 2, sentiment: "support" },
    ],
  },
];

export const trustParticipants: TrustParticipant[] = [
  { id: "tp-1", name: "District Small Business Council", role: "civil-society", accuracy: 0.78, expertise: 0.74, consistency: 0.86, transparency: 0.81 },
  { id: "tp-2", name: "Congressional Budget Analyst", role: "analyst", accuracy: 0.9, expertise: 0.93, consistency: 0.84, transparency: 0.88 },
  { id: "tp-3", name: "Rural Health Coalition", role: "expert", accuracy: 0.82, expertise: 0.91, consistency: 0.8, transparency: 0.76 },
  { id: "tp-4", name: "Constituent Deliberation Panel", role: "constituent", accuracy: 0.67, expertise: 0.58, consistency: 0.74, transparency: 0.9 },
  { id: "tp-5", name: "Member Office Policy Team", role: "office", accuracy: 0.73, expertise: 0.82, consistency: 0.71, transparency: 0.64 },
];

export const paretoScenario: ParetoScenario = {
  id: "scenario-hr-104",
  billId: "hr-104",
  name: "HR-104 Stalled Bill Compromise",
  amendments: [
    { id: "amend-audit", title: "Automatic audit trigger", description: "Adds independent audits when spending variance exceeds 8% or impact targets miss two quarters.", utility: { "growth-caucus": 0.58, "equity-bloc": 0.66, "fiscal-guardians": 0.88 }, risk: 0.22, implementationComplexity: 0.28 },
    { id: "amend-credit", title: "Targeted continuity credit", description: "Narrows credits to construction-affected corridors and adds a rural access carveout.", utility: { "growth-caucus": 0.89, "equity-bloc": 0.61, "fiscal-guardians": 0.72 }, risk: 0.31, implementationComplexity: 0.42 },
    { id: "amend-formula", title: "Transparent need-weighted formula", description: "Allocates funds using public need, vulnerability, and readiness weights with human-readable rationale.", utility: { "growth-caucus": 0.7, "equity-bloc": 0.92, "fiscal-guardians": 0.69 }, risk: 0.26, implementationComplexity: 0.36 },
    { id: "amend-sunset", title: "Five-year sunset with renewal vote", description: "Adds a renewal requirement tied to impact evidence and district-level public reporting.", utility: { "growth-caucus": 0.76, "equity-bloc": 0.73, "fiscal-guardians": 0.84 }, risk: 0.18, implementationComplexity: 0.25 },
  ],
};
