import { User } from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import generateAccessAndRefreshToken from "../utils/generateAccessAndRefreshToken.js";
import asyncHandler from '../utils/asyncHandler.js'

const registerUser = asyncHandler(async (req, res) => {
    const { userName, email, password, fullName } = req.body;
    if (!userName || !email || !password || !fullName) {
        throw new ApiError(400, "Username or Email or Password or FullName is missing")
    }
    const existingUser = await User.findOne({
        $or: [{ userName }, { email }]
    })
    if (existingUser) {
        throw new ApiError(409, "User with this email or userName already exists")
    }
    const user = await User.create({
        fullName: fullName,
        userName: userName.toLowerCase(),
        email: email,
        password: password,
    })

    const createdUser = await User.findById(user._id).select("-password -refreshToken")
    if (!createdUser) {
        throw new ApiError(500, "Something went wrong in Registering User")
    }

    return res.status(201).json(
        new ApiResponse(201, createdUser, "User registered successfully")
    )
})

const loginUser = asyncHandler(async (req, res) => {
    const { userName, email, password } = req.body;
    if ((!userName && !email) || !password) {
        throw new ApiError(400, "Username or Email is required");
    }

    const user = await User.findOne({
        $or: [{ userName }, { email }]
    }).select("+password");

    if (!user) {
        throw new ApiError(404, "User doesn't exist")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid credentials")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
    }

    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser,
                    accessToken: accessToken,
                },
                "User loggedIn successfully"
            )
        )
})

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1
            }
        }
    )
    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production"
    };
    return res.status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            new ApiResponse(
                200,
                {},
                "User loggedOut successfully"
            )
        )
})

const getCurrentUser = asyncHandler(async (req, res) => {
    return res.status(200).json(
        new ApiResponse(
            200,
            req.user,
            "User fetched successfully"
        )
    );
})

const updateUserProfile = asyncHandler(async (req, res) => {
    const { fullName, college, graduationYear, avatarUrl, skills } = req.body;

    if (fullName !== undefined && !fullName.trim()) {
        throw new ApiError(400, "FullName cannot be empty");
    }

    const updateData = {};
    if (fullName !== undefined) updateData.fullName = fullName.trim();
    if (college !== undefined) updateData.college = college.trim();
    if (graduationYear !== undefined) updateData.graduationYear = Number(graduationYear) || undefined;
    if (avatarUrl !== undefined) updateData.avatarUrl = avatarUrl.trim();

    if (skills !== undefined) {
        if (Array.isArray(skills)) {
            updateData.skills = skills.map(s => s.trim()).filter(Boolean);
        } else if (typeof skills === 'string') {
            updateData.skills = skills.split(",").map(s => s.trim()).filter(Boolean);
        }
    }

    const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: updateData
        },
        { new: true }
    ).select("-password -refreshToken");

    if (!updatedUser) {
        throw new ApiError(404, "User not found");
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            updatedUser,
            "Profile updated successfully"
        )
    );
})

export { registerUser, loginUser, logoutUser, getCurrentUser, updateUserProfile }