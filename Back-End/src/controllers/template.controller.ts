import { Request, Response } from "express";
import { prisma } from "../db/prisma";

export async function getTemplate(_req: Request, res: Response) {
  try {
    const templates = await prisma.template.findMany();
    res.json(templates);
  } catch {
    res.status(500).json({
      status: "error",
      timestamp: new Date().toISOString(),
      error: "Internal server error",
    });
  }
}
export async function createTemplate(_req: Request, res: Response) {
  const name = "test";
  const thumbnail = "/home/saif/Downloads/wallhaven-6ld38l.jpg";
  try {
    const template = await prisma.template.create({
      data: {
        name: name,
        thumbnail: thumbnail,
      },
    });
    res.json(template);
  } catch {
    res.status(500).json({
      status: "error",
      timestamp: new Date().toISOString(),
      error: "Internal server error",
    });
  }
}
