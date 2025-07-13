import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchVideos } from "../store/slices/videoSlice";
import VideoCard from "../components/VideoCard";
import { useLayout } from "../context/LayoutContext.jsx";

function Home() {
    const dispatch = useDispatch();
    const { videos = [] } = useSelector(state => state.videos.videos);
    const [filteredVideos, setFilteredVideos] = useState(videos);
    const { loading, error } = useSelector(state => state.videos);
    const [selectedFilter, setSelectedFilter] = useState("All");

    const { searchTerm, isSidebarCompact } = useLayout();

    // Filters array
    const filters = ["All", "Trending", "Coding", "React", "Javascript", "Node", "MongoDB", "Programming", "SQL", "Database", "Tailwind", "CSS", "C++", "Animation", "MySQL", "Express"]

    useEffect(() => {
        // Dispatch the fetchVideos slice
        dispatch(fetchVideos());
    }, [dispatch]);

    useEffect(() => {
        let updatedVideos = videos;

        // Filter videos based on searchTerm
        if (searchTerm) {
            updatedVideos = updatedVideos.filter(video =>
                video?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                video?.description?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filter videos based on selected filter
        if (selectedFilter !== "All") {
            updatedVideos = updatedVideos.filter(video =>
                video?.title?.toLowerCase().includes(selectedFilter.toLowerCase()) ||
                video?.description?.toLowerCase().includes(selectedFilter.toLowerCase())
            );
        }

        setFilteredVideos(updatedVideos);
    }, [searchTerm, videos, selectedFilter]);


    return (
        <div className="px-4 py-1 w-full h-[calc(100vh-57px)] overflow-auto">
            {
                loading && <div className="text-center text-md mt-3 mb-5 w-full font-semibold">Fetching latest videos...</div>
            }
            {!loading && (
                <div className="bg-white flex gap-2 items-center w-full overflow-y-auto h-[50px] no-scrollbar">
                    {filters.map((filter, index) => (
                        <div
                            key={index}
                            className={`cursor-pointer rounded-md px-3 py-1 font-semibold text-[15px] transition-all duration-200 ${selectedFilter === filter ? "bg-black text-white" : "bg-gray-100 hover:bg-gray-200"
                                }`}
                            onClick={() => setSelectedFilter(filter)}
                        >
                            {filter}
                        </div>
                    ))}
                </div>
            )}
            {filteredVideos?.length > 0 ? (
                <div className={`grid gap-5 grid-cols-1 md:grid-cols-2 mt-1 lg:grid-cols-3 ${isSidebarCompact ? "xl:grid-cols-4" : "xl:grid-cols-3"}`}>
                    {filteredVideos?.map((video) => <VideoCard key={video._id} video={video} />)}
                </div>
            ) : (
                !loading && <div className="text-center text-md mt-3 mb-5 w-full font-semibold">No videos found</div>
            )}
        </div>
    );
}

export default Home;