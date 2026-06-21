import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    platform: {
        type: String,
        required: true,
        trim: true,
    },
    url: {
        type: String,
        trim: true,
    },
    topic: {
        type: [String],
        default: [],
    },
    difficulty: {
        type: String,
        enum: ["Easy", "Medium", "Hard"],
        required: true,
    },
    status: {
        type: String,
        enum: ["Not Started", "In Progress", "Solved", "Needs Revision"],
        default: "Not Started",
    },
    notes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Note",
    }],
    tags: {
        type: [String],
        default: [],
    },
    solvedAt: {
        type: Date
    },
    nextRevisionAt: {
        type: Date,
    },
    revisionCount: {
        type: Number,
        default: 0,
    },
}, { timestamps: true })

export const Question = mongoose.model("Question", questionSchema)