import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth";
import { getMe } from "../controllers/user.controller";
import cvRoutes from "./cv.routes";


const router = Router();

router.get("/me", requireAuth, getMe);
router.use("/me/cvs", cvRoutes);

export default router;
