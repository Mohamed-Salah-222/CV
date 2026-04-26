import { getUserCVs, getUserCV, updateUserCV, deleteUserCV, saveUserCV } from "../controllers/cv.controller"
import { requireAuth } from "../middleware/requireAuth";
import { Router } from "express";

const router = Router();

router.get("/", requireAuth, getUserCVs)
router.post("/", requireAuth, saveUserCV)
router.get("/:id", requireAuth, getUserCV)
router.patch("/:id", requireAuth, updateUserCV)
router.delete("/:id", requireAuth, deleteUserCV)

export default router;
