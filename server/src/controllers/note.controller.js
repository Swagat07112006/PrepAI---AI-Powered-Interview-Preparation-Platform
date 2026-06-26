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

const listNotes = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const userNotes = await Note.find({ userId: userId}).sort({ createdAt: -1})

    return res.status(200).json(
        new ApiResponse(
            200,
            userNotes,
            "User Notes fetched successfully"
        )
    )
})

const getNote = asyncHandler(async ( req, res) => {
    const { id } = req.params;
    const note = await Note.findById(id)
    if(!note){
        throw new ApiError(404, "Note not found");
    }
    if(req.user._id.toString() !== note.userId.toString()){
        throw new ApiError(403, "Request Forbidden")
    }
    return res.status(200).json(
        new ApiResponse(
            200,
            note,
            "Note fetched successfully"
        )
    )
})

const updateNote = asyncHandler(async (req, res) => {
    const { id } = req.params
    const updates = req.body;
    const note = await Note.findById(id);
    if(!note){
        throw new ApiError(404, "Note not found")
    }
    if(note.userId.toString() !== req.user._id.toString()){
        throw new ApiError(403, "Request Forbidden")
    }
    const allowedFields = ["title", "topics", "content", "tags"]
    for(const field in updates){
        if(allowedFields.includes(field)){
            note[field] = updates[field]
        }
    }
    await note.save()

    return res.status(200).json(
        new ApiResponse(
            200,
            note,
            "Note updated successfully"
        )
    )
})

const deleteNote = asyncHandler(async (req, res) => {
    const { id } = req.params
    const note = await Note.findById(id);
    if(!note){
        throw new ApiError(404, "Note not found")
    }
    if(note.userId.toString() !== req.user._id.toString()){
        throw new ApiError(403, "Request Forbidden")
    }
    await note.deleteOne()
    return res.status(200).json(
        new ApiResponse(
            200,
            {},
            "Note deleted successfully"
        )
    )
})

export {createNote, listNotes, getNote, updateNote, deleteNote}