import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.models.js";
import { Leaderboard } from "../models/leaderboard.model.js";

const getLeaderboard = asyncHandler(async (req, res) => {
    const users = await User.find({}).sort({ points: -1 });

    const leaderboardEntries = users.map((item, index) => ({
        userId: item._id,
        name: item.username,
        email: item.email,
        score: item.points,
        rank: index + 1,
    }));

    await Leaderboard.deleteMany({});
    await Leaderboard.insertMany(leaderboardEntries);

    res
        .status(200)
        .json(new ApiResponse(200, { leaderboardEntries }, "Leaderboard fetched successfully!"))
})

const getUserRank = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const user = await Leaderboard.findOne({userId});
    console.log(user);
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    const {rank} = user;
    console.log(rank,"rank")
    res
        .status(200)
        .json(new ApiResponse(200, { rank }, "User rank fetched successfully!"))
})

export { getLeaderboard, getUserRank };