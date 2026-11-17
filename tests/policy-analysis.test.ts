import assert from "node:assert/strict";
import { test } from "node:test";
import { analyzePolicy } from "../lib/policy-analysis";

test("uses a contextual simulated analysis when the API key is missing", async (context) => {
  const previousApiKey = process.env.GEMINI_API_KEY;
  delete process.env.GEMINI_API_KEY;
  context.after(() => {
    if (previousApiKey === undefined) {
      delete process.env.GEMINI_API_KEY;
    } else {
      process.env.GEMINI_API_KEY = previousApiKey;
    }
  });

  const result = await analyzePolicy({ billTitle: "Local Transit Access" });

  assert.equal(result.source, "simulated_ai");
  assert.match(result.summary, /Local Transit Access/);
  assert.equal(result.keyRisks.length, 3);
  assert.equal(result.opportunities.length, 3);
  assert.equal(typeof result.stakeholderImpact.governanceBody, "string");
  assert.ok(result.recommendedAmendment.length > 0);
});

test("normalizes malformed policy requests", async (context) => {
  const previousApiKey = process.env.GEMINI_API_KEY;
  delete process.env.GEMINI_API_KEY;
  context.after(() => {
    if (previousApiKey === undefined) delete process.env.GEMINI_API_KEY;
    else process.env.GEMINI_API_KEY = previousApiKey;
  });

  const result = await analyzePolicy({ billTitle: 123, topic: ["health"] });
  assert.equal(result.source, "simulated_ai");
  assert.match(result.summary, /Policy Proposal/);
});
