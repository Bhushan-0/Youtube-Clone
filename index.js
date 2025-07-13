import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import channelRoutes from "./routes/channelRoutes.js";
import videoRoutes from "./routes/videoRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() =>
    console.log("MongoDB connected successfully")
).catch((err) =>
    console.log("MongoDB connection error: ", err)
)

app.get("/", (req, res) => {
    res.status(200).json({ message: "Youtube Clone Server Running..." })
})

app.listen(PORT, () => console.log(`Server running on PORT: ${PORT}`));

authRoutes(app);
channelRoutes(app);
videoRoutes(app);
commentRoutes(app);