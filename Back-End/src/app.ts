import express from "express";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import { env } from "./config/env";
import { requestLogger } from "./middleware/requestLogger";
import { errorHandler } from "./middleware/errorHandler";
import { notFoundHandler } from "./middleware/notFoundHandler";
import routes from "./routes";
import webhookRoutes from "./routes/webhook.routes";

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin: env.CLIENT_URL,
      credentials: true,
    }),
  );


  app.use("/api/webhooks/clerk", express.raw({ type: "application/json" }), webhookRoutes);


  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true, limit: "1mb" }));

  // Clerk auth middleware 
  app.use(clerkMiddleware());

  app.use(requestLogger);

  // Normal API routes (health, users, ai, etc.)
  app.use("/api", routes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
