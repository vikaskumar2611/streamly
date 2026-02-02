import React, { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth.hooks.js";
import useAxiosPrivate from "../../hooks/useAxiosPrivate.hooks.js";
import { Eye, PlaySquare, Clock, Heart } from "lucide-react";

const Dashboard = () => {
    const { user } = useAuth();
    const axiosPrivate = useAxiosPrivate();

    const [stats, setStats] = useState({
        totalViews: 0,
        totalVideos: 0,
        totalWatchMinutes: 0, // This comes from backend
    });
    const [topVideos, setTopVideos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            try {
                // 1. Single API call to your new controller
                const response = await axiosPrivate.get("/users/dashboard");

                // 2. Destructure the result based on your aggregation output
                const {
                    totalViews,
                    totalVideos,
                    totalWatchMinutes,
                    topVideos,
                } = response.data.data;

                // 3. Update State
                setStats({
                    totalViews,
                    totalVideos,
                    totalWatchMinutes,
                });

                // 4. Set Top Videos directly from the response array
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

    // Helper: Format Numbers (e.g., 1.5K)
    const formatNumber = (num) =>
        Intl.NumberFormat("en-US", { notation: "compact" }).format(num);

    // Helper: Format Duration
    // Note: Assuming your DB stores duration in SECONDS.
    // Your backend variable is named 'totalWatchMinutes', but it sums 'duration'.
    // If 'duration' is seconds, we format seconds.
    const formatDuration = (totalSeconds) => {
        const hrs = Math.floor(totalSeconds / 3600);
        const mins = Math.floor((totalSeconds % 3600) / 60);

        if (hrs > 0) return `${hrs}h ${mins}m`;
        return `${mins}m`;
    };

    if (loading)
        return (
            <div className="p-8 text-center text-white">
                Loading Dashboard...
            </div>
        );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black p-4 md:p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* 1. Header */}
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Dashboard
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">
                        Welcome back,{" "}
                        <span className="font-semibold text-purple-600 dark:text-purple-400">
                            {user?.fullName}
                        </span>
                        ! 👋
                    </p>
                </div>

                {/* 2. Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <StatCard
                        icon={<Eye className="w-6 h-6 text-blue-500" />}
                        label="Total Views"
                        value={formatNumber(stats.totalViews)}
                    />
                    <StatCard
                        icon={<Clock className="w-6 h-6 text-orange-500" />}
                        label="Total Watch Time"
                        // Assuming backend sums seconds. If backend sums minutes, remove formatDuration
                        value={formatDuration(stats.totalWatchMinutes)}
                    />
                    <StatCard
                        icon={
                            <PlaySquare className="w-6 h-6 text-purple-500" />
                        }
                        label="Total Videos"
                        value={stats.totalVideos}
                    />
                </div>

                {/* 3. Top 5 Videos Table */}
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
                    <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                            Top Performing Videos
                        </h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-xs uppercase font-medium">
                                <tr>
                                    <th className="px-6 py-4">Video</th>
                                    <th className="px-6 py-4">Date Uploaded</th>
                                    <th className="px-6 py-4">Duration</th>
                                    <th className="px-6 py-4 text-right">
                                        Views
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                                {topVideos.length > 0 ? (
                                    topVideos.map((video) => (
                                        <tr
                                            key={video._id}
                                            className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <img
                                                        src={video.thumbnail}
                                                        alt="Thumbnail"
                                                        className="w-16 h-9 object-cover rounded-md bg-gray-200"
                                                    />
                                                    <div className="max-w-xs">
                                                        <p
                                                            className="font-medium text-gray-900 dark:text-white truncate"
                                                            title={video.title}
                                                        >
                                                            {video.title}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                                {new Date(
                                                    video.createdAt,
                                                ).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                                {formatDuration(video.duration)}
                                            </td>
                                            <td className="px-6 py-4 text-right font-medium text-gray-900 dark:text-white">
                                                {formatNumber(video.views)}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="4"
                                            className="px-6 py-8 text-center text-gray-500"
                                        >
                                            No videos found. Upload your first
                                            video to see stats!
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Reusable Card Component
const StatCard = ({ icon, label, value }) => (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 flex items-center gap-4 transition-transform hover:-translate-y-1">
        <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-full">
            {icon}
        </div>
        <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                {label}
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {value}
            </p>
        </div>
    </div>
);

export default Dashboard;
