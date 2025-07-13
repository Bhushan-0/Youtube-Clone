import { getUserProfile, loginUser, registerUser, updateProfile } from "../controllers/authController.js"
import { uploadUserAvatar } from "../middleware/upload.js";
import verifyToken from "../middleware/verifyToken.js";

// User routes
export default function authRoutes(app) {
    app.post("/api/user/register", registerUser);
    app.post("/api/user/login", loginUser);
    app.get("/api/user/profile", verifyToken, getUserProfile);
    app.put("/api/user/update-profile/:userId", verifyToken, uploadUserAvatar, updateProfile);
} 