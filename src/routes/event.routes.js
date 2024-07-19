import { Router } from "express";
import { registerEvent, getAllEvents, getParticularEvent } from "../controllers/event.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
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
router.route("/getAllEvents").get(getAllEvents);
router.route("/:id").get(getParticularEvent);

export default router;