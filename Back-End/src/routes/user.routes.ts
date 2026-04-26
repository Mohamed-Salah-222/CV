import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth";
import { getMe } from "../controllers/user.controller";
import cvRoutes from "./cv.routes";
import settingsRoutes from "./settings.routes";


const router = Router();

router.get("/me", requireAuth, getMe);
router.use("/me/cvs", cvRoutes);
router.use("/me/settings", settingsRoutes);

export default router;
