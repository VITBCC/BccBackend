import { Router } from "express";
import { postProjects, getProjects, getParticularProject } from "../controllers/project.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
const router = Router();

// router.route("/upload").post(postProjects);
router.route("/upload").post(
    upload.fields([
        {
            name: "coverImage",
            maxCount: 1
        },

    ]),
    postProjects
)
router.route("/getProjects").get(getProjects);
router.route("/:projectId").get(getParticularProject);

export default router;