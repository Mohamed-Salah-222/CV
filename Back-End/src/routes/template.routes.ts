import { Router } from "express";
import { getTemplate, createTemplate } from "../controllers/template.controller";


const router = Router();

router.get("/", getTemplate);
router.get("/create", createTemplate);

export default router;
