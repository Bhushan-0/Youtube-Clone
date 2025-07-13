import { BiLike, BiDislike, BiSolidLike, BiSolidDislike } from "react-icons/bi";
import { useState } from "react";
import axios from "axios";
import user from "../assets/user.svg"
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile } from "../store/slices/authSlice";
import { useNavigate } from "react-router-dom";

// Video Details component
function VideoDetails({ video }) {
    const [likes, setLikes] = useState(video.likes?.length);
    const [dislikes, setDislikes] = useState(video.dislikes?.length);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { data: userData, token } = useSelector(state => state.auth.user);

    // Check if user subscribed to the channel
    const [isSubscribed, setIsSubscribed] = useState(userData?.subscribedChannels?.includes(video.channelId?._id));
    const [isLiked, setIsLiked] = useState(video.likes?.includes(userData._id));
    const [isDisliked, setIsDisliked] = useState(video.dislikes?.includes(userData._id));
    const [totalSubscribers, setTotalSubscribers] = useState(video?.channelId?.subscribers.length);

    // Function for handle like
    const handleLike = async () => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/like-video/${video._id}`, { userId: userData._id });
            setLikes(response?.data?.likes);
            setDislikes(response?.data?.dislikes);

            // Handle like and dislike states locally avoiding API call after like update
            if (isLiked) {
                setIsLiked(false);
            } else {
                setIsLiked(true);
                setIsDisliked(false);
            }
        } catch (err) {
            console.error("Error liking video", err);
        }
    };

    // Function for dislike
    const handleDislike = async () => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/dislike-video/${video._id}`, { userId: userData._id });
            setLikes(response?.data?.likes);
            setDislikes(response?.data?.dislikes);

            if (isDisliked) {
                setIsDisliked(false);
            } else {
                setIsDisliked(true);
                setIsLiked(false);
            }
        } catch (err) {
            console.error("Error disliking video", err);
        }
    };

    // Function for subscribing the channel
    const handleSubscribe = async () => {
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/api/channel/subscribe/${video.channelId?._id}`, { userId: userData._id });
            dispatch(fetchUserProfile());

            // Handle subscribed and count state locally to avoid API call when subscribe or unsubscribe 
            if (isSubscribed) {
                setTotalSubscribers(totalSubscribers - 1);
            } else {
                setTotalSubscribers(totalSubscribers + 1);
            }
            setIsSubscribed(!isSubscribed);
        } catch (err) {
            console.log("Error subscribing channel", err)
        }
    }

    return (
        <div>
            <h2 className="text-xl font-bold">{video.title}</h2>

            <div className="flex items-center gap-3 mt-3">
                <div className="flex-shrink-0 cursor-pointer" onClick={() => navigate(`/channel/${video.channelId._id}`)}>
                    <img
                        src={video.channelId?.avatarUrl ? video.channelId.avatarUrl : user}
                        alt="channel-avatar"
                        className="w-12 h-12 rounded-full object-cover"
                    />
                </div>
                <div className="flex flex-col cursor-pointer" onClick={() => navigate(`/channel/${video.channelId._id}`)}>
                    {
                        video.channelId?.channelName && <p className="text-[17px] font-semibold">{video.channelId?.channelName || "Unknown Channel"}</p>
                    }
                    <p className="text-[15px] text-gray-600">{totalSubscribers} subscribers</p>
                </div>
                <div className="ml-1">
                    <button
                        onClick={handleSubscribe}
                        className={`px-4 py-2 cursor-pointer rounded-lg text-white font-semibold ${isSubscribed ? "bg-gray-500 hover:bg-gray-600" : "bg-red-500 hover:bg-red-600"}`}
                    >
                        {isSubscribed ? "Unsubscribe" : "Subscribe"}
                    </button>
                </div>
                <div className="flex bg-gray-200 rounded-lg overflow-hidden">
                    <button className="flex items-center p-2 gap-2 hover:bg-gray-300 cursor-pointer pr-3 border-r border-gray-300" onClick={handleLike}>
                        {isLiked ? <BiSolidLike size={24} /> : <BiLike size={24} />} {likes}
                    </button>
                    <button className="flex items-center gap-2 p-2 hover:bg-gray-300 cursor-pointer pl-3" onClick={handleDislike}>
                        {isDisliked ? <BiSolidDislike size={24} /> : <BiDislike size={24} />} {dislikes}
                    </button>
                </div>
            </div>

            <div className="mt-4 rounded-lg bg-gray-200 p-3">
                <p className="text-[15px] font-semibold">{video.views} views <span className="ml-2">{new Date(video.uploadDate).toDateString().split(" ").slice(-3).join(" ")}</span></p>
                <p className=" text-gray-700">{video.description}</p>
            </div>
        </div>
    );
}

export default VideoDetails;
