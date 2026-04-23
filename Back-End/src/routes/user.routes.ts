import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth";
import { getMe } from "../controllers/user.controller";

const router = Router();

router.get("/me", requireAuth, getMe);

export default router;
