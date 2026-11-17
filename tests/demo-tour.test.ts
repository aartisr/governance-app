import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { primaryNavigationItems } from "../src/routes/navigation";
import { civicTourStages } from "../src/routes/pages/DemoPage";

test("guided tour frames the live workflow with an introduction and closing", () => {
  const paths = civicTourStages.map((stage) => stage.path);
  assert.deepEqual(paths, ["/", "/", "/bills", "/bills/hr-104", "/impact", "/feedback", "/compromise", "/compromise", "/trust", "/decision-brief", "/decision-brief"]);
  assert.equal(civicTourStages[0].kind, "intro");
  assert.equal(civicTourStages.at(-1)?.kind, "outro");
  for (const stage of civicTourStages) {
    assert.ok(primaryNavigationItems.some((item) => item.path === stage.path || (item.match === "prefix" && stage.path.startsWith(`${item.path}/`))));
    assert.ok(stage.steps.length >= 2, `${stage.title} should explain the screen progressively`);
    assert.ok(stage.steps.every((step) => step.narration.length > 35), `${stage.title} needs clear captions`);
    if (!stage.kind) {
      assert.ok(stage.steps.some((step) => step.action), `${stage.title} needs a visible interaction`);
      assert.ok(stage.steps.every((step) => !step.action || step.action.selector.length > 3));
    }
  }
});

test("the narrated path uses live controls to move between pages", () => {
  const departing = ["/", "/bills", "/bills/hr-104", "/impact", "/feedback", "/compromise", "/trust"];
  for (const path of departing) {
    const stage = civicTourStages.find((item) => item.path === path && item.steps.at(-1)?.action?.kind === "click");
    assert.ok(stage, `${path} should end by clicking a page link`);
  }
  assert.ok(civicTourStages.find((stage) => stage.path === "/feedback")?.steps.some((step) => step.narration.includes("voice tokens") && step.action?.kind === "range"));
  assert.ok(civicTourStages.find((stage) => stage.path === "/decision-brief")?.steps.some((step) => step.narration.includes("What to do next")));
});

test("the bill inspector exposes the stable control used by the tour", () => {
  const readBillStep = civicTourStages.find((stage) => stage.path === "/bills")?.steps.at(-1);
  assert.equal(readBillStep?.action?.selector, "[data-tour='read-selected-bill']");
  const inspectorSource = readFileSync(new URL("../src/components/BillsWorkspace.tsx", import.meta.url), "utf8");
  assert.match(inspectorSource, /data-tour="read-selected-bill"/);
});
