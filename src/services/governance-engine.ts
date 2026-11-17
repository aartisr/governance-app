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

const delay = (ms = 140) => new Promise((resolve) => globalThis.setTimeout(resolve, ms));

export async function listBills() {
  await delay();
  return bills;
}

export async function getBill(billId: string) {
  await delay();
  return bills.find((bill) => bill.id === billId) ?? null;
}

export async function getGovernanceSnapshot() {
  await delay(100);
  return { bills, districts, factions, trustParticipants, paretoScenario, evidenceSources };
}

export function calculateQuadraticCost(votes: number) {
  if (!Number.isSafeInteger(votes) || votes < 0) throw new RangeError("Votes must be a non-negative integer.");
  return votes ** 2;
}

export function summarizeVoiceBudget(allocations: VoiceAllocation[], weeklyBudget: number) {
  if (!Number.isFinite(weeklyBudget) || weeklyBudget < 0) throw new RangeError("Token budget must be finite and non-negative.");
  const spent = allocations.reduce((total, allocation) => total + calculateQuadraticCost(allocation.votes), 0);
  return { spent, remaining: Math.max(0, weeklyBudget - spent), overBudget: spent > weeklyBudget };
}

export function scoreTrust(participant: TrustParticipant) {
  if ([participant.accuracy, participant.expertise, participant.consistency, participant.transparency]
    .some((value) => !Number.isFinite(value) || value < 0 || value > 1)) {
    throw new RangeError("Trust inputs must be finite values between 0 and 1.");
  }
  return participant.accuracy * 0.36 + participant.expertise * 0.28 + participant.consistency * 0.22 + participant.transparency * 0.14;
}

export function getEvidenceForBill(bill: Bill) {
  return bill.evidenceIds
    .map((id) => evidenceSources.find((source) => source.id === id))
    .filter((source): source is EvidenceSource => Boolean(source));
}

export function assessImpact(section: BillSection, district: District): ImpactAssessment {
  if (!Number.isFinite(section.affectedPopulationPercent) || section.affectedPopulationPercent < 0 || section.affectedPopulationPercent > 100 ||
    !Number.isFinite(section.confidence) || section.confidence < 0 || section.confidence > 1 ||
    !Number.isFinite(district.medianIncome) || district.medianIncome <= 0 ||
    [district.ruralShare, district.smallBusinessShare, district.trustBaseline].some((value) => !Number.isFinite(value) || value < 0 || value > 1)) {
    throw new RangeError("Impact inputs must use valid percentages, shares, and positive income.");
  }
  const ruralMultiplier = section.domain === "health" || section.domain === "infrastructure" ? 1 + district.ruralShare * 0.35 : 1;
  const businessMultiplier = section.domain === "tax" ? 1 + district.smallBusinessShare * 0.7 : 1;
  const incomeNormalizer = Math.max(0.72, Math.min(1.28, district.medianIncome / 85000));
  const rawExposure = (section.affectedPopulationPercent * ruralMultiplier * businessMultiplier) / incomeNormalizer;
  const delta = Number(Math.min(100, Math.max(0, rawExposure)).toFixed(1));

  return {
    sectionId: section.id,
    districtId: district.id,
    label: section.title,
    delta,
    unit: "% exposed population equivalent",
    confidence: Number((section.confidence * district.trustBaseline).toFixed(2)),
    explanation: `Illustrative calculation: ${section.affectedPopulationPercent}% assumed base exposure × ${ruralMultiplier.toFixed(2)} rural factor × ${businessMultiplier.toFixed(2)} business factor ÷ ${incomeNormalizer.toFixed(2)} income factor = ${rawExposure.toFixed(1)}% before bounding to 0–100%. Result: ${delta}%. This is not a measured share of residents.`,
    evidenceIds: section.domain === "tax" ? ["ev-census-smb", "ev-bill-104"] : ["ev-bill-104", "ev-cbo-bridge"],
  };
}

export function getLocalizedImpacts(bill: Bill, district: District) {
  return bill.sections.map((section) => assessImpact(section, district));
}

function dominates(a: CompromiseAmendment, b: CompromiseAmendment) {
  const groups = Object.keys(b.utility);
  return groups.length > 0 && groups.every((group) =>
    a.utility[group] !== undefined && a.utility[group] >= b.utility[group]
  ) && groups.some((group) => a.utility[group] > b.utility[group]);
}

function validateAmendment(amendment: CompromiseAmendment) {
  const utilities = Object.values(amendment.utility);
  if (utilities.length === 0 || utilities.some((value) => !Number.isFinite(value) || value < 0 || value > 1)) {
    throw new RangeError("Amendments need finite group utilities between 0 and 1.");
  }
  if (![amendment.risk, amendment.implementationComplexity].every((value) => Number.isFinite(value) && value >= 0 && value <= 1)) {
    throw new RangeError("Risk and complexity must be finite values between 0 and 1.");
  }
}

function validateComparableAmendments(amendments: CompromiseAmendment[]) {
  if (amendments.length === 0) return;
  const groups = Object.keys(amendments[0].utility).sort().join("\u0000");
  for (const amendment of amendments) {
    validateAmendment(amendment);
    if (Object.keys(amendment.utility).sort().join("\u0000") !== groups) {
      throw new RangeError("Every amendment must score the same stakeholder groups.");
    }
  }
}

export function scoreAmendment(amendment: CompromiseAmendment): ParetoPoint {
  validateAmendment(amendment);
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
  validateAmendment(amendment);
  if (Object.values(weights).some((weight) => !Number.isFinite(weight) || weight < 0)) {
    throw new RangeError("Stakeholder weights must be finite and non-negative.");
  }
  const totalWeight = Object.keys(amendment.utility).reduce((sum, factionId) =>
    sum + Math.max(0.1, weights[factionId] ?? 1), 0);
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
  validateComparableAmendments(amendments);
  const points = amendments.map((a) => scoreAmendmentWithWeights(a, weights));
  return points.map((point, index) => ({
    ...point,
    isParetoEfficient: !amendments.some((candidate, candidateIndex) => candidateIndex !== index && dominates(candidate, amendments[index])),
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
  validateAmendment(amendment);
  if (!Number.isSafeInteger(iterations) || iterations < 1 || iterations > 100000) {
    throw new RangeError("Iterations must be an integer from 1 to 100,000.");
  }
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
  validateComparableAmendments(amendments);
  const points = amendments.map(scoreAmendment);
  return points.map((point, index) => ({
    ...point,
    isParetoEfficient: !amendments.some((candidate, candidateIndex) => candidateIndex !== index && dominates(candidate, amendments[index])),
  }));
}

export function getRecommendedCompromise() {
  const frontier = computeParetoFrontier();
  const best = frontier.filter((point) => point.isParetoEfficient)
    .sort((a, b) => b.riskAdjustedScore - a.riskAdjustedScore)[0];
  const amendment = paretoScenario.amendments.find((item) => item.id === best.amendmentId);
  return { best, amendment, frontier };
}

