import { createContext, useContext, useState } from "react";

const LayoutContext = createContext();

// Context for managing sidebar state and searchterm
export const LayoutProvider = ({ children }) => {
    const [isSidebarCompact, setIsSidebarCompact] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    return (
        <LayoutContext.Provider value={{ isSidebarCompact, setIsSidebarCompact, searchTerm, setSearchTerm }}>
            {children}
        </LayoutContext.Provider>
    );
};

export const useLayout = () => useContext(LayoutContext);