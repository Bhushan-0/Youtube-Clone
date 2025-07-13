import { IoMdHome } from "react-icons/io";
import { MdSubscriptions, MdOutlineSmartDisplay, MdOutlineWatchLater, MdHistory, MdPlaylistPlay, MdLogout } from "react-icons/md";
import { SiYoutubeshorts } from "react-icons/si";
import { BiLike } from "react-icons/bi";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useLayout } from "../context/LayoutContext.jsx";

// Sidebar component
function Sidebar() {

    const { data: userData } = useSelector(state => state?.auth?.user);
    const location = useLocation();

    const { isSidebarCompact } = useLayout();

    const navItems = [
        { name: "Home", accessor: "/home", icon: <IoMdHome size={25} />, path: "/home" },
        { name: "Shorts", accessor: "/shots", icon: <SiYoutubeshorts size={23} />, path: "/home" },
        { name: "Subscriptions", accessor: "/subscriptions", icon: <MdSubscriptions size={22} />, path: "/subscriptions" },
        { name: "History", accessor: "/history", icon: <MdHistory size={25} />, path: "/home" },
        { name: "Playlists", accessor: "/playlist", icon: <MdPlaylistPlay size={26} />, path: "/home" },
        // Show channel link only when user has channel
        userData?.channel && { name: "Your videos", accessor: "/channel", icon: <MdOutlineSmartDisplay size={22} />, path: `/channel/${userData?.channel}` },
        { name: "Watch later", accessor: "/watch-later", icon: <MdOutlineWatchLater size={24} />, path: "/home" },
        { name: "Liked videos", accessor: "/liked", icon: <BiLike size={24} />, path: "/home" },
    ].filter(Boolean);

    return (
        <div style={{ width: isSidebarCompact ? "75px" : "230px" }} className={`transition-all ease-in-out duration-300 px-3 h-[calc(100vh-57px)] overflow-hidden`}>
            <ul className="py-2">
                {navItems.map((item, index) => (
                    <div key={item.name}>
                        <li>
                            <Link to={item.path} className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-200 ${location.pathname.includes(item.accessor) ? "bg-gray-100" : ""}`}>
                                <div className="w-[17%]">
                                    {item.icon}
                                </div>
                                <span
                                    className={`whitespace-nowrap transition-all duration-200 ease-in-out ${isSidebarCompact
                                        ? "opacity-0"
                                        : "opacity-100"
                                        }`}
                                >
                                    {item.name}
                                </span>
                            </Link>
                        </li>

                        {/* Show line after 3 links  */}
                        {(index + 1) % 3 === 0 && index !== navItems.length - 1 && (
                            <hr className="my-2 border-t border-gray-200" />
                        )}
                    </div>
                ))}
            </ul>
        </div>
    );
}

export default Sidebar;