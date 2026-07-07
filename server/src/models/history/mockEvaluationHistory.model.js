import mongoose from "mongoose";

const mockEvaluationHistorySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },

    question: {
        type: String,
        required: true,
    },

    answer: {
        type: String,
        required: true,
    },

    feedback: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
    },
}, { timestamps: true, });

export const MockEvaluationHistory = mongoose.model(
    "MockEvaluationHistory",
    mockEvaluationHistorySchema
);