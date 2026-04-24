import { Router } from "express";
import healthRoutes from "./health.routes";
import aiRoutes from "./ai.routes";
import userRoutes from "./user.routes";
import templaetRoutes from "./template.routes";

const router = Router();

router.use("/health", healthRoutes);
router.use("/ai", aiRoutes);
router.use("/users", userRoutes);
router.use("/templates", templaetRoutes);


export default router;
