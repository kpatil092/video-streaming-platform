import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";
import { Video } from "../models/video.model.js";
import mongoose from "mongoose";
import { Comment } from "../models/comment.model.js";
import { Search } from "../models/search.model.js";
import { Subscription } from "../models/subscription.model.js";

const extractKeywords = (title, tags) => {
  const words = title
    .toLowerCase()
    .split(/[^a-zA-Z0-9]+/)
    .filter((word) => word.length > 3);
  return [...new Set([...words, ...tags])]; // remove duplicates
};

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
    // Upload video to Cloudinary
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

    // Extract keywords from title and tags
    const keywords = extractKeywords(title, tags.split(","));

    // Add keywords to Search model
    for (const keyword of keywords) {
      await Search.findOneAndUpdate(
        { keyword },
        { $addToSet: { videos: video._id } },
        { upsert: true }
      );
    }

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
  const { id } = req.params;
  const {userId} = req.query; 

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

    // Get the count of comments on the video
    const commentCount = await Comment.countDocuments({ video: id });

    // Determine the isSubscribed flag based on user authentication
    let isSubscribed = false;
    // console.log(userId)
    if (userId) {
      isSubscribed = await Subscription.exists({
        channel: video.owner._id,
        subscriber: userId,
      });
    }

    // Add the comment count and subscription status to the video object
    const videoWithAdditionalData = {
      ...video._doc,
      commentCount,
      isSubscribed: !!isSubscribed, // Convert the result to a boolean
    };

    // Send response to the client
    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          videoWithAdditionalData,
          "Video details fetched successfully."
        )
      );
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

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const video = await Video.findById(id).session(session);
    if (!video) {
      throw new ApiError(404, "Video not found.");
    }

    // UserId didn't match with owner of the video, so can't delete
    if (video.owner.toString() !== userId.toString()) {
      throw new ApiError(403, "You are not the owner of the video.");
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

    const keywords = extractKeywords(video.title, video.tags);

    for (const keyword of keywords) {
      const searchEntry = await Search.findOneAndUpdate(
        { keyword },
        { $pull: { videos: video._id } },
        { new: true }
      ).session(session);

      if (searchEntry && searchEntry.videos.length === 0) {
        await Search.deleteOne({ keyword }).session(session);
      }
    }

    await Video.findByIdAndDelete(id).session(session);

    await session.commitTransaction();
    session.endSession();

    res
      .status(200)
      .json(new ApiResponse(200, null, "Video deleted successfully."));
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw new ApiError(
      500,
      error.message || "Problem occurred while deleting video"
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
    throw new ApiError(400, "Require at least one field.");
  }

  const video = await Video.findById(id);

  if (!video) {
    throw new ApiError(404, "Video not found.");
  }

  // Store old keywords before update
  const oldKeywords = extractKeywords(video.title, video.tags);

  // Update video details
  if (title !== undefined) video.title = title;
  if (description !== undefined) video.description = description;
  if (tags !== undefined) video.tags = tags;

  await video.save();

  // Extract new keywords after update
  const newKeywords = extractKeywords(video.title, video.tags);

  // Find keywords to remove the video from
  const keywordsToRemove = oldKeywords.filter(
    (keyword) => !newKeywords.includes(keyword)
  );

  // Find keywords to add the video to
  const keywordsToAdd = newKeywords.filter(
    (keyword) => !oldKeywords.includes(keyword)
  );

  // Remove video ID from old keywords and remove the keyword document if the array is empty
  for (const keyword of keywordsToRemove) {
    const searchEntry = await Search.findOneAndUpdate(
      { keyword },
      { $pull: { videos: video._id } },
      { new: true }
    );

    if (searchEntry && searchEntry.videos.length === 0) {
      await Search.deleteOne({ keyword });
    }
  }

  // Add video ID to new keywords
  for (const keyword of keywordsToAdd) {
    await Search.findOneAndUpdate(
      { keyword },
      { $addToSet: { videos: video._id } },
      { upsert: true }
    );
  }

  res
    .status(200)
    .json(new ApiResponse(200, video, "Video details updated successfully."));
});

const getVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 12, q } = req.query;

  try {
    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
    };

    const matchStage = {
      isPublished: true,
    };

    if (q) {
      const regex = new RegExp(`^${q}`, "i");

      matchStage.$or = [
        { tags: { $regex: regex } },
        {
          $expr: {
            $gt: [
              {
                $size: {
                  $filter: {
                    input: { $split: ["$title", " "] },
                    as: "word",
                    cond: { $regexMatch: { input: "$$word", regex: regex } },
                  },
                },
              },
              0,
            ],
          },
        },
      ];
    }

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
      .json(new ApiResponse(200, videos, "Videos fetched successfully."));
  } catch (error) {
    throw new ApiError(500, error.message || "Error fetching videos.");
  }
});

const getKeywords = asyncHandler(async (req, res) => {
  const { query } = req.query;

  if (!query) {
    throw new ApiError(400, "Query parameter is required.");
  }

  try {
    // Fetch all keywords from the database
    const keywordsDocs = await Search.find({}).select("keyword -_id").exec();
    const keywords = keywordsDocs.map((doc) => doc.keyword);

    // Separate keywords based on their match type
    const prefixMatches = {
      fullQuery: [],
      secondLongest: [],
      thirdLongest: [],
      others: [],
    };

    // Create regex patterns for matching prefixes
    const regexPatterns = [
      new RegExp(`^${query}`, "i"),
      new RegExp(`^${query.slice(0, -1)}`, "i"),
      new RegExp(`^${query.slice(0, -2)}`, "i"),
    ];

    keywords.forEach((keyword) => {
      if (regexPatterns[0].test(keyword)) {
        prefixMatches.fullQuery.push(keyword);
      } else if (regexPatterns[1].test(keyword)) {
        prefixMatches.secondLongest.push(keyword);
      } else if (regexPatterns[2].test(keyword)) {
        prefixMatches.thirdLongest.push(keyword);
      } else {
        prefixMatches.others.push(keyword);
      }
    });

    // Combine the results in the desired order and limit to 12 results
    const sortedKeywords = [
      ...prefixMatches.fullQuery.sort(),
      ...prefixMatches.secondLongest.sort(),
      ...prefixMatches.thirdLongest.sort(),
      ...prefixMatches.others.sort(),
    ].slice(0, 12);

    res
      .status(200)
      .json(
        new ApiResponse(200, sortedKeywords, "Keywords fetched successfully.")
      );
  } catch (error) {
    throw new ApiError(500, error.message || "Error fetching keywords.");
  }
});

export {
  uploadVideo,
  getVideoById,
  deleteVideo,
  updateVideoDetails,
  getVideos,
  getKeywords,
};
