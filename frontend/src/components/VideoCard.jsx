import React from "react";
import { Link } from "react-router-dom";

const VideoCard = ({ video }) => {
    // Prevent crash if data is loading
    if (!video) return null;

    const { _id, title, thumbnail, duration, views, createdAt, owner } = video;

    // 1. Simple Duration Formatter (seconds -> 05:30)
    const formatDuration = (seconds) => {
        const min = Math.floor(seconds / 60);
        const sec = Math.floor(seconds % 60);
        return `${min}:${sec.toString().padStart(2, "0")}`;
    };

    // 2. Simple Date Formatter (e.g., "5 days ago")
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return "Today";
        if (diffDays === 1) return "Yesterday";
        if (diffDays < 30) return `${diffDays} days ago`;
        if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
        return `${Math.floor(diffDays / 365)} years ago`;
    };

    return (
        <div className="w-full flex flex-col gap-3 cursor-pointer group">
            {/* --- THUMBNAIL SECTION --- */}
            <Link
                to={`/watch/${_id}`}
                className="relative w-full aspect-video bg-gray-800 rounded-xl overflow-hidden"
            >
                <img
                    src={thumbnail}
                    alt={title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
                {/* Duration Badge */}
                <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                    {formatDuration(duration)}
                </span>
            </Link>

            {/* --- DETAILS SECTION --- */}
            <div className="flex gap-3 items-start">
                {/* Channel Avatar */}
                <Link to={`/c/${owner?.username}`} className="shrink-0">
                    <img
                        src={owner?.avatar}
                        alt="avatar"
                        className="w-9 h-9 rounded-full object-cover bg-gray-700"
                    />
                </Link>

                {/* Text Info */}
                <div className="flex flex-col">
                    <Link to={`/watch/${_id}`}>
                        <h3 className="text-white font-semibold leading-snug line-clamp-2 group-hover:text-blue-400">
                            {title}
                        </h3>
                    </Link>

                    <Link
                        to={`/c/${owner?.username}`}
                        className="text-gray-400 text-sm hover:text-white mt-1"
                    >
                        {owner?.fullName}
                    </Link>

                    <div className="text-gray-400 text-sm">
                        <span>{views} views</span>
                        <span className="mx-1">•</span>
                        <span>{formatDate(createdAt)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VideoCard;
