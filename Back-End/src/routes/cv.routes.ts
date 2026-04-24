import { getUserCVs, getUserCV, createUserCV, updateUserCV, deleteUserCV } from "../controllers/cv.controller"
import { Router } from "express";

const router = Router();

router.get("/", getUserCVs)
router.post("/", createUserCV)
router.get("/:id", getUserCV);
router.patch("/:id", updateUserCV)
router.delete("/:id", deleteUserCV)

export default router;
