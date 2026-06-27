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
    const {page=1, limit=10, q, topics, tags } = req.query
    const filter = {
        userId: req.user._id,
    }
    if(q){
        filter.$or = [
            {
                title: {
                    $regex: q,
                    $options: "i",
                },
            },
            {
                content: {
                    $regex: q,
                    $options: "i",
                }
            }
        ]
    }
    if(topics){
        const topicsArray = topics.split(",")
        filter.topics = {
            $in: topicsArray
        }
    }
    if(tags){
        const tagsArray = tags.split(",")
        filter.tags = {
            $in: tagsArray
        }
    }

    const pageNum = Number(page) || 1
    const limitNum = Number(limit) || 10

    const skip = (pageNum - 1) * limitNum
    const total = await Note.countDocuments(filter)
    const totalPages = Math.ceil(total/limitNum)

    const userNotes = await Note.find(filter).sort({ createdAt: -1}).skip(skip).limit(limitNum)

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                data: userNotes,
                meta: {
                    page: pageNum,
                    limit: limitNum,
                    total: total,
                    totalPages: totalPages,
                }
            },
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