import asyncHandler from '../utils/asyncHandler.js'
import {Question} from '../models/question.model.js'
import ApiResponse from '../utils/ApiResponse.js'
import ApiError from '../utils/ApiError.js'

const createQuestion = asyncHandler(async (req, res) => {
    const {title, platform, difficulty} = req.body
    if(!(title && platform && difficulty)){
        throw new ApiError(400, "Missing required fields: title, platform, difficulty")
    }
    const question = await Question.create({
        title: title,
        platform: platform,
        difficulty: difficulty,
        userId: req.user._id
    })

    return res.status(201).json(
        new ApiResponse(
            201,
            question,
            "Question created successfully"
        )
    )
})

const listQuestions = asyncHandler(async (req, res) => {
    const {page=1, limit=10, difficulty, status, topic} = req.query

    const filter = {
        userId: req.user._id,
    }
    if(difficulty){
        filter.difficulty = difficulty;
    }
    if(status){
        filter.status = status;
    }
    if(topics){
        filter.topics = topics;
    }

    const skip = (Number(page)-1) * Number(limit);
    const total = await Question.countDocuments(filter)
    const totalPages = Math.ceil(total/Number(limit));

    const userQuestions = await Question.find(filter).sort({createdAt: -1}).skip(skip).limit(Number(limit))


    return res.status(200).json(
        new ApiResponse(
            200,
            {
                data: userQuestions,
                meta: {
                    page: page,
                    limit: limit,
                    total: total,
                    totalPages: totalPages,
                }
            },
            "User Questions fetched successfully"
        )
    )
})

const getQuestion = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const question = await Question.findById(id)
    if(!question){
        throw new ApiError(404, "Question Not Found")
    }
    if(!(question.userId.toString() === req.user._id.toString())){
        throw new ApiError(403, "Request forbidden")
    }
    return res.status(200).json(
        new ApiResponse(
            200,
            question,
            "Question fetched successfully"
        )
    )
})

const updateQuestion = asyncHandler(async (req, res) => {
    const { id } = req.params
    const updates = req.body
    const question = await Question.findById(id)
    if(!question){
        throw new ApiError(404, "Question not found")
    }
    if(req.user._id.toString() !== question.userId.toString()){
        throw new ApiError(403, "Request Forbidden")
    }

    const revisionSchedule = [1, 7, 14, 28, 56];
    const wasSolved = question.status === "Solved";

    const allowedFields = ["title", 'platform', 'url', 'topic', 'difficulty', 'status', 'notes', 'tags']
    for(const field in updates){
        if(allowedFields.includes(field)){
            question[field] = updates[field]
        }
    }
    
    const isSolved = question.status === "Solved";
    
    if(!wasSolved && isSolved){
        question.solvedAt = new Date();
        for(const days of revisionSchedule){
            const dueDate = new Date();
            dueDate.setDate(dueDate.getDate()+days)
            
            await Revision.create({
                userId: req.user._id,
                questionId: question._id,
                dueDate
            })
        }
    }
    await question.save()

    return res.status(200).json(
        new ApiResponse(
            200,
            question,
            "Question updated successfully"
        )
    )
})

const deleteQuestion = asyncHandler(async (req, res) => {
    const { id } = req.params
    const question = await Question.findById(id)

    if(!question){
        throw new ApiError(404, "Question not found");
    }
    if(req.user._id.toString() !== question.userId.toString()){
        throw new ApiError(403, "Request Forbidden")
    }

    await question.deleteOne()

    return res.status(200).json(
        new ApiResponse(
            200,
            {},
            "Question deleted successfully"
        )
    )
})

export {createQuestion, listQuestions, getQuestion, updateQuestion, deleteQuestion}