import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
  deleteVideo,
  getVideoById,
  updateVideoDetails,
  uploadVideo,
} from "../controllers/video.controller.js";
import {
  addComment,
  deleteComment,
  getVideoComments,
} from "../controllers/comments.controller.js";

const router = Router();

router.route("/:id").get(getVideoById);

//  secured routes
router.route("/upload-video").post(
  verifyJWT,
  upload.fields([
    { name: "video", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  uploadVideo
);
router.route("/:id").delete(verifyJWT, deleteVideo);
router.route("/update/:id").patch(verifyJWT, updateVideoDetails);

// comment route
router.route("/:id/add-comment").post(verifyJWT, addComment);
router.route("/:id/comments").get(getVideoComments);
router.delete("/:id/:commentId", verifyJWT, deleteComment);

export default router;
