import mongoose from 'mongoose'

const resumeReviewHistorySchema = new mongoose.Schema({
    user:  {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    fileName: {
        type: String,
        required: true,
    },
    review: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
    }
}, {timestamps: true})

export const ResumeReviewHistory = mongoose.model("ResumeReviewHistory", resumeReviewHistorySchema) 