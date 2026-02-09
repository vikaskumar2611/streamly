// pages/Home.jsx
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import VideoGrid from "../../components/VideoGrid";
import Pagination from "../../components/Pagination";
import useAxiosPrivate from "../../hooks/useAxiosPrivate.hooks";
import { selectTheme } from "../../features/theme/themeSlice";

const Home = () => {
    const axiosPrivate = useAxiosPrivate();
    const theme = useSelector(selectTheme);
    const isDark = theme === "dark";

    const [videos, setVideos] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortBy, setSortBy] = useState("createdAt");

    const themeStyles = {
        dark: {
            container:
                "bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950",
            heading: "text-white",
            subHeading: "text-gray-400",
            card: "bg-gray-800/60 backdrop-blur-sm border-gray-700/50",
            cardHover: "hover:bg-gray-700/70 hover:border-gray-600",
            text: "text-white",
            textMuted: "text-gray-400",
            textFaded: "text-gray-500",
            border: "border-gray-800",
            divider: "bg-gray-700",
            skeleton: "bg-gray-700",
            skeletonShimmer: "bg-gray-600",
            emptyState: "text-gray-500",
            badge: "bg-gray-800/80 text-gray-300 border border-gray-700/50",
            badgeActive: "bg-white text-gray-900 shadow-lg shadow-white/10",
            icon: "text-gray-600",
            iconEmpty: "text-gray-700",
            statsText: "text-gray-500",
            statsBadge:
                "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20",
            emptyBg: "bg-gray-800/30 border border-gray-700/30",
        },
        light: {
            container: "bg-gradient-to-b from-slate-50 via-white to-slate-50",
            heading: "text-gray-900",
            subHeading: "text-gray-500",
            card: "bg-white border-gray-200 shadow-sm",
            cardHover: "hover:bg-gray-50 hover:shadow-lg hover:border-gray-300",
            text: "text-gray-800",
            textMuted: "text-gray-500",
            textFaded: "text-gray-400",
            border: "border-gray-200",
            divider: "bg-gray-200",
            skeleton: "bg-gray-200",
            skeletonShimmer: "bg-gray-300",
            emptyState: "text-gray-400",
            badge: "bg-gray-100 text-gray-600 border border-gray-200",
            badgeActive: "bg-gray-900 text-white shadow-lg shadow-gray-900/20",
            icon: "text-gray-400",
            iconEmpty: "text-gray-300",
            statsText: "text-gray-400",
            statsBadge: "bg-indigo-50 text-indigo-600 border border-indigo-100",
            emptyBg: "bg-gray-50 border border-gray-100",
        },
    };

    const t = isDark ? themeStyles.dark : themeStyles.light;

    const sortOptions = [
        { label: "Latest", value: "createdAt" },
        { label: "Popular", value: "views" },
    ];

    useEffect(() => {
        const fetchVideos = async () => {
            setLoading(true);
            try {
                const response = await axiosPrivate.get("/video", {
                    params: {
                        query: "",
                        page: currentPage,
                        limit: 12,
                        sortBy,
                        sortType: "desc",
                    },
                });

                setVideos(response.data.data.videos);
                setPagination(response.data.data.pagination);
            } catch (err) {
                console.error("Failed to fetch videos:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchVideos();
    }, [currentPage, sortBy]);

    return (
        <div
            className={`min-h-screen ${t.container} transition-colors duration-500 px-4 sm:px-6 lg:px-8 py-6`}
        >
            {/* Header */}
            <div className="mb-8 animate-[fadeIn_0.5s_ease-out]">
                <div className="flex items-center gap-3 mb-2">
                    <div className="h-8 w-1 rounded-full bg-gradient-to-b from-indigo-500 to-purple-500" />
                    <h1
                        className={`text-3xl font-extrabold tracking-tight ${t.heading} transition-colors duration-300`}
                    >
                        Recommended Videos
                    </h1>
                </div>
                <p
                    className={`text-sm ml-[1.15rem] ${t.subHeading} transition-colors duration-300`}
                >
                    Discover the latest and trending content
                </p>
            </div>

            {/* Filter Bar */}
            <div
                className={`flex flex-wrap items-center justify-between gap-4 mb-8 pb-5 border-b ${t.border} transition-colors duration-300`}
            >
                {/* Sort Pills */}
                <div className="flex items-center gap-2">
                    {sortOptions.map((opt) => (
                        <button
                            key={opt.value}
                            onClick={() => {
                                setSortBy(opt.value);
                                setCurrentPage(1);
                            }}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer
                                ${
                                    sortBy === opt.value
                                        ? t.badgeActive
                                        : `${t.badge} hover:scale-[1.04]`
                                }`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>

                {/* Stats */}
                <div className="flex items-center gap-3">
                    {pagination && (
                        <span
                            className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full ${t.statsBadge} transition-colors duration-300`}
                        >
                            <span className="relative flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75" />
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-500" />
                            </span>
                            {pagination.totalVideos} videos
                        </span>
                    )}
                    <span className={`text-xs ${t.statsText} hidden sm:inline`}>
                        Page {currentPage} of {pagination?.totalPages || 1}
                    </span>
                </div>
            </div>

            {/* Video Grid */}
            <div className="animate-[fadeInUp_0.4s_ease-out]">
                <VideoGrid
                    videos={videos}
                    layout="grid"
                    loading={loading}
                    columns={4}
                    emptyMessage="No videos available"
                    theme={t}
                    isDark={isDark}
                />
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
                <div
                    className={`mt-10 pt-6 border-t ${t.border} transition-colors duration-300`}
                >
                    <Pagination
                        currentPage={pagination.currentPage}
                        totalPages={pagination.totalPages}
                        hasNextPage={pagination.hasNextPage}
                        hasPrevPage={pagination.hasPrevPage}
                        onPageChange={(page) => {
                            setCurrentPage(page);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        theme={t}
                        isDark={isDark}
                    />
                </div>
            )}

            {/* Empty State */}
            {!loading && videos.length === 0 && (
                <div
                    className={`flex flex-col items-center justify-center py-24 rounded-2xl ${t.emptyBg} mx-auto max-w-md animate-[fadeIn_0.6s_ease-out]`}
                >
                    <div
                        className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 ${
                            isDark ? "bg-gray-800" : "bg-gray-100"
                        }`}
                    >
                        <svg
                            className={`w-10 h-10 ${t.iconEmpty}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                            />
                        </svg>
                    </div>
                    <h3
                        className={`text-lg font-semibold ${t.heading} mb-1 transition-colors duration-300`}
                    >
                        No videos found
                    </h3>
                    <p
                        className={`text-sm ${t.textMuted} transition-colors duration-300`}
                    >
                        Check back later for new content
                    </p>
                </div>
            )}

            {/* Keyframe styles (add once via a global stylesheet or a <style> tag) */}
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to   { opacity: 1; }
                }
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(12px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default Home;
