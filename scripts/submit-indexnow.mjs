import {
  GITHUB_PAGES_ROUTES,
  GITHUB_PAGES_SITE_URL,
  INDEXNOW_ENDPOINT,
  INDEXNOW_KEY,
  INDEXNOW_ROUTES,
} from "./indexnow-config.mjs";

const rawSiteUrl = process.env.PUBLIC_SITE_URL ?? "https://governanceapp.ai-aarti.com";
const canonicalSiteUrl = new URL(rawSiteUrl.startsWith("http") ? rawSiteUrl : `https://${rawSiteUrl}`);
const sites = [
  { label: "canonical app", siteUrl: canonicalSiteUrl, routes: INDEXNOW_ROUTES },
  { label: "GitHub Pages", siteUrl: new URL(GITHUB_PAGES_SITE_URL), routes: GITHUB_PAGES_ROUTES },
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

console.log(`Submitted ${submittedCount} URLs across both public sites.`);
