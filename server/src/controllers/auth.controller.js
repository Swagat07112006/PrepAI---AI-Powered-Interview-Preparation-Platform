import { User } from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import generateAccessAndRefreshToken from "../utils/generateAccessAndRefreshToken.js";
import asyncHandler from '../utils/asyncHandler.js'

//Steps fro Register User:
// 1) Collect all required data(userName, email, password, fullName) from user by form(in frontend) and here we can get data using req.body
// 2) Check if there is any user with same userName or email
// 3) If not then create a new user using User.create()
// 4) Create an document by User.findOne(user._id) and remove password     and refresh token
// 5) return user data in response

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

// 1) Collect all required data(userName, email, password) from user by form(in frontend) and here we can get data using req.body
// 2) Check if user exists in database using email, userName
// 3) Check if password is correct using method present in model file
// 4) Generate accessToken and refreshToken and store in a variable
// 5) return response and set cookies of accessToken and refreshToken, and return user data
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

// 1) In routes we used authMiddleware so user is attached to req
// 2) Find user in database using req.user and unset refreshToken(make refreshToken undefined)
// 3) return response and clear accessToken and refreshToken cookies
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

export { registerUser, loginUser, logoutUser, getCurrentUser }