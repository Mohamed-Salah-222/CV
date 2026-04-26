import { Router } from "express";
import { getAISuggestion, generateCV } from "../controllers/ai.controller";
import { requireAuth } from "../middleware/requireAuth";

const router = Router();

router.get("/suggest", getAISuggestion);
router.post("/generate-cv", requireAuth, generateCV);

export default router;
