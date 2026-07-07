import { Router } from "express";
import authMiddleware from '../middlewares/auth.middleware.js'
import { generateAIRoadmap, generateAIQuestionExplaination, generateAIResumeAnalysis, generateAIMockInterview, evaluateAIMockAnswer } from "../controllers/ai.controller.js";
import upload from '../middlewares/upload.middleware.js'
import testResume from '../controllers/textExtraction.controller.js'
const router = Router()
router.route('/roadmap').post(authMiddleware ,generateAIRoadmap)
router.route('/explain').post(authMiddleware, generateAIQuestionExplaination)
router.route('/resume-test').post(authMiddleware, upload.single("resume"), testResume)
router.route('/resume-review').post(authMiddleware, upload.single("resume"), generateAIResumeAnalysis)
router.route('/mock/start').post(authMiddleware, generateAIMockInterview)
router.route('/mock/evaluate').post(authMiddleware, evaluateAIMockAnswer)
export default router;