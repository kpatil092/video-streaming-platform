import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";
import mongoose from "mongoose";
import { Video } from "../models/video.model.js";

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;
  // console.log(oldPassword, newPassword, confirmPassword);

  if (newPassword !== confirmPassword) {
    throw new ApiError(400, "Passwords are not matching.");
  }

  try {
    const user = await User.findById(req.user?._id);
    // console.log(user);
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

    if (!isPasswordCorrect) {
      throw new ApiError(400, "Inavalid password.");
    }

    user.password = newPassword;
    await user.save({ validateBeforeSave: false });

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Password changed successfully."));
  } catch (error) {
    throw new ApiError(
      error?.status || 500,
      error?.message || "Something went wrong."
    );
  }
});

const getCurrentUser = asyncHandler(async (req, res) => {
  try {
    // console.log(req.user)
    const user = req?.user;
    return res
      .status(200)
      .json(new ApiResponse(200, user, "Current user fetched successfully"));
  } catch (error) {
    throw new ApiError(
      error?.status || 401,
      error?.message ||
        "Something went wrong while retrieving data of current user."
    );
  }
});

const updateAccountDetails = asyncHandler(async (req, res) => {
  const { fullName, country, dateOfBirth } = req.body;

  if (
    fullName === undefined &&
    country === undefined &&
    dateOfBirth === undefined
  ) {
    throw new ApiError(400, "No new fileds to update.");
  }

  const updateFields = {};
  if (fullName !== undefined) updateFields.fullName = fullName;
  if (country !== undefined) updateFields.country = country;
  if (dateOfBirth !== undefined) updateFields.dateOfBirth = dateOfBirth;

  try {
    const user = await User.findByIdAndUpdate(
      req.user?._id,
      {
        $set: updateFields,
      },
      {
        new: true,
      }
    ).select("-password -refreshToken");

    return res
      .status(200)
      .json(
        new ApiResponse(200, user, "Account details updated successfully.")
      );
  } catch (error) {
    throw new ApiError(
      error?.status || 400,
      error?.message || "Something went wrong while updating user details."
    );
  }
});

const updateUserAvatar = asyncHandler(async (req, res, next) => {
  const avatarLocalPath = req.file?.path;
  console.log(avatarLocalPath);

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is missing.");
  }

  const currentUser = await User.findById(req.user._id).select("avatar");
  const currentAvatarUrl = currentUser?.avatar;

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  if (!avatar?.url) {
    throw new ApiError(500, "Error while uploading avatar.");
  }
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        avatar: avatar.url,
      },
    },
    {
      new: true,
    }
  ).select("-password -refreshToken");

  //! Need to check
  if (currentAvatarUrl) {
    const avatarPublicId = currentAvatarUrl.split("/").pop().split(".")[0];
    await deleteFromCloudinary(
      `video-streaming-platform/avatar/${avatarPublicId}`,
      "image"
    );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user?.avatar, "Avatar updated successfully.")); // alert
});

const updateCoverImage = asyncHandler(async (req, res, next) => {
  const coverImageLocalPath = req.file?.path;

  if (!coverImageLocalPath) {
    throw new ApiError(400, "Cover image file is missing.");
  }

  const currentUser = await User.findById(req.user._id).select("coverImage");
  const currentCoverImageUrl = currentUser?.coverImage;

  const coverImage = await uploadOnCloudinary(coverImageLocalPath);
  if (!coverImage?.url) {
    throw new ApiError(500, "Error while uploading cover image.");
  }
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        coverImage: coverImage.url,
      },
    },
    {
      new: true,
    }
  ).select("-password -refreshToken");

  //! Need to check
  if (currentCoverImageUrl) {
    const coverImagePublicId = currentCoverImageUrl
      .split("/")
      .pop()
      .split(".")[0];
    await deleteFromCloudinary(
      `video-streaming-platform/avatar/${coverImagePublicId}`,
      "image"
    );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Cover image updated successfully."));
});

const getUserChannelProfile = asyncHandler(async (req, res) => {
  const { channelName } = req.params;
  if (!channelName?.trim()) {
    throw new ApiError(400, "Channel Name does not exist!");
  }

  try {
    const channel = await User.aggregate([
      {
        $match: {
          channelName: channelName?.toLowerCase(),
        },
      },
      {
        $lookup: {
          from: "subscriptions",
          localField: "_id",
          foreignField: "channel",
          as: "subscribers",
        },
      },
      {
        $lookup: {
          from: "subscriptions",
          localField: "_id",
          foreignField: "subscriber",
          as: "subscribedTo",
        },
      },
      {
        $addFields: {
          subscriberCount: {
            $size: "$subscribers",
          },
          channelSubscribedToCount: {
            $size: "$subscribedTo",
          },
          isSubscribed: {
            $cond: {
              if: { $in: [req.user?._id, "$subscribers.subscriber"] },
              then: true,
              else: false,
            },
          },
        },
      },
      {
        $project: {
          fullName: 1,
          channelName: 1,
          subscriberCount: 1,
          channelSubscribedToCount: 1,
          isSubscribed: 1,
          avatar: 1,
          coverImage: 1,
          email: 1,
        },
      },
    ]);

    if (!channel?.length) {
      throw new ApiError(404, "Channel does not exist.");
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, channel[0], "User channel fetched successfully.")
      );
  } catch (error) {
    throw new ApiError(
      error?.status || 500,
      error?.message ||
        "Something went wrong while fetching the channel detail."
    );
  }
});

const getUserWatchHistory = asyncHandler(async (req, res) => {
  try {
    const user = await User.aggregate([
      {
        $match: {
          //! Alert
          _id: new mongoose.Types.ObjectId(req.user?._id),
        },
      },
      {
        $lookup: {
          from: "videos",
          localField: "watchHistory",
          foreignField: "_id",
          as: "watchHistory",

          pipeline: [
            {
              $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
                pipeline: [
                  {
                    $project: {
                      channelName: 1,
                      avatar: 1,
                    },
                  },
                ],
              },
            },
            {
              $addFields: {
                owner: {
                  $first: "$owner",
                },
              },
            },
          ],
        },
      },
    ]);

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          user[0].watchHistory,
          "Watch history fetched successfully."
        )
      );
  } catch (error) {
    throw new ApiError(
      error?.status || 500,
      error?.message || "Facing issue while fetching watch history."
    );
  }
});

const getCurrentUsersVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 12 } = req.query;
  const userId = req.user._id;

  try {
    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
    };

    const matchStage = {
      isPublished: true,
      owner: new mongoose.Types.ObjectId(userId), // Match videos by user ID
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
        new ApiResponse(200, videos, "User's videos fetched successfully.")
      );
  } catch (error) {
    throw new ApiError(500, error.message || "Error fetching user's videos.");
  }
});

export {
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
  updateCoverImage,
  getUserChannelProfile,
  getUserWatchHistory,
  getCurrentUsersVideos,
};
