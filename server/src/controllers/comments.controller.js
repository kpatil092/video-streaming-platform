import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Video } from "../models/video.model.js";
import { Comment } from "../models/comment.model.js";
import mongoose from "mongoose";

const addComment = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const { id } = req.params; //id
  const { content } = req.body;

  if (!content?.trim()) {
    throw new ApiError(400, "Comment content cannot be empty.");
  }

  try {
    // Check if the video exists
    const video = await Video.findById(id);
    if (!video) {
      throw new ApiError(404, "Video not found.");
    }

    // Create a new comment
    const newComment = await Comment.create({
      content,
      user: userId,
      video: id,
    });

    // Update the video's comments array and increment the comments count
    // video.comments.push(newComment._id);
    // video.commentsCount += 1;
    // await video.save();

    return res
      .status(201)
      .json(new ApiResponse(201, newComment, "Comment added successfully."));
  } catch (error) {
    throw new ApiError(400, error?.message || "Error while adding comment.");
  }
});

const getUserComment = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const { page = 1, limit = 5 } = req.query; // Default 5

  try {
    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
    };

    const aggregateQuery = Comment.aggregate([
      {
        $match: {
          user: userId,
        },
      },
      {
        $sort: {
          createdAt: -1, // sorted to latest comment
        },
      },
      {
        $lookup: {
          from: "videos",
          localField: "video",
          foreignField: "_id",
          as: "videoInfo",
        },
      },
      {
        $unwind: "$videoInfo",
      },
      {
        $lookup: {
          from: "users",
          localField: "videoInfo.owner",
          foreignField: "_id",
          as: "ownerInfo",
        },
      },
      {
        $unwind: "$ownerInfo",
      },
      {
        $project: {
          content: 1,
          likeCount: 1,
          unlikeCount: 1,
          createdAt: 1,
          updatedAt: 1,
          "videoInfo.title": 1,
          "videoInfo.thumbnail": 1,
          "ownerInfo.channelName": 1,
          "ownerInfo.avatar": 1,
        },
      },
    ]);

    const comments = await Comment.aggregatePaginate(aggregateQuery, options);

    res
      .status(200)
      .json(new ApiResponse(200, comments, "Comments fetched successfully."));
  } catch (error) {
    throw new ApiError(
      400,
      error?.message || "Error while retrieving comment posted by the user."
    );
  }
});

const getVideoComments = asyncHandler(async (req, res) => {
  const { id } = req.params; // videoId
  const { page = 1, limit = 5 } = req.query; // Default 5

  try {
    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
    };

    const aggregateQuery = Comment.aggregate([
      {
        $match: {
          video: new mongoose.Types.ObjectId(id),
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
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $addFields: {
          channelName: "$user.channelName",
          avatar: "$user.avatar",
        },
      },
      {
        $project: {
          content: 1,
          likeCount: 1,
          unlikeCount: 1,
          createdAt: 1,
          channelName: 1,
          avatar: 1,
        },
      },
    ]);

    const comments = await Comment.aggregatePaginate(aggregateQuery, options);

    return res
      .status(200)
      .json(new ApiResponse(200, comments, "Comments fetched successfully."));
  } catch (error) {
    throw new ApiError(500, error.message || "Error fetching comments.");
  }
});

//! Not checked yet
const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user._id;

  if (!commentId || !mongoose.Types.ObjectId.isValid(commentId)) {
    throw new ApiError(400, "Comment Id is invalid.");
  }

  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new ApiError(404, "Comment not found.");
  }

  const video = await Video.findById(comment.video);
  if (!video) {
    throw new ApiError(404, "Video not found.");
  }

  if (
    comment.user.toString() !== userId.toString() &&
    video.owner.toString() !== userId.toString()
  ) {
    throw new ApiError(403, "You are not authorized to delete this comment.");
  }

  await Comment.findByIdAndDelete(commentId);

  // Update the video's comment count
  // video.commentsCount = video.commentsCount > 0 ? video.commentsCount - 1 : 0;
  // await video.save();

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Comment deleted successfully."));
});

export { getUserComment, addComment, getVideoComments, deleteComment };
