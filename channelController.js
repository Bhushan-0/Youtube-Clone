import cloudinary from "../config/cloudinary.js";
import Channel from "../models/channelModel.js";
import User from "../models/userModel.js";


// Controller for create channel
export const createChannel = async (req, res) => {
    try {
        const { userId, channelName, description } = req.body;

        let avatarUrl = "";

        if (req.file) {
            avatarUrl = req.file.path;
        }

        const user = await User.findById(userId);
        if (user.channel) {
            return res.status(400).json({ message: "User already has a channel" });
        }

        const newChannel = new Channel({
            channelName,
            owner: userId,
            description,
            avatarUrl
        })

        await newChannel.save();

        // Set channel ID in user document who created the channel
        user.channel = newChannel._id;
        await user.save();

        res.status(201).json({
            message: "Channel created",
            channel: newChannel
        })
    } catch (err) {
        res.status(500).json({ message: "Internal server error", error: err.message })
    }
}

// Controller for subscribe the channel
export const subscribeChannel = async (req, res) => {
    try {

        const { channelId } = req.params;
        const { userId } = req.body;

        const channel = await Channel.findById(channelId);
        if (!channel) {
            return res.status(404).json({ message: "Channel not found" })
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        // Check if the channel is already subscribed by the user
        if (channel.subscribers.includes(userId)) {

            // If the channel is subscribed then remove the subscription
            // Remove the user ID from channel subscribers
            await Channel.findByIdAndUpdate(channelId, { $pull: { subscribers: userId } });

            // Remove channel ID from users subscribedChannels array
            await User.findByIdAndUpdate(userId, { $pull: { subscribedChannels: channelId } });

            return res.status(200).json({ message: "Channel unsubscribed" })
        } else {

            // If channel is not subscribed previously then subscribe
            await Channel.findByIdAndUpdate(channelId, { $addToSet: { subscribers: userId } });
            await User.findByIdAndUpdate(userId, { $addToSet: { subscribedChannels: channelId } });

            return res.status(200).json({ message: "Channel subscribed" });
        }

    } catch (err) {
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
}

// Controller for updating the channel info
export const updateChannel = async (req, res) => {
    try {
        const { channelId } = req.params;
        const { channelName, description } = req.body;

        const channel = await Channel.findById(channelId);

        if (!channel) {
            return res.status(404).json({ message: "Channel not found" })
        }

        // If user selected new avatar for channal
        if (req.file) {
            if (channel.avatarUrl) {
                try {

                    // Delete previous channel avatar
                    const avatarPublicId = channel.avatarUrl.split("/").pop().split(".")[0];
                    await cloudinary.uploader.destroy(`youtube-clone/channelAvatar/${avatarPublicId}`, { resource_type: "image" })
                } catch (err) {
                    console.log(err.message);
                }
            }

            // Add new avatar url
            channel.avatarUrl = req.file.path;
        }

        if (channelName) {
            channel.channelName = channelName
        }

        if (description) {
            channel.description = description
        }

        await channel.save();

        res.status(200).json({ message: "Channel updated", channel });

    } catch (err) {
        res.status(500).json({ message: "Internal server error", error: err.message })
    }
}

// Controller for get Channel info
export const getChannel = async (req, res) => {
    try {
        const { channelId } = req.params;

        // Populates videos of channel and for each video gives us _id, title, thumbnail, duration, views, uploadedDate and uploader
        const channel = await Channel.findById(channelId).populate("videos", "_id title thumbnailUrl duration views uploadDate uploader");

        if (!channel) {
            return res.status(404).json({ message: "Channel not found" })
        }

        res.status(200).json({ message: "Channel info fetched", data: channel });
    } catch (err) {
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
}