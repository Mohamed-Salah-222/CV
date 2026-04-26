import { Request, Response } from "express";
import { getAuth } from "@clerk/express";
import { prisma } from "../db/prisma";

async function getUserIdFromClerk(req: Request): Promise<string | null> {
  const { userId } = getAuth(req);
  if (!userId) return null;
  
  // Try to find existing user
  let user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { id: true },
  });
  
  // If no user found, create one (fallback - ideally webhook handles this)
  if (!user) {
    user = await prisma.user.create({
      data: {
        clerkId: userId,
        email: `${userId}@placeholder.com`,
        firstName: "",
        lastName: "",
      },
      select: { id: true },
    });
    console.log("Created user:", user.id, "for clerkId:", userId);
  }
  
  return user.id;
}

export async function updateUserCV(req: Request, res: Response) {
  const data = req.body.data ?? null;
  const title = req.body.title ?? null;
  const id = req.params.id;
  
  if (!id || id === "undefined" || id === "null" || id === "" || typeof id !== "string") {
    res.status(400).json({
      status: "error",
      timestamp: new Date().toISOString(),
      error: "Missing id",
    });
    return;
  }

  const userId = await getUserIdFromClerk(req);
  if (!userId) {
    res.status(401).json({
      status: "error",
      timestamp: new Date().toISOString(),
      error: "Unauthorized",
    });
    return;
  }

  try {
    const existingCv = await prisma.cV.findFirst({
      where: { id, userId },
    });
    if (!existingCv) {
      res.status(404).json({
        status: "error",
        timestamp: new Date().toISOString(),
        error: "CV not found",
      });
      return;
    }

    const updateData: { data?: unknown; title?: string } = {};
    if (data !== null) updateData.data = data;
    if (title) updateData.title = title;

    const updatedCv = await prisma.cV.update({
      where: { id },
      data: updateData as Parameters<typeof prisma.cV.update>[0]["data"],
    });
    
    res.json({
      status: "success",
      timestamp: new Date().toISOString(),
      data: updatedCv,
    });
  } catch (e: any) {
    console.error("error", e.message);
    res.status(500).json({
      status: "error",
      timestamp: new Date().toISOString(),
      error: e.message,
    });
  }
}

export async function saveUserCV(req: Request, res: Response) {
  const data = req.body.data ?? null;
  
  const userId = await getUserIdFromClerk(req);
  if (!userId) {
    res.status(401).json({
      status: "error",
      timestamp: new Date().toISOString(),
      error: "Unauthorized",
    });
    return;
  }

  try {
    const cv = await prisma.cV.create({
      data: {
        userId,
        templateId: req.body.template_id ?? "default",
        data,
        title: req.body.title ?? "Untitled CV",
      },
    });
    
    res.json({
      status: "success",
      timestamp: new Date().toISOString(),
      data: cv,
    });
  } catch (e: any) {
    console.error("error", e.message);
    res.status(500).json({
      status: "error",
      timestamp: new Date().toISOString(),
      error: e.message,
    });
  }
}

export async function getUserCVs(req: Request, res: Response) {
  const userId = await getUserIdFromClerk(req);
  if (!userId) {
    res.status(401).json({
      status: "error",
      timestamp: new Date().toISOString(),
      error: "Unauthorized",
    });
    return;
  }

  try {
    const cvs = await prisma.cV.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
    });
    
    res.json({
      status: "success",
      timestamp: new Date().toISOString(),
      data: cvs,
    });
  } catch (e: any) {
    console.error("error", e.message);
    res.status(500).json({
      status: "error",
      timestamp: new Date().toISOString(),
      error: e.message,
    });
  }
}

export async function deleteUserCV(req: Request, res: Response) {
  const id = req.params.id;
  
  const userId = await getUserIdFromClerk(req);
  if (!userId) {
    res.status(401).json({
      status: "error",
      timestamp: new Date().toISOString(),
      error: "Unauthorized",
    });
    return;
  }

  try {
    const existingCv = await prisma.cV.findFirst({
      where: { id: id as string, userId },
    });
    
    if (!existingCv) {
      res.status(404).json({
        status: "error",
        timestamp: new Date().toISOString(),
        error: "CV not found",
      });
      return;
    }

    await prisma.cV.delete({
      where: { id: id as string },
    });
    
    res.json({
      status: "success",
      timestamp: new Date().toISOString(),
    });
  } catch (e: any) {
    console.error("error", e.message);
    res.status(500).json({
      status: "error",
      timestamp: new Date().toISOString(),
      error: e.message,
    });
  }
}

export async function getUserCV(req: Request, res: Response) {
  const id = req.params.id;
  
  const userId = await getUserIdFromClerk(req);
  if (!userId) {
    res.status(401).json({
      status: "error",
      timestamp: new Date().toISOString(),
      error: "Unauthorized",
    });
    return;
  }

  try {
    const cv = await prisma.cV.findFirst({
      where: { id: id as string, userId },
    });
    
    if (!cv) {
      res.status(404).json({
        status: "error",
        timestamp: new Date().toISOString(),
        error: "CV not found",
      });
      return;
    }
    
    res.json({
      status: "success",
      timestamp: new Date().toISOString(),
      data: cv,
    });
  } catch (e: any) {
    console.error("error", e.message);
    res.status(500).json({
      status: "error",
      timestamp: new Date().toISOString(),
      error: e.message,
    });
  }
}