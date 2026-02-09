import { Router } from "express";
import {
    createPost,
    deletePost,
    getUserPosts,
    updatePost,
    voteOnPost,
} from "../controllers/post.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.route("/").post(createPost);

router.route("/user/:channelId").get(getUserPosts);

router.route("/:postId").patch(updatePost).delete(deletePost);

router.route("/vote/:postId").post(voteOnPost);

export default router;
