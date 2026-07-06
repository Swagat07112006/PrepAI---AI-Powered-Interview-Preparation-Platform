import extractResumeText from "../services/resume/extractResumeText.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const testResume = asyncHandler(async(req, res) => {
    const text = await extractResumeText(req.file)
    return res.status(200).json(
        new ApiResponse(
            200,
            {text},
            "Resume parsed successfully"
        )
    )
})

export default testResume