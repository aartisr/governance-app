import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check endpoint
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Gemini AI Policy Analysis API Route
  app.post("/api/gemini/analyze-policy", async (req, res) => {
    try {
      const { billTitle, billSummary, topic, userPrompt } = req.body || {};

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
        // Fallback response if GEMINI_API_KEY is not configured
        return res.json({
          source: "simulated_ai",
          summary: `AI Analysis for "${billTitle || "Policy Proposal"}": Key considerations include economic efficiency, equity impact across urban vs. rural districts, and regulatory compliance timelines.`,
          keyRisks: [
            "Implementation latency due to multi-agency coordination requirements.",
            "Fiscal variance dependent on federal grant allocation timing.",
            "Unintended compliance overhead for small enterprise stakeholders."
          ],
          opportunities: [
            "Enhanced transparency and real-time auditability of fund dispersion.",
            "High Pareto improvement score when coupled with targeted tax credits.",
            "Cross-jurisdictional alignment with federal NIST governance frameworks."
          ],
          stakeholderImpact: {
            consumers: "Low-to-moderate direct cost impact with long-term quality assurance gains.",
            enterprises: "Initial transition cost offset by streamlined reporting channels.",
            governanceBody: "High audit readiness and clear key performance indicators."
          },
          recommendedAmendment: "Introduce a 90-day phased rollout for compliance benchmarks with dedicated technical assistance for small organizations."
        });
      }

      const ai = new GoogleGenAI({ apiKey });
      const promptText = `
You are an expert AI Governance & Public Policy Analyst for Governance OS.
Analyze the following policy proposal and provide structured insights.

Policy Title: ${billTitle || "Legislative Proposal"}
Policy Context/Summary: ${billSummary || "No detailed summary provided."}
Focus Domain: ${topic || "General Policy & Governance"}
User Question/Instruction: ${userPrompt || "Provide a comprehensive risk, Pareto efficiency, and stakeholder impact analysis."}

Respond in clean JSON format with these exact keys:
{
  "summary": "Brief executive summary (2-3 sentences)",
  "keyRisks": ["Risk 1", "Risk 2", "Risk 3"],
  "opportunities": ["Opportunity 1", "Opportunity 2", "Opportunity 3"],
  "stakeholderImpact": {
    "consumers": "Description of impact on citizens/consumers",
    "enterprises": "Description of impact on businesses/industry",
    "governanceBody": "Description of impact on oversight agencies"
  },
  "recommendedAmendment": "A single high-impact compromise or refining amendment recommendation."
}
`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: promptText,
        config: {
          responseMimeType: "application/json",
          temperature: 0.2,
          maxOutputTokens: 800,
        },
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error("No response text from Gemini API");
      }

      const parsedData = JSON.parse(responseText);
      return res.json({
        source: "gemini_api",
        ...parsedData,
      });
    } catch (error: any) {
      console.warn("Gemini API call encountered an issue (using free-tier simulated fallback):", error?.message || error);
      // Graceful free-tier fallback response when API key is rate limited or unavailable
      return res.json({
        source: "simulated_ai_fallback",
        summary: `Analysis for "${req.body?.billTitle || "Policy Proposal"}": Key considerations include economic efficiency, equity impact across urban vs. rural districts, and regulatory compliance timelines.`,
        keyRisks: [
          "Implementation latency due to multi-agency coordination requirements.",
          "Fiscal variance dependent on federal grant allocation timing.",
          "Unintended compliance overhead for small enterprise stakeholders."
        ],
        opportunities: [
          "Enhanced transparency and real-time auditability of fund dispersion.",
          "High Pareto improvement score when coupled with targeted tax credits.",
          "Cross-jurisdictional alignment with federal NIST governance frameworks."
        ],
        stakeholderImpact: {
          consumers: "Low-to-moderate direct cost impact with long-term quality assurance gains.",
          enterprises: "Initial transition cost offset by streamlined reporting channels.",
          governanceBody: "High audit readiness and clear key performance indicators."
        },
        recommendedAmendment: "Introduce a 90-day phased rollout for compliance benchmarks with dedicated technical assistance for small organizations."
      });
    }
  });

  // Vite development middleware vs Static Production serving
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Governance OS Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
