import mongoose, { Schema } from "mongoose";

const commentSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    video: {
      type: Schema.Types.ObjectId,
      ref: "Video",
      required: true,
    },
    replies: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    likeCount: {
      type: Number,
      default: 0,
    },
    unlikeCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default Comment = mongoose.model("Comment", commentSchema);
