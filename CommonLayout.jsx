import { useEffect, useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
import { useLayout } from "../context/LayoutContext.jsx";

// Common layout
function CommonLayout() {

    const { isSidebarCompact, setIsSidebarCompact } = useLayout();
    const [screenWidth, setScreenWidth] = useState("");

    // Set screen width to handle responsiveness
    useEffect(() => {
        const handleResize = () => {
            setIsSidebarCompact(window.innerWidth < 1280);
            setScreenWidth(window.innerWidth);
        }

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize)
    }, [])

    return (
        <div className="relative h-screen">
            <Header />
            <div
                className={`fixed top-[57px] left-0 h-full bg-white transition-all duration-300 z-50`}
            >
                <Sidebar />
            </div>

            <div className={`flex-1 transition-all duration-300 ${!isSidebarCompact ? "opacity-75" : ""} ${screenWidth < 1280 ? "ml-[75px]" : (screenWidth > 1280 && isSidebarCompact) ? "ml-[75px] opacity-100" : "ml-[230px] opacity-100"}`}>
                <Outlet />
            </div>
        </div>
    );
}

export default CommonLayout;