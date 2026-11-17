export const siteIdentity = {
  name: "Civic Accord",
  author: { name: "Aarti S Ravikumar", url: "https://ai-aarti.com/" },
  school: { name: "Pioneer Charter School of Science II", url: "https://saugus.pioneercss.org" },
};

export interface PageMetadata {
  title: string;
  description: string;
}

export function resolveSiteOrigin(environment: Record<string, string | undefined>, fallback?: string) {
  const configured = [
    environment.PUBLIC_SITE_URL,
    environment.VERCEL_PROJECT_PRODUCTION_URL,
    environment.VERCEL_URL,
    environment.URL,
    environment.CF_PAGES_URL,
    environment.RENDER_EXTERNAL_URL,
    environment.RAILWAY_PUBLIC_DOMAIN,
  ].find((value) => value?.trim());
  const value = configured?.trim() ?? fallback;
  if (!value) {
    throw new Error("No deployment hostname detected. Set PUBLIC_SITE_URL to the public site URL.");
  }
  const url = new URL(value.includes("://") ? value : `https://${value}`);
  if (!["http:", "https:"].includes(url.protocol) || url.username || url.password) {
    throw new Error("The site URL must be an HTTP(S) URL without credentials.");
  }
  if (url.pathname !== "/" || url.search || url.hash) {
    throw new Error("The app must be hosted at a domain root; the site URL cannot include a path, query, or fragment.");
  }
  return url.origin;
}

export function getRuntimeSiteOrigin(currentOrigin: string, canonicalOrigin?: string) {
  return new URL(canonicalOrigin || currentOrigin).origin;
}

export const metadataByPath: Record<string, PageMetadata> = {
  "/": {
    title: "Civic Accord | Evidence-Based Civic Decision Support",
    description: "Explore a civic decision-support prototype by Aarti S Ravikumar, Pioneer Charter School of Science II: review bills, local impact, voter priorities, evidence, and compromise options.",
  },
  "/bills": {
    title: "Bills | Civic Accord",
    description: "Browse illustrative legislation, sponsors, policy domains, and bill status in Civic Accord, created by Aarti S Ravikumar, Pioneer Charter School of Science II.",
  },
  "/feedback": {
    title: "Voter Feedback | Civic Accord",
    description: "Explore priority-setting with a transparent voice-token budget in Civic Accord, a civic prototype by Aarti S Ravikumar, Pioneer Charter School of Science II.",
  },
  "/impact": {
    title: "Local Policy Impact | Civic Accord",
    description: "Compare illustrative district-level policy impacts, explanations, and confidence in Civic Accord by Aarti S Ravikumar, Pioneer Charter School of Science II.",
  },
  "/compromise": {
    title: "Compromise Analysis | Civic Accord",
    description: "Compare simulated compromise options by shared benefit, minimum support, and risk in Civic Accord by Aarti S Ravikumar, Pioneer Charter School of Science II.",
  },
  "/trust": {
    title: "Stakeholder Trust | Civic Accord",
    description: "Inspect illustrative stakeholder credibility scores and their transparent weighting in Civic Accord by Aarti S Ravikumar, Pioneer Charter School of Science II.",
  },
  "/demo": {
    title: "Video Demo | Civic Accord",
    description: "Watch a narrated, nine-chapter interactive tour of Civic Accord, the civic decision-support prototype by Aarti S Ravikumar, Pioneer Charter School of Science II.",
  },
};

export function normalizePath(pathname: string) {
  return pathname.replace(/\/+$/, "") || "/";
}

export function getPageMetadata(pathname: string): PageMetadata {
  const path = normalizePath(pathname);
  if (path.startsWith("/bills/")) {
    return {
      title: "Bill Details | Civic Accord",
      description: "Read illustrative bill sections alongside evidence, budget context, and affected populations in Civic Accord by Aarti S Ravikumar, Pioneer Charter School of Science II.",
    };
  }
  return metadataByPath[path] ?? metadataByPath["/"];
}

export function getPageStructuredData(pathname: string, siteUrl: string) {
  const origin = new URL(siteUrl).origin;
  const canonicalUrl = new URL(normalizePath(pathname), origin).href;
  const metadata = getPageMetadata(pathname);
  const author = {
    "@type": "Person",
    "@id": `${siteIdentity.author.url}#person`,
    name: siteIdentity.author.name,
    url: siteIdentity.author.url,
  };
  const school = {
    "@type": "EducationalOrganization",
    "@id": `${siteIdentity.school.url}/#organization`,
    name: siteIdentity.school.name,
    url: siteIdentity.school.url,
  };

  return {
    "@context": "https://schema.org",
    "@graph": [
      author,
      school,
      {
        "@type": "WebSite",
        "@id": `${origin}/#website`,
        url: `${origin}/`,
        name: siteIdentity.name,
        author: { "@id": author["@id"] },
        creditText: `${author.name} · ${school.name}`,
        mentions: { "@id": school["@id"] },
        inLanguage: "en",
      },
      {
        "@type": "WebApplication",
        "@id": `${origin}/#software`,
        name: siteIdentity.name,
        url: `${origin}/`,
        description: metadataByPath["/"].description,
        applicationCategory: "EducationalApplication",
        operatingSystem: "Web browser",
        isAccessibleForFree: true,
        author: { "@id": author["@id"] },
        creator: { "@id": author["@id"] },
        creditText: `${author.name} · ${school.name}`,
        mentions: { "@id": school["@id"] },
        sameAs: "https://github.com/aartisr/governance-app",
      },
      {
        "@type": "WebPage",
        "@id": `${canonicalUrl}#webpage`,
        url: canonicalUrl,
        name: metadata.title,
        description: metadata.description,
        author: { "@id": author["@id"] },
        isPartOf: { "@id": `${origin}/#website` },
        about: { "@id": `${origin}/#software` },
        mentions: { "@id": school["@id"] },
        inLanguage: "en",
      },
    ],
  };
}
