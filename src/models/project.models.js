import mongoose, { Schema } from "mongoose";

const projectSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    mentors: {
        type: [String],
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    coverImage: {
        type: String,
        required: true,
    },
    contributors: {
        type: [String],
    },
    technologies: {
        type: [String],
        required: true,
    },
    usersEnrolled: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: "User"
        }],
        default: [],
    },
    review: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true })

export const Project = mongoose.model("Projects", projectSchema);