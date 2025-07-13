import mongoose from "mongoose";
import Channel from "./channelModel.js";
import Comment from "./commentModel.js";
import cloudinary from "../config/cloudinary.js";

const User = mongoose.models.User;

// Video model
const videoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    thumbnailUrl: {
        type: String
    },
    videoUrl: {
        type: String,
        required: true
    },
    duration: {
        type: String,
        required: true
    },
    uploader: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    channelId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Channel",
        required: true,
    },
    views: {
        type: Number,
        default: 0
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    dislikes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }],
    uploadDate: {
        type: Date,
        default: Date.now
    }
})

videoSchema.pre("findOneAndDelete", async function (next) {
    const doc = await this.model.findOne(this.getFilter());

    if (doc) {
        try {
            await Channel.findByIdAndUpdate(doc.channelId, {
                $pull: { videos: doc._id }
            });

            await User.findByIdAndUpdate(doc.uploader, {
                $pull: { uplodedVideos: doc._id }
            });

            await Comment.deleteMany({ videoId: doc._id });

            const videoPublicId = doc.videoUrl.split("/").pop().split(".")[0];
            const thumbnailPublicId = doc.thumbnailUrl.split("/").pop().split(".")[0];

            await cloudinary.uploader.destroy(`youtube-clone/videos/${videoPublicId}`, { resource_type: "video" });
            await cloudinary.uploader.destroy(`youtube-clone/thumbnails/${thumbnailPublicId}`, { resource_type: "image" });

            console.log("Thumbnail and video deleted from cloudinary");
        } catch (err) {
            console.log("Error in delete video middleware", err.message);
        }
    }
    next();
})

const Video = mongoose.model("Video", videoSchema);

export default Video;