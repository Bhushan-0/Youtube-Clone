import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import VideoPlayer from "../components/VideoPlayer";
import VideoDetails from "../components/VideoDetails";
import SuggestedVideos from "../components/SuggestedVideos";
import Comments from "../components/Comments";

// Watch video page
function WatchVideo() {
    const { videoId } = useParams();
    const [video, setVideo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Fetch video 
    useEffect(() => {
        const fetchVideo = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/videos/${videoId}`);
                setVideo(response.data.video);
            } catch (err) {
                setError("Failed to fetch video.");
            } finally {
                setLoading(false);
            }
        };

        fetchVideo();
    }, [videoId]);

    if (loading) return <p className="text-center text-md mt-3 mb-5 w-full font-semibold">Loading...</p>;
    if (error) return <p className="text-center text-md mt-3 mb-5 w-full font-semibold text-red-500">{error}</p>;
    if (!video) return <p className="text-center text-md mt-3 mb-5 w-full font-semibold text-gray-500">Video not found</p>;

    return (
        <div className="flex flex-col lg:flex-row gap-6 px-4 py-2 w-full h-[calc(100vh-57px)] overflow-auto">
            {/* Left Section (Video, Details, Comments) */}
            <div className="w-full lg:w-[70%] flex flex-col gap-4">
                <VideoPlayer video={video} />
                <VideoDetails video={video} />
                <Comments videoId={video._id} />
            </div>

            {/* Right Section (Recommended Videos) */}
            <div className="w-full lg:w-[30%]">
                <SuggestedVideos currentVideoId={video._id} />
            </div>
        </div>
    );
}

export default WatchVideo;