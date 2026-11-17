import assert from "node:assert/strict";
import { test } from "node:test";
import type { CompromiseAmendment } from "../src/domain/types";
import {
  calculateQuadraticCost,
  computeParetoFrontier,
  computeParetoFrontierWithWeights,
  getBill,
  getRecommendedCompromise,
  scoreAmendmentWithWeights,
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

test("an unknown bill does not silently become a different bill", async () => {
  assert.equal(await getBill("unknown"), null);
});
