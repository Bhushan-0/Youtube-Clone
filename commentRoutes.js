import { createComment, deleteCommentById, getCommentsByVideo } from "../controllers/commentController.js";

// Comment routes
export default function commentRoutes(app) {
    app.post("/api/comments/add", createComment);
    app.get("/api/comments/:videoId", getCommentsByVideo);
    app.delete("/api/delete-comment/:commentId", deleteCommentById);
}