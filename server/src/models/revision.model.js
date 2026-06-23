import mongoose from 'mongoose';

const revisionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    questionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
        index: true,
        required: true,
    },
    dueDate: {
        type: Date,
        required: true,
        index: true,
    },
    status: {
        type: String,
        enum: ["Pending", "Completed", "Missed"],
        default: "Pending",
    },
    completedAt: {
        type: Date,
    },
}, { timestamps: true })

export const Revision = mongoose.model("Revision", revisionSchema)