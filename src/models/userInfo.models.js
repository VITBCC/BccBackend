import mongoose, { Schema } from "mongoose";

const userInfoSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    year: {
        type: String,
        // 1st year , 2nd year
    },
    college: {
        type: String,
    },
    branch: {
        type: String,
    },
}, {timestamps: true})


export const UserInfo = mongoose.model("UserInfo", userInfoSchema);