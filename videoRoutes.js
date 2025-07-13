import { deleteVideo, dislikeVideo, getAllVideos, getChannelVideos, getVideoById, likeVideo, searchVideo, uploadVideo } from "../controllers/videoController.js";
import { uploadVideoAndThumbnail } from "../middleware/upload.js";
import verifyToken from "../middleware/verifyToken.js";

// Video routes
export default function videoRoutes(app) {
    app.post("/api/upload-video", verifyToken, uploadVideoAndThumbnail, uploadVideo);
    app.delete("/api/delete-video/:videoId", verifyToken, deleteVideo);
    app.get("/api/videos", getAllVideos);
    app.get("/api/videos/:videoId", getVideoById);

    app.post("/api/like-video/:videoId", likeVideo);
    app.post("/api/dislike-video/:videoId", dislikeVideo);

    app.get("/channel/videos/:channelId", getChannelVideos);
    app.get("/videos/search", searchVideo);
}