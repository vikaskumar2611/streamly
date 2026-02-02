import React from "react";
import { NavLink } from "react-router-dom";
import useAuth from "../hooks/useAuth.hooks";

const Sidebar = ({ isOpen, onClose }) => {
    const { user } = useAuth();

    const navSections = [
        {
            title: "Menu",
            items: [
                { name: "Home", path: "/home", icon: "🏠" },
                { name: "Dashboard", path: "/dashboard", icon: "📊" },
            ],
        },
        {
            title: "You",
            items: [
                {
                    name: "My Channel",
                    path: `/c/${user?.username || "me"}`,
                    icon: "👤",
                },
                { name: "History", path: "/history", icon: "🕒" },
                { name: "Playlists", path: "/playlists", icon: "📂" },
            ],
        },
        {
            title: "Creator Studio",
            items: [{ name: "Upload Video", path: "/upload", icon: "⬆️" }],
        },
        {
            title: "Account",
            items: [{ name: "Settings", path: "/settings", icon: "⚙️" }],
        },
    ];

    return (
        <>
            {/* Mobile Overlay */}
            <div
                className={`
                    fixed inset-0 bg-black/50 z-20 lg:hidden
                    transition-opacity duration-300
                    ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}
                `}
                onClick={onClose}
            />

            {/* Sidebar */}
            <aside
                className={`
                    bg-gray-800 border-r border-gray-700 
                    flex flex-col z-30 w-64
                    transition-transform duration-300 ease-in-out
                    
                    /* Mobile: Fixed, slide from left */
                    fixed lg:relative
                    top-0 lg:top-auto
                    left-0
                    h-full
                    pt-16 lg:pt-0
                    
                    /* Mobile open/close */
                    ${isOpen ? "translate-x-0" : "-translate-x-full"}
                    
                    /* Desktop: Always visible */
                    lg:translate-x-0
                `}
            >
                {/* Mobile Header */}
                <div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-700">
                    <span className="text-lg font-bold text-blue-500">
                        Menu
                    </span>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                {/* Navigation Items */}
                <nav className="flex-1 overflow-y-auto py-2">
                    {navSections.map((section) => (
                        <div key={section.title} className="mb-2">
                            <h3 className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                {section.title}
                            </h3>

                            <div className="px-2 space-y-1">
                                {section.items.map((item) => (
                                    <NavLink
                                        key={item.path}
                                        to={item.path}
                                        onClick={onClose}
                                        className={({ isActive }) =>
                                            `flex items-center gap-4 px-3 py-2.5 rounded-lg 
                                            transition-all duration-200
                                            ${
                                                isActive
                                                    ? "bg-blue-600 text-white font-semibold"
                                                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                                            }`
                                        }
                                    >
                                        <span className="text-xl">
                                            {item.icon}
                                        </span>
                                        <span>{item.name}</span>
                                    </NavLink>
                                ))}
                            </div>
                        </div>
                    ))}
                </nav>

                {/* User Profile Section */}
                {user && (
                    <div className="border-t border-gray-700 p-4">
                        <NavLink
                            to={`/c/${user.username}`}
                            onClick={onClose}
                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-700 transition-colors"
                        >
                            <img
                                src={user.avatar || "/default-avatar.png"}
                                alt={user.username}
                                className="w-8 h-8 rounded-full object-cover"
                            />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">
                                    {user.fullName || user.username}
                                </p>
                                <p className="text-xs text-gray-400 truncate">
                                    @{user.username}
                                </p>
                            </div>
                        </NavLink>
                    </div>
                )}

                {/* Footer */}
                <div className="border-t border-gray-700 p-4">
                    <p className="text-xs text-gray-500 text-center">
                        Made with ❤️ by Streamly Team
                    </p>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
