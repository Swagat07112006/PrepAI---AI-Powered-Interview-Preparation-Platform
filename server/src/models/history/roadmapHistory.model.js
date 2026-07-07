import mongoose from "mongoose";
const roadmapHistorySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    targetCompany: {
        type: String,
        required: true,
        trim: true,
    },
    currentLevel: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
        trim: true,
    },
    timeAvailable: {
        type: String,
        required: true,
    },
    hoursPerDay: {
        type: Number,
        required: true,
    },
    skills: [
        {
            type: String,
            trim: true,
        }
    ],
    roadmap: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
    }
}, {timestamps: true})

export const RoadmapHistory = mongoose.model("RoadmapHistory", roadmapHistorySchema)