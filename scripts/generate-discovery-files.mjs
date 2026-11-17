import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { INDEXNOW_KEY } from "./indexnow-config.mjs";
import { getPageMetadata, getPageStructuredData, metadataByPath, resolveSiteOrigin, siteIdentity } from "../src/site-metadata.ts";

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[character]);
}

export async function generateDiscoveryFiles({
  distDirectory = resolve("dist"),
  siteUrl = resolveSiteOrigin(process.env),
} = {}) {
  const origin = resolveSiteOrigin({ PUBLIC_SITE_URL: siteUrl });
  const routes = Object.keys(metadataByPath);
  const template = await readFile(resolve(distDirectory, "index.html"), "utf8");
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map((route) => `  <url><loc>${origin}${route}</loc></url>`).join("\n")}
</urlset>
`;
  const robots = `User-agent: *
Allow: /

Sitemap: ${origin}/sitemap.xml
`;
  const manifest = JSON.stringify({
    name: siteIdentity.name,
    short_name: siteIdentity.name,
    description: `Civic decision support by ${siteIdentity.author.name}, ${siteIdentity.school.name}.`,
    start_url: "/",
    display: "standalone",
    background_color: "#f2f5fb",
    theme_color: "#0a3161",
  }, null, 2);
  const socialCard = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" role="img" aria-labelledby="title description">
  <title id="title">Civic Accord by Aarti S Ravikumar, Pioneer Charter School of Science II</title>
  <desc id="description">Evidence-based civic decision support by Aarti S Ravikumar, Pioneer Charter School of Science II</desc>
  <rect width="1200" height="630" fill="#f2f5fb"/>
  <rect width="1200" height="24" fill="#b31942"/>
  <rect y="24" width="1200" height="12" fill="#ffffff"/>
  <rect y="36" width="1200" height="24" fill="#0a3161"/>
  <text x="100" y="280" fill="#0a3161" font-family="Georgia, serif" font-size="88" font-weight="700">Civic Accord</text>
  <text x="104" y="390" fill="#4e5f82" font-family="Arial, sans-serif" font-size="30">Evidence-based civic decision support</text>
  <a href="https://ai-aarti.com/"><text x="104" y="470" fill="#0a3161" font-family="Arial, sans-serif" font-size="28">Aarti S Ravikumar</text></a>
  <a href="https://saugus.pioneercss.org"><text x="104" y="516" fill="#0a3161" font-family="Arial, sans-serif" font-size="28">Pioneer Charter School of Science II</text></a>
</svg>`;

  await Promise.all(routes.map(async (route) => {
    const metadata = getPageMetadata(route);
    const canonical = `${origin}${route}`;
    const metaValues = {
      description: metadata.description,
      author: siteIdentity.author.name,
      "DC.creator": siteIdentity.author.name,
      "DC.title": metadata.title,
      "DC.description": metadata.description,
      "og:title": metadata.title,
      "og:description": metadata.description,
      "og:url": canonical,
      "og:image": `${origin}/social-card.svg`,
      "twitter:title": metadata.title,
      "twitter:description": metadata.description,
      "twitter:image": `${origin}/social-card.svg`,
    };
    const html = template
      .replace(/<title>[\s\S]*?<\/title>/, () => `<title>${escapeHtml(metadata.title)}</title>`)
      .replace(/(<meta (?:name|property)="([^"]+)" content=")[^"]*(")/g,
        (match, prefix, key, suffix) => key in metaValues ? `${prefix}${escapeHtml(metaValues[key])}${suffix}` : match)
      .replace(/<link rel="canonical" href="[^"]*"\s*\/?>/, () => `<link rel="canonical" href="${canonical}" />`)
      .replace(/<script id="site-structured-data" type="application\/ld\+json">[\s\S]*?<\/script>/,
        () => `<script id="site-structured-data" type="application/ld+json">${JSON.stringify(getPageStructuredData(route, origin)).replace(/</g, "\\u003c")}</script>`)
      .replace(/(<div id="root">[\s\S]*?<main>\s*<h1>)[\s\S]*?(<\/h1>\s*<p>)[\s\S]*?(<\/p>)/,
        (_match, prefix, middle, suffix) => `${prefix}${escapeHtml(metadata.title)}${middle}${escapeHtml(metadata.description)}${suffix}`);
    const directory = resolve(distDirectory, route.slice(1));
    await mkdir(directory, { recursive: true });
    await writeFile(resolve(directory, "index.html"), html);
  }));

  const llms = await readFile(resolve("public/llms.txt"), "utf8");
  const llmsFull = await readFile(resolve("public/llms-full.txt"), "utf8");
  const absoluteLinks = (content) => content.replace(/\]\((\/[^)]*)\)/g, (_match, path) => `](${new URL(path, origin).href})`);
  const openapi = JSON.parse(await readFile(resolve("public/openapi.json"), "utf8"));
  openapi.servers = [{ url: origin }];
  const plugin = JSON.parse(await readFile(resolve("public/.well-known/ai-plugin.json"), "utf8"));
  plugin.api.url = new URL(plugin.api.url, origin).href;
  plugin.logo_url = new URL(plugin.logo_url, origin).href;
  await mkdir(resolve(distDirectory, ".well-known"), { recursive: true });
  await Promise.all([
    writeFile(resolve(distDirectory, "robots.txt"), robots),
    writeFile(resolve(distDirectory, "sitemap.xml"), sitemap),
    writeFile(resolve(distDirectory, "llms.txt"), absoluteLinks(llms)),
    writeFile(resolve(distDirectory, "ai.txt"), absoluteLinks(llms)),
    writeFile(resolve(distDirectory, "llms-full.txt"), absoluteLinks(llmsFull)),
    writeFile(resolve(distDirectory, "openapi.json"), JSON.stringify(openapi, null, 2)),
    writeFile(resolve(distDirectory, ".well-known/ai-plugin.json"), JSON.stringify(plugin, null, 2)),
    writeFile(resolve(distDirectory, "site.webmanifest"), manifest),
    writeFile(resolve(distDirectory, "social-card.svg"), socialCard),
    writeFile(resolve(distDirectory, `${INDEXNOW_KEY}.txt`), INDEXNOW_KEY),
  ]);
  console.log(`Generated discovery files and ${routes.length} route pages for ${origin}`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const localOrigin = "http://localhost:3000";
  const siteUrl = resolveSiteOrigin(process.env, localOrigin);
  if (siteUrl === localOrigin) {
    console.warn("Building discovery URLs for localhost. For deployment, set PUBLIC_SITE_URL or use a supported host's deployment environment variables.");
  }
  await generateDiscoveryFiles({
    siteUrl,
  });
}
