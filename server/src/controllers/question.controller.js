import asyncHandler from '../utils/asyncHandler.js'
import { Question } from '../models/question.model.js'
import { Note } from '../models/note.model.js'
import ApiResponse from '../utils/ApiResponse.js'
import ApiError from '../utils/ApiError.js'
import { Revision } from '../models/revision.model.js'

const createQuestion = asyncHandler(async (req, res) => {
    const { title, platform, difficulty, topics = [], tags = [], url = "" } = req.body
    if (!(title && platform && difficulty)) {
        throw new ApiError(400, "Missing required fields: title, platform, difficulty")
    }
    const question = await Question.create({
        title: title,
        platform: platform,
        difficulty: difficulty,
        topics,
        tags,
        url,
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
    const { page = 1, limit = 10, difficulty, status, topics, platform, q } = req.query

    const filter = {
        userId: req.user._id,
    }
    if (difficulty) {
        filter.difficulty = difficulty;
    }
    if (status) {
        filter.status = status;
    }
    if (topics) {
        const topicsArray = topics.split(",")
        filter.topics = {
            $in: topicsArray
        }
    }
    if (platform) {
        filter.platform = {
            $regex: `^${platform.trim().replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}$`,
            $options: "i"
        };
    }
    if (q) {
        filter.$or = [
            {
                title: {
                    $regex: q,
                    $options: "i",
                }
            },
            {
                tags: {
                    $regex: q,
                    $options: "i",
                }
            }
        ]
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Question.countDocuments(filter)
    const totalPages = Math.ceil(total / Number(limit));
    const platforms = await Question.distinct("platform", { userId: req.user._id });

    const userQuestions = await Question.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .populate("notes")


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
                    platforms: platforms,
                }
            },
            "User Questions fetched successfully"
        )
    )
})

const getQuestion = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const question = await Question.findById(id).populate("notes")
    if (!question) {
        throw new ApiError(404, "Question Not Found")
    }
    if (!(question.userId.toString() === req.user._id.toString())) {
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
    if (!question) {
        throw new ApiError(404, "Question not found")
    }
    if (req.user._id.toString() !== question.userId.toString()) {
        throw new ApiError(403, "Request Forbidden")
    }

    const revisionSchedule = [1, 7, 14, 28, 56];
    const wasSolved = question.status === "Solved";

    const allowedFields = ["title", 'platform', 'url', 'topics', 'difficulty', 'status', 'notes', 'tags']
    for (const field in updates) {
        if (allowedFields.includes(field)) {
            question[field] = updates[field]
        }
    }

    const isSolved = question.status === "Solved";

    if (!wasSolved && isSolved) {
        question.solvedAt = new Date();
        for (const days of revisionSchedule) {
            const dueDate = new Date();
            dueDate.setDate(dueDate.getDate() + days)

            await Revision.create({
                userId: req.user._id,
                questionId: question._id,
                dueDate: dueDate,
            })
        }
    }
    await question.save()
    await question.populate("notes")

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

    if (!question) {
        throw new ApiError(404, "Question not found");
    }
    if (req.user._id.toString() !== question.userId.toString()) {
        throw new ApiError(403, "Request Forbidden")
    }

    // Delete all associated revisions
    await Revision.deleteMany({ questionId: question._id });

    await question.deleteOne()

    return res.status(200).json(
        new ApiResponse(
            200,
            {},
            "Question deleted successfully"
        )
    )
})

export { createQuestion, listQuestions, getQuestion, updateQuestion, deleteQuestion }