import { AIProvider, IAIProvider } from "./provider";

export class GeminiAIProvider extends AIProvider implements IAIProvider {
  private apiKey: string;
  private currModel: string = "gemini-flash-latest";
  private model_token_limit: number;




  constructor(apiKey: string) {
    super();
    this.apiKey = apiKey;
    this.model_token_limit = 1000;
  }
  async parseCV(tokens: string): Promise<any> {
    try {
      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/" + this.currModel + ":generateContent",
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
                    text: `${this.parseCVPrompt}\n\nUSER_INPUT:\n${tokens}`
                  }
                ]
              }
            ],
          }),
        }
      );

      const data = await response.json() as any;
      let text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

      if (!text) {
        return { data: null, error: "No response from AI" };
      }

      text = text.replace(/```json/g, "").replace(/```/g, "").trim();

      try {
        const parsed = JSON.parse(text);
        return { data: parsed, score: 1 };
      } catch {
        return { data: null, error: "Failed to parse JSON" };
      }
    } catch (e: any) {
      return { data: null, error: e.message };
    }
  }

  async suggest(tokens: string): Promise<any> {
    try {
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
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

      return { data: text, score: 1 };
    } catch (e) {
      console.log("error: ", e)
      return { data: null, score: 0 };
    }
  }

  async generateCV(rawText: string): Promise<any> {
    try {
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
                    text: `${this.cvGenerationPrompt}\n\nUSER_DATA:\n${rawText}`
                  }
                ]
              }
            ],
          }),
        }
      );

      const data = await response.json() as any;
      let text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

      if (!text) {
        return { data: null, error: "No response from AI" };
      }

      text = text.replace(/```json/g, "").replace(/```/g, "").trim();

      try {
        const parsed = JSON.parse(text);
        return { data: parsed, score: 1 };
      } catch {
        return { data: null, error: "Failed to parse AI response" };
      }
    } catch (e) {
      console.log("error: ", e)
      return { data: null, score: 0 };
    }
  }

  async improveField(fieldType: string, currentText: string, context?: string): Promise<any> {
    try {
      const inputText = context
        ? `fieldType: ${fieldType}\ncurrentText: ${currentText}\ncontext: ${context}`
        : `fieldType: ${fieldType}\ncurrentText: ${currentText}`;

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
                    text: `${this.improveFieldPrompt}\n\n${inputText}`
                  }
                ]
              }
            ],
          }),
        }
      );

      const data = await response.json() as any;
      let text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

      if (!text) {
        return { data: null, error: "No response from AI" };
      }

      text = text.replace(/```json/g, "").replace(/```/g, "").trim();

      try {
        const parsed = JSON.parse(text);
        return { data: parsed, score: 1 };
      } catch {
        return { data: null, error: "Failed to parse AI response" };
      }
    } catch (e) {
      console.log("error: ", e)
      return { data: null, score: 0 };
    }
  }
}


