import { Router } from "express";
import { getUserSettings } from "../controllers/settings.controller";
import { requireAuth } from "../middleware/requireAuth";

const router = Router();

router.get("/", requireAuth, getUserSettings);

export default router;