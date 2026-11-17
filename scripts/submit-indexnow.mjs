import {
  INDEXNOW_ENDPOINT,
  createIndexNowPayload,
  INDEXNOW_APP_ROUTES,
  INDEXNOW_DOCS_ROUTES,
  GITHUB_PAGES_URL,
} from "./indexnow-config.mjs";
import { resolveSiteOrigin } from "../src/site-metadata.ts";

const canonicalSiteUrl = new URL(resolveSiteOrigin(process.env));
const rawDocsUrl = process.env.GITHUB_PAGES_URL ?? GITHUB_PAGES_URL;
const docsSiteUrl = new URL(rawDocsUrl.startsWith("http") ? rawDocsUrl : `https://${rawDocsUrl}`);
const sites = [
  { label: "canonical app", siteUrl: canonicalSiteUrl, routes: INDEXNOW_APP_ROUTES },
  { label: "GitHub Pages docs", siteUrl: docsSiteUrl, routes: INDEXNOW_DOCS_ROUTES },
];

let submittedCount = 0;
for (const { label, siteUrl, routes } of sites) {
  const payload = createIndexNowPayload(siteUrl, routes);

  const response = await fetch(INDEXNOW_ENDPOINT, {
    method: "POST",
    headers: { "content-type": "application/json; charset=utf-8" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`IndexNow submission failed for ${label}: ${response.status} ${await response.text()}`);
  }

  submittedCount += payload.urlList.length;
  console.log(`Submitted ${payload.urlList.length} ${label} URLs to IndexNow.`);
}

console.log(`Submitted ${submittedCount} URLs for the public site.`);
