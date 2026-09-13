import { Router } from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { getAllLike, toggleCommentLike, toggleVideoLike } from "../controllers/like.controller.js"

const router = Router()
router.use(verifyJWT)

router.route("/toggle/v/:videoId").post(toggleVideoLike)
router.route("/toggle/c/:commentId").post(toggleCommentLike)
router.route("/videos").get(getAllLike)

export default router
