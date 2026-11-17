import { createRootRoute, createRoute, createRouter } from "@tanstack/react-router";
import { AppShell } from "../components/AppShell";
import { BillDetailPage } from "./pages/BillDetailPage";
import { BillsPage } from "./pages/BillsPage";
import { CommandCenterPage } from "./pages/CommandCenterPage";
import { CompromisePage } from "./pages/CompromisePage";
import { DemoPage } from "./pages/DemoPage";
import { DecisionBriefPage } from "./pages/DecisionBriefPage";
import { FeedbackPage } from "./pages/FeedbackPage";
import { ImpactPage } from "./pages/ImpactPage";
import { TrustPage } from "./pages/TrustPage";
import { createAppChildRoute } from "./route-factory";

const rootRoute = createRootRoute({ component: AppShell });

const indexRoute = createAppChildRoute(rootRoute, "/", CommandCenterPage);
const billsRoute = createAppChildRoute(rootRoute, "/bills", BillsPage);
const billDetailRoute = createAppChildRoute(rootRoute, "/bills/$billId", BillDetailPage);
const feedbackRoute = createAppChildRoute(rootRoute, "/feedback", FeedbackPage);
const impactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/impact",
  component: ImpactPage,
  validateSearch: (search: Record<string, unknown>) => ({ billId: typeof search.billId === "string" ? search.billId : undefined }),
});
const compromiseRoute = createAppChildRoute(rootRoute, "/compromise", CompromisePage);
const trustRoute = createAppChildRoute(rootRoute, "/trust", TrustPage);
const demoRoute = createAppChildRoute(rootRoute, "/demo", DemoPage);
const decisionBriefRoute = createAppChildRoute(rootRoute, "/decision-brief", DecisionBriefPage);

const routeTree = rootRoute.addChildren([
  indexRoute,
  billsRoute,
  billDetailRoute,
  feedbackRoute,
  impactRoute,
  compromiseRoute,
  trustRoute,
  decisionBriefRoute,
  demoRoute,
]);

export const router = createRouter({ routeTree });
