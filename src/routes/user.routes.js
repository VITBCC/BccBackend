import { Router } from "express";
import { registerUser, loginUser } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { notifyUser } from "../controllers/notify.controller.js";
const router = Router();

router.route("/register").post(
    registerUser
)

router.route("/login").post(
    loginUser
)
router.route("/ping").post(
    notifyUser
)

export default router