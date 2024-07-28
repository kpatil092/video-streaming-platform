import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    fullname: {
      type: String,
      required: true,
      trim: true,
    },
    channelname: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },
    country: {
      type: String,
    },
    avatar: {
      type: String, // cloudinary
    },
    coverImage: {
      type: String, // cloudinary
    },
    watchHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    subscription: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    subscriber: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comments",
      },
    ],
    likedVideo: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

export const User = mongoose.model("User", userSchema);
