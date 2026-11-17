interface PolicyRequest {
  billTitle?: string;
  billSummary?: string;
  topic?: string;
  userPrompt?: string;
}

function normalizeRequest(value: unknown): PolicyRequest {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return {};
  const input = value as Record<string, unknown>;
  const read = (key: keyof PolicyRequest, limit: number) =>
    typeof input[key] === "string" ? input[key].trim().slice(0, limit) : undefined;
  return {
    billTitle: read("billTitle", 200),
    billSummary: read("billSummary", 4000),
    topic: read("topic", 100),
    userPrompt: read("userPrompt", 1000),
  };
}

export const fallbackAnalysis = (request: PolicyRequest, source: string) => ({
  source,
  summary: `Simulated example for "${request.billTitle || "Policy Proposal"}". No policy text was independently analyzed or verified.`,
  keyRisks: [
    "Example question: What agencies would implement this proposal?",
    "Example question: What budget assumptions need verification?",
    "Example question: Which communities might face new burdens?",
  ],
  opportunities: [
    "Publish primary bill text and a traceable source list.",
    "Invite affected groups to review assumptions and missing impacts.",
    "Compare several amendment options using explicitly stated criteria.",
  ],
  stakeholderImpact: {
    consumers: "Impact has not been assessed.",
    enterprises: "Impact has not been assessed.",
    governanceBody: "Implementation impact has not been assessed.",
  },
  recommendedAmendment: "No amendment is recommended by this simulated example. Verify sources and consult affected groups first.",
});

export async function analyzePolicy(input: unknown = {}) {
  const request = normalizeRequest(input);
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    return fallbackAnalysis(request, "simulated_ai");
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(apiKey)}`,
      {
        method: "POST",
        signal: AbortSignal.timeout(10_000),
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `Analyze this policy proposal and respond with JSON containing summary, keyRisks, opportunities, stakeholderImpact, and recommendedAmendment.\n\nTitle: ${request.billTitle || "Legislative Proposal"}\nSummary: ${request.billSummary || "No detailed summary provided."}\nTopic: ${request.topic || "General Policy & Governance"}\nInstruction: ${request.userPrompt || "Provide a comprehensive risk, Pareto efficiency, and stakeholder impact analysis."}`,
                },
              ],
            },
          ],
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.2,
            maxOutputTokens: 800,
          },
        }),
      },
    );

    if (!response.ok) {
      throw new Error(`Gemini API returned ${response.status}`);
    }

    const payload = await response.json() as {
      candidates?: Array<{
        content?: { parts?: Array<{ text?: string }> };
      }>;
    };
    const responseText = payload.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!responseText) {
      throw new Error("Gemini returned no content");
    }

    const parsed = JSON.parse(responseText) as Record<string, unknown>;
    const impact = parsed.stakeholderImpact as Record<string, unknown> | null;
    if (
      typeof parsed.summary !== "string" ||
      !Array.isArray(parsed.keyRisks) || !parsed.keyRisks.every((risk) => typeof risk === "string") ||
      !Array.isArray(parsed.opportunities) || !parsed.opportunities.every((opportunity) => typeof opportunity === "string") ||
      typeof parsed.recommendedAmendment !== "string" ||
      typeof impact !== "object" || impact === null || Array.isArray(impact) ||
      typeof impact.consumers !== "string" ||
      typeof impact.enterprises !== "string" ||
      typeof impact.governanceBody !== "string"
    ) {
      throw new Error("Gemini returned an unexpected response shape");
    }
    return { ...parsed, source: "gemini_api" };
  } catch (error) {
    console.warn("Gemini API call failed; returning simulated analysis.", error);
    return fallbackAnalysis(request, "simulated_ai_fallback");
  }
}
