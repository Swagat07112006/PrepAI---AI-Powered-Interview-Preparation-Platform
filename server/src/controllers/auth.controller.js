import { User } from "../models/user.model";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import generateAccessAndRefreshToken from "../utils/generateAccessAndRefreshToken";

const registerUser = async (req, res) => {
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
}

const loginUser = async (req, res) => {
    try {
        
        const { userName, email, password } = req.body;
        if ((!userName && !email)||!password) {
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
                        refreshToken: refreshToken
                    },
                    "User loggedIn successfully"
                )
            )
    } catch (error) {
        throw new ApiError(401, "Something wrong during login of user")
    }
}

export {registerUser, loginUser}