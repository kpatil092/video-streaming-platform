import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new Schema(
  {
    videoFile: {
      type: String, // cloudinary
      required: true,
    },

    thumbnail: {
      type: String, // cloudinary
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    duration: {
      type: Number, // cloudinary
      required: true,
    },
    tags: [
      {
        type: String,
        
      },
    ],
    views: {
      type: Number,
      default: 0,
    },
    likesCount: {
      type: Number,
      default: 0,
    },
    unlikesCount: {
      type: Number,
      default: 0,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    commentsCount: {
      type: Number,
      default: 0,
    },
    comments: [   //! not required?
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  { timestamps: true }
);

// videoSchema.index({title: "text", tags: "text"});

videoSchema.plugin(mongooseAggregatePaginate);

export const Video = mongoose.model("Video", videoSchema);
