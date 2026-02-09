import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import VideoGrid from "../../components/VideoGrid";
import Pagination from "../../components/Pagination";
import useAxiosPrivate from "../../hooks/useAxiosPrivate.hooks";
import { selectTheme } from "../../features/theme/themeSlice";

// ─── Reusable Spinner ────────────────────────────────────────────────
const Spinner = ({ className = "" }) => (
    <svg
        className={`animate-spin ${className}`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
    >
        <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
        />
        <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
    </svg>
);

// ─── Skeleton Card ───────────────────────────────────────────────────
const SkeletonCard = ({ isDark }) => (
    <div
        className={`rounded-xl overflow-hidden ${
            isDark ? "bg-gray-800/60" : "bg-gray-200/60"
        } animate-pulse`}
    >
        <div
            className={`aspect-video ${isDark ? "bg-gray-700" : "bg-gray-300"}`}
        />
        <div className="p-4 space-y-3">
            <div
                className={`h-4 rounded-full w-3/4 ${
                    isDark ? "bg-gray-700" : "bg-gray-300"
                }`}
            />
            <div className="flex items-center gap-2">
                <div
                    className={`h-8 w-8 rounded-full ${
                        isDark ? "bg-gray-700" : "bg-gray-300"
                    }`}
                />
                <div
                    className={`h-3 rounded-full w-1/3 ${
                        isDark ? "bg-gray-700" : "bg-gray-300"
                    }`}
                />
            </div>
            <div
                className={`h-3 rounded-full w-1/2 ${
                    isDark ? "bg-gray-700" : "bg-gray-300"
                }`}
            />
        </div>
    </div>
);

const SkeletonGrid = ({ isDark, count = 12 }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {Array.from({ length: count }).map((_, i) => (
            <SkeletonCard key={i} isDark={isDark} />
        ))}
    </div>
);

// ─── Main Component ──────────────────────────────────────────────────
const WatchHistory = () => {
    const axiosPrivate = useAxiosPrivate();
    const theme = useSelector(selectTheme);
    const isDark = theme === "dark";

    const themeStyles = {
        dark: {
            background: "bg-gray-950",
            text: "text-white",
            textMuted: "text-gray-400",
            textFaded: "text-gray-500",
            border: "border-gray-800/60",
            iconBg: "bg-purple-500/10",
            iconColor: "text-purple-400",
            iconRing: "ring-purple-500/20",
            emptyStateBg: "bg-gray-800/50",
            emptyStateIcon: "text-gray-500",
            emptyStateTitle: "text-white",
            emptyStateText: "text-gray-500",
            loadingText: "text-gray-400",
            errorBg: "bg-red-500/10",
            errorText: "text-red-400",
            errorBorder: "border-red-500/20",
            errorIcon: "text-red-400",
            headerBg: "bg-gray-900/50",
            badge: "bg-purple-500/15 text-purple-400 border-purple-500/20",
            retryBtn: "bg-purple-600 hover:bg-purple-500 active:bg-purple-700",
            browseBtn:
                "bg-purple-600 hover:bg-purple-500 active:bg-purple-700 shadow-lg shadow-purple-500/25",
        },
        light: {
            background: "bg-gray-50",
            text: "text-gray-900",
            textMuted: "text-gray-500",
            textFaded: "text-gray-400",
            border: "border-gray-200",
            iconBg: "bg-purple-50",
            iconColor: "text-purple-600",
            iconRing: "ring-purple-200",
            emptyStateBg: "bg-gray-100",
            emptyStateIcon: "text-gray-400",
            emptyStateTitle: "text-gray-900",
            emptyStateText: "text-gray-500",
            loadingText: "text-gray-500",
            errorBg: "bg-red-50",
            errorText: "text-red-600",
            errorBorder: "border-red-200",
            errorIcon: "text-red-500",
            headerBg: "bg-white/80",
            badge: "bg-purple-50 text-purple-600 border-purple-200",
            retryBtn: "bg-purple-600 hover:bg-purple-700 active:bg-purple-800",
            browseBtn:
                "bg-purple-600 hover:bg-purple-700 active:bg-purple-800 shadow-lg shadow-purple-300/40",
        },
    };

    const t = isDark ? themeStyles.dark : themeStyles.light;

    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalVideos: 0,
        hasNextPage: false,
        hasPrevPage: false,
    });

    const fetchWatchHistory = async (page = 1) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axiosPrivate.get("/users/history", {
                params: { page, limit: 12 },
            });

            const { watchHistory, pagination: paginationData } =
                response.data.data;

            const videos = (watchHistory || [])
                .map((item) => item.video)
                .filter((video) => video != null);

            setHistory([...videos].reverse());
            setPagination(paginationData);
        } catch (err) {
            console.error("Error fetching watch history:", err);
            setError("Failed to load watch history.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWatchHistory(1);
    }, [axiosPrivate]);

    const handlePageChange = (newPage) => {
        fetchWatchHistory(newPage);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // ─── LOADING STATE ───────────────────────────────────────────────
    if (loading) {
        return (
            <div
                className={`min-h-screen ${t.background} p-4 md:p-8
                            transition-colors duration-300`}
            >
                <div className="max-w-7xl mx-auto">
                    {/* Skeleton Header */}
                    <div className="flex items-center gap-4 mb-8 animate-pulse">
                        <div
                            className={`w-14 h-14 rounded-2xl ${
                                isDark ? "bg-gray-800" : "bg-gray-200"
                            }`}
                        />
                        <div className="space-y-2.5">
                            <div
                                className={`h-6 w-44 rounded-lg ${
                                    isDark ? "bg-gray-800" : "bg-gray-200"
                                }`}
                            />
                            <div
                                className={`h-4 w-32 rounded-lg ${
                                    isDark ? "bg-gray-800" : "bg-gray-200"
                                }`}
                            />
                        </div>
                    </div>

                    <SkeletonGrid isDark={isDark} count={12} />
                </div>
            </div>
        );
    }

    // ─── ERROR STATE ─────────────────────────────────────────────────
    if (error) {
        return (
            <div
                className={`min-h-screen ${t.background} flex items-center justify-center
                            p-4 transition-colors duration-300`}
            >
                <div
                    className={`
                        flex flex-col items-center text-center
                        max-w-md w-full p-8 rounded-2xl
                        border ${t.errorBorder} ${t.errorBg}
                        animate-[fadeIn_0.4s_ease-out]
                    `}
                >
                    <div
                        className={`
                            w-16 h-16 rounded-2xl flex items-center justify-center
                            mb-5 ${t.errorBg} ${t.errorIcon}
                        `}
                    >
                        <svg
                            className="w-8 h-8"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                        </svg>
                    </div>

                    <h3 className={`text-lg font-semibold mb-1.5 ${t.text}`}>
                        Something went wrong
                    </h3>
                    <p className={`text-sm mb-6 ${t.errorText}`}>{error}</p>

                    <button
                        onClick={() => fetchWatchHistory(1)}
                        className={`
                            px-6 py-2.5 rounded-xl text-white text-sm font-semibold
                            ${t.retryBtn}
                            transition-all duration-200
                            hover:scale-[1.03] active:scale-95
                            cursor-pointer
                        `}
                    >
                        <span className="flex items-center gap-2">
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
                                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                />
                            </svg>
                            Try Again
                        </span>
                    </button>
                </div>
            </div>
        );
    }

    // ─── MAIN RENDER ─────────────────────────────────────────────────
    return (
        <div
            className={`min-h-screen ${t.background} transition-colors duration-300`}
        >
            {/* ── Header ─────────────────────────────────────────── */}
            <div
                className={`
                    sticky top-0 z-30
                    border-b ${t.border}
                    ${t.headerBg} backdrop-blur-xl
                    transition-colors duration-300
                `}
            >
                <div className="max-w-7xl mx-auto px-4 md:px-8 py-5">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            {/* Icon */}
                            <div
                                className={`
                                    p-3 rounded-2xl
                                    ${t.iconBg} ${t.iconColor}
                                    ring-1 ${t.iconRing}
                                    transition-colors duration-300
                                `}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-6 h-6"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <circle cx="12" cy="12" r="10" />
                                    <polyline points="12 6 12 12 16 14" />
                                </svg>
                            </div>

                            {/* Title & Subtitle */}
                            <div>
                                <h1
                                    className={`text-xl md:text-2xl font-bold ${t.text}
                                                transition-colors duration-300`}
                                >
                                    Watch History
                                </h1>
                                <p
                                    className={`text-sm ${t.textMuted} mt-0.5
                                                transition-colors duration-300`}
                                >
                                    {pagination.totalVideos > 0
                                        ? "Your recently watched videos"
                                        : "Videos you have watched recently"}
                                </p>
                            </div>
                        </div>

                        {/* Video Count Badge */}
                        {pagination.totalVideos > 0 && (
                            <span
                                className={`
                                    hidden sm:inline-flex items-center gap-1.5
                                    px-3.5 py-1.5 rounded-full
                                    text-xs font-semibold
                                    border ${t.badge}
                                    transition-colors duration-300
                                `}
                            >
                                <svg
                                    className="w-3.5 h-3.5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                                    />
                                </svg>
                                {pagination.totalVideos.toLocaleString()} videos
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Content ────────────────────────────────────────── */}
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
                {history.length > 0 ? (
                    <div className="animate-[fadeIn_0.3s_ease-out]">
                        <VideoGrid videos={history} />

                        <div className="mt-10">
                            <Pagination
                                currentPage={pagination.currentPage}
                                totalPages={pagination.totalPages}
                                hasNextPage={pagination.hasNextPage}
                                hasPrevPage={pagination.hasPrevPage}
                                onPageChange={handlePageChange}
                            />
                        </div>
                    </div>
                ) : (
                    /* ── Empty State ───────────────────────────────── */
                    <div
                        className="flex flex-col items-center justify-center
                                    py-24 text-center
                                    animate-[fadeIn_0.4s_ease-out]"
                    >
                        {/* Decorative background glow */}
                        <div className="relative mb-6">
                            <div
                                className="absolute inset-0 rounded-full
                                            bg-purple-500/10 blur-2xl scale-150"
                            />
                            <div
                                className={`
                                    relative p-7 rounded-3xl
                                    ${t.emptyStateBg}
                                    ring-1 ${isDark ? "ring-gray-700/50" : "ring-gray-200"}
                                    transition-colors duration-300
                                `}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className={`w-12 h-12 ${t.emptyStateIcon}`}
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <circle cx="12" cy="12" r="10" />
                                    <polyline points="12 6 12 12 16 14" />
                                </svg>
                            </div>
                        </div>

                        <h3
                            className={`text-xl font-bold ${t.emptyStateTitle}
                                        transition-colors duration-300`}
                        >
                            No watch history yet
                        </h3>
                        <p
                            className={`text-sm mt-2 max-w-sm leading-relaxed
                                        ${t.emptyStateText}
                                        transition-colors duration-300`}
                        >
                            Videos you watch will show up here. Start exploring
                            to build your history!
                        </p>

                        <button
                            onClick={() => (window.location.href = "/home")}
                            className={`
                                mt-8 px-7 py-3 rounded-xl
                                text-white text-sm font-semibold
                                ${t.browseBtn}
                                transition-all duration-200
                                hover:scale-[1.03] active:scale-95
                                cursor-pointer
                            `}
                        >
                            <span className="flex items-center gap-2">
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
                                Browse Videos
                            </span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WatchHistory;
