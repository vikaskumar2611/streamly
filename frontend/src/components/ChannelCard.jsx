import React, { useState } from "react";

const ChannelProfileCard = ({ channelData, onToggleSubscribe }) => {
    // Local state to handle optimistic UI updates when clicking subscribe
    const [isSubscribed, setIsSubscribed] = useState(channelData.isSubscribed);
    const [subCount, setSubCount] = useState(channelData.subscribersCount);

    const handleSubscribeClick = () => {
        // Optimistic update: toggle UI immediately
        const newState = !isSubscribed;
        setIsSubscribed(newState);
        setSubCount((prev) => (newState ? prev + 1 : prev - 1));

        // Call parent function to hit the API
        if (onToggleSubscribe) {
            onToggleSubscribe(channelData._id);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-800">
            {/* 1. Cover Image Section */}
            <div className="relative h-32 md:h-48 w-full bg-gray-300">
                {channelData.coverImage ? (
                    <img
                        src={channelData.coverImage}
                        alt="Cover"
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold text-xl">
                        NO COVER
                    </div>
                )}
            </div>

            {/* 2. Profile Info Section */}
            <div className="px-6 pb-6 relative">
                <div className="flex flex-col md:flex-row items-start md:items-end -mt-12 mb-4 md:mb-0">
                    {/* Avatar */}
                    <div className="relative">
                        <img
                            src={channelData.avatar}
                            alt={channelData.username}
                            className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white dark:border-gray-900 object-cover shadow-md bg-white"
                        />
                    </div>

                    {/* Text Info */}
                    <div className="mt-4 md:mt-0 md:ml-6 flex-1 text-center md:text-left">
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                            {channelData.fullName}
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 font-medium">
                            @{channelData.username}
                        </p>

                        {/* Counts */}
                        <div className="flex items-center justify-center md:justify-start gap-4 mt-2 text-sm text-gray-600 dark:text-gray-300">
                            <span>
                                <span className="font-bold text-gray-900 dark:text-white">
                                    {subCount}
                                </span>{" "}
                                subscribers
                            </span>
                            <span>•</span>
                            <span>
                                <span className="font-bold text-gray-900 dark:text-white">
                                    {channelData.channelsSubscribedToCount}
                                </span>{" "}
                                subscribed
                            </span>
                        </div>

                        {/* Email */}
                        <div className="flex items-center justify-center md:justify-start gap-2 mt-1 text-xs text-gray-400">
                            {/* Standard Mail SVG */}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-3 h-3"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <rect
                                    width="20"
                                    height="16"
                                    x="2"
                                    y="4"
                                    rx="2"
                                />
                                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                            </svg>
                            <span>{channelData.email}</span>
                        </div>
                    </div>

                    {/* 3. Action Button */}
                    <div className="mt-6 md:mt-0 md:mb-2 w-full md:w-auto">
                        <button
                            onClick={handleSubscribeClick}
                            className={`
                                flex items-center justify-center gap-2 px-6 py-2 rounded-full font-semibold transition-all duration-200 w-full md:w-auto
                                ${
                                    isSubscribed
                                        ? "bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                                        : "bg-red-600 text-white hover:bg-red-700 shadow-md hover:shadow-lg"
                                }
                            `}
                        >
                            {isSubscribed ? (
                                <>
                                    {/* Standard Bell SVG */}
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="w-4 h-4"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                                        <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                                    </svg>
                                    Subscribed
                                </>
                            ) : (
                                <>
                                    {/* Standard User+ SVG */}
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="w-4 h-4"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                                        <circle cx="9" cy="7" r="4" />
                                        <polyline points="16 11 18 13 22 9" />
                                    </svg>
                                    Subscribe
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChannelProfileCard;
