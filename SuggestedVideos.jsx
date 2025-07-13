import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

// Suggested videos component
function SuggestedVideos({ currentVideoId }) {
    const { videos = [] } = useSelector(state => state.videos?.videos);

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-bold">Recommended Videos</h3>
            {/* Do not show current playing video */}
            {videos?.filter(video => video._id !== currentVideoId)?.map((video) => (
                <Link to={`/watch/${video._id}`} key={video._id} className="flex gap-2">
                    <img src={video.thumbnailUrl} className="w-34 h-20 object-cover rounded-md" alt="thumbnail" />
                    <div>
                        <h4 className="text-sm font-semibold">{video.title}</h4>
                        <p className="text-xs text-gray-600">{video.channelId.channelName}</p>
                    </div>
                </Link>
            ))}
        </div>
    );
}

export default SuggestedVideos;