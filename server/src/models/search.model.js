import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const searchSchema = new Schema({
  keyword: {
    type: String,
    required: true,
    unique: true,
    index: true, // Indexing for faster search
  },
  videos: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video",
    },
  ],
});

searchSchema.plugin(mongooseAggregatePaginate);
export const Search = mongoose.model("Search", searchSchema);
