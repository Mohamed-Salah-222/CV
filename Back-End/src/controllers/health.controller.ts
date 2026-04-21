import { Request, Response } from "express";
import { prisma } from "../db/prisma";

export async function getHealth(_req: Request, res: Response) {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      database: "connected",
    });
  } catch {
    res.status(503).json({
      status: "degraded",
      timestamp: new Date().toISOString(),
      database: "disconnected",
    });
  }
}
