import { getUserCVs, getUserCV, updateUserCV, deleteUserCV, saveUserCV } from "../controllers/cv.controller"
import { Router } from "express";

const router = Router();

router.get("/", getUserCVs)
router.post("/", saveUserCV)
router.get("/:id", getUserCV)
router.patch("/:id", updateUserCV)
router.delete("/:id", deleteUserCV)

export default router;
