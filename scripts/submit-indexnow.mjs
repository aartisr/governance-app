import { INDEXNOW_ENDPOINT, INDEXNOW_KEY, INDEXNOW_ROUTES } from "./indexnow-config.mjs";

const rawSiteUrl = process.env.PUBLIC_SITE_URL ?? "https://governanceapp.ai-aarti.com";
const siteUrl = new URL(rawSiteUrl.startsWith("http") ? rawSiteUrl : `https://${rawSiteUrl}`);
const payload = {
  host: siteUrl.host,
  key: INDEXNOW_KEY,
  keyLocation: new URL(`/${INDEXNOW_KEY}.txt`, siteUrl).href,
  urlList: INDEXNOW_ROUTES.map((route) => new URL(route, siteUrl).href),
};

const response = await fetch(INDEXNOW_ENDPOINT, {
  method: "POST",
  headers: { "content-type": "application/json; charset=utf-8" },
  body: JSON.stringify(payload),
});

if (!response.ok) {
  throw new Error(`IndexNow submission failed: ${response.status} ${await response.text()}`);
}

console.log(`Submitted ${payload.urlList.length} canonical URLs to IndexNow.`);
