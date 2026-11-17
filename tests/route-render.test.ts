import assert from "node:assert/strict";
import { test } from "node:test";
import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { createMemoryHistory, RouterProvider } from "@tanstack/react-router";
import { router } from "../src/routes/router";

test("every route renders its page without a runtime component error", async () => {
  const routes = [
    ["/", "See what it takes to move a public decision forward"],
    ["/bills", "Explore bills and their evidence"],
    ["/bills/hr-104", "Community Resilience and Enterprise Act"],
    ["/feedback", "Spend voice tokens on what matters"],
    ["/impact", "Explore local impact"],
    ["/compromise", "Find a way forward for HR-104"],
    ["/trust", "Explore stakeholder trust"],
    ["/decision-brief", "What we learned about HR-104"],
    ["/demo", "Guided website tour"],
  ] as const;

  for (const [path, expectedText] of routes) {
    router.update({ history: createMemoryHistory({ initialEntries: [path] }) });
    await router.load();
    const html = renderToString(createElement(RouterProvider, { router }));
    assert.ok(html.includes(expectedText), `${path} did not render its expected page`);
    assert.ok(!html.includes("Something went wrong"), `${path} rendered the router error screen`);
  }

  router.update({ history: createMemoryHistory({ initialEntries: ["/bills"] }) });
  await router.load();
  const billsHtml = renderToString(createElement(RouterProvider, { router }));
  assert.ok(billsHtml.includes("Sample Evidence Cards"), "the complete Bills inspector must render");
});
