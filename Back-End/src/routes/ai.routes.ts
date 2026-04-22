import { Router } from "express";
import { getAISuggestion } from "../controllers/ai.controller";

const router = Router();

router.get("/suggest", getAISuggestion);

export default router;
