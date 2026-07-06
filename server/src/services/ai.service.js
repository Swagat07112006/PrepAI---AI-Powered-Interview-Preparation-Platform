import ai from '../utils/gemeni.js'
import parseGeminiResponse from '../utils/parseGeminiResponse.js'
import { explainerPrompt } from './prompts/questionExplainer.prompt.js'
import { resumeReviewPrompt } from './prompts/resumeReview.prompt.js'
import { roadmapPrompt } from './prompts/roadmap.prompt.js'

const generateAIResponse = async (prompt) => {
    const AIResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
    })
    return parseGeminiResponse(AIResponse.text);
}


const generateRoadmap = async ({ roadmapData }) => {
    return generateAIResponse(roadmapPrompt(roadmapData))
}

const generateQuestionExplaination = async({ question }) => {
    return generateAIResponse(explainerPrompt(question))
}

const generateResumeAnalysis = async({ resumeText }) => {
    return generateAIResponse(resumeReviewPrompt(resumeText))
}

export {generateRoadmap, generateQuestionExplaination, generateResumeAnalysis}