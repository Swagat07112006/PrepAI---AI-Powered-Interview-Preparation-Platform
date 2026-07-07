import mongoose from "mongoose";

const mockInterviewHistorySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },

    company: {
        type: String,
        required: true,
        trim: true,
    },

    role: {
        type: String,
        required: true,
        trim: true,
    },

    difficulty: {
        type: String,
        required: true,
    },

    questionCount: {
        type: Number,
        required: true,
    },

    interview: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
    },
}, { timestamps: true, });

export const MockInterviewHistory = mongoose.model(
    "MockInterviewHistory",
    mockInterviewHistorySchema
);