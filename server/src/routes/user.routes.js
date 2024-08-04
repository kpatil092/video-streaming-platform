import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  changeCurrentPassword,
  getCurrentUser,
  getUserChannelProfile,
  getUsersVideos,
  getWatchHistory,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  updateAccountDetails,
  updateCoverImage,
  updateUserAvatar,
} from "../controllers/user.controller.js";
import { getUserComment } from "../controllers/comments.controller.js";

const router = Router();

router.route("/register").post(
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  registerUser
);

router.route("/login").post(loginUser);
router.route("/c/videos/:channelName").get(getUsersVideos);

// secured route
router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);

router
  .route("/update-avatar")
  .patch(verifyJWT, upload.single("avatar"), updateUserAvatar);

router
  .route("/update-cover-image")
  .patch(verifyJWT, upload.single("cover-image"), updateCoverImage);
router.route("/change-password").post(verifyJWT, changeCurrentPassword);

router.route("/update").patch(verifyJWT, updateAccountDetails);
router.route("/c/:channelName").get(verifyJWT, getUserChannelProfile);
router.route("/history").get(verifyJWT, getWatchHistory);

// Comment route
router.route("/comments").get(verifyJWT, getUserComment);

export default router;

// router.route("/update").put(
//   verifyJWT,
//   upload.fields([
//     { name: "avatar", maxCount: 1 },
//     { name: "coverImage", maxCount: 1 },
//   ]),
//   updateUserAvatar,
//   updateCoverImage,
//   updateAccountDetails
// );
