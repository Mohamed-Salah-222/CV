import { getUserCVs, getUserCV, updateUserCV, deleteUserCV, saveUserCV, duplicateUserCV } from "../controllers/cv.controller"
import { requireAuth } from "../middleware/requireAuth";
import { Router } from "express";

const router = Router();

router.get("/", requireAuth, getUserCVs)
router.post("/", requireAuth, saveUserCV)
router.get("/:id", requireAuth, getUserCV)
router.patch("/:id", requireAuth, updateUserCV)
router.delete("/:id", requireAuth, deleteUserCV)
router.post("/:id/duplicate", requireAuth, duplicateUserCV)

export default router;
