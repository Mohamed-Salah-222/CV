import { Router } from "express";
import { getUserSettings } from "../controllers/settings.controller";

const router = Router();

router.get("/", getUserSettings);

export default router;