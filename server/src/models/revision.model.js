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
        required: true,
    },
    dueDate: {
        type: Date,
        required: true,
        index: true,
    },
    revisionStage: {
        type: String,
        enum: ["Pending", "Ongoing", "Completed"],
        default: "Pending",
    },
    completedAt: {
        type: Date,
    },
    reminderSent: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

export const Revision = mongoose.model("Revision", revisionSchema)