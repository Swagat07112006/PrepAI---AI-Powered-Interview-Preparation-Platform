import ApiError from '../utils/ApiError.js'
const parseGeminiResponse = (text) => {
    try{
        const cleanedText = text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

        return JSON.parse(cleanedText)
    } catch(error){
        throw new ApiError(
            500,
            "Failed to parse Gemini response"
        )
    }
}

export default parseGeminiResponse