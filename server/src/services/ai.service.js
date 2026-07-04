import ai from '../utils/gemeni.js'
import { roadmapPrompt } from './prompt.service.js'

const generateRoadmap = async (roadmapData) => {
    const prompt = roadmapPrompt(roadmapData)
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: 'Why is the sky blue?',
    });
    return response.text
}

export {generateRoadmap}