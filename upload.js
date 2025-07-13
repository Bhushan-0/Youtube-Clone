import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

// Storage setup for video in cloudinary
const videoStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "youtube-clone/videos",
        resource_type: "video",
        format: "mp4"
    }
});

// Storage for video thumbnail in cloudinary
const thumbnailStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "youtube-clone/thumbnails",
        resource_type: "image",
        allowedFormats: ["jpg", "jpeg", "png"]
    }
});

// Channel avatar storage
const channelAvatarStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "youtube-clone/channelAvatar",
        resource_type: "image",
        allowedFormats: ["jpg", "jpeg", "png"]
    }
})

// User avatar storage
const userAvatarStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "youtube-clone/userAvatar",
        resource_type: "image",
        allowedFormats: ["jpg", "jpeg", "png"]
    }
})

// Select custom storage for either video or eithe thumnbail because we adding video and thumbnail in single api
const customStorage = {
    _handleFile: function (req, file, cb) {
        let storage;
        if (file.fieldname === "video") {
            storage = videoStorage;
        } else if (file.fieldname === "thumbnail") {
            storage = thumbnailStorage;
        } else {
            return cb(new Error("Unexpected field"));
        }
        storage._handleFile(req, file, cb);
    }
};

// Create multer instance with custom storage
export const uploadVideoAndThumbnail = multer({
    storage: customStorage,
}).fields([
    { name: "video", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
]);

// Multer instance for upload channel avatar
export const uploadChannelAvatar = multer({
    storage: channelAvatarStorage,
}).single("channelAvatar")

// Multer instance for upload user avatar
export const uploadUserAvatar = multer({
    storage: userAvatarStorage,
}).single("userAvatar");