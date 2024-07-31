import { Subscription } from "../models/subscription.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

//! Need to check it down
const subscribeUser = asyncHandler(async (req, res) => {
  const { channelName } = req.params;

  if (!channelName) {
    throw new ApiError(400, "Channel ID is required.");
  }

  const userId = req.user?._id;

  const channel = await User.findById(channelName);
  if (!channel) {
    throw new ApiError(404, "Channel not found.");
  }

  const existingSubscription = await Subscription.findOne({
    subscriber: userId,
    channel: channelName,
  });

  if (existingSubscription) {
    throw new ApiError(400, "You are already subscribed to this channel.");
  }

  const subscription = new Subscription({
    subscriber: userId,
    channel: channelName,
  });

  await subscription.save();

  res.status(200).json(new ApiResponse(200, null, "Subscribed successfully."));
});

//! Need to check it down
const unsubscribeUser = asyncHandler(async (req, res) => {
  const { channelName } = req.params;

  if (!channelName) {
    throw new ApiError(400, "Channel ID is required.");
  }

  const userId = req.user._id;

  const channel = await User.findById(channelName);
  if (!channel) {
    throw new ApiError(404, "Channel not found.");
  }

  const existingSubscription = await Subscription.findOne({
    subscriber: userId,
    channel: channelName,
  });

  if (existingSubscription) {
    throw new ApiError(400, "You are already subscribed to this channel.");
  }

  const subscription = new Subscription({
    subscriber: userId,
    channel: channelName,
  });

  await subscription.save();

  res.status(200).json(new ApiResponse(200, null, "Subscribed successfully."));
});

export { subscribeUser, unsubscribeUser };
