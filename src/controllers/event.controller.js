import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.models.js";
import { Event } from "../models/event.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const registerEvent = asyncHandler(async (req, res) => {
    const { name, description, sponsors, aim, perks, eventDate, partners, venue, mode, capacity, prerequisite, technology, tags, userId } = req.body;

    if ([name, description, aim, eventDate, userId].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required")
    }

    console.log(userId)
    const user = await User.find({ _id: userId });

    if (!user) {
        throw new ApiError(400, "User not found");
    }
    console.log(user)

    const findExistingEvent = await Event.findOne({ name });

    if (findExistingEvent) {
        throw new ApiError(400, "Event already exist");
    }
    if (user.isAdmin === false) {
        throw new ApiError(500, "You are not allowed to perform this action");
    }

    if (mode === "Offline") {
        if ([venue, capacity].some((field) => field?.trim() === "")) {
            throw new ApiError(400, "Venue and capacity is required");
        }
    }
    // thunderclient mein eventImage karke daalna hai 

    let eventImageLocalPath;
    if (req.files && Array.isArray(req.files.eventImage) && req.files.eventImage.length > 0) {
        eventImageLocalPath = req.files.eventImage[0].path;
    }
    if (!eventImageLocalPath) {
        throw new ApiError(400, "Event image not found");
    }

    const eventImg = await uploadOnCloudinary(eventImageLocalPath);

    const createEvent = await Event.create({
        name,
        description,
        aim,
        perks: perks ? perks : "",
        eventDate,
        sponsors: sponsors ? sponsors : "",
        venue: venue ? venue : "",
        mode,
        capacity: capacity ? capacity : 0,
        eventImage: eventImg ? eventImg.secure_url : "",
        prerequisite: prerequisite || [],
        tags: tags ? tags : "",
    })
    if (!createEvent) {
        throw new ApiError(500, "Event not created");
    }
    // createEvent.usersRegistered.push(userId);
    // createEvent.save({ validateBeforeSave: false })

    res
        .status(200)
        .json(new ApiResponse(200, { createEvent }, "Event created successfully"));

})
const getAllEvents = asyncHandler(async (req, res) => {
    const events = await Event.find();
    if (!events) {
        throw new ApiError(500, "No upcoming events found");
    }

    res
        .status(200)
        .json(new ApiResponse(200, { events }, "All upcoming events fetched"))

})

const getParticularEvent = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id) {
        throw new ApiError(400, "EventId is required");
    }
    const event = await Event.findById(id);
    if (!event) {
        throw new ApiError(400, "No upcoming events");
    }
    res
        .status(200)
        .json(new ApiResponse(200, { event }, "Successfully retrieved events"));
})

export { registerEvent, getAllEvents, getParticularEvent }