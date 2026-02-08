import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import VideoGrid from "../../components/VideoGrid";
import Pagination from "../../components/Pagination";
import useAxiosPrivate from "../../hooks/useAxiosPrivate.hooks";
import { selectTheme } from "../../features/theme/themeSlice";

const WatchHistory = () => {
    const axiosPrivate = useAxiosPrivate();
    const theme = useSelector(selectTheme);
    const isDark = theme === "dark";

    // Theme configuration object
    const themeStyles = {
        dark: {
            background: "bg-gray-900",
            text: "text-white",
            textMuted: "text-gray-400",
            textFaded: "text-gray-500",
            border: "border-gray-800",
            iconBg: "bg-purple-900",
            iconColor: "text-purple-300",
            emptyStateBg: "bg-gray-800",
            emptyStateIcon: "text-gray-400",
            emptyStateTitle: "text-white",
            emptyStateText: "text-gray-400",
            loadingText: "text-gray-400",
            errorText: "text-red-400",
            loadingBg: "bg-gray-900",
        },
        light: {
            background: "bg-gray-50",
            text: "text-gray-900",
            textMuted: "text-gray-600",
            textFaded: "text-gray-500",
            border: "border-gray-200",
            iconBg: "bg-purple-100",
            iconColor: "text-purple-600",
            emptyStateBg: "bg-gray-100",
            emptyStateIcon: "text-gray-400",
            emptyStateTitle: "text-gray-900",
            emptyStateText: "text-gray-500",
            loadingText: "text-gray-500",
            errorText: "text-red-500",
            loadingBg: "bg-gray-50",
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
        try {
            const response = await axiosPrivate.get("/users/history", {
                params: { page, limit: 12 },
            });

            console.log("API Response:", response.data.data);

            const { watchHistory, pagination: paginationData } =
                response.data.data;

            // Extract video objects from the array
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
        // Scroll to top when page changes
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    if (loading) {
        return (
            <div
                className={`w-full h-[50vh] flex flex-col justify-center items-center ${t.loadingBg} transition-colors duration-300`}
            >
                <svg
                    className={`animate-spin h-8 w-8 mb-3 ${t.loadingText}`}
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
                <p className={`${t.loadingText} font-medium`}>
                    Loading history...
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <div
                className={`w-full h-[50vh] flex flex-col justify-center items-center ${t.loadingBg} transition-colors duration-300`}
            >
                <svg
                    className={`w-12 h-12 mb-3 ${t.errorText}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                </svg>
                <p className={`${t.errorText} font-medium`}>{error}</p>
                <button
                    onClick={() => fetchWatchHistory(1)}
                    className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div
            className={`min-h-screen ${t.background} p-4 md:p-8 transition-colors duration-300`}
        >
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div
                    className={`flex items-center gap-3 mb-6 border-b ${t.border} pb-4 transition-colors duration-300`}
                >
                    <div
                        className={`p-3 ${t.iconBg} rounded-full ${t.iconColor} transition-colors duration-300`}
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
                    <div>
                        <h1
                            className={`text-2xl font-bold ${t.text} transition-colors duration-300`}
                        >
                            Watch History
                        </h1>
                        <p
                            className={`text-sm ${t.textMuted} transition-colors duration-300`}
                        >
                            {pagination.totalVideos > 0
                                ? `${pagination.totalVideos.toLocaleString()} videos watched`
                                : "Videos you have watched recently"}
                        </p>
                    </div>
                </div>

                {/* Content Section */}
                {history.length > 0 ? (
                    <>
                        <VideoGrid videos={history} />

                        {/* Pagination */}
                        <Pagination
                            currentPage={pagination.currentPage}
                            totalPages={pagination.totalPages}
                            hasNextPage={pagination.hasNextPage}
                            hasPrevPage={pagination.hasPrevPage}
                            onPageChange={handlePageChange}
                        />
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div
                            className={`${t.emptyStateBg} p-6 rounded-full mb-4 transition-colors duration-300`}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className={`w-10 h-10 ${t.emptyStateIcon}`}
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="m21 21-6-6m6 6v-4.8m0 4.8h-4.8" />
                                <path d="M3 5v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4.8" />
                                <path d="M7 15h6" />
                                <path d="M7 11h10" />
                                <path d="M7 7h10" />
                            </svg>
                        </div>
                        <h3
                            className={`text-lg font-semibold ${t.emptyStateTitle} transition-colors duration-300`}
                        >
                            No history found
                        </h3>
                        <p
                            className={`${t.emptyStateText} mt-2 max-w-sm transition-colors duration-300`}
                        >
                            It looks like you haven't watched any videos yet.
                            Start watching to see your history here!
                        </p>
                        <button
                            onClick={() => (window.location.href = "/home")}
                            className="mt-6 px-6 py-2.5 bg-purple-600 text-white rounded-full font-medium hover:bg-purple-700 transition-all duration-200 transform hover:scale-105 active:scale-95"
                        >
                            Browse Videos
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WatchHistory;
