const API_URL = import.meta.env.VITE_API_URL;
const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;

if (!API_URL) {
  throw new Error("VITE_API_URL is not set. Check your .env file.");
}
if (!CLERK_PUBLISHABLE_KEY) {
  throw new Error("VITE_CLERK_PUBLISHABLE_KEY is not set. Check your .env file.");
}

export const env = {
  API_URL,
  CLERK_PUBLISHABLE_KEY,
  GITHUB_TOKEN,
} as const;
