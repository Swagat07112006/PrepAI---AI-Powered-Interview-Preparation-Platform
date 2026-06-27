import { Revision } from "../models/revision.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const getDueRevision = asyncHandler(async (req, res) => {
    const now = new Date();
    const filter = {
        userId: req.user._id,
        status: "Pending",
        dueDate: {
            $lte: now
        }
    }

    const revisions = await Revision.find(filter).sort({ dueDate: 1 }).populate('questionId')

    return res.status(200).json(
        new ApiResponse(
            200,
            revisions, 
            revisions.length === 0 ? "No due revisions right now" : "Due revisions fetched successfully"),
    )
})

const getUpcomingRevision = asyncHandler(async (req, res) => {
    const now = new Date();
    const filter = {
        userId: req.user._id,
        status: "Pending",
        dueDate: {
            $gt: now
        }
    }

    const revisions = await Revision.find(filter).sort({ dueDate: 1}).populate('questionId')

    return res.status(200).json(
        new ApiResponse(
            200,
            revisions,
            revisions.length === 0 ? "No Upcoming Revisions" : "Upcoming Revision fetched successfully"
        )
    )
})

const getCompletedRevision = asyncHandler(async (req, res) => {
    const filter = {
        userId: req.user._id,
        status: "Completed",
    }

    const revisions = await Revision.find(filter).sort({ completedAt: -1 }).populate('questionId')

    return res.status(200).json(
        new ApiResponse(
            200,
            revisions,
            revisions.length === 0 ? "No Completed Revisions" : "Completed Revisions fetched successfully"
        )
    )
})

export {getDueRevision, getUpcomingRevision, getCompletedRevision}