import { AIProvider, IAIProvider } from "./provider";
import { AISuggestion } from "@cv/types";


// TODO: add away to write response to db when you get a response
//
// make it so that when a get the response you can just save it to a db
export class GeminiAIProvider extends AIProvider implements IAIProvider {
  private apiKey: string;

  constructor(apiKey: string) {
    super();
    this.apiKey = apiKey;
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
}


