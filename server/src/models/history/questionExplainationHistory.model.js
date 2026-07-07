import mongoose from "mongoose";

const questionExplanationHistorySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },

    question: {
        type: String,
        required: true,
        trim: true,
    },

    explanation: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
    },
}, { timestamps: true, });

export const QuestionExplanationHistory = mongoose.model(
    "QuestionExplanationHistory",
    questionExplanationHistorySchema
);