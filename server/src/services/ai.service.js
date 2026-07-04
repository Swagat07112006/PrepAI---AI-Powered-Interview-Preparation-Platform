import ai from '../utils/gemeni.js'
import parseGeminiResponse from '../utils/parseGeminiResponse.js'
import { roadmapPrompt } from './prompt.service.js'


const generateRoadmap = async (roadmapData) => {
    const prompt = roadmapPrompt(roadmapData)
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
    });
    return parseGeminiResponse(response.text);
}

export {generateRoadmap}