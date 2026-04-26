import { Router } from "express";
import { getAISuggestion, generateCV } from "../controllers/ai.controller";

const router = Router();

router.get("/suggest", getAISuggestion);
router.post("/generate-cv", generateCV);

export default router;
