import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  changeCurrentPassword,
  getCurrentUser,
  getUserChannelProfile,
  getUsersVideos,
  getWatchHistory,
  updateAccountDetails,
  updateCoverImage,
  updateUserAvatar,
} from "../controllers/user.controller.js";
import { getUserComment } from "../controllers/comments.controller.js";
import {
  getChannelSubscribedTo,
  getVideosOfSubscribedChannels,
  subscribeChannel,
  unsubscribeChannel,
} from "../controllers/subscription.controller.js";

const router = Router();

router.route("/c/videos/:channelName").get(getUsersVideos);

// secured route
router.route("/current-user").get(verifyJWT, getCurrentUser);

// updaing routes
router
  .route("/update-avatar")
  .patch(verifyJWT, upload.single("avatar"), updateUserAvatar);
router
  .route("/update-cover-image")
  .patch(verifyJWT, upload.single("cover-image"), updateCoverImage);
router.route("/change-password").post(verifyJWT, changeCurrentPassword);
router.route("/update").patch(verifyJWT, updateAccountDetails);

// channel routes
router.route("/c/:channelName").get(verifyJWT, getUserChannelProfile);
router.route("/history").get(verifyJWT, getWatchHistory);

// Comment route
router.route("/comments").get(verifyJWT, getUserComment);

// subscription routes
router.route("/subscribe/:channelId").post(verifyJWT, subscribeChannel);
router.route("/unsubscribe/:channelId").post(verifyJWT, unsubscribeChannel);
router.route("/subscriptions/channel").get(verifyJWT, getChannelSubscribedTo);
router
  .route("/subscriptions/videos")
  .get(verifyJWT, getVideosOfSubscribedChannels);

export default router;
