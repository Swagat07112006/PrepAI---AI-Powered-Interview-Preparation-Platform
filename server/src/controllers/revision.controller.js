import { Revision } from "../models/revision.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";

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

    const revisions = await Revision.find(filter).sort({ dueDate: 1 }).populate('questionId')

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

const completeRevision = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const revision = await Revision.findOne({ _id: id, userId: req.user._id });
    if (!revision) {
        throw new ApiError(404, "Revision not found");
    }
    revision.status = "Completed";
    revision.completedAt = new Date();
    await revision.save();
    return res.status(200).json(
        new ApiResponse(200, revision, "Revision completed successfully")
    );
});

const rescheduleRevision = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { dueDate } = req.body;
    if (!dueDate) {
        throw new ApiError(400, "Due date is required");
    }
    const revision = await Revision.findOne({ _id: id, userId: req.user._id });
    if (!revision) {
        throw new ApiError(404, "Revision not found");
    }
    revision.dueDate = new Date(dueDate);
    revision.status = "Pending";
    revision.completedAt = undefined;
    await revision.save();
    return res.status(200).json(
        new ApiResponse(200, revision, "Revision rescheduled successfully")
    );
});

const skipRevision = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const revision = await Revision.findOne({ _id: id, userId: req.user._id });
    if (!revision) {
        throw new ApiError(404, "Revision not found");
    }
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    revision.dueDate = tomorrow;
    revision.status = "Pending";
    await revision.save();
    return res.status(200).json(
        new ApiResponse(200, revision, "Revision skipped successfully")
    );
});

const markMissedRevision = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const revision = await Revision.findOne({ _id: id, userId: req.user._id });
    if (!revision) {
        throw new ApiError(404, "Revision not found");
    }
    revision.status = "Missed";
    await revision.save();
    return res.status(200).json(
        new ApiResponse(200, revision, "Revision marked as missed successfully")
    );
});

const getRevisionsByQuestion = asyncHandler(async (req, res) => {
    const { questionId } = req.params;
    const revisions = await Revision.find({
        questionId: questionId,
        userId: req.user._id,
    }).sort({ dueDate: 1 });

    return res.status(200).json(
        new ApiResponse(200, revisions, "Revisions for question fetched successfully")
    );
});

export {
    getDueRevision,
    getUpcomingRevision,
    getCompletedRevision,
    completeRevision,
    rescheduleRevision,
    skipRevision,
    markMissedRevision,
    getRevisionsByQuestion,
}