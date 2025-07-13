import mongoose from "mongoose";

// User model
const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    userAvatar: {
        type: String
    },
    channel: {
        type: mongoose.Schema.Types.ObjectId, ref: "Channel"
    },
    uplodedVideos: [{
        type: mongoose.Schema.Types.ObjectId, ref: "Video"
    }],
    subscribedChannels: [{
        type: mongoose.Schema.Types.ObjectId, ref: "Channel"
    }]
})

const User = mongoose.model("User", userSchema);

export default User;