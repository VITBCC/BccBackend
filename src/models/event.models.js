import mongoose, { Schema } from "mongoose";

const eventSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    aim: {
        type: String,
        required: true,
        // what you will gain at the end of session
    },
    perks: {
        type: [String],
        // merchandise , rewards etc...
    },
    eventDate: {
        type: String,
        required: true,
    },
    partners: {
        type: [String],
    },
    venue: {
        type: String,
    },
    mode: {
        type: String,
        enum: ['Online', 'Offline'],
        required: true,
    },
    capacity: {
        type: Number,
    },
    eventImage: {
        type: String,
        required: true,
    },
    prerequisite: {
        type: [String],
    },
    technology: {
        type: [String],
    },
    tags: {
        type: [String],
        // community tags
    },
    usersRegistered: {
        type: [Schema.Types.ObjectId],
        ref: "User",
        default: [],
    },

}, { timestamps: true })

export const Event = mongoose.model("Events", eventSchema);