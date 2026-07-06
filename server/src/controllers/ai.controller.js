import asyncHandler from '../utils/asyncHandler.js'
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';
import { generateRoadmap ,generateQuestionExplaination, generateResumeAnalysis } from '../services/ai.service.js';
import extractResumeText from '../services/resume/extractResumeText.js';
const generateAIRoadmap = asyncHandler(async (req, res) => {
    const {
        targetCompany,
        currentLevel,
        role,
        timeAvailable,
        hoursPerDay,
        skills,
    } = req.body;

    if(!targetCompany || !role || !currentLevel || !timeAvailable || !hoursPerDay || !skills){
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

    return res.status(200).json(
        new ApiResponse(
            200,
            roadmap,
            "AI Roadmap generated successfully"
        )
    )
})

const generateAIQuestionExplaination = asyncHandler(async (req, res) => {
    const {question} = req.body;
    if(!question){
        throw new ApiError(400, "Question is required")
    }
    const explaination = await generateQuestionExplaination({question})

    return res.status(200).json(
        new ApiResponse(
            200,
            explaination,
            "Question explained successfully"
        )
    )
})

const generateAIResumeAnalysis = asyncHandler(async (req, res) => {
    if(!req.file){
        throw new ApiError(400, "Resume file is required")
    }
    const resumeText = await extractResumeText(req.file)
    const review = await generateResumeAnalysis({resumeText})

    return res.status(200).json(
        new ApiResponse(
            200,
            review,
            "Resume reviewed successfully"
        )
    )
})

export {generateAIRoadmap, generateAIQuestionExplaination, generateAIResumeAnalysis}