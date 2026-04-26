import { Request, Response } from "express";

export async function getUserSettings(_req: Request, res: Response) {
  // TODO: Later integrate with Clerk publicMetadata
  // For now, fake response
  res.json({
    status: "success",
    data: {
      autoSave: true,
    },
  });
}