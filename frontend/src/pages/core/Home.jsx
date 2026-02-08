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

    // Theme configuration object
    const themeStyles = {
        dark: {
            container: "bg-gray-900",
            heading: "text-white",
            subHeading: "text-gray-400",
            card: "bg-gray-800 border-gray-700",
            cardHover: "hover:bg-gray-700",
            text: "text-white",
            textMuted: "text-gray-400",
            textFaded: "text-gray-500",
            border: "border-gray-700",
            divider: "bg-gray-700",
            skeleton: "bg-gray-700",
            skeletonShimmer: "bg-gray-600",
            emptyState: "text-gray-500",
            badge: "bg-gray-700 text-gray-300",
            icon: "text-gray-400",
        },
        light: {
            container: "bg-gray-50",
            heading: "text-gray-900",
            subHeading: "text-gray-600",
            card: "bg-white border-gray-200 shadow-sm",
            cardHover: "hover:bg-gray-50 hover:shadow-md",
            text: "text-gray-800",
            textMuted: "text-gray-500",
            textFaded: "text-gray-400",
            border: "border-gray-200",
            divider: "bg-gray-200",
            skeleton: "bg-gray-200",
            skeletonShimmer: "bg-gray-300",
            emptyState: "text-gray-400",
            badge: "bg-gray-100 text-gray-600",
            icon: "text-gray-500",
        },
    };

    const t = isDark ? themeStyles.dark : themeStyles.light;

    useEffect(() => {
        const fetchVideos = async () => {
            setLoading(true);
            try {
                const response = await axiosPrivate.get("/video", {
                    params: {
                        query: "",
                        page: currentPage,
                        limit: 12,
                        sortBy: "createdAt",
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
    }, [currentPage]);

    return (
        <div
            className={`min-h-screen ${t.container} transition-colors duration-300`}
        >
            {/* Header Section */}
            <div className="mb-6">
                <h1
                    className={`text-2xl font-bold ${t.heading} transition-colors duration-300`}
                >
                    Recommended Videos
                </h1>
                <p
                    className={`text-sm mt-1 ${t.subHeading} transition-colors duration-300`}
                >
                    Discover the latest and trending content
                </p>
            </div>

            {/* Optional: Filter/Sort Section */}
            <div
                className={`flex items-center gap-4 mb-6 pb-4 border-b ${t.border}`}
            >
                <span className={`text-sm ${t.textMuted}`}>
                    {pagination?.totalVideos || 0} videos
                </span>
                <div className={`h-4 w-px ${t.divider}`} />
                <span className={`text-sm ${t.textFaded}`}>
                    Sorted by latest
                </span>
            </div>

            {/* Video Grid */}
            <VideoGrid
                videos={videos}
                layout="grid"
                loading={loading}
                columns={4}
                emptyMessage="No videos available"
                theme={t} // Pass theme to VideoGrid if needed
                isDark={isDark}
            />

            {/* Pagination */}
            {pagination && (
                <div className={`mt-8 pt-6 border-t ${t.border}`}>
                    <Pagination
                        currentPage={pagination.currentPage}
                        totalPages={pagination.totalPages}
                        hasNextPage={pagination.hasNextPage}
                        hasPrevPage={pagination.hasPrevPage}
                        onPageChange={(page) => {
                            setCurrentPage(page);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        theme={t} // Pass theme to Pagination if needed
                        isDark={isDark}
                    />
                </div>
            )}

            {/* Empty State with Theme */}
            {!loading && videos.length === 0 && (
                <div
                    className={`flex flex-col items-center justify-center py-16 ${t.emptyState}`}
                >
                    <svg
                        className={`w-16 h-16 mb-4 ${t.icon}`}
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
                    <h3 className={`text-lg font-medium ${t.heading}`}>
                        No videos found
                    </h3>
                    <p className={`text-sm ${t.textMuted}`}>
                        Check back later for new content
                    </p>
                </div>
            )}
        </div>
    );
};

export default Home;
