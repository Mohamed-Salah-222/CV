import { Router } from "express";
import healthRoutes from "./health.routes";
import aiRoutes from "./ai.routes";
import userRoutes from "./user.routes";
import cvRoutes from "./cv.routes";
import settingsRoutes from "./settings.routes";

const router = Router();

router.use("/health", healthRoutes);
router.use("/ai", aiRoutes);
router.use("/users", userRoutes);
router.use("/cv", cvRoutes);
router.use("/settings", settingsRoutes);

export default router;
