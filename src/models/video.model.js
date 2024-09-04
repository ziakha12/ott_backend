import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new mongoose.Schema({
  videoFile: {
    type: String, //cloudinary URl
    required: true,
  },
  thumbnail: {
    type: String, //cloudinary Url
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  discription: {
    type: String,
    required: true,
  },
  duration: {
    type: Number, // cloudinary Url
    required: true,
  },
  views :{
    type : Number,
    default : 0
  },
  isPublished:{
    type : Boolean,
    default : true
  },
  owner:{
    type : Schema.Types.ObjectId,
    ref : "User"
  }
 },{timestamps : true});

 mongoose.plugin(mongooseAggregatePaginate)
export const Video = mongoose.model("Video", videoSchema);