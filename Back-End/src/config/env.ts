import "dotenv/config";

const requiredVars = ["DATABASE_URL", "DIRECT_URL", "CLERK_SECRET_KEY"] as const;

const missing = requiredVars.filter((key) => !process.env[key]);
if (missing.length > 0) {
  console.error(`Missing required environment variables: ${missing.join(", ")}`);
  process.exit(1);
}

export const env = {
  NODE_ENV: process.env.NODE_ENV ?? "development",
  PORT: Number(process.env.PORT ?? 3001),
  DATABASE_URL: process.env.DATABASE_URL!,
  DIRECT_URL: process.env.DIRECT_URL!,
  CLIENT_URL: process.env.CLIENT_URL ?? "http://localhost:5173",
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY!,
  CLERK_WEBHOOK_SIGNING_SECRET: process.env.CLERK_WEBHOOK_SIGNING_SECRET,
} as const;
