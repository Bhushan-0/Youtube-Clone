import Channel from "../models/channelModel.js";
import User from "../models/userModel.js";
import Video from "../models/videoModel.js";
import cloudinary from "../config/cloudinary.js";

// Controller for upload video
export const uploadVideo = async (req, res) => {
    try {
        const { title, description, uploaderId, channelId } = req.body;

        // Check if user is exist who uploaded the video
        const user = await User.findById(uploaderId);
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        // Check channel exist
        const channel = await Channel.findById(channelId);
        if (!channel) {
            return res.status(404).json({ message: "Channel not found" })
        }

        // Get video file
        const videoFile = req.files["video"][0];

        if (!videoFile) {
            return res.status(400).json({ message: "No video file provided" })
        }

        // Set video Url getting
        const videoUrl = videoFile.path;

        // If the thumbnail is not provided for the video then set a custom thumbnail that is the snapshot of the video as a image
        const thumbnailUrl = req.files["thumbnail"] ? req.files["thumbnail"][0].path : videoUrl.replace("/upload/", "/upload/w_300,h_200,so_1/f_jpg/");

        // Get publicId of video
        const publicId = videoFile.filename;

        // Get the video Metadata from cloudinary of the uploaded video
        const videoMetadata = await cloudinary.api.resource(publicId, {
            resource_type: "video",
            media_metadata: true
        });

        // Set duration for the video that we get from video metadata from cloudinary
        const duration = Math.floor(videoMetadata.duration);

        const newVideo = new Video({
            title,
            description,
            videoUrl,
            thumbnailUrl,
            duration,
            uploader: uploaderId,
            channelId
        });

        await newVideo.save();

        // Push videoId in user's uploadedVideos array who uploaded video
        user.uplodedVideos.push(newVideo._id);
        await user.save();

        // Push videoId in channel's video array to identify the channel videos
        channel.videos.push(newVideo._id);
        await channel.save();

        res.status(200).json({ message: "Video uploaded successfully", video: newVideo })
    } catch (err) {
        res.status(500).json({ message: "Internal server error", error: err.message })
    }
}

// Get video by its id
export const getVideoById = async (req, res) => {
    try {
        const { videoId } = req.params;

        // Logic for update the video view when this controller called
        const video = await Video.findByIdAndUpdate(
            videoId,
            // Increment the video views by 1
            { $inc: { views: 1 } },
            // Return the new updated video
            { new: true }
            // Populate channelId of video to get channelId, name avatar and subscribers 
        ).populate("channelId", "_id channelName avatarUrl subscribers");

        if (!video) {
            return res.status(404).json({ message: "Video not found" });
        }

        res.status(200).json({ message: "Video fetched", video: video })

    } catch (err) {
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
}

// Controller for get channel videos
export const getChannelVideos = async (req, res) => {
    try {
        const { channelId } = req.params;
        // const { page = 1, limit = 10 } = req.query;

        // Find the videos that has channelId ad requested, sort by latest
        const videos = await Video.find({ channelId })
            .select("_id title thumbnailUrl views uploadDate")
            .sort({ uploadDate: -1 })
        // .skip((page - 1) * limit)
        // .limit(Number(limit));

        res.status(200).json({
            message: "Videos fetched",
            videos,
            // page: Number(page),
            totalVideos: await Video.countDocuments({ channelId })
        })
    } catch (err) {
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
}

// Controller for delete video
export const deleteVideo = async (req, res) => {
    try {
        const { videoId } = req.params;

        const deletedVideo = await Video.findOneAndDelete({ _id: videoId });

        if (!deletedVideo) {
            res.status(404).json({ message: "Video not found" });
        }

        res.status(200).json({ message: "Video deleted" })
    } catch (err) {
        res.status(500).json({ message: "Internal server error", error: err.message })
    }
}

// Controller for get all videos
export const getAllVideos = async (req, res) => {
    try {
        // const { page = 1, limit = 10 } = req.query;
        const videos = await Video.find().populate("channelId", "_id channelName avatarUrl")
            .sort({ uploadDate: -1 })
        // .skip((page - 1) * limit)
        // .limit(Number(limit));

        return res.status(200).json({
            message: "Videos fetched",
            videos,
            // page: Number(page),
            totalVideos: await Video.countDocuments()
        })
    } catch (err) {
        res.status(500).json({ message: "Internal server error", error: err.message })
    }
}

// Search video not implemented currently
export const searchVideo = async (req, res) => {
    try {
        const { searchTerm, page = 1, limit = 10 } = req.query;

        // Match searchTerm either in title or in description with pagination
        const videos = await Video.find({
            $or: [
                { title: { $regex: searchTerm, $options: "i" } },
                { description: { $regex: searchTerm, $options: "i" } }
            ]
        })
            .select("_id title thumbnailUrl views uploadDate")
            .sort({ uploadDate: -1 })
            .skip((page - 1) * limit)
            .limit(Number(limit))

        if (!videos.length) {
            return res.status(404).json({ message: "No videos found" })
        }

        res.status(200).json({
            message: "Vidoes fetched",
            videos,
            page: Number(page),
            totalVideos: await Video.countDocuments({
                $or: [
                    { title: { $regex: searchTerm, $options: "i" } },
                    { description: { $regex: searchTerm, $options: "i" } }
                ]
            })
        })
    } catch (err) {
        res.status(500).json({ message: "Internal server error", error: err.message })
    }
}

// Controller for like video
export const likeVideo = async (req, res) => {
    try {
        const { videoId } = req.params;
        const { userId } = req.body;

        const video = await Video.findById(videoId);

        if (!video) {
            return res.status(404).json({ message: "Video not found" });
        }

        // If user already liked then remove like either like
        const likeAction = video.likes.includes(userId)
            ? { $pull: { likes: userId } }
            : { $addToSet: { likes: userId } }

        // Remove from dislike and use likeAction
        const updatedVideo = await Video.findByIdAndUpdate(videoId, {
            $pull: { dislikes: userId },
            ...likeAction
        }, { new: true });

        res.status(200).json({ message: "Likes updated", likes: updatedVideo.likes.length, dislikes: updatedVideo.dislikes.length });
    } catch (err) {
        res.status(500).json({ message: "Internal server error", error: err.message })
    }
}

// Controller for dislike video
export const dislikeVideo = async (req, res) => {
    try {
        const { videoId } = req.params;
        const { userId } = req.body;

        const video = await Video.findById(videoId);

        if (!video) {
            return res.status(404).json({ message: "No video found" });
        }

        // If already disliked remove dislike either add dislike
        const dislikeAction = video.dislikes.includes(userId)
            ? { $pull: { dislikes: userId } }
            : { $addToSet: { dislikes: userId } }

        // If liked then remove like and add dislike
        const updatedVideo = await Video.findByIdAndUpdate(videoId, {
            $pull: { likes: userId },
            ...dislikeAction
        }, { new: true });

        res.status(200).json({ message: "Dislikes updated", likes: updatedVideo.likes.length, dislikes: updatedVideo.dislikes.length });
    } catch (err) {
        res.status(500).json({ message: "Internal server error", error: err.message })
    }
}