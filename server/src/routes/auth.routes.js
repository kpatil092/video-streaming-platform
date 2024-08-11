import { Router } from "express";
import {
  checkRefreshTokens,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
} from "../controllers/auth.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/check-refresh-token").post(checkRefreshTokens);

router.route("/refresh-token").post(refreshAccessToken);

router.route("/register").post(
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  registerUser
);

router.route("/login").post(loginUser);

router.route("/logout").post(verifyJWT, logoutUser);

export default router;

// (req, res) => {
//   const refreshToken = req.cookies.refreshToken;

//   if (!refreshToken) {
//     return res.status(200).json({ exists: false });
//   }

//   // Verify the refresh token
//   jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
//     if (err) {
//       return res.status(200).json({ exists: false });
//     }

//     // Refresh token is valid
//     return res.status(200).json({ exists: true });
//   });
// }
