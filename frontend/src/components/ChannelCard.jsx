import React, { useState } from "react";
import { useSelector } from "react-redux";
import useAuth from "../hooks/useAuth.hooks.js";
import { selectTheme } from "../features/theme/themeSlice";
import { Bell, UserCheck, Mail } from "lucide-react";

const ChannelProfileCard = ({ channelData, onToggleSubscribe }) => {
    const { user } = useAuth();
    const theme = useSelector(selectTheme);
    const isDark = theme === "dark";

    const t = isDark
        ? {
              card: "bg-gray-900 border-gray-800 shadow-xl shadow-black/30",
              coverFallback:
                  "bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600",
              coverTag: "text-white/50 bg-white/10 backdrop-blur-md",
              avatarBorder: "border-gray-900",
              avatarRing: "ring-gray-700/60",
              name: "text-white",
              username: "text-gray-400",
              statsNum: "text-white",
              statsText: "text-gray-400",
              email: "text-gray-500",
              dot: "text-gray-600",
              statCard: "bg-gray-800/60 border-gray-700/40",
              statLabel: "text-gray-500",
              statValue: "text-white",
              subBtn: "bg-red-600 text-white hover:bg-red-500 shadow-lg shadow-red-600/25",
              subdBtn:
                  "bg-gray-700/80 text-gray-200 hover:bg-gray-600 border border-gray-600/50",
              divider: "border-gray-800",
          }
        : {
              card: "bg-white border-gray-200 shadow-xl shadow-gray-200/60",
              coverFallback:
                  "bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-500",
              coverTag: "text-white/70 bg-white/15 backdrop-blur-md",
              avatarBorder: "border-white",
              avatarRing: "ring-gray-200",
              name: "text-gray-900",
              username: "text-gray-500",
              statsNum: "text-gray-900",
              statsText: "text-gray-500",
              email: "text-gray-400",
              dot: "text-gray-300",
              statCard: "bg-gray-50 border-gray-200/80",
              statLabel: "text-gray-500",
              statValue: "text-gray-900",
              subBtn: "bg-red-600 text-white hover:bg-red-500 shadow-lg shadow-red-600/20",
              subdBtn:
                  "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200",
              divider: "border-gray-100",
          };

    const [isSubscribed, setIsSubscribed] = useState(channelData.isSubscribed);
    const [subCount, setSubCount] = useState(channelData.subscribersCount);

    const handleSubscribeClick = () => {
        const next = !isSubscribed;
        setIsSubscribed(next);
        setSubCount((p) => (next ? p + 1 : p - 1));
        onToggleSubscribe?.(channelData._id);
    };

    const isOwnChannel = user?.username === channelData.username;

    const fmt = (n) => {
        if (!n && n !== 0) return "0";
        if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
        if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
        return n.toLocaleString();
    };

    const SubscribeButton = ({ fullWidth = false }) => {
        if (isOwnChannel) return null;
        return (
            <button
                onClick={handleSubscribeClick}
                className={`
                    inline-flex items-center justify-center gap-2
                    px-5 py-2.5 rounded-full font-semibold text-sm
                    transition-all duration-300 active:scale-95
                    ${fullWidth ? "w-full" : "hover:scale-[1.03] shrink-0"}
                    ${isSubscribed ? t.subdBtn : t.subBtn}
                `}
            >
                {isSubscribed ? (
                    <>
                        <Bell className="w-4 h-4" />
                        Subscribed
                    </>
                ) : (
                    <>
                        <UserCheck className="w-4 h-4" />
                        Subscribe
                    </>
                )}
            </button>
        );
    };

    return (
        <div
            className={`w-full max-w-4xl mx-auto rounded-2xl overflow-hidden border transition-all duration-300 ${t.card}`}
        >
            {/* Cover Image */}
            <div className="relative h-24 xs:h-28 sm:h-36 md:h-48 w-full">
                {channelData.coverImage ? (
                    <img
                        src={channelData.coverImage}
                        alt="Cover"
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div
                        className={`w-full h-full flex items-center justify-center ${t.coverFallback}`}
                    >
                        <span
                            className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg font-bold text-[10px] sm:text-xs md:text-sm tracking-widest uppercase ${t.coverTag}`}
                        >
                            No Cover
                        </span>
                    </div>
                )}
                <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/15 to-transparent pointer-events-none" />
            </div>

            {/* Profile Section */}
            <div className="px-3 xs:px-4 sm:px-6 pb-4 sm:pb-6 relative">
                {/* ===== MOBILE LAYOUT (< md) ===== */}
                <div className="md:hidden">
                    {/* Avatar + Name */}
                    <div className="flex items-end -mt-8 xs:-mt-10 sm:-mt-12 gap-3 sm:gap-4">
                        <img
                            src={channelData.avatar}
                            alt={channelData.username}
                            className={`
                                w-16 h-16 xs:w-20 xs:h-20 sm:w-24 sm:h-24
                                rounded-full border-[3px] sm:border-4 object-cover
                                shadow-xl ring-2 bg-white shrink-0
                                transition-all duration-300
                                ${t.avatarBorder} ${t.avatarRing}
                            `}
                        />
                        <div className="pb-0.5 sm:pb-1 min-w-0 flex-1">
                            <h1
                                className={`text-lg xs:text-xl sm:text-2xl font-bold leading-tight truncate ${t.name}`}
                            >
                                {channelData.fullName}
                            </h1>
                            <p
                                className={`text-xs sm:text-sm font-medium truncate ${t.username}`}
                            >
                                @{channelData.username}
                            </p>
                        </div>
                    </div>

                    {/* Stat Cards */}
                    <div className="flex items-center gap-3 sm:gap-4 mt-3 sm:mt-4">
                        <div
                            className={`flex-1 text-center py-2.5 rounded-xl border transition-colors duration-300 ${t.statCard}`}
                        >
                            <p
                                className={`text-base sm:text-lg font-bold ${t.statValue}`}
                            >
                                {fmt(subCount)}
                            </p>
                            <p
                                className={`text-[10px] sm:text-xs ${t.statLabel}`}
                            >
                                Subscribers
                            </p>
                        </div>
                        <div
                            className={`flex-1 text-center py-2.5 rounded-xl border transition-colors duration-300 ${t.statCard}`}
                        >
                            <p
                                className={`text-base sm:text-lg font-bold ${t.statValue}`}
                            >
                                {fmt(channelData.channelsSubscribedToCount)}
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
                        className={`flex items-center gap-1.5 mt-2.5 sm:mt-3 text-[11px] sm:text-xs ${t.email}`}
                    >
                        <Mail className="w-3 h-3 shrink-0" />
                        <span className="truncate">{channelData.email}</span>
                    </div>

                    {/* Subscribe */}
                    <div className="mt-3 sm:mt-4">
                        <SubscribeButton fullWidth />
                    </div>
                </div>

                {/* ===== DESKTOP LAYOUT (md+) ===== */}
                <div className="hidden md:block">
                    <div className="flex items-end -mt-14 lg:-mt-16">
                        <img
                            src={channelData.avatar}
                            alt={channelData.username}
                            className={`
                                w-28 h-28 lg:w-32 lg:h-32 rounded-full border-4 object-cover
                                shadow-xl ring-2 bg-white shrink-0
                                transition-all duration-300
                                ${t.avatarBorder} ${t.avatarRing}
                            `}
                        />

                        <div className="ml-5 lg:ml-6 flex-1 pb-1 min-w-0">
                            <div className="flex items-start justify-between gap-4">
                                <div className="min-w-0 flex-1">
                                    <h1
                                        className={`text-2xl lg:text-3xl font-bold truncate ${t.name}`}
                                    >
                                        {channelData.fullName}
                                    </h1>
                                    <p
                                        className={`text-sm font-medium mt-0.5 ${t.username}`}
                                    >
                                        @{channelData.username}
                                    </p>

                                    {/* Stats inline */}
                                    <div
                                        className={`flex items-center gap-4 mt-2 text-sm ${t.statsText}`}
                                    >
                                        <span>
                                            <span
                                                className={`font-bold ${t.statsNum}`}
                                            >
                                                {subCount.toLocaleString()}
                                            </span>{" "}
                                            subscribers
                                        </span>
                                        <span className={t.dot}>•</span>
                                        <span>
                                            <span
                                                className={`font-bold ${t.statsNum}`}
                                            >
                                                {channelData.channelsSubscribedToCount?.toLocaleString() ||
                                                    0}
                                            </span>{" "}
                                            subscribed
                                        </span>
                                    </div>

                                    {/* Email */}
                                    <div
                                        className={`flex items-center gap-1.5 mt-1.5 text-xs ${t.email}`}
                                    >
                                        <Mail className="w-3 h-3 shrink-0" />
                                        <span>{channelData.email}</span>
                                    </div>
                                </div>

                                <div className="mt-1">
                                    <SubscribeButton />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChannelProfileCard;
