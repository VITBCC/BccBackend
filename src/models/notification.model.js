import mongoose, { Schema } from "mongoose";

const notifySchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    purpose: {
        type: String,
        enum: ['Work', 'Notify'],
        required: true,
    },
}, { timestamps: true })

export const notifyModel = mongoose.model("Notification", notifySchema)