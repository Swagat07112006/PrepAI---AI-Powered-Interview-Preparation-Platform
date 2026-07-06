import { Router } from "express";
import authMiddleware from '../middlewares/auth.middleware.js'
import { generateAIRoadmap, generateAIQuestionExplaination } from "../controllers/ai.controller.js";
const router = Router()
router.route('/roadmap').post(authMiddleware ,generateAIRoadmap)
router.route('/explain').post(authMiddleware, generateAIQuestionExplaination)
export default router;