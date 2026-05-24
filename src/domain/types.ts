export type BillStatus = "introduced" | "committee" | "stalled" | "negotiating" | "ready";

export type PolicyDomain =
  | "tax"
  | "health"
  | "infrastructure"
  | "education"
  | "climate"
  | "security"
  | "civil-rights";

export type District = {
  id: string;
  name: string;
  state: string;
  population: number;
  medianIncome: number;
  smallBusinessShare: number;
  ruralShare: number;
  trustBaseline: number;
};

export type BillSection = {
  id: string;
  title: string;
  summary: string;
  domain: PolicyDomain;
  budgetDeltaMillions: number;
  affectedPopulationPercent: number;
  confidence: number;
};

export type EvidenceSource = {
  id: string;
  title: string;
  publisher: string;
  sourceType: "bill-text" | "census" | "budget" | "economic" | "expert" | "public-comment";
  trustScore: number;
  recencyScore: number;
  excerpt: string;
};

export type Bill = {
  id: string;
  title: string;
  sponsor: string;
  status: BillStatus;
  domain: PolicyDomain;
  introduced: string;
  summary: string;
  sections: BillSection[];
  evidenceIds: string[];
};

export type VoiceAllocation = {
  issueId: string;
  label: string;
  votes: number;
  sentiment: "support" | "oppose" | "condition";
};

export type Faction = {
  id: string;
  name: string;
  color: string;
  priorities: Record<string, number>;
  hardBoundaries: string[];
  negotiables: string[];
  tokenAllocations: VoiceAllocation[];
};

export type TrustParticipant = {
  id: string;
  name: string;
  role: "constituent" | "expert" | "office" | "analyst" | "civil-society";
  accuracy: number;
  expertise: number;
  consistency: number;
  transparency: number;
};

export type ImpactAssessment = {
  sectionId: string;
  districtId: string;
  label: string;
  delta: number;
  unit: string;
  confidence: number;
  explanation: string;
  evidenceIds: string[];
};

export type CompromiseAmendment = {
  id: string;
  title: string;
  description: string;
  utility: Record<string, number>;
  risk: number;
  implementationComplexity: number;
};

export type ParetoScenario = {
  id: string;
  billId: string;
  name: string;
  amendments: CompromiseAmendment[];
};

export type ParetoPoint = {
  amendmentId: string;
  label: string;
  totalUtility: number;
  minimumFactionUtility: number;
  riskAdjustedScore: number;
  isParetoEfficient: boolean;
};
