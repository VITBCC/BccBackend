import { Router } from "express";
import { registerEvent, getAllEvents, getParticularEvent, userEventRegistration } from "../controllers/event.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();

router.route("/registerEvent").post(
    upload.fields([
        {
            name: "eventImage",
            maxCount: 1
        },

    ]),
    registerEvent
)
router.route("/getAllEvents").get( getAllEvents);
router.route("/:id").get(verifyJWT, getParticularEvent);
router.route("/userEventRegistration").post(verifyJWT,userEventRegistration);


export default router;