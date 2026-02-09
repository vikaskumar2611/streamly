// src/components/Layout.jsx
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth.hooks";
import { useDispatch, useSelector } from "react-redux";
import { logOut } from "../features/auth/authSlice";
import { toggleTheme, selectTheme } from "../features/theme/themeSlice";
import { useState, useEffect, useRef } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate.hooks";
import Sidebar from "./Sidebar";

const Layout = () => {
    const axiosPrivate = useAxiosPrivate();
    const { accessToken } = useAuth();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const [search, setSearch] = useState("");
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [searchFocused, setSearchFocused] = useState(false);
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
    const mobileSearchRef = useRef(null);

    const theme = useSelector(selectTheme);
    const isDark = theme === "dark";

    useEffect(() => {
        const root = document.documentElement;
        if (isDark) {
            root.classList.add("dark");
            root.classList.remove("light");
        } else {
            root.classList.add("light");
            root.classList.remove("dark");
        }
    }, [isDark]);

    // Close sidebar & mobile search on route change
    useEffect(() => {
        setSidebarOpen(false);
        setMobileSearchOpen(false);
        setSearch("");
    }, [location.pathname]);

    useEffect(() => {
        if (sidebarOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [sidebarOpen]);

    // Auto-focus mobile search input when opened
    useEffect(() => {
        if (mobileSearchOpen && mobileSearchRef.current) {
            mobileSearchRef.current.focus();
        }
    }, [mobileSearchOpen]);

    const handleLogout = async () => {
        try {
            await axiosPrivate.post("/users/logout");
            dispatch(logOut());
            navigate("/login");
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (!search.trim()) return;
        navigate(`/results?q=${encodeURIComponent(search.trim())}`);
        setSearch("");
        setMobileSearchOpen(false);
    };

    const handleThemeToggle = () => {
        dispatch(toggleTheme());
    };

    return (
        <div
            className={`h-screen w-screen font-sans flex flex-col overflow-hidden transition-colors duration-300 ${
                isDark ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
            }`}
        >
            {/* Navigation Bar */}
            <header
                className={`
                    px-4 lg:px-6 h-14 flex items-center justify-between gap-4 
                    border-b z-40 shrink-0 
                    backdrop-blur-md transition-colors duration-300
                    ${
                        isDark
                            ? "bg-gray-900/80 border-gray-700/50"
                            : "bg-white/80 border-gray-200/50 shadow-sm"
                    }
                `}
            >
                {/* ===== Mobile Search Overlay ===== */}
                {mobileSearchOpen && (
                    <div
                        className="sm:hidden absolute inset-0 z-50 flex items-center px-3 gap-2"
                        style={{
                            backgroundColor: isDark
                                ? "rgba(17, 24, 39, 0.98)"
                                : "rgba(255, 255, 255, 0.98)",
                        }}
                    >
                        {/* Back button */}
                        <button
                            onClick={() => {
                                setMobileSearchOpen(false);
                                setSearch("");
                            }}
                            className={`p-2 rounded-full shrink-0 transition-colors active:scale-95 ${
                                isDark
                                    ? "hover:bg-gray-700 text-gray-400 hover:text-white"
                                    : "hover:bg-gray-100 text-gray-500 hover:text-gray-800"
                            }`}
                            aria-label="Close search"
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
                                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                                />
                            </svg>
                        </button>

                        {/* Search form */}
                        <form
                            onSubmit={handleSearch}
                            className="flex flex-1 items-center"
                        >
                            <div
                                className={`flex flex-1 items-center rounded-full overflow-hidden border transition-all ${
                                    isDark
                                        ? "border-blue-500 ring-1 ring-blue-500/30 bg-gray-800"
                                        : "border-blue-500 ring-1 ring-blue-500/20 bg-white"
                                }`}
                            >
                                <div
                                    className={`flex items-center pl-3.5 ${
                                        isDark
                                            ? "text-gray-500"
                                            : "text-gray-400"
                                    }`}
                                >
                                    <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                        />
                                    </svg>
                                </div>
                                <input
                                    ref={mobileSearchRef}
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search videos, channels..."
                                    className={`w-full px-3 py-2 text-sm outline-none bg-transparent ${
                                        isDark
                                            ? "text-white placeholder-gray-500"
                                            : "text-gray-900 placeholder-gray-400"
                                    }`}
                                />
                                {/* Clear button */}
                                {search && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSearch("");
                                            mobileSearchRef.current?.focus();
                                        }}
                                        className={`p-2 shrink-0 transition-colors ${
                                            isDark
                                                ? "text-gray-500 hover:text-gray-300"
                                                : "text-gray-400 hover:text-gray-600"
                                        }`}
                                    >
                                        <svg
                                            className="w-4 h-4"
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
                                )}
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={!search.trim()}
                                className={`ml-2 p-2.5 rounded-full shrink-0 transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed ${
                                    isDark
                                        ? "bg-blue-600 hover:bg-blue-500 text-white"
                                        : "bg-blue-600 hover:bg-blue-700 text-white"
                                }`}
                            >
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    />
                                </svg>
                            </button>
                        </form>
                    </div>
                )}

                {/* Left: Hamburger + Logo */}
                <div className="flex items-center gap-2 shrink-0">
                    {accessToken && (
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className={`lg:hidden p-1.5 rounded-md transition-all duration-200 active:scale-95 ${
                                isDark
                                    ? "hover:bg-gray-700/70 text-gray-400 hover:text-white"
                                    : "hover:bg-gray-100 text-gray-500 hover:text-gray-800"
                            }`}
                            aria-label="Toggle menu"
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
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            </svg>
                        </button>
                    )}

                    <Link to="/" className="flex items-center gap-1.5 group">
                        <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-shadow duration-300">
                            <svg
                                className="w-4 h-4 text-white"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>
                        <span className="text-lg font-bold bg-gradient-to-r from-blue-500 to-blue-400 bg-clip-text text-transparent hidden sm:block">
                            Stream.ly
                        </span>
                    </Link>
                </div>

                {/* Center: Desktop Search Bar */}
                {accessToken && (
                    <form
                        onSubmit={handleSearch}
                        className={`
                            hidden sm:flex flex-1 max-w-lg mx-4
                            transition-all duration-300
                            ${searchFocused ? "max-w-xl" : ""}
                        `}
                    >
                        <div
                            className={`
                                flex w-full rounded-full overflow-hidden border transition-all duration-300
                                ${
                                    searchFocused
                                        ? isDark
                                            ? "border-blue-500 ring-1 ring-blue-500/30 shadow-lg shadow-blue-500/10"
                                            : "border-blue-500 ring-1 ring-blue-500/20 shadow-lg shadow-blue-500/10"
                                        : isDark
                                          ? "border-gray-600/50 hover:border-gray-500"
                                          : "border-gray-300 hover:border-gray-400"
                                }
                            `}
                        >
                            <div
                                className={`flex items-center pl-4 ${
                                    isDark ? "text-gray-500" : "text-gray-400"
                                }`}
                            >
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    />
                                </svg>
                            </div>
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onFocus={() => setSearchFocused(true)}
                                onBlur={() => setSearchFocused(false)}
                                placeholder="Search videos"
                                className={`
                                    w-full px-3 py-1.5 text-sm outline-none bg-transparent transition-colors
                                    ${
                                        isDark
                                            ? "text-white placeholder-gray-500"
                                            : "text-gray-900 placeholder-gray-400"
                                    }
                                `}
                            />
                            <button
                                type="submit"
                                className={`
                                    px-4 transition-all duration-200 shrink-0 active:scale-95
                                    ${
                                        isDark
                                            ? "bg-gray-700/50 hover:bg-gray-600/70 text-gray-300 hover:text-white border-l border-gray-600/50"
                                            : "bg-gray-50 hover:bg-gray-100 text-gray-600 hover:text-gray-800 border-l border-gray-300"
                                    }
                                `}
                            >
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    />
                                </svg>
                            </button>
                        </div>
                    </form>
                )}

                {/* Right: Nav Actions */}
                <nav className="flex gap-1 sm:gap-2 items-center shrink-0">
                    {/* Theme Toggle */}
                    <button
                        onClick={handleThemeToggle}
                        className={`
                            p-2 rounded-full transition-all duration-300 active:scale-90
                            ${
                                isDark
                                    ? "hover:bg-gray-700/70 text-gray-400 hover:text-yellow-400"
                                    : "hover:bg-gray-100 text-gray-500 hover:text-amber-500"
                            }
                        `}
                        aria-label="Toggle theme"
                        title={
                            isDark
                                ? "Switch to Light Mode"
                                : "Switch to Dark Mode"
                        }
                    >
                        {isDark ? (
                            <svg
                                className="w-5 h-5"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        ) : (
                            <svg
                                className="w-5 h-5"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                            </svg>
                        )}
                    </button>

                    {accessToken ? (
                        <>
                            {/* Mobile Search Trigger */}
                            <button
                                onClick={() => setMobileSearchOpen(true)}
                                className={`sm:hidden p-2 rounded-full transition-all duration-200 active:scale-90 ${
                                    isDark
                                        ? "hover:bg-gray-700/70 text-gray-400 hover:text-white"
                                        : "hover:bg-gray-100 text-gray-500 hover:text-gray-800"
                                }`}
                                aria-label="Open search"
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
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    />
                                </svg>
                            </button>

                            {/* Divider */}
                            <div
                                className={`hidden sm:block w-px h-6 ${
                                    isDark ? "bg-gray-700" : "bg-gray-200"
                                }`}
                            />

                            {/* Logout */}
                            <button
                                onClick={handleLogout}
                                className={`
                                    flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium
                                    transition-all duration-200 active:scale-95
                                    ${
                                        isDark
                                            ? "text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                            : "text-red-500 hover:text-red-600 hover:bg-red-50"
                                    }
                                `}
                            >
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                    />
                                </svg>
                                <span className="hidden sm:inline">Logout</span>
                            </button>
                        </>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link
                                to="/login"
                                className={`
                                    px-4 py-1.5 rounded-full text-sm font-medium
                                    transition-all duration-200 active:scale-95
                                    ${
                                        isDark
                                            ? "text-gray-300 hover:text-white hover:bg-gray-700/50"
                                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                                    }
                                `}
                            >
                                Login
                            </Link>
                            <Link
                                to="/register"
                                className="
                                    bg-gradient-to-r from-blue-600 to-blue-500 
                                    px-4 py-1.5 rounded-full text-sm font-semibold text-white
                                    hover:from-blue-700 hover:to-blue-600 
                                    shadow-md shadow-blue-500/25 hover:shadow-blue-500/40
                                    transition-all duration-200 active:scale-95
                                "
                            >
                                Register
                            </Link>
                        </div>
                    )}
                </nav>
            </header>

            {/* Body: Sidebar + Content */}
            <div className="flex flex-1 overflow-hidden">
                {accessToken && (
                    <Sidebar
                        isOpen={sidebarOpen}
                        onClose={() => setSidebarOpen(false)}
                        isDark={isDark}
                    />
                )}

                <main
                    className={`flex-1 overflow-y-auto p-4 transition-colors duration-300 ${
                        isDark ? "bg-gray-900" : "bg-gray-50"
                    }`}
                >
                    <Outlet context={{ isDark }} />
                </main>
            </div>
        </div>
    );
};

export default Layout;
