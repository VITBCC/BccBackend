import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { notifyModel } from "../models/notification.model.js";


const notifyUser = asyncHandler(async (req, res) => {
    const { email, purpose } = req.body;
    if (!email || !purpose) {
        throw new ApiError(500, "All fields are required.");
    }

    const userEmail = await notifyModel.findOne({ email, purpose });

    if (userEmail) {
        throw new ApiResponse(400, "User already subscribed");
    }


    const newEmail = await notifyModel.create({
        email: email,
        purpose: purpose
    })

    if (!newEmail) {
        throw new ApiError(500, "Failed to create new email");
    }
    if (purpose === "Notify") {
        return res.status(200).json(new ApiResponse(200, newEmail, "Thanks for subscribing to VIT BCC."))
    }
    return res.status(200).json(new ApiResponse(200, newEmail, "Thanks, We will notify you for further steps."))

})

export { notifyUser };