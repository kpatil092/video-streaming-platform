import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";
import { Video } from "../models/video.model.js";
import mongoose from "mongoose";

const uploadVideo = asyncHandler(async (req, res) => {
  const { title, description, tags } = req.body;
  if (!title || !description || !tags) {
    throw new ApiError(400, "All fields are required.");
  }

  if (!req.files?.video || !req.files?.thumbnail) {
    throw new ApiError(400, "Video and thumbnail files are required."); // bad request
  }

  const videoPath = req.files.video[0].path;
  const thumbnailPath = req.files.thumbnail[0].path;

  try {
    const videoObj = await uploadOnCloudinary(
      videoPath,
      "video-streaming-platform/videos"
    );

    if (!videoObj) {
      throw new ApiError(500, "Error while processing video."); // internal server error
    }

    // Upload thumbnail to Cloudinary
    const thumbnailObj = await uploadOnCloudinary(
      thumbnailPath,
      "video-streaming-platform/thumbnails"
    );

    // Create video document in database
    const video = await Video.create({
      videoFile: videoObj?.playback_url, // m3u8 extension
      thumbnail: thumbnailObj?.url,
      title,
      description,
      duration: videoObj?.duration, // You can extract and set duration if needed
      tags: tags.split(","),
      owner: req.user._id,
    });

    res
      .status(201)
      .json(new ApiResponse(200, video, "Video uploaded successfully."));
  } catch (error) {
    throw new ApiError(
      error?.status || 500,
      error.message || "Failed to upload video."
    );
  }
});

const getVideoById = asyncHandler(async (req, res) => {
  // get ID , (verified not important)
  const { id } = req.params;
  // Validate the video ID
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid video ID.");
  }

  try {
    // Fetch the video details from the database
    const video = await Video.findById(id)
      .populate("owner", "channelName avatar")
      .select("-__v");

    if (!video) {
      throw new ApiError(404, "Video not found.");
    }

    // Send response to the client
    res
      .status(200)
      .json(new ApiResponse(200, video, "Video details fetched successfully."));
  } catch (error) {
    throw new ApiError(500, error.message || "Error fetching video details.");
  }
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user?._id;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid video ID.");
  }

  try {
    const video = await Video.findById(id);
    // UserId didn't match with owner of the video, so can't delete
    if (video.owner.toString() !== userId.toString()) {
      throw new ApiError(404, "You are not the owner of the video.");
    }

    const videoPublicId = video.videoFile.split("/").pop().split(".")[0];
    const thumbnailPublicId = video.thumbnail.split("/").pop().split(".")[0];
    await deleteFromCloudinary(
      `video-streaming-platform/videos/${videoPublicId}`,
      "video"
    );
    await deleteFromCloudinary(
      `video-streaming-platform/thumbnails/${thumbnailPublicId}`,
      "image"
    );

    await Video.findByIdAndDelete(id);
    res
      .status(200)
      .json(new ApiResponse(200, null, "Video deleted successfully."));
  } catch (error) {
    throw new ApiError(
      400,
      error?.message || "Problem occure while deleting video"
    );
  }
});

const updateVideoDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, description, tags } = req.body;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid video ID.");
  }

  if (!title && !description && !tags) {
    throw new ApiError(400, "Require atleast one field.");
  }

  const updateFields = {};
  if (title !== undefined) updateFields.title = title;
  if (description !== undefined) updateFields.description = description;
  if (tags !== undefined) updateFields.tags = tags;

  const video = await Video.findByIdAndUpdate(
    id,
    {
      $set: updateFields,
    },
    {
      new: true,
    }
  );

  if (!video) {
    throw new ApiError(404, "Video not found.");
  }

  res
    .status(200)
    .json(new ApiResponse(200, video, "Video details updated successfully."));
});

const getVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 24 } = req.query;

  try {
    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
    };

    const aggregateQuery = Video.aggregate([
      {
        $match: {
          isPublished: true,
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "owner",
          foreignField: "_id",
          as: "owner",
        },
      },
      {
        $unwind: "$owner",
      },
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
      .json(new ApiResponse(200, videos, "Videos fetched successfully."));
  } catch (error) {
    throw new ApiError(500, error.message || "Error fetching videos.");
  }
});

export {
  uploadVideo,
  getVideoById,
  deleteVideo,
  updateVideoDetails,
  getVideos,
};
