import { generateRoadmap } from '../services/ai.service.js';
import asyncHandler from '../utils/asyncHandler.js'
import ApiResponse from '../utils/ApiResponse.js';
const generateAIRoadmap = asyncHandler(async (req, res) => {
    const {
        targetCompany,
        currentLevel,
        role,
        timeAvailable,
        hoursPerDay,
        skills,
    } = req.body;

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

export {generateAIRoadmap}