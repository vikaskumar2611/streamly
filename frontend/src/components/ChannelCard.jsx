import React, { useState } from "react";
import { useSelector } from "react-redux";
import useAuth from "../hooks/useAuth.hooks.js";
import { selectTheme } from "../features/theme/themeSlice";

const ChannelProfileCard = ({ channelData, onToggleSubscribe }) => {
    const { user } = useAuth();
    const theme = useSelector(selectTheme);
    const isDark = theme === "dark";

    const themeStyles = {
        dark: {
            card: "bg-gray-900 border-gray-800",
            cardShadow: "shadow-lg shadow-black/20",
            coverPlaceholder: "bg-gradient-to-r from-purple-600 to-blue-600",
            coverPlaceholderText: "text-white/80",
            avatarBorder: "border-gray-900",
            avatarRing: "ring-gray-700",
            name: "text-white",
            username: "text-gray-400",
            statsText: "text-gray-300",
            statsNumber: "text-white",
            emailText: "text-gray-500",
            emailIcon: "text-gray-500",
            subscribedBtn: "bg-gray-700 text-white hover:bg-gray-600",
            subscribeBtn:
                "bg-red-600 text-white hover:bg-red-700 shadow-md hover:shadow-lg",
            divider: "text-gray-600",
            statCard: "bg-gray-800/60 border-gray-700/50",
            statLabel: "text-gray-500",
            statValue: "text-white",
        },
        light: {
            card: "bg-white border-gray-200",
            cardShadow: "shadow-lg shadow-gray-200/50",
            coverPlaceholder: "bg-gradient-to-r from-purple-500 to-blue-500",
            coverPlaceholderText: "text-white/90",
            avatarBorder: "border-white",
            avatarRing: "ring-gray-200",
            name: "text-gray-900",
            username: "text-gray-500",
            statsText: "text-gray-600",
            statsNumber: "text-gray-900",
            emailText: "text-gray-400",
            emailIcon: "text-gray-400",
            subscribedBtn: "bg-gray-200 text-gray-800 hover:bg-gray-300",
            subscribeBtn:
                "bg-red-600 text-white hover:bg-red-700 shadow-md hover:shadow-lg",
            divider: "text-gray-400",
            statCard: "bg-gray-50 border-gray-200",
            statLabel: "text-gray-500",
            statValue: "text-gray-900",
        },
    };

    const t = isDark ? themeStyles.dark : themeStyles.light;

    const [isSubscribed, setIsSubscribed] = useState(channelData.isSubscribed);
    const [subCount, setSubCount] = useState(channelData.subscribersCount);

    const handleSubscribeClick = () => {
        const newState = !isSubscribed;
        setIsSubscribed(newState);
        setSubCount((prev) => (newState ? prev + 1 : prev - 1));

        if (onToggleSubscribe) {
            onToggleSubscribe(channelData._id);
        }
    };

    const isOwnChannel = user?.username === channelData.username;

    const formatCount = (count) => {
        if (!count && count !== 0) return "0";
        if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
        if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
        return count.toLocaleString();
    };

    return (
        <div
            className={`
                w-full max-w-4xl mx-auto rounded-xl overflow-hidden border
                transition-all duration-300
                ${t.card} ${t.cardShadow}
            `}
        >
            {/* ==================== COVER IMAGE ==================== */}
            <div className="relative h-24 xs:h-28 sm:h-36 md:h-48 w-full">
                {channelData.coverImage ? (
                    <img
                        src={channelData.coverImage}
                        alt="Cover"
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div
                        className={`
                            w-full h-full flex items-center justify-center
                            ${t.coverPlaceholder}
                        `}
                    >
                        <span
                            className={`
                                backdrop-blur-sm bg-black/10 px-3 py-1.5 sm:px-4 sm:py-2 
                                rounded-lg font-bold text-xs sm:text-sm md:text-xl
                                ${t.coverPlaceholderText}
                            `}
                        >
                            NO COVER
                        </span>
                    </div>
                )}
            </div>

            {/* ==================== PROFILE SECTION ==================== */}
            <div className="px-3 xs:px-4 sm:px-6 pb-4 sm:pb-6 relative">
                {/* ===== MOBILE LAYOUT (< md) ===== */}
                <div className="md:hidden">
                    {/* Avatar + Name Row */}
                    <div className="flex items-end -mt-8 xs:-mt-10 sm:-mt-12 gap-3 sm:gap-4">
                        {/* Avatar */}
                        <img
                            src={channelData.avatar}
                            alt={channelData.username}
                            className={`
                                w-16 h-16 xs:w-20 xs:h-20 sm:w-24 sm:h-24 
                                rounded-full border-[3px] sm:border-4 object-cover
                                shadow-lg ring-2 bg-white shrink-0
                                transition-all duration-300
                                ${t.avatarBorder} ${t.avatarRing}
                            `}
                        />

                        {/* Name + Username */}
                        <div className="pb-0.5 sm:pb-1 min-w-0 flex-1">
                            <h1
                                className={`
                                    text-lg xs:text-xl sm:text-2xl font-bold leading-tight truncate
                                    transition-colors duration-300 ${t.name}
                                `}
                            >
                                {channelData.fullName}
                            </h1>
                            <p
                                className={`
                                    text-xs sm:text-sm font-medium truncate
                                    transition-colors duration-300 ${t.username}
                                `}
                            >
                                @{channelData.username}
                            </p>
                        </div>
                    </div>

                    {/* Stats Row */}
                    <div className="flex items-center gap-3 sm:gap-4 mt-3 sm:mt-4">
                        <div
                            className={`
                                flex-1 text-center py-2 rounded-lg border
                                transition-colors duration-300 ${t.statCard}
                            `}
                        >
                            <p
                                className={`text-base sm:text-lg font-bold ${t.statValue}`}
                            >
                                {formatCount(subCount)}
                            </p>
                            <p
                                className={`text-[10px] sm:text-xs ${t.statLabel}`}
                            >
                                Subscribers
                            </p>
                        </div>
                        <div
                            className={`
                                flex-1 text-center py-2 rounded-lg border
                                transition-colors duration-300 ${t.statCard}
                            `}
                        >
                            <p
                                className={`text-base sm:text-lg font-bold ${t.statValue}`}
                            >
                                {formatCount(
                                    channelData.channelsSubscribedToCount,
                                )}
                            </p>
                            <p
                                className={`text-[10px] sm:text-xs ${t.statLabel}`}
                            >
                                Subscribed
                            </p>
                        </div>
                    </div>

                    {/* Email */}
                    <div
                        className={`
                            flex items-center gap-1.5 mt-2.5 sm:mt-3 text-[11px] sm:text-xs
                            transition-colors duration-300 ${t.emailText}
                        `}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className={`w-3 h-3 shrink-0 ${t.emailIcon}`}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <rect width="20" height="16" x="2" y="4" rx="2" />
                            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                        </svg>
                        <span className="truncate">{channelData.email}</span>
                    </div>

                    {/* Subscribe Button */}
                    {!isOwnChannel && (
                        <button
                            onClick={handleSubscribeClick}
                            className={`
                                flex items-center justify-center gap-2 w-full mt-3 sm:mt-4
                                px-5 py-2.5 rounded-full font-semibold text-sm
                                transition-all duration-300
                                active:scale-95
                                ${isSubscribed ? t.subscribedBtn : t.subscribeBtn}
                            `}
                        >
                            {isSubscribed ? (
                                <>
                                    <BellIcon />
                                    Subscribed
                                </>
                            ) : (
                                <>
                                    <SubscribeIcon />
                                    Subscribe
                                </>
                            )}
                        </button>
                    )}
                </div>

                {/* ===== DESKTOP LAYOUT (md+) ===== */}
                <div className="hidden md:block">
                    <div className="flex items-end -mt-14 lg:-mt-16">
                        {/* Avatar */}
                        <img
                            src={channelData.avatar}
                            alt={channelData.username}
                            className={`
                                w-28 h-28 lg:w-32 lg:h-32 rounded-full border-4 object-cover
                                shadow-lg ring-2 bg-white shrink-0
                                transition-all duration-300
                                ${t.avatarBorder} ${t.avatarRing}
                            `}
                        />

                        {/* Info */}
                        <div className="ml-5 lg:ml-6 flex-1 pb-1 min-w-0">
                            <div className="flex items-start justify-between gap-4">
                                {/* Text content */}
                                <div className="min-w-0 flex-1">
                                    <h1
                                        className={`
                                            text-2xl lg:text-3xl font-bold truncate
                                            transition-colors duration-300 ${t.name}
                                        `}
                                    >
                                        {channelData.fullName}
                                    </h1>
                                    <p
                                        className={`
                                            text-sm font-medium
                                            transition-colors duration-300 ${t.username}
                                        `}
                                    >
                                        @{channelData.username}
                                    </p>

                                    {/* Stats inline */}
                                    <div
                                        className={`
                                            flex items-center gap-4 mt-1.5 text-sm
                                            transition-colors duration-300 ${t.statsText}
                                        `}
                                    >
                                        <span>
                                            <span
                                                className={`font-bold ${t.statsNumber}`}
                                            >
                                                {subCount.toLocaleString()}
                                            </span>{" "}
                                            subscribers
                                        </span>
                                        <span className={t.divider}>•</span>
                                        <span>
                                            <span
                                                className={`font-bold ${t.statsNumber}`}
                                            >
                                                {channelData.channelsSubscribedToCount?.toLocaleString() ||
                                                    0}
                                            </span>{" "}
                                            subscribed
                                        </span>
                                    </div>

                                    {/* Email */}
                                    <div
                                        className={`
                                            flex items-center gap-2 mt-1 text-xs
                                            transition-colors duration-300 ${t.emailText}
                                        `}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className={`w-3 h-3 shrink-0 ${t.emailIcon}`}
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

                                {/* Subscribe Button */}
                                {!isOwnChannel && (
                                    <button
                                        onClick={handleSubscribeClick}
                                        className={`
                                            flex items-center gap-2 px-6 py-2.5 rounded-full
                                            font-semibold text-sm shrink-0 mt-1
                                            transition-all duration-300
                                            transform hover:scale-105 active:scale-95
                                            ${isSubscribed ? t.subscribedBtn : t.subscribeBtn}
                                        `}
                                    >
                                        {isSubscribed ? (
                                            <>
                                                <BellIcon />
                                                Subscribed
                                            </>
                                        ) : (
                                            <>
                                                <SubscribeIcon />
                                                Subscribe
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ==================== ICON COMPONENTS ====================
const BellIcon = () => (
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
);

const SubscribeIcon = () => (
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
);

export default ChannelProfileCard;
