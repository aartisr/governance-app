import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { paretoScenario } from "../src/data/governance-data";
import { getRecommendedCompromise } from "../src/services/governance-engine";

test("downloadable journey report agrees with the current sample scenario", () => {
  const source = readFileSync(new URL("../docs/Civic_Accord_HR104_Journey_Report.md", import.meta.url), "utf8");
  const download = readFileSync(new URL("../public/reports/Civic_Accord_HR104_Journey_Report.md", import.meta.url), "utf8");
  const pdf = readFileSync(new URL("../public/reports/Civic_Accord_HR104_Journey_Report.pdf", import.meta.url));
  const recommendation = getRecommendedCompromise();

  assert.equal(download, source);
  assert.equal(pdf.subarray(0, 4).toString(), "%PDF");
  assert.ok(source.includes(recommendation.amendment!.title));
  assert.ok(source.includes(recommendation.best.riskAdjustedScore.toFixed(3)));
  for (const amendment of paretoScenario.amendments) assert.ok(source.includes(amendment.title));
  assert.match(source, /does not capture an individual visitor's clicks/);
});
