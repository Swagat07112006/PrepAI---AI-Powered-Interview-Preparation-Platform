import { Router } from "express";
import authMiddleware from '../middlewares/auth.middleware.js'
import { generateAIRoadmap } from "../controllers/ai.controller.js";
const router = Router()
router.route('/roadmap').post(authMiddleware ,generateAIRoadmap)
export default router;