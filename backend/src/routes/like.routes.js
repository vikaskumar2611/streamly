import { Router } from "express";
import {
    getLikedVideos,
    toggleCommentLike,
    toggleVideoLike,
    togglePostLike,
    fetchCommentLike,
    fetchPostLike,
    fetchVideoLike,
} from "../controllers/like.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/fetch/v/:videoId").get(fetchVideoLike);
router.route("/fetch/c/:commentId").get(fetchCommentLike);
router.route("/fetch/t/:postId").get(fetchPostLike);

router.route("/toggle/v/:videoId").post(toggleVideoLike);
router.route("/toggle/c/:commentId").post(toggleCommentLike);
router.route("/toggle/t/:postId").post(togglePostLike);
router.route("/videos").get(getLikedVideos);

export default router;
