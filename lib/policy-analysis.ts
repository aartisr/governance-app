interface PolicyRequest {
  billTitle?: string;
  billSummary?: string;
  topic?: string;
  userPrompt?: string;
}

export const fallbackAnalysis = (request: PolicyRequest, source: string) => ({
  source,
  summary: `AI Analysis for "${request.billTitle || "Policy Proposal"}": Key considerations include economic efficiency, equity impact across urban vs. rural districts, and regulatory compliance timelines.`,
  keyRisks: [
    "Implementation latency due to multi-agency coordination requirements.",
    "Fiscal variance dependent on federal grant allocation timing.",
    "Unintended compliance overhead for small enterprise stakeholders.",
  ],
  opportunities: [
    "Enhanced transparency and real-time auditability of fund dispersion.",
    "High Pareto improvement score when coupled with targeted tax credits.",
    "Cross-jurisdictional alignment with federal NIST governance frameworks.",
  ],
  stakeholderImpact: {
    consumers: "Low-to-moderate direct cost impact with long-term quality assurance gains.",
    enterprises: "Initial transition cost offset by streamlined reporting channels.",
    governanceBody: "High audit readiness and clear key performance indicators.",
  },
  recommendedAmendment: "Introduce a 90-day phased rollout for compliance benchmarks with dedicated technical assistance for small organizations.",
});

export async function analyzePolicy(request: PolicyRequest = {}) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    return fallbackAnalysis(request, "simulated_ai");
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(apiKey)}`,
      {
        method: "POST",
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

    return { source: "gemini_api", ...JSON.parse(responseText) };
  } catch (error) {
    console.warn("Gemini API call failed; returning simulated analysis.", error);
    return fallbackAnalysis(request, "simulated_ai_fallback");
  }
}