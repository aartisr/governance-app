import { analyzePolicy } from "../../lib/policy-analysis";

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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).end();
    return;
  }

  try {
    res.status(200).json(await analyzePolicy(req.body));
  } catch (error) {
    console.warn("Gemini API route failed; returning fallback analysis.", error);
    res.status(200).json(await analyzePolicy());
  }
}