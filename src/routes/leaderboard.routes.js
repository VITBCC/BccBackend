import { Router } from "express";
import { getLeaderboard ,getUserRank} from "../controllers/leaderboard.controller.js";


const router = Router();

router.route("/leaderboard").get(getLeaderboard);
router.route("/:userId").get(getUserRank);

export default router;