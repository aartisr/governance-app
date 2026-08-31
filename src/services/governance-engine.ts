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

export function scoreAmendmentWithWeights(
  amendment: CompromiseAmendment,
  weights: Record<string, number> = { "growth-caucus": 1, "equity-bloc": 1, "fiscal-guardians": 1 }
): ParetoPoint {
  const totalWeight = Object.values(weights).reduce((sum, w) => sum + Math.max(0.1, w), 0);
  const weightedSum = Object.entries(amendment.utility).reduce((sum, [factionId, util]) => {
    const w = Math.max(0.1, weights[factionId] ?? 1);
    return sum + util * w;
  }, 0);

  const totalUtility = weightedSum / totalWeight;
  const minimumFactionUtility = Math.min(...Object.values(amendment.utility));
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

export function computeParetoFrontierWithWeights(
  weights: Record<string, number>,
  amendments = paretoScenario.amendments
) {
  const points = amendments.map((a) => scoreAmendmentWithWeights(a, weights));
  return points.map((point) => ({
    ...point,
    isParetoEfficient: !points.some((candidate) => candidate.amendmentId !== point.amendmentId && dominates(candidate, point)),
  }));
}

export type MonteCarloResult = {
  iterations: number;
  p10: number;
  p50: number;
  p90: number;
  mean: number;
  stdDev: number;
  distribution: { bin: string; count: number; min: number; max: number }[];
};

export function runMonteCarloSimulation(
  amendment: CompromiseAmendment,
  iterations = 1000
): MonteCarloResult {
  const scores: number[] = [];
  const baseUtility = Object.values(amendment.utility).reduce((a, b) => a + b, 0) / Object.values(amendment.utility).length;

  // Box-Muller random normal generator
  function randomNormal(mean: number, stdDev: number) {
    const u1 = Math.max(0.0001, Math.random());
    const u2 = Math.random();
    const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    return mean + z0 * stdDev;
  }

  for (let i = 0; i < iterations; i++) {
    // Macro inflation shock factor (stdDev 0.08)
    const macroShock = randomNormal(1.0, 0.08);
    // Implementation friction factor based on complexity
    const friction = randomNormal(amendment.implementationComplexity * 0.2, 0.05);
    // District adoption variance
    const adoptionVar = randomNormal(1.0, amendment.risk * 0.3);

    const score = Math.max(0, Math.min(1, baseUtility * (1 - friction) * adoptionVar * (1 / Math.max(0.7, macroShock * 0.9))));
    scores.push(score);
  }

  scores.sort((a, b) => a - b);

  const p10 = Number(scores[Math.floor(iterations * 0.1)].toFixed(3));
  const p50 = Number(scores[Math.floor(iterations * 0.5)].toFixed(3));
  const p90 = Number(scores[Math.floor(iterations * 0.9)].toFixed(3));
  const mean = Number((scores.reduce((a, b) => a + b, 0) / iterations).toFixed(3));
  const variance = scores.reduce((sum, val) => sum + (val - mean) ** 2, 0) / iterations;
  const stdDev = Number(Math.sqrt(variance).toFixed(3));

  // Build 10 histogram bins from 0.0 to 1.0
  const binSize = 0.1;
  const distribution = Array.from({ length: 10 }, (_, i) => {
    const min = Number((i * binSize).toFixed(1));
    const max = Number(((i + 1) * binSize).toFixed(1));
    const count = scores.filter((s) => s >= min && (i === 9 ? s <= max : s < max)).length;
    return { bin: `${Math.round(min * 100)}-${Math.round(max * 100)}%`, count, min, max };
  });

  return { iterations, p10, p50, p90, mean, stdDev, distribution };
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

