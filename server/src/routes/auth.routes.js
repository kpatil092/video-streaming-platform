// Need to check, if redundant we will remove httpOnly from access token

import { Router } from "express";
import jwt from "jsonwebtoken";

const router = Router();

router.route("/check").get((req, res) => {
  const token = req.cookies.accessToken;
  if (!token) {
    // console.log(token);
    return res.status(401).json({ message: "Not authenticated" }); //unauthorized
  }
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    res.status(200).json({ user: decoded.user });
  } catch (err) {
    // console.log(err);
    res.status(401).json({ message: "Not authenticated" });
  }
});

router.route('/check-refresh-token').post((req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(200).json({ exists: false });
  }

  // Verify the refresh token
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(200).json({ exists: false });
    }

    // Refresh token is valid
    return res.status(200).json({ exists: true });
  });
});

export default router;
