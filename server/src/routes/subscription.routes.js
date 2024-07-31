import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  subscribeUser,
  unsubscribeUser,
} from "../controllers/subscription.controller.js";

const router = Router();

//! Haven't been checked yet
router.put("/subscribe/:channelId", verifyJWT, subscribeUser);
router.put("/unsubscribe/:channelId", verifyJWT, unsubscribeUser);

export default router;
