import ai from '../utils/gemeni.js'
import parseGeminiResponse from '../utils/parseGeminiResponse.js'
import { explainerPrompt } from './prompts/questionExplainer.prompt.js'
import { roadmapPrompt } from './prompts/roadmap.prompt.js'


const generateRoadmap = async (roadmapData) => {
    const roadMapPrompt = roadmapPrompt(roadmapData)
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: roadMapPrompt
    });
    return parseGeminiResponse(response.text);
}

const generateQuestionExplaination = async({ question }) => {
    const questionExplainerPrompt = explainerPrompt({question})
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: questionExplainerPrompt
    });
    return parseGeminiResponse(response.text);
}

export {generateRoadmap, generateQuestionExplaination}