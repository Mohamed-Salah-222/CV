import { getAuth } from "@clerk/express";
import { Request, Response, NextFunction } from "express";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const { userId } = getAuth(req);
  
  if (!userId) {
    // Debug: log what's happening with auth
    const authHeader = req.headers.authorization;
    console.log("requireAuth - no userId. Auth header:", authHeader?.substring(0, 50) ?? "none");
    res.status(401).json({ 
      status: "error",
      error: "Unauthorized - no valid session" 
    });
    return;
  }
  
  console.log("requireAuth - userId:", userId);
  next();
}
