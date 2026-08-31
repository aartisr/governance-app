export interface EvaluationCriterion {
  id: string;
  name: string;
  score: number; // 1 to 10
  weight: number; // e.g. 0.2
  summary: string;
  strengths: string[];
  improvements: string[];
  subMetrics: {
    name: string;
    score: number;
    description: string;
  }[];
}

export interface DimensionCategory {
  id: string;
  title: string;
  score: number;
  weight: number;
  iconName: string;
  summary: string;
  criteria: EvaluationCriterion[];
}

export interface ComplianceFramework {
  name: string;
  code: string;
  alignmentScore: number; // 0-100%
  status: 'Full Pass' | 'Substantial Alignment' | 'Partial Baseline' | 'Needs Enhancement';
  details: {
    pillar: string;
    description: string;
    score: number;
  }[];
}

export interface ParetoAmendment {
  id: string;
  name: string;
  costMillion: number;
  environmentalBenefit: number; // 1-100
  housingUnits: number; // count
  transitCapacity: number; // 1-100
  stakeholderSupportPct: number; // 0-100
  deliveryRisk: 'Low' | 'Medium' | 'High';
  paretoScore: number;
}
