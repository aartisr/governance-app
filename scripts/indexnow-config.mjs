export const INDEXNOW_KEY = "c0c223c3-952a-4d62-b96e-0eaa7a7bb2d1";
export const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";
export const INDEXNOW_APP_ROUTES = ["/", "/bills", "/feedback", "/impact", "/compromise", "/trust", "/decision-brief", "/demo"];
export const INDEXNOW_DOCS_ROUTES = [
	"/",
	"/how-it-works.html",
	"/bill-intelligence.html",
	"/impact-analysis.html",
	"/compromise-analysis.html",
	"/voter-feedback-and-trust.html",
	"/contributing.html",
];
export const GITHUB_PAGES_URL = "https://aartisr.github.io/governance-app/";

export function createIndexNowPayload(siteUrl, routes) {
	const base = new URL(siteUrl);
	if (!base.pathname.endsWith("/")) base.pathname += "/";
	return {
		host: base.host,
		key: INDEXNOW_KEY,
		keyLocation: new URL(`${INDEXNOW_KEY}.txt`, base).href,
		urlList: routes.map((route) => new URL(route.replace(/^\//, ""), base).href),
	};
}
