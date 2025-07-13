import { createChannel, getChannel, subscribeChannel, updateChannel } from "../controllers/channelController.js"
import { uploadChannelAvatar } from "../middleware/upload.js";
import verifyToken from "../middleware/verifyToken.js";

// Channel routes
export default function channelRoutes(app) {
    app.post("/api/create-channel", verifyToken, uploadChannelAvatar, createChannel);
    app.get("/api/channel/:channelId", getChannel);
    app.put("/api/channel/update-channel/:channelId", verifyToken, uploadChannelAvatar, updateChannel);
    app.post("/api/channel/subscribe/:channelId", subscribeChannel);
}