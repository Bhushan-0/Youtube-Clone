import bcrypt from "bcryptjs";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import cloudinary from "../config/cloudinary.js";

// Controller for register user
export const registerUser = async (req, res) => {
    try {
        const { userName, email, password } = req.body;

        //  Store hashed password
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = new User({
            userName: userName,
            email: email,
            password: hashedPassword
        })

        await user.save();
        res.status(200).json({ message: "User registered sucessfully" });
    } catch (err) {
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
}

// Controller for login user
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        // Compare password
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: "Invalid username or password" });
        }

        // Create token for user
        const token = jwt.sign({
            userId: user._id,
            email: user.email
        }, "secret", { expiresIn: "24h" });
        res.status(200).json({ message: "User login successful", token: token })
    } catch (err) {
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
}

// Controller for get user profile
export const getUserProfile = async (req, res) => {
    try {
        const { userId } = req.user;

        const user = await User.findById(userId).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found", error: err.message });
        }

        res.status(200).json({ message: "User profile fetched", user })
    } catch (err) {
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
}

// Controller for update user profile
export const updateProfile = async (req, res) => {
    try {
        const { userId } = req.params;
        const { userName } = req.body;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Logic for change user avatar
        if (req.file) {
            if (user.userAvatar) {
                try {

                    // Extract old avatar public id for deleting the avatar from cloudinary
                    const avatarPublicId = user.userAvatar.split("/").pop().split(".")[0];

                    // Delete avatar from cloudinary storage
                    await cloudinary.uploader.destroy(`youtube-clone/userAvatar/${avatarPublicId}`, { resource_type: "image" })
                } catch (err) {
                    console.log(err.message);
                }
            }

            // Set updated avatar
            user.userAvatar = req.file.path;
        }

        if (userName) {
            user.userName = userName;
        }

        await user.save();

        res.status(200).json({ message: "User profile image updated", user })
    } catch (err) {
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
}