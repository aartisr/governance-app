import {
  INDEXNOW_ENDPOINT,
  INDEXNOW_KEY,
  INDEXNOW_APP_ROUTES,
  INDEXNOW_DOCS_ROUTES,
  GITHUB_PAGES_URL,
  PUBLIC_SITE_URL,
} from "./indexnow-config.mjs";

const rawSiteUrl = process.env.PUBLIC_SITE_URL ?? PUBLIC_SITE_URL;
const canonicalSiteUrl = new URL(rawSiteUrl.startsWith("http") ? rawSiteUrl : `https://${rawSiteUrl}`);
const rawDocsUrl = process.env.GITHUB_PAGES_URL ?? GITHUB_PAGES_URL;
const docsSiteUrl = new URL(rawDocsUrl.startsWith("http") ? rawDocsUrl : `https://${rawDocsUrl}`);
const sites = [
  { label: "canonical app", siteUrl: canonicalSiteUrl, routes: INDEXNOW_APP_ROUTES },
  { label: "GitHub Pages docs", siteUrl: docsSiteUrl, routes: INDEXNOW_DOCS_ROUTES },
];

let submittedCount = 0;
for (const { label, siteUrl, routes } of sites) {
  const payload = {
    host: siteUrl.host,
    key: INDEXNOW_KEY,
    keyLocation: new URL(`/${INDEXNOW_KEY}.txt`, siteUrl).href,
    urlList: routes.map((route) => new URL(route, siteUrl).href),
  };

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
