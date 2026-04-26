import { Request, Response } from "express";
import { GeminiAIProvider } from "../AI/providers/gemini";
import { env } from "../config/env";

export async function getAISuggestion(_req: Request, res: Response) {
  const DUMMY_DATA = "Backend developer with 5 years experience in Python and JavaScript";
  try {
    const ai = new GeminiAIProvider(env.GEMINI_API_KEY!);
    const data = await ai.suggest(DUMMY_DATA);
    // console.log("Ai: ", ai);
    // console.log("Data : ", data);
    res.json(data);
  } catch (e: any) {
    res.status(500).json({
      status: "error",
      timestamp: new Date().toISOString(),
      error: e.message,
    });
  }
}

export async function generateCV(_req: Request, res: Response) {
  try {
    const { rawText } = _req.body;

    if (!rawText || typeof rawText !== "string") {
      res.status(400).json({
        status: "error",
        timestamp: new Date().toISOString(),
        error: "rawText is required",
      });
      return;
    }

    const ai = new GeminiAIProvider(env.GEMINI_API_KEY!);
    const result = await ai.generateCV(rawText);

    if (!result.data) {
      res.status(500).json({
        status: "error",
        timestamp: new Date().toISOString(),
        error: result.error || "Failed to generate CV",
      });
      return;
    }

    res.json({
      status: "success",
      timestamp: new Date().toISOString(),
      data: result.data,
    });
  } catch (e: any) {
    res.status(500).json({
      status: "error",
      timestamp: new Date().toISOString(),
      error: e.message,
    });
  }
}

export async function improveField(_req: Request, res: Response) {
  try {
    const { fieldType, currentText, context } = _req.body;

    if (!fieldType || !currentText) {
      res.status(400).json({
        status: "error",
        timestamp: new Date().toISOString(),
        error: "fieldType and currentText are required",
      });
      return;
    }

    const ai = new GeminiAIProvider(env.GEMINI_API_KEY!);
    const result = await ai.improveField(fieldType, currentText, context);

    if (!result.data) {
      res.status(500).json({
        status: "error",
        timestamp: new Date().toISOString(),
        error: result.error || "Failed to improve field",
      });
      return;
    }

    res.json({
      status: "success",
      timestamp: new Date().toISOString(),
      data: result.data,
    });
  } catch (e: any) {
    res.status(500).json({
      status: "error",
      timestamp: new Date().toISOString(),
      error: e.message,
    });
  }
}
