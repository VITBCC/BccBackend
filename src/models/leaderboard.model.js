import mongoose, { Schema } from "mongoose";

const leaderboardSchema = new mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    score: {
        type: Number,
        required: true,
    },
    rank: {
        type: Number,
        required: true,
    }
}, { timestamps: true })

export const Leaderboard = mongoose.model("Leaderboards", leaderboardSchema);