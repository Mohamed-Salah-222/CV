import { AIProvider, IAIProvider } from "./provider";
import { AIResult, FieldSuggestions, SkillGraph, AISuggestion } from "@cv/types";


export class GeminiAIProvider extends AIProvider implements IAIProvider {
  private apiKey: string;

  constructor(apiKey: string) {
    super();
    this.apiKey = apiKey;
  }

  async suggest(tokens: string): Promise<AISuggestion> {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": this.apiKey,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `${this.systemPrompt}\n\nUSER_INPUT:\n${tokens}`
                }
              ]
            }
          ],
        }),
      }
    );

    const data = await response.json() as any;
    console.log(data);

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    console.log("text is :", text);

    return { data: text, score: 1 };
  }
}
