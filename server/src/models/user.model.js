import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        lowercase: true,
        trim: true,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: [true, `Password is required`],
        select: false,
    },
    college: {
        type: String,
    },
    graduationYear: {
        type: Number,
    },
    targetCompanies: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Company'
        }
    ],
    skills: [
        {
            type: String,
        }
    ],
    avatarUrl: {
        type: String
    },
    role: [
        {
            type: String,
            enum: ["user", "admin"],
            default: "user",
        }
    ]
}, { timestamps: true })

export const User = new mongoose.model("User", userSchema)