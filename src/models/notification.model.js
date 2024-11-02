import mongoose, { Schema } from "mongoose";

const notifySchema = new Schema({
    email : {
        type : String , 
        required : true,
    }
}, {timestamps : true})

export const notifyModel = mongoose.model("Notification", notifySchema)