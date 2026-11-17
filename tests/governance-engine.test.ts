import assert from "node:assert/strict";
import { test } from "node:test";
import type { CompromiseAmendment } from "../src/domain/types";
import { bills, districts } from "../src/data/governance-data";
import {
  assessImpact,
  calculateQuadraticCost,
  computeParetoFrontier,
  computeParetoFrontierWithWeights,
  getBill,
  getRecommendedCompromise,
  runMonteCarloSimulation,
  scoreAmendment,
  scoreAmendmentWithWeights,
  scoreTrust,
  summarizeVoiceBudget,
} from "../src/services/governance-engine";

const amendment = (id: string, a: number, b: number): CompromiseAmendment => ({
  id,
  title: id,
  description: id,
  utility: { a, b },
  risk: 0.2,
  implementationComplexity: 0.2,
});

test("quadratic budget reports overspending without hiding it", () => {
  assert.equal(calculateQuadraticCost(7), 49);
  assert.deepEqual(summarizeVoiceBudget([
    { issueId: "a", label: "A", votes: 7, sentiment: "support" },
    { issueId: "b", label: "B", votes: 2, sentiment: "support" },
  ], 50), { spent: 53, remaining: 0, overBudget: true });
});

test("Pareto efficiency compares every stakeholder's utility", () => {
  const options = [amendment("balanced", 0.7, 0.7), amendment("dominated", 0.6, 0.6), amendment("tradeoff", 0.9, 0.4)];
  const frontier = computeParetoFrontier(options);
  assert.deepEqual(frontier.map((point) => point.isParetoEfficient), [true, false, true]);
  assert.deepEqual(
    computeParetoFrontierWithWeights({ a: 2, b: 1 }, options).map((point) => point.isParetoEfficient),
    [true, false, true],
  );
});

test("only stakeholders in an amendment contribute to its weighted average", () => {
  const option = amendment("one", 0.8, 0.4);
  assert.equal(scoreAmendmentWithWeights(option, { a: 2, b: 1, unrelated: 100 }).totalUtility, 0.667);
});

test("the recommended option belongs to the stakeholder frontier", () => {
  assert.ok(getRecommendedCompromise().best.isParetoEfficient);
});

test("impact exposure remains a bounded percentage even for extreme sample inputs", () => {
  const highExposure = assessImpact(bills[0].sections[2], districts.find((district) => district.id === "ia-04")!);
  assert.equal(highExposure.delta, 100);
  assert.match(highExposure.explanation, /before bounding to 0–100%/);
  for (const bill of bills) for (const district of districts) for (const section of bill.sections) {
    const impact = assessImpact(section, district);
    assert.ok(impact.delta >= 0 && impact.delta <= 100);
  }
});

test("the leading amendment changes when assumed stakeholder weights change", () => {
  const baseline = computeParetoFrontierWithWeights({ "growth-caucus": 1, "equity-bloc": 1, "fiscal-guardians": 1 });
  const stressed = computeParetoFrontierWithWeights({ "growth-caucus": 0.2, "equity-bloc": 2.5, "fiscal-guardians": 1 });
  assert.equal([...baseline].sort((a, b) => b.riskAdjustedScore - a.riskAdjustedScore)[0].amendmentId, "amend-sunset");
  assert.equal([...stressed].sort((a, b) => b.riskAdjustedScore - a.riskAdjustedScore)[0].amendmentId, "amend-formula");
  assert.equal(baseline.filter((point) => point.isParetoEfficient).length, 4);
  assert.equal(baseline.find((point) => point.amendmentId === "amend-sunset")?.riskAdjustedScore, 0.642);
  assert.equal(stressed.find((point) => point.amendmentId === "amend-formula")?.riskAdjustedScore, 0.638);
});

test("invalid model inputs fail clearly instead of producing misleading scores", () => {
  assert.throws(() => calculateQuadraticCost(Number.NaN), RangeError);
  assert.throws(() => calculateQuadraticCost(-1), RangeError);
  assert.throws(() => scoreAmendment({ ...amendment("empty", 0.5, 0.5), utility: {} }), RangeError);
  assert.throws(() => computeParetoFrontier([
    amendment("two-groups", 0.5, 0.5),
    { ...amendment("one-group", 0.6, 0.6), utility: { a: 0.6 } },
  ]), RangeError);
  assert.throws(() => runMonteCarloSimulation(amendment("invalid", 0.5, 0.5), 0), RangeError);
  assert.throws(() => assessImpact({ ...bills[0].sections[0], affectedPopulationPercent: Number.NaN }, districts[0]), RangeError);
  assert.throws(() => scoreTrust({ id: "invalid", name: "Invalid", role: "expert", accuracy: Number.NaN, expertise: 0.5, consistency: 0.5, transparency: 0.5 }), RangeError);
});

test("an unknown bill does not silently become a different bill", async () => {
  assert.equal(await getBill("unknown"), null);
});
