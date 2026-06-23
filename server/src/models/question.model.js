import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    title: {
        type: String,
        required: true,
        trim: true,
        index: true,
    },
    platform: {
        type: String,
        required: true,
        trim: true,
        index: true,
    },
    url: {
        type: String,
        trim: true,
    },
    topics: {
        type: [String],
        default: [],
        index: true,
    },
    difficulty: {
        type: String,
        enum: ["easy", "medium", "hard"],
        required: true,
        index: true,
    },
    status: {
        type: String,
        enum: ["Not Started", "In Progress", "Solved", "Needs Revision"],
        default: "Not Started",
        index: true,
    },
    notes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Note",
    }],
    tags: {
        type: [String],
        index: true,
        default: [],
    },
    solvedAt: {
        type: Date,
        default: null
    },
}, { timestamps: true })

questionSchema.index({
    userId: 1,
    difficulty: 1,
    status: 1,
});

export const Question = mongoose.model("Question", questionSchema)