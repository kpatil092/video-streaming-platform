import { Subscription } from "../models/subscription.model.js";
import { User } from "../models/user.model.js";
import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const subscribeChannel = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  if (!channelId) {
    throw new ApiError(400, "Channel ID is required.");
  }

  const userId = req.user?._id;

  const channel = await User.findById(channelId);
  if (!channel) {
    throw new ApiError(404, "Channel not found.");
  }

  const existingSubscription = await Subscription.findOne({
    subscriber: userId,
    channel: channelId,
  });

  if (existingSubscription) {
    throw new ApiError(400, "You are already subscribed to this channel.");
  }

  const subscription = await Subscription.create({
    subscriber: userId,
    channel: channelId,
  });

  if (!subscription) {
    throw new ApiError(400, "Failed to subscribe.");
  }

  res.status(200).json(new ApiResponse(200, null, "Subscribed successfully."));
});

const unsubscribeChannel = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  if (!channelId) {
    throw new ApiError(400, "Channel name is required.");
  }

  const userId = req.user._id;

  const channel = await User.findById(channelId); // validation
  if (!channel) {
    throw new ApiError(404, "Channel not found.");
  }

  const existingSubscription = await Subscription.findOneAndDelete({
    subscriber: userId,
    channel: channelId,
  });

  if (!existingSubscription) {
    throw new ApiError(400, "Failed to unsubscribe.");
  }

  res
    .status(200)
    .json(new ApiResponse(200, null, "Unsubscribed successfully."));
});

const getChannelSubscribedTo = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  // Ensure the user is authenticated
  if (!userId) {
    throw new ApiError(401, "Unauthorized access.");
  }

  try {
    // Find the subscriptions of the authenticated user
    const subscriptions = await Subscription.find({ subscriber: userId })
      .populate("channel", "channelName avatar createdAt")
      .select("channel");

    // Extract channel data
    const channels = subscriptions.map((subscription) => subscription.channel);

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          channels,
          "Subscribed channels fetched successfully."
        )
      );
  } catch (error) {
    throw new ApiError(
      500,
      error.message || "Error fetching subscribed channels."
    );
  }
});

const getVideosOfSubscribedChannels = asyncHandler(async (req, res) => {
  const { page = 1, limit = 12 } = req.query;
  const userId = req.user?._id;

  // Ensure the user is authenticated
  if (!userId) {
    throw new ApiError(401, "Unauthorized access.");
  }

  try {
    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
    };

    // Find the subscribed channel IDs
    const subscriptions = await Subscription.find({
      subscriber: userId,
    }).select("channel");
    const subscribedChannelIds = subscriptions.map(
      (subscription) => subscription.channel
    );

    const matchStage = {
      isPublished: true,
      owner: { $in: subscribedChannelIds }, // Only videos from subscribed channels
    };

    const aggregateQuery = Video.aggregate([
      { $match: matchStage },
      { $sort: { createdAt: -1 } },
      {
        $lookup: {
          from: "users",
          localField: "owner",
          foreignField: "_id",
          as: "owner",
        },
      },
      { $unwind: "$owner" },
      {
        $addFields: {
          channelName: "$owner.channelName",
          avatar: "$owner.avatar",
        },
      },
      {
        $project: {
          videoFile: 1,
          thumbnail: 1,
          title: 1,
          duration: 1,
          tags: 1,
          views: 1,
          isPublished: 1,
          createdAt: 1,
          channelName: 1,
          avatar: 1,
        },
      },
    ]);

    const videos = await Video.aggregatePaginate(aggregateQuery, options);

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          videos,
          "Subscribed channels' videos fetched successfully."
        )
      );
  } catch (error) {
    throw new ApiError(500, error.message || "Error fetching videos.");
  }
});

export {
  subscribeChannel,
  unsubscribeChannel,
  getChannelSubscribedTo,
  getVideosOfSubscribedChannels,
};
