import {Router} from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { deleteVideo, getAllVideos, togglePublishStatus, updateVideo, uploadVideo } from "../controllers/video.controller.js"
import { upload } from "../middlewares/multer.middleware.js"

const router = Router()
router.use(verifyJWT)

router
    .route("/")
    .get(getAllVideos)
    .post(
        upload.fields([
            {
                name: "videoFile",
                maxCount: 1
            },
            {
                name: "thumbnail",
                maxCount: 1
            }
        ]),
        uploadVideo
    )
router
    .route("/:videoId")
    .get(getAllVideos)
    .delete(deleteVideo)
    .patch(upload.single("thumbnail"), updateVideo)
    
router.route("/toggle/publish/:videoId").patch(togglePublishStatus)    

export default router