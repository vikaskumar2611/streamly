import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth.hooks";
import { useDispatch } from "react-redux";
import { logOut } from "../features/auth/authSlice";
import { useState, useEffect } from "react";
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

    // Close mobile sidebar on route change
    useEffect(() => {
        setSidebarOpen(false);
    }, [location.pathname]);

    // Prevent body scroll when mobile sidebar is open
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
    };

    return (
        <div className="h-screen w-screen bg-gray-900 text-white font-sans flex flex-col overflow-hidden">
            {/* Navigation Bar */}
            <header className="bg-gray-800 p-4 shadow-md flex justify-between items-center gap-4 border-b border-gray-700 z-40 shrink-0">
                {/* Left: Hamburger + Logo */}
                <div className="flex items-center gap-3">
                    {/* Hamburger - Mobile Only */}
                    {accessToken && (
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="lg:hidden p-2 rounded-lg hover:bg-gray-700 transition-colors"
                            aria-label="Toggle menu"
                        >
                            <svg
                                className="w-6 h-6"
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

                    {/* Logo */}
                    <Link
                        to="/"
                        className="text-xl font-bold text-blue-500 hover:text-blue-400 transition-colors"
                    >
                        MyVideoApp
                    </Link>
                </div>

                {/* Center: Search Bar */}
                {accessToken && (
                    <form
                        onSubmit={handleSearch}
                        className="hidden sm:flex flex-1 max-w-xl mx-4"
                    >
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search videos..."
                            className="w-full px-4 py-2 rounded-l-lg bg-gray-700 text-white outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600"
                        />
                        <button
                            type="submit"
                            className="px-5 bg-blue-600 rounded-r-lg hover:bg-blue-700 transition-colors"
                        >
                            🔍
                        </button>
                    </form>
                )}

                {/* Right: Nav Actions */}
                <nav className="flex gap-2 sm:gap-4 items-center">
                    {accessToken ? (
                        <>
                            <button className="sm:hidden p-2 hover:bg-gray-700 rounded-lg">
                                🔍
                            </button>
                            <button
                                onClick={handleLogout}
                                className="text-red-400 hover:text-red-300 hover:bg-gray-700 px-3 py-2 rounded-lg transition-colors"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="hover:text-blue-400 transition-colors px-3 py-2"
                            >
                                Login
                            </Link>
                            <Link
                                to="/register"
                                className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Register
                            </Link>
                        </>
                    )}
                </nav>
            </header>

            {/* Body: Sidebar + Content */}
            <div className="flex flex-1 overflow-hidden">
                {accessToken && (
                    <Sidebar
                        isOpen={sidebarOpen}
                        onClose={() => setSidebarOpen(false)}
                    />
                )}

                <main className="flex-1 overflow-y-auto bg-gray-900 p-4">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;
