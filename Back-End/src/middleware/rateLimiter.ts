import rateLimit from "express-rate-limit";
import { getAuth } from "@clerk/express";
import { Request } from "express";

export const aiRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 30, // Limit each user to 30 requests per windowMs
  message: {
    status: "error",
    message: "Too many AI requests from this user, please try again after an hour",
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: Request) => {
    const { userId } = getAuth(req);
    return userId || req.ip || "anonymous";
  },
});

export const generateRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 30, // Limit to 30 full CV generations per hour
  message: {
    status: "error",
    message: "Too many CV generations, please try again after an hour",
  },
  keyGenerator: (req: Request) => {
    const { userId } = getAuth(req);
    return userId || req.ip || "anonymous";
  },
});
