import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile } from "../store/slices/authSlice";

// Modal for create channel
function CreateChannelModal({ isOpen, onClose, isEditting, channel, fetchChannelData }) {
    const [channelName, setChannelName] = useState(channel ? channel.channelName : "");
    const [description, setDescription] = useState(channel ? channel?.description : "");
    const [avatar, setAvatar] = useState(channel ? channel.avatarUrl : null);
    const [preview, setPreview] = useState(channel ? channel.avatarUrl : null);
    const [isLoading, setIsLoading] = useState(false);

    const { data: userData, token } = useSelector(state => state.auth.user);
    const dispatch = useDispatch();

    // Reset states
    useEffect(() => {
        if (isOpen) {
            setChannelName(channel?.channelName || "");
            setDescription(channel?.description || "");
            setAvatar(channel?.avatarUrl || null);
            setPreview(channel?.avatarUrl || null);
        }
    }, [isOpen, channel]);

    // Onchange for for handling
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatar(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    // Handle submit function for create channel
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!channelName) return alert("Channel name is required!");

        const formData = new FormData();
        formData.append("userId", userData._id);
        formData.append("channelName", channelName);
        formData.append("description", description);
        if (avatar) {
            formData.append("channelAvatar", avatar);
        }

        const config = {
            headers: { Authorization: `Bearer ${token}` }
        }

        let apiEndPoint = "";

        // Check that we are editing the channel or adding the channel to select the API endpoint according to that
        if (isEditting) {
            apiEndPoint = `${import.meta.env.VITE_API_URL}/api/channel/update-channel/${userData?.channel}`
        } else {
            apiEndPoint = `${import.meta.env.VITE_API_URL}/api/create-channel`
        }

        try {
            setIsLoading(true);
            if (isEditting) {
                const response = await axios.put(apiEndPoint, formData, config);
            } else {
                const response = await axios.post(apiEndPoint, formData, config);
            }
            
            // Fetch user pofile again when we create or edit channel
            dispatch(fetchUserProfile());
            
            if (isEditting) {
                // Fetch channel data again if we edited channel
                fetchChannelData();
            }
        } catch (err) {
            console.log(err);
        } finally {
            setIsLoading(false);
        }

        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className={`fixed inset-0 z-100 flex items-center justify-center backdrop-blur-xs`} onClick={onClose}>
            <div className="bg-white w-[400px] p-5 rounded-lg shadow-lg" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-xl font-bold mb-4">
                    {
                        isEditting ? "Edit channel" : "Create Your Channel"
                    }
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">

                    <div className="flex flex-col items-center">
                        <label className="cursor-pointer">
                            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                            <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                                {preview ? (
                                    <img src={preview} alt="Avatar Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-gray-500">+</span>
                                )}
                            </div>
                        </label>
                        <p className="text-sm text-gray-500 mt-1">Select Picture</p>
                    </div>

                    <div>
                        <label className="block font-medium">Channel Name</label>
                        <input
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded-md"
                            placeholder="Enter channel name"
                            value={channelName}
                            onChange={(e) => setChannelName(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block font-medium">Description</label>
                        <textarea
                            className="w-full p-2 border border-gray-300 rounded-md"
                            placeholder="Describe your channel"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows="3"
                        ></textarea>
                    </div>

                    <div className="flex justify-end space-x-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded-md cursor-pointer">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md cursor-pointer">
                            {
                                isLoading ? "Loading..." : isEditting ? "Update" : "Create"
                            }
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateChannelModal;