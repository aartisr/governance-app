export interface PageMetadata {
  title: string;
  description: string;
}

const siteName = "Civic Accord";
const defaultMetadata: PageMetadata = {
  title: `${siteName} | Evidence-Based Civic Decision Support`,
  description: "Review bills, understand local impact, compare compromise options, and place evidence beside public input.",
};

const metadataByPath: Record<string, PageMetadata> = {
  "/": defaultMetadata,
  "/bills": {
    title: `Bills | ${siteName}`,
    description: "Browse legislation, sponsors, policy domains, and bill status in an evidence-based civic decision-support workspace.",
  },
  "/feedback": {
    title: `Voter Feedback | ${siteName}`,
    description: "Express issue priorities with a transparent weekly voice-token budget and clear stakeholder constraints.",
  },
  "/impact": {
    title: `Local Policy Impact | ${siteName}`,
    description: "Compare district-level policy impact estimates, explanations, and confidence for individual bills.",
  },
  "/compromise": {
    title: `Compromise Analysis | ${siteName}`,
    description: "Compare compromise options by shared benefit, minimum stakeholder support, and delivery risk.",
  },
  "/trust": {
    title: `Stakeholder Trust | ${siteName}`,
    description: "Understand stakeholder credibility through transparent accuracy, expertise, consistency, and transparency scores.",
  },
};

function getMetadata(pathname: string): PageMetadata {
  if (pathname.startsWith("/bills/")) {
    return {
      title: `Bill Details | ${siteName}`,
      description: "Read bill sections alongside their linked evidence, budget context, and affected populations.",
    };
  }

  return metadataByPath[pathname] ?? defaultMetadata;
}

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
  const metadata = getMetadata(pathname);
  const canonicalUrl = new URL(pathname, window.location.origin).toString();
  document.title = metadata.title;
  setMeta('meta[name="description"]', "name", "description", metadata.description);
  setMeta('meta[property="og:title"]', "property", "og:title", metadata.title);
  setMeta('meta[property="og:description"]', "property", "og:description", metadata.description);
  setMeta('meta[property="og:url"]', "property", "og:url", canonicalUrl);
  setMeta('meta[name="twitter:title"]', "name", "twitter:title", metadata.title);
  setMeta('meta[name="twitter:description"]', "name", "twitter:description", metadata.description);

  let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement("link");
    canonical.rel = "canonical";
    document.head.append(canonical);
  }
  canonical.href = canonicalUrl;
}