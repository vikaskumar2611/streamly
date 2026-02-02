import { Router } from "express";
import {
    loginUser,
    logoutUser,
    registerUser,
    refreshAcessToken,
    changeCurrentPassword,
    updateAcountDetails,
    updateUserAvatar,
    updateUserCoverImage,
    getCurrentUser,
    getUserChannelProfile,
    getWatchHistory,
    getDashboardStats,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1,
        },
        {
            name: "coverImage",
            maxCount: 1,
        },
    ]),
    registerUser,
);

router.route("/login").post(upload.none(), loginUser);

//secured routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAcessToken);
router.route("/dashboard").get(verifyJWT, getDashboardStats);
router
    .route("/change-password")
    .post(verifyJWT, upload.none(), changeCurrentPassword);
router.route("/current-user").get(verifyJWT, getCurrentUser);
router
    .route("/update-account")
    .patch(verifyJWT, upload.none(), updateAcountDetails);
router
    .route("/avatar")
    .patch(verifyJWT, upload.single("avatar"), updateUserAvatar);
router
    .route("/cover-image")
    .patch(verifyJWT, upload.single("coverImage"), updateUserCoverImage);
router.route("/c/:username").get(verifyJWT, getUserChannelProfile);
router.route("/history").get(verifyJWT, getWatchHistory);
export default router;
