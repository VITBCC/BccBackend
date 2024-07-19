import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.models.js";

const generateTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        // console.log(user)
        const accessToken = user.generateAccessToken();
        console.log("ho gya")
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });
        return { accessToken, refreshToken };

    } catch (err) {
        throw new ApiError(500, "Something went wrong while generating token");
    }
}


const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;
    console.log(username, email, password);

    if ([email, password, username].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required")
    }

    // if (!username && !email && !password) {
    //     throw new ApiError(400, "All fields are required");
    // }

    // check if user already exists
    const user = await User.findOne({ email });

    if (user) {
        throw new ApiError(409, "User already exists");
    }

    const newUser = await User.create({
        username: username,
        email: email,
        password: password,
    })

    console.log("User created : ", newUser);

    const returnUser = await User.findById(newUser._id).select("-password -refreshToken")

    if (!returnUser) {
        throw new ApiError(500, "User creation failed");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, returnUser, "User registered successfully"))

})

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    console.log(email, password);
    if (!email && !password) {
        throw new ApiError(400, "All fields are required");
    }
    const user = await User.findOne({ email });
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const { accessToken, refreshToken } = await generateTokens(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    return res
        .status(200)
        .json(new ApiResponse(200, { user: loggedInUser, accessToken: accessToken, refreshToken: refreshToken }));

})

export { registerUser ,loginUser};