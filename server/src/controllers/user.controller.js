import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);

    const accessToken = user?.generateAccessToken();
    const refreshToken = user?.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating refresh and access token. "
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  // get data from frontend
  // validation
  // check if already exists
  // check for images
  // upload to cloudinary
  // create user object
  // remove password & refresh tokens from response
  // check for user object creation
  // return response

  const { fullName, email, channelName, password, country } = req.body;
  // console.log(fullName, email, channelName, password);

  if (
    [fullName, email, channelName, password].some(
      (field) => field === undefined || field?.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required"); // bad request
  }

  // try {
    const existedUser = await User.findOne({
      $or: [{ channelName }, { email }],
    });
    // console.log(existedUser);

    if (existedUser) {
      throw new ApiError(409, "User with email or channelname already exist"); // conflict
    }

    // console.log(req.files);

    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

    const avatar = await uploadOnCloudinary(
      avatarLocalPath,
      "video-streaming-platform/avatar"
    );
    const coverImage = await uploadOnCloudinary(
      coverImageLocalPath,
      "video-streaming-platform/cover-image"
    );

    const user = await User.create({
      fullName,
      avatar: avatar?.url || "",
      coverImage: coverImage?.url || "",
      email,
      password,
      channelName: channelName.toLowerCase(),
      country: country || "",
    });

    // extra db query
    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );
    if (!createdUser) {
      throw new ApiError(
        500,
        "Something went wrong while registering the user."
      ); // internal server error
    }

    return res
      .status(201)
      .json(new ApiResponse(200, createdUser, "Usr registered successfully.")); // ok
  // } catch (error) {
    // throw new ApiError(
      // error?.message || 500,
      // error?.message || "Something went wrong while registering user."
    // );
  // }
});

const loginUser = asyncHandler(async (req, res) => {
  // collect fields
  // find the user
  // password check
  // generate access and refresh tokens
  // send cookie

  const { email, password } = req.body;
  // console.log(email, password);
  if (!email) {
    throw new ApiError(400, "Email is required."); // bad request
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User does not exist."); // not found
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials."); // unauthorized
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  // console.log(accessToken, refreshToken);

  // Extra DB query (can be optimized)
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },

        "User logged in successfully."
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  const id = req.user._id;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        $unset: {
          refreshToken: 1,
        },
      },
      {
        new: true,
      }
    );

    if (!updatedUser) {
      throw new ApiError(404, "User not found");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    // console.log(updatedUser);

    return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json(new ApiResponse(200, {}, "User logged out"));
  } catch (error) {
    throw new ApiError(
      error?.status || 500,
      error?.message || "Something went wrong while logging out."
    );
  }
});

// To refresh the tokens if the access token expires, so the refresh token's timing could extend.
const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request.");
  }

  try {
    //decode incoming token
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    // get user with that token
    const user = await User.findById(decodedToken?._id);
    if (!user) {
      throw new ApiError(401, "Inavalid refresh token.");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
      user._id
    );

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken },
          "Access token refreshed"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token.");
  }
});

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
      .json(
        new ApiResponse(200, user, "Current user fetched successfully")
      );
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

const getWatchHistory = asyncHandler(async (req, res) => {
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

const getUsersVideos = asyncHandler(async (req, res) => {
  const { channelName } = req.params;
  if (!channelName?.trim()) {
    throw new ApiError(400, "Channel Name does not exist!");
  }

  try {
    const usersVideos = await User.aggregate([
      {
        $match: {
          channelName: channelName?.toLowerCase(),
        },
      },
      {
        $lookup: {
          from: "videos",
          localField: "_id",
          foreignField: "owner",
          as: "userVideos",
        },
      },
      {
        $project: {
          userVideos: {
            _id: 1,
            title: 1,
            description: 1,
            duration: 1,
            url: 1,
            thumbnail: 1,
            createdAt: 1,
            views: 1,
          },
        },
      },
    ]);

    if (!usersVideos.length) {
      throw new ApiError(404, "Channel does not uploaded any video.");
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, usersVideos, "User's videos fetched successfully.")
      );
  } catch (error) {
    throw new ApiError(
      error?.status || 500,
      error?.message || "Facing issue while fetching user's videos."
    );
  }
});

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
  updateCoverImage,
  getUserChannelProfile,
  getWatchHistory,
  getUsersVideos,
};
