// src/components/Sidebar.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import useAuth from "../hooks/useAuth.hooks";
import { selectTheme } from "../features/theme/themeSlice";

const icons = {
    home: (
        <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={1.8}
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
            />
        </svg>
    ),
    dashboard: (
        <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={1.8}
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
            />
        </svg>
    ),
    subscriptions: (
        <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={1.8}
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z"
            />
        </svg>
    ),
    channel: (
        <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={1.8}
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
            />
        </svg>
    ),
    history: (
        <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={1.8}
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
            />
        </svg>
    ),
    playlists: (
        <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={1.8}
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z"
            />
        </svg>
    ),
    upload: (
        <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={1.8}
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
            />
        </svg>
    ),
    createPost: (
        <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={1.8}
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
            />
        </svg>
    ),
    settings: (
        <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={1.8}
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
            />
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
        </svg>
    ),
    likedVideos: (
        <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={1.8}
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z"
            />
        </svg>
    ),
    watchLater: (
        <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={1.8}
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
            />
        </svg>
    ),
    trending: (
        <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={1.8}
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z"
            />
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1.001A3.75 3.75 0 0012 18z"
            />
        </svg>
    ),
};

const Sidebar = ({ isOpen, onClose }) => {
    const { user } = useAuth();
    const theme = useSelector(selectTheme);
    const isDark = theme === "dark";

    const themeStyles = {
        dark: {
            sidebar: "bg-gray-800 border-gray-700",
            overlay: "bg-black/50",
            border: "border-gray-700",
            sectionTitle: "text-gray-500",
            navLink: "text-gray-300 hover:bg-gray-700 hover:text-white",
            navLinkActive: "bg-blue-600 text-white",
            text: "text-white",
            textMuted: "text-gray-400",
            textFaded: "text-gray-500",
            hover: "hover:bg-gray-700",
            ring: "ring-gray-600",
            icon: "text-white",
            navIcon: "text-gray-400",
            navIconActive: "text-white",
            scrollbar: "sidebar-scrollbar-dark",
        },
        light: {
            sidebar: "bg-white border-gray-200 shadow-lg",
            overlay: "bg-black/30",
            border: "border-gray-200",
            sectionTitle: "text-gray-400",
            navLink: "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
            navLinkActive: "bg-blue-600 text-white",
            text: "text-gray-800",
            textMuted: "text-gray-500",
            textFaded: "text-gray-400",
            hover: "hover:bg-gray-100",
            ring: "ring-gray-200",
            icon: "text-gray-600",
            navIcon: "text-gray-400",
            navIconActive: "text-white",
            scrollbar: "sidebar-scrollbar-light",
        },
    };

    const t = isDark ? themeStyles.dark : themeStyles.light;

    const navSections = [
        {
            title: "Menu",
            items: [
                { name: "Home", path: "/home", icon: icons.home },
                {
                    name: "Dashboard",
                    path: "/dashboard",
                    icon: icons.dashboard,
                },
                {
                    name: "Subscriptions",
                    path: "/subscriptions",
                    icon: icons.subscriptions,
                },
            ],
        },
        {
            title: "You",
            items: [
                {
                    name: "My Channel",
                    path: `/c/${user?.username || "me"}`,
                    icon: icons.channel,
                },
                { name: "History", path: "/history", icon: icons.history },
                {
                    name: "Playlists",
                    path: "/playlists",
                    icon: icons.playlists,
                },
            ],
        },
        {
            title: "Create",
            items: [
                { name: "Upload Video", path: "/upload", icon: icons.upload },
                {
                    name: "Create Post",
                    path: "/create/post",
                    icon: icons.createPost,
                },
            ],
        },
        {
            title: "Account",
            items: [
                { name: "Settings", path: "/settings", icon: icons.settings },
            ],
        },
    ];

    const getNavLinkClasses = ({ isActive }) => {
        const baseClasses =
            "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 text-sm group";
        return isActive
            ? `${baseClasses} ${t.navLinkActive} font-semibold shadow-md`
            : `${baseClasses} ${t.navLink}`;
    };

    const getIconClasses = (isActive) => {
        return isActive
            ? `flex-shrink-0 ${t.navIconActive}`
            : `flex-shrink-0 ${t.navIcon} group-hover:text-current transition-colors duration-200`;
    };

    return (
        <>
            {/* Scrollbar Styles */}
            <style>{`
                .sidebar-scrollbar-dark::-webkit-scrollbar {
                    width: 6px;
                }
                .sidebar-scrollbar-dark::-webkit-scrollbar-track {
                    background: transparent;
                }
                .sidebar-scrollbar-dark::-webkit-scrollbar-thumb {
                    background-color: #4b5563;
                    border-radius: 9999px;
                    border: 2px solid transparent;
                }
                .sidebar-scrollbar-dark::-webkit-scrollbar-thumb:hover {
                    background-color: #6b7280;
                }
                .sidebar-scrollbar-dark::-webkit-scrollbar-thumb:active {
                    background-color: #9ca3af;
                }
                .sidebar-scrollbar-light::-webkit-scrollbar {
                    width: 6px;
                }
                .sidebar-scrollbar-light::-webkit-scrollbar-track {
                    background: transparent;
                }
                .sidebar-scrollbar-light::-webkit-scrollbar-thumb {
                    background-color: #d1d5db;
                    border-radius: 9999px;
                    border: 2px solid transparent;
                }
                .sidebar-scrollbar-light::-webkit-scrollbar-thumb:hover {
                    background-color: #9ca3af;
                }
                .sidebar-scrollbar-light::-webkit-scrollbar-thumb:active {
                    background-color: #6b7280;
                }
                .sidebar-scrollbar-dark {
                    scrollbar-width: thin;
                    scrollbar-color: #4b5563 transparent;
                }
                .sidebar-scrollbar-light {
                    scrollbar-width: thin;
                    scrollbar-color: #d1d5db transparent;
                }
                .sidebar-scroll-container::-webkit-scrollbar-thumb {
                    transition: background-color 0.3s ease;
                }
            `}</style>

            {/* Mobile Overlay */}
            <div
                className={`
                    fixed inset-0 z-20 lg:hidden
                    transition-opacity duration-300
                    ${t.overlay}
                    ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}
                `}
                onClick={onClose}
            />

            {/* Sidebar */}
            <aside
                className={`
                    ${t.sidebar}
                    border-r flex flex-col z-30 w-60
                    transition-all duration-300 ease-in-out
                    fixed lg:relative
                    top-0 lg:top-auto
                    left-0
                    h-full
                    pt-16 lg:pt-0
                    ${isOpen ? "translate-x-0" : "-translate-x-full"}
                    lg:translate-x-0
                `}
            >
                {/* Mobile Header */}
                <div
                    className={`lg:hidden flex items-center justify-between px-4 py-3 border-b ${t.border} flex-shrink-0`}
                >
                    <span className="text-base font-bold text-blue-500">
                        Menu
                    </span>
                    <button
                        onClick={onClose}
                        className={`p-1.5 rounded-lg transition-colors ${t.hover}`}
                    >
                        <svg
                            className={`w-5 h-5 ${t.icon}`}
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

                {/* Scrollable Navigation */}
                <nav
                    className={`
                        flex-1 py-1.5
                        overflow-y-auto overflow-x-hidden
                        min-h-0
                        sidebar-scroll-container
                        ${t.scrollbar}
                    `}
                >
                    {navSections.map((section) => (
                        <div key={section.title} className="mb-1.5">
                            <h3
                                className={`px-4 py-1.5 text-xs font-semibold uppercase tracking-wider ${t.sectionTitle} sticky top-0 ${isDark ? "bg-gray-800" : "bg-white"} z-10`}
                            >
                                {section.title}
                            </h3>

                            <div className="px-2 space-y-0.5">
                                {section.items.map((item) => (
                                    <NavLink
                                        key={item.path}
                                        to={item.path}
                                        onClick={onClose}
                                        className={getNavLinkClasses}
                                    >
                                        {({ isActive }) => (
                                            <>
                                                <span
                                                    className={getIconClasses(
                                                        isActive,
                                                    )}
                                                >
                                                    {item.icon}
                                                </span>
                                                <span>{item.name}</span>
                                            </>
                                        )}
                                    </NavLink>
                                ))}
                            </div>
                        </div>
                    ))}
                </nav>

                {/* User Profile Section */}
                {user && (
                    <div className={`border-t ${t.border} p-3 flex-shrink-0`}>
                        <NavLink
                            to={`/c/${user.username}`}
                            onClick={onClose}
                            className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${t.hover}`}
                        >
                            <img
                                src={user.avatar || "/default-avatar.png"}
                                alt={user.username}
                                className={`w-8 h-8 rounded-full object-cover ring-2 ${t.ring}`}
                            />
                            <div className="flex-1 min-w-0">
                                <p
                                    className={`text-sm font-medium truncate ${t.text}`}
                                >
                                    {user.fullName || user.username}
                                </p>
                                <p
                                    className={`text-xs truncate ${t.textMuted}`}
                                >
                                    @{user.username}
                                </p>
                            </div>
                        </NavLink>
                    </div>
                )}

                {/* Footer */}
                <div className={`border-t ${t.border} p-2.5 flex-shrink-0`}>
                    <p className={`text-xs text-center ${t.textFaded}`}>
                        Made with ❤️ by{" "}
                        <NavLink
                            to="/about"
                            onClick={onClose}
                            className="text-blue-500 hover:text-blue-400 hover:underline transition-colors duration-200"
                        >
                            Streamly Team
                        </NavLink>
                    </p>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
