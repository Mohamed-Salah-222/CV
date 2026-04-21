const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  throw new Error("VITE_API_URL is not set. Check your .env file.");
}

export const env = {
  API_URL,
} as const;
