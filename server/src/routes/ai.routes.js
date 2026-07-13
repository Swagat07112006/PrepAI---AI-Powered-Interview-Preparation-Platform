import { Router } from "express";
import authMiddleware from '../middlewares/auth.middleware.js'
import {
    generateAIRoadmap,
    generateAIQuestionExplaination,
    generateAIResumeAnalysis,
    generateAIMockInterview,
    evaluateAIMockAnswer,
    getAIRoadmapHistory,
    deleteAIRoadmap,
    getAIExplainHistory,
    deleteAIExplain,
    getAIResumeHistory,
    deleteAIResume,
    getAIMockHistory,
    deleteAIMock
} from "../controllers/ai.controller.js";
import upload from '../middlewares/upload.middleware.js'
import testResume from '../controllers/textExtraction.controller.js'

const router = Router()
router.route('/roadmap').post(authMiddleware, generateAIRoadmap)
router.route('/roadmap/history').get(authMiddleware, getAIRoadmapHistory)
router.route('/roadmap/:id').delete(authMiddleware, deleteAIRoadmap)

router.route('/explain').post(authMiddleware, generateAIQuestionExplaination)
router.route('/explain/history').get(authMiddleware, getAIExplainHistory)
router.route('/explain/:id').delete(authMiddleware, deleteAIExplain)

router.route('/resume-test').post(authMiddleware, upload.single("resume"), testResume)
router.route('/resume-review').post(authMiddleware, upload.single("resume"), generateAIResumeAnalysis)
router.route('/resume/history').get(authMiddleware, getAIResumeHistory)
router.route('/resume/:id').delete(authMiddleware, deleteAIResume)

router.route('/mock/start').post(authMiddleware, generateAIMockInterview)
router.route('/mock/evaluate').post(authMiddleware, evaluateAIMockAnswer)
router.route('/mock/history').get(authMiddleware, getAIMockHistory)
router.route('/mock/:id').delete(authMiddleware, deleteAIMock)

export default router;

