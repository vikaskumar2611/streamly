import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth.hooks.js";
import useAxiosPrivate from "../../hooks/useAxiosPrivate.hooks.js";
import { selectTheme } from "../../features/theme/themeSlice";
import {
    Eye,
    PlaySquare,
    Clock,
    TrendingUp,
    Video,
    Upload,
    ChevronRight,
    BarChart3,
} from "lucide-react";

const Dashboard = () => {
    const { user } = useAuth();
    const axiosPrivate = useAxiosPrivate();
    const theme = useSelector(selectTheme);
    const isDark = theme === "dark";

    const [stats, setStats] = useState({
        totalViews: 0,
        totalVideos: 0,
        totalWatchMinutes: 0,
    });
    const [topVideos, setTopVideos] = useState([]);
    const [loading, setLoading] = useState(true);

    const themeStyles = {
        dark: {
            page: "bg-gray-900",
            heading: "text-white",
            subHeading: "text-gray-400",
            text: "text-white",
            textMuted: "text-gray-400",
            textFaded: "text-gray-500",
            accent: "text-purple-400",
            card: "bg-gray-800 border-gray-700",
            cardHover: "hover:bg-gray-750",
            cardIcon: "bg-gray-700",
            tableHeader: "bg-gray-800 text-gray-400",
            tableRow: "hover:bg-gray-800/50",
            tableBorder: "divide-gray-700 border-gray-700",
            skeleton: "bg-gray-700",
            emptyIcon: "text-gray-600",
            emptyText: "text-gray-500",
            mobileCard: "bg-gray-800/60 border-gray-700/60",
            badge: "bg-gray-700 text-gray-300",
            divider: "border-gray-700/50",
        },
        light: {
            page: "bg-gray-50",
            heading: "text-gray-900",
            subHeading: "text-gray-600",
            text: "text-gray-900",
            textMuted: "text-gray-600",
            textFaded: "text-gray-500",
            accent: "text-purple-600",
            card: "bg-white border-gray-200 shadow-sm",
            cardHover: "hover:shadow-md",
            cardIcon: "bg-gray-100",
            tableHeader: "bg-gray-100 text-gray-600",
            tableRow: "hover:bg-gray-50",
            tableBorder: "divide-gray-200 border-gray-200",
            skeleton: "bg-gray-200",
            emptyIcon: "text-gray-300",
            emptyText: "text-gray-400",
            mobileCard: "bg-white border-gray-200",
            badge: "bg-gray-100 text-gray-600",
            divider: "border-gray-200",
        },
    };

    const t = isDark ? themeStyles.dark : themeStyles.light;

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            try {
                const response = await axiosPrivate.get("/users/dashboard");
                const {
                    totalViews,
                    totalVideos,
                    totalWatchMinutes,
                    topVideos,
                } = response.data.data;

                setStats({ totalViews, totalVideos, totalWatchMinutes });
                setTopVideos(topVideos);
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        if (user?._id) {
            fetchDashboardData();
        }
    }, [user, axiosPrivate]);

    const formatNumber = (num) =>
        Intl.NumberFormat("en-US", { notation: "compact" }).format(num);

    const formatDuration = (totalSeconds) => {
        const hrs = Math.floor(totalSeconds / 3600);
        const mins = Math.floor((totalSeconds % 3600) / 60);
        if (hrs > 0) return `${hrs}h ${mins}m`;
        return `${mins}m`;
    };

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diff = now - date;
        const days = Math.floor(diff / 86400000);

        if (days === 0) return "Today";
        if (days === 1) return "Yesterday";
        if (days < 7) return `${days}d ago`;
        if (days < 30) return `${Math.floor(days / 7)}w ago`;
        if (days < 365) return `${Math.floor(days / 30)}mo ago`;
        return `${Math.floor(days / 365)}y ago`;
    };

    // ==================== LOADING SKELETON ====================
    if (loading) {
        return (
            <div
                className={`min-h-screen ${t.page} px-3 py-4 sm:p-4 md:p-6 lg:p-8 transition-colors duration-300`}
            >
                <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
                    {/* Header Skeleton */}
                    <div className="space-y-2">
                        <div
                            className={`h-7 sm:h-8 w-36 sm:w-48 rounded-lg ${t.skeleton} animate-pulse`}
                        />
                        <div
                            className={`h-4 sm:h-5 w-52 sm:w-64 rounded-lg ${t.skeleton} animate-pulse`}
                        />
                    </div>

                    {/* Stats Skeleton */}
                    <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className={`${t.card} p-4 sm:p-6 rounded-xl border animate-pulse ${
                                    i === 3 ? "xs:col-span-2 sm:col-span-1" : ""
                                }`}
                            >
                                <div className="flex items-center gap-3 sm:gap-4">
                                    <div
                                        className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full ${t.skeleton}`}
                                    />
                                    <div className="flex-1 space-y-2">
                                        <div
                                            className={`h-3 sm:h-4 w-20 sm:w-24 rounded ${t.skeleton}`}
                                        />
                                        <div
                                            className={`h-5 sm:h-6 w-14 sm:w-16 rounded ${t.skeleton}`}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Table/Cards Skeleton */}
                    <div
                        className={`${t.card} rounded-xl border overflow-hidden`}
                    >
                        <div className={`p-4 sm:p-6 border-b ${t.tableBorder}`}>
                            <div
                                className={`h-5 sm:h-6 w-40 sm:w-48 rounded ${t.skeleton} animate-pulse`}
                            />
                        </div>
                        <div className="p-4 sm:p-6 space-y-4">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div
                                    key={i}
                                    className="flex items-center gap-3 sm:gap-4 animate-pulse"
                                >
                                    <div
                                        className={`w-20 h-12 sm:w-24 sm:h-14 rounded-lg ${t.skeleton} shrink-0`}
                                    />
                                    <div className="flex-1 space-y-2">
                                        <div
                                            className={`h-3.5 sm:h-4 w-3/4 rounded ${t.skeleton}`}
                                        />
                                        <div
                                            className={`h-3 w-1/2 rounded ${t.skeleton}`}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // ==================== MAIN RENDER ====================
    return (
        <div
            className={`min-h-screen ${t.page} px-3 py-4 sm:p-4 md:p-6 lg:p-8 transition-colors duration-300`}
        >
            <div className="max-w-7xl mx-auto space-y-5 sm:space-y-6 lg:space-y-8">
                {/* 1. Header */}
                <div className="flex flex-col gap-1">
                    <h1
                        className={`text-2xl sm:text-3xl font-bold ${t.heading} transition-colors duration-300`}
                    >
                        Dashboard
                    </h1>
                    <p
                        className={`text-base sm:text-lg ${t.subHeading} transition-colors duration-300`}
                    >
                        Welcome back,{" "}
                        <span className={`font-semibold ${t.accent}`}>
                            {user?.fullName}
                        </span>
                        ! 👋
                    </p>
                </div>

                {/* 2. Stats Grid */}
                <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                    <StatCard
                        icon={
                            <Eye className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
                        }
                        label="Total Views"
                        value={formatNumber(stats.totalViews)}
                        theme={t}
                    />
                    <StatCard
                        icon={
                            <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500" />
                        }
                        label="Total Upload Time"
                        value={formatDuration(stats.totalWatchMinutes)}
                        theme={t}
                    />
                    <StatCard
                        icon={
                            <PlaySquare className="w-5 h-5 sm:w-6 sm:h-6 text-purple-500" />
                        }
                        label="Total Videos"
                        value={stats.totalVideos}
                        theme={t}
                        className="xs:col-span-2 sm:col-span-1"
                    />
                </div>

                {/* 3. Top Videos */}
                <div
                    className={`${t.card} rounded-xl border overflow-hidden transition-colors duration-300`}
                >
                    {/* Section Header */}
                    <div
                        className={`px-4 py-3 sm:p-6 border-b ${t.tableBorder}`}
                    >
                        <div className="flex items-center gap-2 sm:gap-3">
                            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                            <h2
                                className={`text-base sm:text-xl font-bold ${t.heading} transition-colors duration-300`}
                            >
                                Top Performing Videos
                            </h2>
                        </div>
                    </div>

                    {topVideos.length > 0 ? (
                        <>
                            {/* ===== Desktop Table (hidden on mobile) ===== */}
                            <div className="hidden md:block overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead
                                        className={`${t.tableHeader} text-xs uppercase font-medium transition-colors duration-300`}
                                    >
                                        <tr>
                                            <th className="px-6 py-4">#</th>
                                            <th className="px-6 py-4">Video</th>
                                            <th className="px-6 py-4">
                                                Date Uploaded
                                            </th>
                                            <th className="px-6 py-4">
                                                Duration
                                            </th>
                                            <th className="px-6 py-4 text-right">
                                                Views
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody
                                        className={`divide-y ${t.tableBorder}`}
                                    >
                                        {topVideos.map((video, index) => (
                                            <tr
                                                key={video._id}
                                                className={`${t.tableRow} transition-colors duration-200`}
                                            >
                                                <td
                                                    className={`px-6 py-4 text-sm font-medium ${t.textMuted}`}
                                                >
                                                    {index + 1}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className="relative shrink-0">
                                                            <img
                                                                src={
                                                                    video.thumbnail
                                                                }
                                                                alt=""
                                                                className="w-20 h-12 object-cover rounded-lg"
                                                            />
                                                            <span className="absolute bottom-0.5 right-0.5 bg-black/80 text-white text-[10px] px-1 rounded">
                                                                {formatDuration(
                                                                    video.duration,
                                                                )}
                                                            </span>
                                                        </div>
                                                        <p
                                                            className={`font-medium ${t.text} truncate max-w-xs transition-colors duration-300`}
                                                            title={video.title}
                                                        >
                                                            {video.title}
                                                        </p>
                                                    </div>
                                                </td>
                                                <td
                                                    className={`px-6 py-4 text-sm ${t.textMuted} transition-colors duration-300`}
                                                >
                                                    {new Date(
                                                        video.createdAt,
                                                    ).toLocaleDateString()}
                                                </td>
                                                <td
                                                    className={`px-6 py-4 text-sm ${t.textMuted} transition-colors duration-300`}
                                                >
                                                    {formatDuration(
                                                        video.duration,
                                                    )}
                                                </td>
                                                <td
                                                    className={`px-6 py-4 text-right font-semibold ${t.text} transition-colors duration-300`}
                                                >
                                                    {formatNumber(video.views)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* ===== Mobile Card List (hidden on desktop) ===== */}
                            <div className="md:hidden divide-y ${t.tableBorder}">
                                {topVideos.map((video, index) => (
                                    <MobileVideoCard
                                        key={video._id}
                                        video={video}
                                        index={index}
                                        theme={t}
                                        formatNumber={formatNumber}
                                        formatDuration={formatDuration}
                                        formatDate={formatDate}
                                    />
                                ))}
                            </div>
                        </>
                    ) : (
                        /* Empty State */
                        <div className="px-4 py-10 sm:px-6 sm:py-16 text-center">
                            <div className="flex flex-col items-center gap-3 sm:gap-4">
                                <div
                                    className={`p-3 sm:p-4 rounded-full ${t.cardIcon}`}
                                >
                                    <Upload
                                        className={`w-6 h-6 sm:w-8 sm:h-8 ${t.emptyIcon}`}
                                    />
                                </div>
                                <div>
                                    <p
                                        className={`font-medium text-sm sm:text-base ${t.text}`}
                                    >
                                        No videos yet
                                    </p>
                                    <p
                                        className={`text-xs sm:text-sm mt-1 ${t.emptyText}`}
                                    >
                                        Upload your first video to see stats!
                                    </p>
                                </div>
                                <Link
                                    to="/upload"
                                    className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-full transition-colors active:scale-95"
                                >
                                    <Upload className="w-4 h-4" />
                                    Upload Video
                                </Link>
                            </div>
                        </div>
                    )}
                </div>

                {/* 4. Quick Actions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <QuickActionCard
                        icon={<Upload className="w-5 h-5" />}
                        title="Upload New Video"
                        description="Share your content with the world"
                        link="/upload"
                        theme={t}
                        color="blue"
                    />
                    <QuickActionCard
                        icon={<Video className="w-5 h-5" />}
                        title="Manage Videos"
                        description="Edit, delete, or organize your videos"
                        link={`/c/${user?.username}`}
                        theme={t}
                        color="purple"
                    />
                </div>
            </div>
        </div>
    );
};

// ==================== STAT CARD ====================
const StatCard = ({ icon, label, value, theme: t, className = "" }) => (
    <div
        className={`${t.card} p-4 sm:p-6 rounded-xl border flex items-center gap-3 sm:gap-4 transition-all duration-300 ${t.cardHover} hover:-translate-y-0.5 sm:hover:-translate-y-1 ${className}`}
    >
        <div
            className={`p-2.5 sm:p-3 ${t.cardIcon} rounded-full transition-colors duration-300 shrink-0`}
        >
            {icon}
        </div>
        <div className="min-w-0">
            <p
                className={`text-xs sm:text-sm ${t.textMuted} font-medium transition-colors duration-300`}
            >
                {label}
            </p>
            <p
                className={`text-xl sm:text-2xl font-bold ${t.text} transition-colors duration-300 truncate`}
            >
                {value}
            </p>
        </div>
    </div>
);

// ==================== MOBILE VIDEO CARD ====================
const MobileVideoCard = ({
    video,
    index,
    theme: t,
    formatNumber,
    formatDuration,
    formatDate,
}) => (
    <div
        className={`flex items-start gap-3 p-3 sm:p-4 ${t.tableRow} transition-colors duration-200`}
    >
        {/* Rank */}
        <div
            className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-1 text-xs font-bold ${
                index === 0
                    ? "bg-yellow-500/20 text-yellow-500"
                    : index === 1
                      ? "bg-gray-400/20 text-gray-400"
                      : index === 2
                        ? "bg-orange-500/20 text-orange-500"
                        : `${t.badge} text-xs`
            }`}
        >
            {index + 1}
        </div>

        {/* Thumbnail */}
        <div className="relative shrink-0">
            <img
                src={video.thumbnail}
                alt=""
                className="w-24 h-14 sm:w-28 sm:h-16 object-cover rounded-lg"
            />
            <span className="absolute bottom-0.5 right-0.5 bg-black/80 text-white text-[10px] px-1 rounded">
                {formatDuration(video.duration)}
            </span>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
            <p
                className={`text-sm font-medium ${t.text} line-clamp-2 leading-tight transition-colors duration-300`}
            >
                {video.title}
            </p>
            <div
                className={`flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-1.5 text-xs ${t.textMuted}`}
            >
                <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {formatNumber(video.views)}
                </span>
                <span>{formatDate(video.createdAt)}</span>
            </div>
        </div>
    </div>
);

// ==================== QUICK ACTION CARD ====================
const QuickActionCard = ({
    icon,
    title,
    description,
    link,
    theme: t,
    color,
}) => {
    const colorClasses = {
        blue: "bg-blue-500 hover:bg-blue-600 shadow-blue-500/25",
        purple: "bg-purple-500 hover:bg-purple-600 shadow-purple-500/25",
        green: "bg-green-500 hover:bg-green-600 shadow-green-500/25",
        orange: "bg-orange-500 hover:bg-orange-600 shadow-orange-500/25",
    };

    return (
        <Link
            to={link}
            className={`${t.card} p-4 sm:p-6 rounded-xl border flex items-center gap-3 sm:gap-4 transition-all duration-300 ${t.cardHover} hover:-translate-y-0.5 sm:hover:-translate-y-1 group active:scale-[0.98]`}
        >
            <div
                className={`p-2.5 sm:p-3 rounded-full text-white shrink-0 shadow-md ${colorClasses[color]} transition-colors duration-300`}
            >
                {icon}
            </div>
            <div className="flex-1 min-w-0">
                <p
                    className={`font-semibold text-sm sm:text-base ${t.text} transition-colors duration-300`}
                >
                    {title}
                </p>
                <p
                    className={`text-xs sm:text-sm ${t.textMuted} transition-colors duration-300 truncate`}
                >
                    {description}
                </p>
            </div>
            <ChevronRight
                className={`w-4 h-4 sm:w-5 sm:h-5 ${t.textFaded} group-hover:translate-x-0.5 transition-all duration-200 shrink-0`}
            />
        </Link>
    );
};

export default Dashboard;
