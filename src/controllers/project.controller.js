import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.models.js";
import { Project } from "../models/project.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const postProjects = asyncHandler(async (req, res) => {
    const { name, mentors, description, technologies, userId } = req.body;

    // Validate required fields
    if (!name || !mentors || !description || !technologies || !userId) {
        throw new ApiError(400, "All fields are required");
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // Check if project already exists
    const checkExistingProject = await Project.findOne({ name });
    if (checkExistingProject) {
        throw new ApiError(400, "Project already exists");
    }

    // Handle file upload
    let coverImageLocalPath;
    if (req.files && req.files.coverImage && req.files.coverImage.length > 0) {
        console.log(req.files);
        coverImageLocalPath = req.files.coverImage[0].path; // Access the first element of the array
    }

    if (!coverImageLocalPath) {
        throw new ApiError(400, "Cover image is required");
    }

    // Upload the image to Cloudinary
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);
    if (!coverImage) {
        throw new ApiError(500, "Error uploading cover image");
    }

    // Create the project with Cloudinary URL
    const project = await Project.create({
        name,
        mentors,
        description,
        coverImage: coverImage.secure_url, // Store the Cloudinary URL
        technologies,
    });

    if (!project) {
        throw new ApiError(500, "Internal server error");
    }

    // Update user's points and suggested projects
    user.points += 15;
    user.suggestedProjects.push(project._id);
    await user.save();

    // Send success response
    res.status(200).json(new ApiResponse(200, "Project uploaded successfully."));
});



// if that project is approved by the admins then only it will be displayed
const getProjects = asyncHandler(async (req, res) => {
    const projects = await Project.find({ review: true });
    if (!projects) {
        throw new ApiError(500, "No project found!");
    }
    res
        .status(200)
        .json(new ApiResponse(200, { projects }, "Projects retrived successfully"))
})

const getParticularProject = asyncHandler(async (req, res) => {
    const { projectId } = req.params;
    if (!projectId) {
        throw new ApiResponse(400, "Project id is required");
    }

    console.log(projectId)
    const project = await Project.findById(projectId);
    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    console.log(project)
    res
        .status(200)
        .json(new ApiResponse(200, { project }, "Project retrived successfully"))

})

const enrollInProject = asyncHandler(async (req, res) => {
    const { projectId } = req.params;
    const { userId } = req.body;
    if (!projectId || !userId) {
        throw new ApiError(400, "ProjectId and UserId are mandatory");
    }
    const project = await Project.findById(projectId);
    if (!project) {
        throw new ApiError(404, "Project not found");
    }
    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    const enrolled = project.usersEnrolled.find(id => id.toString() === userId);
    if (enrolled) {
        throw new ApiError(400, "User already enrolled in this project");
    }
    const userEnrolledProject = user.projectsEnrolled.find(id => id.toString() === projectId);
    if (userEnrolledProject) {
        throw new ApiError(400, "User already enrolled in this project");
    }
    project.usersEnrolled.push(userId);
    project.save({ validateBeforeSave: false });
    user.projectsEnrolled.push(projectId);
    user.points = user.points + 20;
    user.save({ validateBeforeSave: false });

    res
        .status(200)
        .json(new ApiResponse(200, "Enrolled successfully"))
})

const deRegisterProject = asyncHandler(async (req, res) => {
    const { projectId } = req.params;
    const { userId } = req.body;
    if (!projectId || !userId) {
        throw new ApiError(400, "ProjectId and UserId are mandatory");
    }
    const project = await Project.findById(projectId);
    if (!project) {
        throw new ApiError(404, "Project not found");
    }
    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    const enrolled = project.usersEnrolled.find(id => id.toString() === userId);
    if (!enrolled) {
        throw new ApiError(400, "User not enrolled in this project");
    }
    const userEnrolledProject = user.projectsEnrolled.find(id => id.toString() === projectId);
    if (!userEnrolledProject) {
        throw new ApiError(400, "User not enrolled in this project");
    }
    project.usersEnrolled.pull(userId);
    project.save({ validateBeforeSave: false });
    user.projectsEnrolled.pull(projectId);
    user.points = user.points - 20;
    user.save({ validateBeforeSave: false });
    res
        .status(200)
        .json(new ApiResponse(200, "De-Enrolled successfully"));
})


export { postProjects, getProjects, getParticularProject, enrollInProject, deRegisterProject };