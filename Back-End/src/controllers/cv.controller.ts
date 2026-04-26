import { Request, Response } from "express";
import { prisma } from "../db/prisma";

// HACK: need to actualy query by the user id 
// I am only doing it like this so that I don't have to login, or pass auth bearer thing xD
export async function updateUserCV(_req: Request, res: Response) {
  const data = _req.body.data ?? null;
  const title = _req.body.title ?? null;
  const id = _req.params.id;
  if (!id || id === "undefined" || id === "null" || id === "" || typeof (id) !== "string") {
    res.status(400).json({
      status: "error",
      timestamp: new Date().toISOString(),
      error: "Missing id",
    });
  }
  try {
    const existingCv = await prisma.cV.findFirst({
      where: { id: id as string },
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

    const newCv = await prisma.cV.update({
      where: { id: id as string },
      data: updateData as Parameters<typeof prisma.cV.update>[0]["data"],
    });
    res.json({
      status: "success",
      timestamp: new Date().toISOString(),
      data: newCv,
    });
  } catch (e: any) {
    console.log("error", e.message);
    res.status(500).json({
      status: "error",
      timestamp: new Date().toISOString(),
      error: e.message,
    });
  }
}

export async function saveUserCV(_req: Request, res: Response) {
  const data = _req.body.data ?? null;
  try {
    const cv = await prisma.cV.create({
      data: {
        userId: "1",
        templateId: _req.body.template_id ?? "default",
        data: data,
        title: _req.body.title ?? "Untitled CV",
      },
    });
    res.json({
      status: "success",
      timestamp: new Date().toISOString(),
      data: cv,
    });
  } catch (e: any) {
    console.log("error", e.message);
    res.status(500).json({
      status: "error",
      timestamp: new Date().toISOString(),
      error: e.message,
    });
  }
}
export async function getUserCVs(_req: Request, res: Response) {
  try {
    const cvs = await prisma.cV.findMany({
      where: { userId: "1" },
      orderBy: { updatedAt: "desc" },
    });
    res.json({
      status: "success",
      timestamp: new Date().toISOString(),
      data: cvs,
    });
  } catch (e: any) {
    console.log("error", e.message);
    res.status(500).json({
      status: "error",
      timestamp: new Date().toISOString(),
      error: e.message,
    });
  }
}
export async function deleteUserCV(_req: Request, res: Response) {
  const id = _req.params.id;
  try {
    const cv = await prisma.cV.delete({
      where: {
        id: id as string,
      },
    });
    res.json(cv);
  } catch (e: any) {
    console.log("error", e.message);
    res.status(500).json({
      status: "error",
      timestamp: new Date().toISOString(),
      error: e.message,
    });
  }
}
export async function getUserCV(_req: Request, res: Response) {
  const id = _req.params.id;
  try {
    const cv = await prisma.cV.findUnique({
      where: {
        id: id as string,
      },
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
    console.log("error", e.message);
    res.status(500).json({
      status: "error",
      timestamp: new Date().toISOString(),
      error: e.message,
    });
  }
}
