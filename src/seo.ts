import { getPageMetadata, getPageStructuredData, getRuntimeSiteOrigin, normalizePath, siteIdentity } from "./site-metadata";

function setMeta(selector: string, attribute: "name" | "property", key: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.append(element);
  }
  element.content = content;
}

export function updatePageMetadata(pathname: string) {
  const metadata = getPageMetadata(pathname);
  let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  const canonicalOrigin = document.head.querySelector<HTMLMetaElement>('meta[name="site-origin"]')?.content;
  const siteUrl = getRuntimeSiteOrigin(window.location.origin, canonicalOrigin);
  const canonicalUrl = new URL(normalizePath(pathname), siteUrl).href;
  document.title = metadata.title;
  setMeta('meta[name="description"]', "name", "description", metadata.description);
  setMeta('meta[property="og:title"]', "property", "og:title", metadata.title);
  setMeta('meta[property="og:description"]', "property", "og:description", metadata.description);
  setMeta('meta[property="og:url"]', "property", "og:url", canonicalUrl);
  setMeta('meta[property="og:image"]', "property", "og:image", `${siteUrl}/social-card.svg`);
  setMeta('meta[name="twitter:title"]', "name", "twitter:title", metadata.title);
  setMeta('meta[name="twitter:description"]', "name", "twitter:description", metadata.description);
  setMeta('meta[name="twitter:image"]', "name", "twitter:image", `${siteUrl}/social-card.svg`);
  setMeta('meta[name="author"]', "name", "author", siteIdentity.author.name);
  setMeta('meta[name="DC.creator"]', "name", "DC.creator", siteIdentity.author.name);
  setMeta('meta[name="DC.description"]', "name", "DC.description", metadata.description);
  setMeta('meta[name="DC.title"]', "name", "DC.title", metadata.title);

  if (!canonical) {
    canonical = document.createElement("link");
    canonical.rel = "canonical";
    document.head.append(canonical);
  }
  canonical.href = canonicalUrl;

  let structuredData = document.head.querySelector<HTMLScriptElement>("#site-structured-data");
  if (!structuredData) {
    structuredData = document.createElement("script");
    structuredData.id = "site-structured-data";
    structuredData.type = "application/ld+json";
    document.head.append(structuredData);
  }
  structuredData.textContent = JSON.stringify(getPageStructuredData(pathname, siteUrl));
}