import { Request, Response } from "express";
import { getAuth } from "@clerk/express";
import { getUserByClerkId } from "../services/user.service";

export async function getMe(req: Request, res: Response) {
  const { userId } = getAuth(req);

  const user = await getUserByClerkId(userId!);

  if (!user) {
    res.status(404).json({
      error: {
        message:
          "User not found in database. The webhook may not have fired yet — try again in a moment.",
      },
    });
    return;
  }

  res.json(user);
}
