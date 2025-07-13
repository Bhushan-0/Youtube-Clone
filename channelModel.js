import mongoose from "mongoose";

// Channel model
const channelSchema = new mongoose.Schema({
    channelName: {
        type: String,
        required: true
    },
    avatarUrl: {
        type: String
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    description: {
        type: String
    },
    subscribers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    videos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video"
    }]
})

const Channel = mongoose.model("Channel", channelSchema);

export default Channel;