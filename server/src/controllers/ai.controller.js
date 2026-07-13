import asyncHandler from '../utils/asyncHandler.js'
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';
import { generateRoadmap, generateQuestionExplaination, generateResumeAnalysis, generateMockInterview, evaluateMockAnswer } from '../services/ai.service.js';
import extractResumeText from '../services/resume/extractResumeText.js';
import { RoadmapHistory } from '../models/history/roadmapHistory.model.js';
import { ResumeReviewHistory } from '../models/history/resumeReviewHistory.model.js';
import { QuestionExplanationHistory } from '../models/history/questionExplainationHistory.model.js';
import { MockInterviewHistory } from '../models/history/mockInterviewHistory.model.js';
import { MockEvaluationHistory } from '../models/history/mockEvaluationHistory.model.js';
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
    const explaination = await generateQuestionExplaination(question)

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
    await MockInterviewHistory.create({
        user: req.user._id,
        company,
        role,
        difficulty,
        questionCount,
        interview,
    });

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

    await MockEvaluationHistory.create({
        user: req.user._id,
        question,
        answer,
        feedback,
    });

    return res.status(200).json(
        new ApiResponse(
            200,
            feedback,
            "Answer evaluated successfully"
        )
    )
})

const getAIRoadmapHistory = asyncHandler(async (req, res) => {
    const history = await RoadmapHistory.find({ user: req.user._id })
        .sort({ createdAt: -1 })
        .lean();

    return res.status(200).json(
        new ApiResponse(
            200,
            history,
            "Roadmap history fetched successfully"
        )
    );
});

const deleteAIRoadmap = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const roadmap = await RoadmapHistory.findOne({ _id: id, user: req.user._id });
    if (!roadmap) {
        throw new ApiError(404, "Roadmap not found or unauthorized");
    }
    await RoadmapHistory.findByIdAndDelete(id);
    return res.status(200).json(
        new ApiResponse(200, null, "Roadmap deleted successfully")
    );
});

const getAIExplainHistory = asyncHandler(async (req, res) => {

    const history = await QuestionExplanationHistory.find({ user: req.user._id })
        .sort({ createdAt: -1 })
        .lean();

    return res.status(200).json(
        new ApiResponse(
            200,
            history,
            "Question explanation history fetched successfully"
        )
    );
});

const deleteAIExplain = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const history = await QuestionExplanationHistory.findOne({ _id: id, user: req.user._id });
    if (!history) {
        throw new ApiError(404, "Explanation history not found or unauthorized");
    }
    await QuestionExplanationHistory.findByIdAndDelete(id);
    return res.status(200).json(
        new ApiResponse(200, null, "Explanation history deleted successfully")
    );
});

const getAIResumeHistory = asyncHandler(async (req, res) => {
    const history = await ResumeReviewHistory.find({ user: req.user._id })
        .sort({ createdAt: -1 })
        .lean();

    return res.status(200).json(
        new ApiResponse(
            200,
            history,
            "Resume review history fetched successfully"
        )
    );
});

const deleteAIResume = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const history = await ResumeReviewHistory.findOne({ _id: id, user: req.user._id });
    if (!history) {
        throw new ApiError(404, "Resume review history not found or unauthorized");
    }
    await ResumeReviewHistory.findByIdAndDelete(id);
    return res.status(200).json(
        new ApiResponse(200, null, "Resume review history deleted successfully")
    );
});

const getAIMockHistory = asyncHandler(async (req, res) => {

    const history = await MockInterviewHistory.find({ user: req.user._id })
        .sort({ createdAt: -1 })
        .lean();

    return res.status(200).json(
        new ApiResponse(
            200,
            history,
            "Mock interview history fetched successfully"
        )
    );
});

const deleteAIMock = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const history = await MockInterviewHistory.findOne({ _id: id, user: req.user._id });
    if (!history) {
        throw new ApiError(404, "Mock interview history not found or unauthorized");
    }
    await MockInterviewHistory.findByIdAndDelete(id);
    return res.status(200).json(
        new ApiResponse(200, null, "Mock interview history deleted successfully")
    );
});

export {
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
};





