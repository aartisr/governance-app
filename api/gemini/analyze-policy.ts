import { analyzePolicy } from "../../lib/policy-analysis";

interface PolicyRequest {
  billTitle?: string;
  billSummary?: string;
  topic?: string;
  userPrompt?: string;
}

interface VercelRequest {
  method?: string;
  body?: unknown;
}

interface VercelResponse {
  status: (statusCode: number) => VercelResponse;
  json: (body: unknown) => void;
  setHeader: (name: string, value: string) => void;
  end: () => void;
}

function isPolicyRequest(body: unknown): body is PolicyRequest {
  return typeof body === "object" && body !== null;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).end();
    return;
  }

  try {
    res.status(200).json(await analyzePolicy(isPolicyRequest(req.body) ? req.body : undefined));
  } catch (error) {
    console.warn("Gemini API route failed; returning fallback analysis.", error);
    res.status(200).json(await analyzePolicy());
  }
}