import axios from "axios";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

// Upload video page
function UploadVideo() {
    const navigate = useNavigate();

    const { data: userData, token } = useSelector(state => state.auth.user);

    const [loading, setLoading] = useState(false);
    const [videoFile, setVideoFile] = useState(null);
    const [thumbnailFile, setThumbnailFile] = useState(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [previewVideo, setPreviewVideo] = useState(null);
    const [previewThumbnail, setPreviewThumbnail] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (e.target.name === "video") {
                setVideoFile(file);
                setPreviewVideo(URL.createObjectURL(file));
            } else if (e.target.name === "thumbnail") {
                setThumbnailFile(file);
                setPreviewThumbnail(URL.createObjectURL(file));
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const config = {
            headers: { Authorization: `Bearer ${token}` }
        }

        try {
            setLoading(true);

            if (!videoFile || !title.trim() || !description.trim()) {
                alert("Please fill all required fields!");
                return;
            }

            const formData = new FormData();
            formData.append("uploaderId", userData._id);
            formData.append("channelId", userData.channel);
            formData.append("title", title);
            formData.append("description", description);
            formData.append("video", videoFile);
            if (thumbnailFile) formData.append("thumbnail", thumbnailFile);

            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/upload-video`, formData, config);
            
            // Navigate home after video upload
            navigate("/home");
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full h-[calc(100vh-57px)] overflow-auto">

            <div className="max-w-3xl mx-auto p-6 my-4">
                <h2 className="text-2xl font-bold mb-4">Upload Video</h2>
                <form onSubmit={handleSubmit} className="space-y-4">

                    <div>
                        <label className="block font-medium">Select Video *</label>
                        {/* Preview for selected video */}
                        {(videoFile && previewVideo) && <video className="mt-2 w-[200px] rounded-lg" src={previewVideo} controls />}
                        <input type="file" name="video" accept="video/*" onChange={handleFileChange} className="mt-2 border border-gray-200 p-2 w-full rounded-md cursor-pointer" required />
                    </div>

                    <div>
                        <label className="block font-medium">Upload Thumbnail (Optional)</label>
                        {/* Preview for selected thumbnail */}
                        {(thumbnailFile && previewThumbnail) && <img className="mt-2 w-[200px] object-cover rounded-lg" src={previewThumbnail} alt="Thumbnail Preview" />}
                        <input type="file" name="thumbnail" accept="image/*" onChange={handleFileChange} className="mt-2 border border-gray-200 p-2 w-full rounded-md cursor-pointer" />
                    </div>

                    <div>
                        <label className="block font-medium">Video Title *</label>
                        <input type="text" className="w-full mt-2 p-2 border border-gray-300 rounded-md" placeholder="Enter video title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                    </div>

                    <div>
                        <label className="block font-medium">Video Description *</label>
                        <textarea className="w-full mt-2 p-2 border border-gray-300 rounded-md" placeholder="Enter video description" value={description} onChange={(e) => setDescription(e.target.value)} rows="3" required></textarea>
                    </div>

                    <button disabled={loading} type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md cursor-pointer w-full disabled:opacity-50 disabled:cursor-not-allowed">
                        {loading ? "Uploading your video please wait..." : "Upload Video"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default UploadVideo;