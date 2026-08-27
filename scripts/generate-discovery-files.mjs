import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { INDEXNOW_KEY } from "./indexnow-config.mjs";

const rawSiteUrl = process.env.PUBLIC_SITE_URL ?? process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL ?? "https://governanceapp.ai-aarti.com";
const siteUrl = new URL(rawSiteUrl.startsWith("http") ? rawSiteUrl : `https://${rawSiteUrl}`).origin;
const distDirectory = resolve("dist");
const routes = ["/", "/bills", "/feedback", "/impact", "/compromise", "/trust"];
const lastModified = new Date().toISOString().slice(0, 10);

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map((route) => `  <url><loc>${siteUrl}${route}</loc><lastmod>${lastModified}</lastmod><changefreq>weekly</changefreq><priority>${route === "/" ? "1.0" : "0.8"}</priority></url>`).join("\n")}
</urlset>
`;

const robots = `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`;

const llms = `# Civic Accord

> An evidence-based civic decision-support workspace for reviewing bills, local policy impact, voter priorities, compromise options, and stakeholder trust.

## Primary pages

- [Overview](${siteUrl}/): Start with the current governance picture and recommended action.
- [Bills](${siteUrl}/bills): Browse bills, sponsors, domains, and status.
- [Voter feedback](${siteUrl}/feedback): Express issue priorities with a weekly voice-token budget.
- [Impact analysis](${siteUrl}/impact): Compare district-level policy impact estimates.
- [Compromise analysis](${siteUrl}/compromise): Compare options by shared benefit, minimum support, and risk.
- [Stakeholder trust](${siteUrl}/trust): Review transparent credibility dimensions.

## Source materials

- [Product documentation](${siteUrl}/README.md)
`;

const manifest = JSON.stringify({
  name: "Civic Accord",
  short_name: "Civic Accord",
  description: "Evidence-based civic decision support for bills, impact, compromise, and trust.",
  start_url: "/",
  display: "standalone",
  background_color: "#f2f5fb",
  theme_color: "#0a3161",
}, null, 2);

const socialCard = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" role="img" aria-labelledby="title description">
  <title id="title">Civic Accord</title>
  <desc id="description">Evidence-based civic decision support</desc>
  <rect width="1200" height="630" fill="#f2f5fb"/>
  <rect width="1200" height="24" fill="#b31942"/>
  <rect y="24" width="1200" height="12" fill="#ffffff"/>
  <rect y="36" width="1200" height="24" fill="#0a3161"/>
  <text x="100" y="280" fill="#0a3161" font-family="Georgia, serif" font-size="88" font-weight="700">Civic Accord</text>
  <text x="104" y="420" fill="#4e5f82" font-family="Arial, sans-serif" font-size="30">Evidence-based civic decision support</text>
  <circle cx="1030" cy="354" r="86" fill="#0f766e"/>
  <path d="M986 356h88M1030 312v88" stroke="#ffffff" stroke-width="18" stroke-linecap="round"/>
</svg>`;

await mkdir(distDirectory, { recursive: true });
await Promise.all([
  writeFile(resolve(distDirectory, "robots.txt"), robots),
  writeFile(resolve(distDirectory, "sitemap.xml"), sitemap),
  writeFile(resolve(distDirectory, "llms.txt"), llms),
  writeFile(resolve(distDirectory, "ai.txt"), llms),
  writeFile(resolve(distDirectory, "site.webmanifest"), manifest),
  writeFile(resolve(distDirectory, "social-card.svg"), socialCard),
  writeFile(resolve(distDirectory, `${INDEXNOW_KEY}.txt`), INDEXNOW_KEY),
]);

console.log(`Generated discovery files for ${siteUrl}`);