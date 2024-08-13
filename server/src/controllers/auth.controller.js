import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { cookieOptions } from "../utils/cookieOptions.js";

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

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
      user._id
    );

    return res
      .status(200)
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", refreshToken, cookieOptions)
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

const checkRefreshTokens = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    return res
      .status(200)
      .json(new ApiResponse(200, { exists: false }, "Tokens not available."));
  }

  // Verify the refresh token
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (error, user) => {
    if (error) {
      throw new ApiError(error?.status || 400, "Invalid token");
    }

    // Refresh token is valid
    return res
      .status(200)
      .json(new ApiResponse(200, { exists: true }, "Tokens validated."));
  });
});

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
    throw new ApiError(500, "Something went wrong while registering the user."); // internal server error
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "Usr registered successfully.")); // ok
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

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
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

    // console.log(updatedUser);

    return res
      .status(200)
      .clearCookie("accessToken", cookieOptions)
      .clearCookie("refreshToken", cookieOptions)
      .json(new ApiResponse(200, {}, "User logged out"));
  } catch (error) {
    throw new ApiError(
      error?.status || 500,
      error?.message || "Something went wrong while logging out."
    );
  }
});

export {
  checkRefreshTokens,
  refreshAccessToken,
  registerUser,
  loginUser,
  logoutUser,
};
