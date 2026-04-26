import { Router } from "express";
import { getAISuggestion, generateCV, improveField } from "../controllers/ai.controller";
import { requireAuth } from "../middleware/requireAuth";

const router = Router();

router.get("/suggest", getAISuggestion);
router.post("/generate-cv", requireAuth, generateCV);
router.post("/improve-field", requireAuth, improveField);

export default router;
