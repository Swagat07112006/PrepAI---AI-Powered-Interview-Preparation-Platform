import asyncHandler from '../utils/asyncHandler.js'
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';
import { generateRoadmap, generateQuestionExplaination, generateResumeAnalysis, generateMockInterview, evaluateMockAnswer } from '../services/ai.service.js';
import extractResumeText from '../services/resume/extractResumeText.js';
import { RoadmapHistory } from '../models/history/roadmapHistory.model.js';
import { ResumeReviewHistory } from '../models/history/resumeReviewHistory.model.js';
import { QuestionExplanationHistory } from '../models/history/questionExplainationHistory.model.js';
const generateAIRoadmap = asyncHandler(async (req, res) => {
    const {
        targetCompany,
        currentLevel,
        role,
        timeAvailable,
        hoursPerDay,
        skills,
    } = req.body;

    if (!targetCompany || !role || !currentLevel || !timeAvailable || !hoursPerDay || !skills) {
        throw new ApiError(400, "All fields are required")
    }

    const roadmap = await generateRoadmap({
        targetCompany,
        currentLevel,
        role,
        timeAvailable,
        hoursPerDay,
        skills,
    })

    await RoadmapHistory.create({
        user: req.user._id,
        targetCompany,
        currentLevel,
        role,
        timeAvailable,
        hoursPerDay,
        skills,
        roadmap,
    })

    return res.status(200).json(
        new ApiResponse(
            200,
            roadmap,
            "AI Roadmap generated successfully"
        )
    )
})

const generateAIQuestionExplaination = asyncHandler(async (req, res) => {
    const { question } = req.body;
    if (!question) {
        throw new ApiError(400, "Question is required")
    }
    const explaination = await generateQuestionExplaination( question )

    await QuestionExplanationHistory.create({
        user: req.user._id,
        question: question,
        explanation: explaination,
    });

    return res.status(200).json(
        new ApiResponse(
            200,
            explaination,
            "Question explained successfully"
        )
    )
})

const generateAIResumeAnalysis = asyncHandler(async (req, res) => {
    if (!req.file) {
        throw new ApiError(400, "Resume file is required")
    }
    const resumeText = await extractResumeText(req.file)
    const review = await generateResumeAnalysis(resumeText)

    await ResumeReviewHistory.create({
        user: req.user._id,
        fileName: req.file.originalname,
        review: review
    })

    return res.status(200).json(
        new ApiResponse(
            200,
            review,
            "Resume reviewed successfully"
        )
    )
})

const generateAIMockInterview = asyncHandler(async (req, res) => {
    const {
        company,
        role,
        difficulty,
        questionCount,
    } = req.body;
    if (!(company && role && difficulty && questionCount)) {
        throw new ApiError(400, "All fields are required")
    }

    const interview = await generateMockInterview({
        company,
        role,
        difficulty,
        questionCount,
    })

    return res.status(200).json(
        new ApiResponse(
            200,
            interview,
            "Mock Interview generated successfully"
        )
    )
})

const evaluateAIMockAnswer = asyncHandler(async (req, res) => {
    const { question, answer } = req.body;
    if (!question || !answer) {
        throw new ApiError(400, "Both Question and Answer are required")
    }
    const feedback = await evaluateMockAnswer({ question, answer })

    return res.status(200).json(
        new ApiResponse(
            200,
            feedback,
            "Answer evaluated successfully"
        )
    )
})

export { generateAIRoadmap, generateAIQuestionExplaination, generateAIResumeAnalysis, generateAIMockInterview, evaluateAIMockAnswer }