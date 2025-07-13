import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile } from "../store/slices/authSlice";
import userImg from "../assets/user.svg";
import axios from "axios";

// Account page
function Account() {
    const dispatch = useDispatch();
    const { data: userData, token } = useSelector(state => state.auth.user);

    const [loading, setLoading] = useState(false);

    const [newAvatar, setNewAvatar] = useState(null);
    const [preview, setPreview] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [updatedName, setUpdatedName] = useState(userData?.userName);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNewAvatar(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    // Handle profile update
    const handleUpdate = async () => {

        const config = {
            headers: { Authorization: `Bearer ${token}` }
        }

        try {
            setLoading(true);
            const formData = new FormData();
            formData.append("userName", updatedName);
            if (newAvatar) {
                formData.append("userAvatar", newAvatar);
            }
            const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/user/update-profile/${userData._id}`, formData, config);
            dispatch(fetchUserProfile());
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
            setPreview(null);
            setNewAvatar(null);
        }

        setIsEditing(false);
    };

    return (
        <div className="max-w-xl mx-auto mt-10 p-6">
            <h2 className="text-2xl font-bold text-center mb-5">Your Account</h2>

            <div className="flex flex-col items-center">

                <label className="relative cursor-pointer">
                    {
                        isEditing && <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                    }
                    <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                        {preview || userData?.userAvatar ? (
                            <img src={preview || userData.userAvatar} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <img src={userImg} alt="Profile" className="w-full h-full object-cover" />
                        )}
                    </div>
                </label>
                {
                    isEditing && <p className="text-sm text-gray-500 mt-2">Click to change profile picture</p>
                }

                <div className="w-full mt-5">
                    <div className="mb-3">
                        <label className="block font-medium">Username</label>
                        {isEditing ? (
                            <input
                                type="text"
                                className="w-full p-2 border border-gray-300 rounded-md"
                                value={updatedName}
                                onChange={(e) => setUpdatedName(e.target.value)}
                            />
                        ) : (
                            <p className="p-2 border border-gray-300 rounded-md">{userData?.userName}</p>
                        )}
                    </div>

                    <div className="mb-3">
                        <label className="block font-medium">Email</label>
                        <p className="p-2 border border-gray-300 rounded-md bg-gray-100">{userData?.email}</p>
                    </div>
                </div>

                <div className="mt-5 flex space-x-3">
                    {isEditing ? (
                        <>
                            <button onClick={handleUpdate} className="px-4 py-2 bg-blue-600 text-white rounded-md cursor-pointer">
                                {loading ? "Saving..." : "Save Changes"}
                            </button>
                            <button onClick={() => {
                                setIsEditing(false);
                                setPreview(null);
                                setNewAvatar(null);
                            }} className="px-4 py-2 bg-gray-400 text-white rounded-md cursor-pointer">
                                Cancel
                            </button>
                        </>
                    ) : (
                        <button onClick={() => setIsEditing(true)} className="px-4 py-2 bg-blue-600 text-white rounded-md cursor-pointer">
                            Edit Profile
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Account;