import mongoose, { Schema } from "mongoose";
import { Project } from "./project.models.js";
import { Event } from "./event.models.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";

const userSchema = new Schema({
    username: {
        type: String,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    suggestedProjects: [{
        type: Schema.Types.ObjectId,
        ref: "Project"
    }],
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
    isAdmin: {
        type: Boolean,
        default: false,
    },
    registeredEvents: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: "Event"
        }],
        default: [],
    },
    refreshToken: {
        type: String,
    },
}, { timestamps: true })
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
})
userSchema.methods.isPasswordCorrect = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
}
userSchema.methods.generateAccessToken = function () {
    return jwt.sign({
        _id: this._id,
        email: this.email,
    },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        },
    )
}
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,

        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}



export const User = mongoose.model("Users", userSchema);