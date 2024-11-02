import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { notifyModel } from "../models/notification.model.js";


const notifyUser = asyncHandler(async(req, res) => {
    const {email} = req.body;
    if (!email){
        throw new ApiError(500 , "Email is required");
    }
   
    const userEmail= await notifyModel.findOne({email});

    if (userEmail){
        throw new ApiResponse(400 , "User already subscribed");
    }
   

    const newEmail =await notifyModel.create({
        email : email
    })

    if (!newEmail){
        throw new ApiError(500 , "Failed to create new email");
    }
    return res.status(200).json(new ApiResponse(200 , newEmail , "Thanks for subscribing to VIT BCC."))
    
})

export {notifyUser};