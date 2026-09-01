export interface BillClause {
  id: string;
  number: string;
  title: string;
  summary: string;
  fiscalImpact: string;
  contestedLevel: 'low' | 'medium' | 'high';
  stakeholderPositions: {
    group: string;
    stance: 'support' | 'oppose' | 'neutral';
    reason: string;
  }[];
}

export interface Stakeholder {
  id: string;
  name: string;
  role: string;
  organization: string;
  category: 'Industry' | 'Community' | 'Environmental' | 'Labor' | 'Municipal';
  avatar: string;
  credibilityScore: number;
  credibilityBreakdown: {
    empiricalRigor: number;
    domainExpertise: number;
    financialTransparency: number;
    historicalAccuracy: number;
  };
  initialUtility: number;
  currentUtility: number;
  voiceTokensAllocated: number;
  keyDemands: string[];
}

export interface ParetoAmendment {
  id: string;
  title: string;
  clauseTarget: string;
  description: string;
  active: boolean;
  stakeholderUtilityDelta: Record<string, number>;
  paretoGainScore: number;
  evidenceConfidence: number;
  evidenceSource: string;
}

export interface GovernanceBill {
  id: string;
  code: string;
  title: string;
  category: string;
  status: 'In Committee' | 'Floor Deliberation' | 'Pareto Compromise Ready' | 'Enacted';
  sponsor: string;
  district: string;
  summary: string;
  problemStatement: string;
  budgetEst: string;
  timeline: string;
  confidenceScore: number;
  clauses: BillClause[];
  stakeholders: Stakeholder[];
  amendments: ParetoAmendment[];
  statusQuoUtility: { groupA: number; groupB: number; generalPublic: number };
  baseBillUtility: { groupA: number; groupB: number; generalPublic: number };
  paretoOptimizedUtility: { groupA: number; groupB: number; generalPublic: number };
}

export interface NobelStepItem {
  stepNumber: string;
  stepTitle: string;
  academicInsight: string;
  practicalImplementation: string;
}

export interface VideoScene {
  id: string;
  sceneNumber: number;
  title: string;
  subtitle: string;
  timestamp: string;
  durationSeconds: number;
  activeTab: 'overview' | 'intelligence' | 'impact' | 'voicetokens' | 'evidence' | 'pareto' | 'audit';
  narrationScript: string;
  screenValueSummary?: string;
  democraticProblemSolved?: string;
  mathematicalMechanism?: string;
  governanceOutcome?: string;
  nobelSteps?: NobelStepItem[];
  highlightTargetId?: string;
  actionType?: 'zoom-clause' | 'slide-token' | 'toggle-amendment' | 'verify-evidence' | 'calculate-pareto' | 'export-record';
  interactiveCues: {
    time: number;
    action: string;
    cursorPosition: { x: number; y: number };
    tipText: string;
  }[];
  keyTakeaways: string[];
}

export interface VoiceTokenBudget {
  totalBudget: number;
  allocated: Record<string, number>; // billId -> tokens spent
  calculatedVoices: Record<string, number>; // billId -> sqrt(tokens)
}

export interface SubtitleItem {
  id: string;
  startTime: number;
  endTime: number;
  text: string;
  speaker: string;
}
