// components/VideoGrid.jsx
import React from "react";
import VideoCard from "./VideoCard";

const VideoGrid = ({
    videos = [],
    loading = false,
    emptyMessage = "No videos found",
}) => {
    // Standard Responsive Grid Layout
    // Mobile: 1 col, Tablet: 2 cols, Desktop: 3 cols, Large Screen: 4 cols
    const gridClasses =
        "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6";

    // 1. Loading State (Show Skeletons)
    if (loading) {
        return (
            <div className={gridClasses}>
                {Array.from({ length: 8 }).map((_, index) => (
                    <VideoCardSkeleton key={index} />
                ))}
            </div>
        );
    }

    // 2. Empty State
    if (!videos || videos.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <svg
                    className="w-16 h-16 mb-4 opacity-50"
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
                <p className="text-lg font-medium">{emptyMessage}</p>
            </div>
        );
    }

    // 3. Data State
    return (
        <div className={gridClasses}>
            {videos.map((video) => (
                <VideoCard key={video._id} video={video} />
            ))}
        </div>
    );
};

// Simplified Skeleton to match your new VideoCard
const VideoCardSkeleton = () => {
    return (
        <div className="flex flex-col gap-3 animate-pulse">
            {/* Thumbnail Box */}
            <div className="w-full aspect-video bg-gray-700 rounded-xl" />

            <div className="flex gap-3">
                {/* Avatar Circle */}
                <div className="w-9 h-9 bg-gray-700 rounded-full shrink-0" />

                {/* Text Lines */}
                <div className="flex-1 flex flex-col gap-2 pt-1">
                    {/* Title Line */}
                    <div className="h-4 bg-gray-700 rounded w-11/12" />
                    {/* Meta Line */}
                    <div className="h-3 bg-gray-700 rounded w-2/3" />
                </div>
            </div>
        </div>
    );
};

export default VideoGrid;
