import Comment from "../models/commentModel.js";
import Video from "../models/videoModel.js";

// Controller for create comment
export const createComment = async (req, res) => {
    try {
        const { videoId, userId, text } = req.body;

        const video = await Video.findById(videoId);
        if (!video) {
            return res.status(404).json({ message: "Video not found" });
        }

        const newComment = new Comment({
            text,
            videoId,
            userId,
        })
        await newComment.save();

        // Add the new added comment id in the vidoes comments array to identify the video comments
        video.comments.push(newComment._id);
        await video.save();

        res.status(200).json({ message: "Comment added", comment: newComment });
    } catch (err) {
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
}

// Controller for get all comments for specific video
export const getCommentsByVideo = async (req, res) => {
    try {
        const { videoId } = req.params;

        // Find the video and populates its comment array also populate the userId present in comment to get the userName and userAvatar who added the comment
        const video = await Video.findById(videoId).populate({
            path: "comments",

            // Sort the comments to get newly added comments on top
            options: { sort: { timestamp: -1 } },
            populate: { path: "userId", select: "userName userAvatar" }
        })

        if (!video) {
            return res.status(404).json({ message: "No video found" });
        }

        res.status(200).json({ success: true, message: "Comments fetched successfully", data: video.comments });
    } catch (err) {
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
}


// Controller for deleting the comment
export const deleteCommentById = async (req, res) => {
    try {
        const { commentId } = req.params;
        const deletedComment = await Comment.findByIdAndDelete(commentId);
        if (!deletedComment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        // Remove the comment from video document
        await Video.findByIdAndUpdate(deletedComment.videoId, {
            $pull: { comments: commentId }
        });

        res.status(200).json({ message: "Comment deleted" });
    } catch (err) {
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
}