import {
  bills,
  districts,
  evidenceSources,
  factions,
  paretoScenario,
  trustParticipants,
} from "../data/governance-data";
import type {
  Bill,
  BillSection,
  CompromiseAmendment,
  District,
  EvidenceSource,
  ImpactAssessment,
  ParetoPoint,
  TrustParticipant,
  VoiceAllocation,
} from "../domain/types";

const delay = (ms = 140) => new Promise((resolve) => window.setTimeout(resolve, ms));

export async function listBills() {
  await delay();
  return bills;
}

export async function getBill(billId: string) {
  await delay();
  return bills.find((bill) => bill.id === billId) ?? bills[0];
}

export async function getGovernanceSnapshot() {
  await delay(100);
  return { bills, districts, factions, trustParticipants, paretoScenario, evidenceSources };
}

export function calculateQuadraticCost(votes: number) {
  return Math.max(0, votes) ** 2;
}

export function summarizeVoiceBudget(allocations: VoiceAllocation[], weeklyBudget: number) {
  const spent = allocations.reduce((total, allocation) => total + calculateQuadraticCost(allocation.votes), 0);
  return { spent, remaining: Math.max(0, weeklyBudget - spent), overBudget: spent > weeklyBudget };
}

export function scoreTrust(participant: TrustParticipant) {
  return participant.accuracy * 0.36 + participant.expertise * 0.28 + participant.consistency * 0.22 + participant.transparency * 0.14;
}

export function getEvidenceForBill(bill: Bill) {
  return bill.evidenceIds
    .map((id) => evidenceSources.find((source) => source.id === id))
    .filter((source): source is EvidenceSource => Boolean(source));
}

export function assessImpact(section: BillSection, district: District): ImpactAssessment {
  const ruralMultiplier = section.domain === "health" || section.domain === "infrastructure" ? 1 + district.ruralShare * 0.35 : 1;
  const businessMultiplier = section.domain === "tax" ? 1 + district.smallBusinessShare * 0.7 : 1;
  const incomeNormalizer = Math.max(0.72, Math.min(1.28, district.medianIncome / 85000));
  const delta = Number(((section.affectedPopulationPercent * ruralMultiplier * businessMultiplier) / incomeNormalizer).toFixed(1));

  return {
    sectionId: section.id,
    districtId: district.id,
    label: section.title,
    delta,
    unit: "% exposed population equivalent",
    confidence: Number((section.confidence * district.trustBaseline).toFixed(2)),
    explanation: `${district.name} receives a ${delta}% localized exposure estimate after adjusting for rurality, small-business density, and income sensitivity.`,
    evidenceIds: section.domain === "tax" ? ["ev-census-smb", "ev-bill-104"] : ["ev-bill-104", "ev-cbo-bridge"],
  };
}

export function getLocalizedImpacts(bill: Bill, district: District) {
  return bill.sections.map((section) => assessImpact(section, district));
}

function dominates(a: ParetoPoint, b: ParetoPoint) {
  return (
    a.totalUtility >= b.totalUtility &&
    a.minimumFactionUtility >= b.minimumFactionUtility &&
    a.riskAdjustedScore >= b.riskAdjustedScore &&
    (a.totalUtility > b.totalUtility || a.minimumFactionUtility > b.minimumFactionUtility || a.riskAdjustedScore > b.riskAdjustedScore)
  );
}

export function scoreAmendment(amendment: CompromiseAmendment): ParetoPoint {
  const utilities = Object.values(amendment.utility);
  const totalUtility = utilities.reduce((sum, value) => sum + value, 0) / utilities.length;
  const minimumFactionUtility = Math.min(...utilities);
  const riskAdjustedScore = totalUtility * (1 - amendment.risk * 0.62) * (1 - amendment.implementationComplexity * 0.28);

  return {
    amendmentId: amendment.id,
    label: amendment.title,
    totalUtility: Number(totalUtility.toFixed(3)),
    minimumFactionUtility: Number(minimumFactionUtility.toFixed(3)),
    riskAdjustedScore: Number(riskAdjustedScore.toFixed(3)),
    isParetoEfficient: false,
  };
}

export function computeParetoFrontier(amendments = paretoScenario.amendments) {
  const points = amendments.map(scoreAmendment);
  return points.map((point) => ({
    ...point,
    isParetoEfficient: !points.some((candidate) => candidate.amendmentId !== point.amendmentId && dominates(candidate, point)),
  }));
}

export function getRecommendedCompromise() {
  const frontier = computeParetoFrontier();
  const best = [...frontier].sort((a, b) => b.riskAdjustedScore - a.riskAdjustedScore)[0];
  const amendment = paretoScenario.amendments.find((item) => item.id === best.amendmentId);
  return { best, amendment, frontier };
}
