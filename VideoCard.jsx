import { Link, useNavigate } from "react-router-dom";
import user from "../assets/user.svg";
import { useSelector } from "react-redux";
import { MdDeleteSweep } from "react-icons/md";
import axios from "axios";
import { useState } from "react";
import ConfirmationModal from "./ConfirmationModal";

// Video card component
function VideoCard({ video, showDelete, fetchChannelData }) {

    // Format duration function
    function formatDuration(durationInSeconds) {
        const minutes = Math.floor(durationInSeconds / 60);
        const seconds = durationInSeconds % 60;
        return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    }

    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [deleteId, setDeleteId] = useState("");

    const navigate = useNavigate();

    const { data: userData, token } = useSelector(state => state.auth?.user);

    // Function for delete video
    const handleDeleteVideo = async () => {
        if (!deleteId) return;
        try {
            setLoading(true);
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            }

            const response = await axios.delete(`${import.meta.env.VITE_API_URL}/api/delete-video/${deleteId}`, config);

            // Fetch channel data again after deleting video
            fetchChannelData();
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="w-full overflow-hidden transition duration-300 cursor-pointer">
            <Link to={`/watch/${video._id}`} className="relative">
                <div className="w-full rounded-lg overflow-hidden aspect-video bg-gray-200">
                    <img
                        src={video.thumbnailUrl}
                        alt={video.title}
                        className="w-full h-full object-cover"
                    />
                </div>

                {video.duration && (
                    <span className="absolute bottom-2 right-2 bg-black opacity-80 text-white text-xs font-semibold px-2 py-1 rounded">
                        {formatDuration(video?.duration)}
                    </span>
                )}

                {
                    loading && (
                        <span className="absolute h-full top-0 w-full bg-gray-200 opacity-80 text-black font-semibold rounded flex items-center justify-center">
                            Deleting your video...
                        </span>
                    )
                }
            </Link>

            <div className="p-3 flex gap-3">
                {
                    video.channelId?.avatarUrl && <div className="flex-shrink-0" onClick={() => navigate(`/channel/${video?.channelId?._id}`)}>
                        <img
                            src={video.channelId?.avatarUrl ? video.channelId.avatarUrl : user}
                            alt="channel-avatar"
                            className="w-10 h-10 rounded-full object-cover"
                        />
                    </div>
                }

                <div className="flex flex-col w-full" onClick={() => navigate(`/watch/${video._id}`)}>
                    <h3 className="text-lg font-semibold line-clamp-2">{video.title}</h3>
                    {
                        video.channelId?.channelName && <p className="text-sm text-gray-600">{video.channelId?.channelName || "Unknown Channel"}</p>
                    }
                    <p className="text-sm text-gray-500">{video.views} views • {new Date(video.uploadDate).toDateString()}</p>
                </div>

                {/* Show delete button only when the channel belongs to user or uploaded by that user */}
                <div className="flex">
                    {
                        (showDelete && userData?._id === video?.uploader) &&
                        <MdDeleteSweep size={40} color="#ff333d" className="cursor-pointer hover:bg-gray-200 rounded-full p-2"
                            onClick={() => {
                                setIsModalOpen(true);
                                setDeleteId(video._id);
                            }}
                        />
                    }
                </div>
            </div>

            {/* Confirm video delete modal */}
            <ConfirmationModal
                isOpen={isModalOpen}
                message={"Do you want to delete this video?"}
                onClose={() => { setIsModalOpen(false) }}
                callbackFunction={handleDeleteVideo}
            />
        </div>
    );
}

export default VideoCard;