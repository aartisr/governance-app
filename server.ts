import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "10mb" }));

  // Health check endpoint
  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      appName: "Civic Accord - Pareto Governance Engine Video Demo",
      timestamp: new Date().toISOString(),
      hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    });
  });

  // AI endpoint: Generate custom video demo script & scene actions for any bill
  app.post("/api/generate-walkthrough", async (req, res) => {
    try {
      const { topic, customBillText, targetAudience = "Citizen & Policymaker" } = req.body;
      const ai = getGeminiClient();

      if (!ai) {
        return res.status(200).json({
          fallback: true,
          message: "GEMINI_API_KEY not configured, using built-in high fidelity scenarios.",
        });
      }

      const prompt = `You are the lead narrative director and civic data scientist for "Civic Accord: Pareto Governance Engine", built by Aarti S Ravikumar.
Generate a structured 6-scene end-to-end video demonstration script and simulation dataset for the following bill/policy topic:
"${topic || "Municipal Clean Energy Grid & Congestion Pricing Accord"}"
Bill context: "${customBillText || "A comprehensive legislative proposal balancing carbon emission reduction, public transit funding, small business cost burdens, and low-income commuter equity."}"
Target Audience: ${targetAudience}

Return valid JSON adhering to this schema:
{
  "title": string,
  "summary": string,
  "billCode": string,
  "scenes": [
    {
      "sceneId": "scene-1" | "scene-2" | "scene-3" | "scene-4" | "scene-5" | "scene-6",
      "title": string,
      "narration": string,
      "durationSec": number,
      "keyTakeaways": string[],
      "visualFocus": string,
      "simulationHighlight": string
    }
  ],
  "stakeholders": [
    {
      "name": string,
      "group": string,
      "initialUtility": number,
      "postCompromiseUtility": number,
      "coreConcern": string
    }
  ],
  "paretoGainSummary": {
    "statusQuoTotal": number,
    "uncompromisedBillTotal": number,
    "paretoOptimizedTotal": number,
    "winWinPercentage": number,
    "keyAmendment": string
  }
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.7,
        },
      });

      const text = response.text || "{}";
      const parsed = JSON.parse(text);
      res.json({ success: true, data: parsed });
    } catch (err: any) {
      console.error("Error in generate-walkthrough:", err);
      res.status(500).json({ error: err.message || "Failed to generate walkthrough" });
    }
  });

  // AI endpoint: Analyze specific policy trade-offs and find Pareto optimal amendments
  app.post("/api/analyze-tradeoffs", async (req, res) => {
    try {
      const { billTitle, stakeholderInterests, contestedClauses } = req.body;
      const ai = getGeminiClient();

      if (!ai) {
        return res.status(200).json({
          fallback: true,
          message: "Using deterministic Pareto simulation engine.",
        });
      }

      const prompt = `As the Pareto Governance Engine AI, compute the Pareto Frontier for:
Bill: ${billTitle}
Stakeholder Interests: ${JSON.stringify(stakeholderInterests || {})}
Contested Clauses: ${JSON.stringify(contestedClauses || [])}

Calculate 3 compromise amendment proposals that yield a strict Pareto improvement (making at least one group significantly better off without degrading any group's utility below their baseline).
Return JSON:
{
  "compromiseOptions": [
    {
      "name": string,
      "description": string,
      "groupAUtilityGain": number,
      "groupBUtilityGain": number,
      "evidenceCredibilityScore": number,
      "rationale": string
    }
  ],
  "paretoEfficiencyScore": number,
  "consensusLikelihood": string
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.5,
        },
      });

      const text = response.text || "{}";
      const parsed = JSON.parse(text);
      res.json({ success: true, data: parsed });
    } catch (err: any) {
      console.error("Error in analyze-tradeoffs:", err);
      res.status(500).json({ error: err.message || "Failed to analyze tradeoffs" });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Civic Accord Governance Video Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
