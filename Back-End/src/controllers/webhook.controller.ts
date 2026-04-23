import { Request, Response } from "express";
import { verifyWebhook } from "@clerk/express/webhooks";
import { syncUserFromClerk, deleteUserByClerkId } from "../services/user.service";

export async function handleClerkWebhook(req: Request, res: Response) {
  try {
    const evt = await verifyWebhook(req);

    switch (evt.type) {
      case "user.created":
      case "user.updated":
        await syncUserFromClerk(evt.data as Parameters<typeof syncUserFromClerk>[0]);
        break;
      case "user.deleted":
        if (evt.data.id) {
          await deleteUserByClerkId(evt.data.id);
        }
        break;
      default:
        break;
    }

    res.status(200).json({ received: true });
  } catch (err) {
    console.error("Webhook verification failed:", err);
    res.status(400).json({ error: { message: "Webhook verification failed" } });
  }
}
