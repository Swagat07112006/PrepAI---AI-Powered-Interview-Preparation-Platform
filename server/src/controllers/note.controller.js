import asyncHandler from '../utils/asyncHandler.js'
import { Note } from '../models/note.model.js';
import ApiResponse from '../utils/ApiResponse.js'
import ApiError from '../utils/ApiError.js'
const createNote = asyncHandler(async (req, res) => {
    const {title, topics, content, tags} = req.body;
    const userId = req.user._id;
    if(!(title && content)){
        throw new ApiError(400, "Title and Content are required")
    }
    const note = await Note.create({
        title,
        topics,
        content,
        tags,
        userId,
    })

    return res.status(201).json(
        new ApiResponse(
            201,
            note,
            "Note created successfully",
        )
    )
})

export {createNote}