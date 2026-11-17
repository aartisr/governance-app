import assert from "node:assert/strict";
import { mkdtemp, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { generateDiscoveryFiles } from "../scripts/generate-discovery-files.mjs";
import { createIndexNowPayload } from "../scripts/indexnow-config.mjs";
import { getPageMetadata, getPageStructuredData, getRuntimeSiteOrigin, metadataByPath, resolveSiteOrigin } from "../src/site-metadata";

test("generates crawlable route HTML and discovery files with consistent attribution", async (context) => {
  const directory = await mkdtemp(join(tmpdir(), "civic-accord-discovery-"));
  context.after(() => rm(directory, { recursive: true, force: true }));
  await writeFile(join(directory, "index.html"), await readFile("index.html", "utf8"));
  const origin = "https://civic-accord.example";

  await generateDiscoveryFiles({ distDirectory: directory, siteUrl: origin });

  const sitemap = await readFile(join(directory, "sitemap.xml"), "utf8");
  const robots = await readFile(join(directory, "robots.txt"), "utf8");
  assert.ok(robots.includes(`Sitemap: ${origin}/sitemap.xml`));
  for (const route of Object.keys(metadataByPath)) {
    const html = await readFile(join(directory, route.slice(1), "index.html"), "utf8");
    const metadata = getPageMetadata(route);
    assert.ok(sitemap.includes(`<loc>${origin}${route}</loc>`));
    assert.ok(html.includes(`<title>${metadata.title}</title>`));
    assert.ok(html.includes(`<link rel="canonical" href="${origin}${route}" />`));
    assert.ok(html.includes(`<h1>${metadata.title}</h1>`));
    assert.ok(html.includes(`<p>${metadata.description}</p>`));
    assert.ok(html.includes('name="author" content="Aarti S Ravikumar"'));
    assert.ok(html.includes('href="https://ai-aarti.com/"'));
    assert.ok(html.includes('href="https://saugus.pioneercss.org"'));
    const serialized = html.match(/<script id="site-structured-data" type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
    assert.ok(serialized);
    const graph = JSON.parse(serialized)["@graph"];
    const author = graph.find((entity: { "@type": string }) => entity["@type"] === "Person");
    const webpage = graph.find((entity: { "@type": string }) => entity["@type"] === "WebPage");
    assert.equal(author.url, "https://ai-aarti.com/");
    assert.equal(webpage.author["@id"], author["@id"]);
    assert.equal(webpage.url, `${origin}${route}`);
    assert.equal(webpage.name, metadata.title);
  }
  for (const filename of ["llms.txt", "llms-full.txt", "ai.txt"]) {
    const content = await readFile(join(directory, filename), "utf8");
    assert.ok(content.includes("[Aarti S Ravikumar](https://ai-aarti.com/)"));
    assert.ok(content.includes("[Pioneer Charter School of Science II](https://saugus.pioneercss.org)"));
    assert.ok(content.includes(`${origin}/demo`));
    assert.ok(!content.includes("https://civicaccord.org"));
    assert.ok(!content.includes("https://governanceapp.ai-aarti.com"));
  }
  const openapi = JSON.parse(await readFile(join(directory, "openapi.json"), "utf8"));
  assert.deepEqual(openapi.servers, [{ url: origin }]);
  const plugin = JSON.parse(await readFile(join(directory, ".well-known/ai-plugin.json"), "utf8"));
  assert.equal(plugin.api.url, `${origin}/openapi.json`);
  assert.equal(plugin.logo_url, `${origin}/favicon.svg`);
});

test("resolves deployment hostnames across providers and honors an explicit canonical override", () => {
  for (const key of ["VERCEL_PROJECT_PRODUCTION_URL", "VERCEL_URL", "URL", "CF_PAGES_URL", "RENDER_EXTERNAL_URL", "RAILWAY_PUBLIC_DOMAIN"]) {
    assert.equal(resolveSiteOrigin({ [key]: "deployed.example" }), "https://deployed.example", key);
  }
  assert.equal(resolveSiteOrigin({
    PUBLIC_SITE_URL: "https://custom.example/",
    VERCEL_PROJECT_PRODUCTION_URL: "app.vercel.app",
    VERCEL_URL: "preview.vercel.app",
  }), "https://custom.example");
  assert.equal(resolveSiteOrigin({
    PUBLIC_SITE_URL: " ",
    VERCEL_PROJECT_PRODUCTION_URL: "app.vercel.app",
    VERCEL_URL: "preview.vercel.app",
  }), "https://app.vercel.app");
  assert.throws(() => resolveSiteOrigin({}), /No deployment hostname/);
  assert.equal(resolveSiteOrigin({}, "http://localhost:3000"), "http://localhost:3000");
  for (const invalid of ["ftp://invalid.example", "https://user:password@invalid.example", "https://invalid.example/subpath", "https://invalid.example/?q=1"]) {
    assert.throws(() => resolveSiteOrigin({ PUBLIC_SITE_URL: invalid }), undefined, invalid);
  }
});

test("browser URLs follow local or public hosts unless a preferred canonical domain is configured", () => {
  for (const current of ["http://localhost:3000", "http://127.0.0.1:5180", "https://new-host.example"]) {
    const origin = getRuntimeSiteOrigin(current);
    const graph = getPageStructuredData("/demo", origin)["@graph"];
    assert.equal(graph.find((entity) => entity["@type"] === "WebPage")?.url, `${current}/demo`);
    assert.equal(graph.find((entity) => entity["@type"] === "Person")?.url, "https://ai-aarti.com/");
    assert.equal(graph.find((entity) => entity["@type"] === "EducationalOrganization")?.url, "https://saugus.pioneercss.org");
  }
  assert.equal(getRuntimeSiteOrigin("https://preview.example", "https://preferred.example/"), "https://preferred.example");
});

test("normalizes trailing slashes and gives bill details their own attributed metadata", () => {
  assert.deepEqual(getPageMetadata("/demo/"), getPageMetadata("/demo"));
  const detail = getPageStructuredData("/bills/HR-401/", "https://civic-accord.example");
  const webpage = detail["@graph"].find((entity) => entity["@type"] === "WebPage");
  assert.equal(webpage?.url, "https://civic-accord.example/bills/HR-401");
  assert.equal(webpage?.name, "Bill Details | Civic Accord");
  assert.ok(webpage?.description?.includes("Aarti S Ravikumar, Pioneer Charter School of Science II"));
});

test("documentation pages expose linked author and school credits without JavaScript", async () => {
  const pages = (await readdir("site")).filter((filename) => filename.endsWith(".html"));
  for (const filename of pages) {
    const html = await readFile(join("site", filename), "utf8");
    if (!html.includes("<html")) continue;
    assert.ok(html.includes('name="author" content="Aarti S Ravikumar"'), filename);
    assert.ok(html.includes('href="https://ai-aarti.com/" rel="author"'), filename);
    assert.ok(html.includes('href="https://saugus.pioneercss.org">Pioneer Charter School of Science II</a>'), filename);
    if (filename === "404.html") {
      assert.ok(html.includes('content="noindex, follow"'));
    } else {
      const serialized = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
      assert.ok(serialized, filename);
      assert.equal(JSON.parse(serialized).author.url, "https://ai-aarti.com/", filename);
    }
  }
});

test("IndexNow preserves the GitHub Pages project path for URLs and key verification", () => {
  const payload = createIndexNowPayload("https://aartisr.github.io/governance-app", ["/", "/how-it-works.html"]);
  assert.equal(payload.host, "aartisr.github.io");
  assert.ok(payload.keyLocation.startsWith("https://aartisr.github.io/governance-app/"));
  assert.deepEqual(payload.urlList, [
    "https://aartisr.github.io/governance-app/",
    "https://aartisr.github.io/governance-app/how-it-works.html",
  ]);
  const app = createIndexNowPayload("https://governanceapp.ai-aarti.com", ["/", "/demo"]);
  assert.deepEqual(app.urlList, [
    "https://governanceapp.ai-aarti.com/",
    "https://governanceapp.ai-aarti.com/demo",
  ]);
});
