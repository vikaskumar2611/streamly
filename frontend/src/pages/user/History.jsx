import React, { useEffect, useState } from "react";

import VideoGrid from "../../components/VideoGrid";
import useAxiosPrivate from "../../hooks/useAxiosPrivate.hooks";

const WatchHistory = () => {
    const axiosPrivate = useAxiosPrivate();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchWatchHistory = async () => {
            setLoading(true);
            try {
                // Adjust the URL prefix based on your API routes (e.g., /users/history)
                const response = await axiosPrivate.get("/users/history");

                // The backend returns the array directly in response.data.data
                // We might want to reverse it to show most recently watched first
                // if the backend sends it in chronological order (Oldest -> Newest)
                const historyData = response.data.data;
                setHistory(historyData.reverse());
            } catch (err) {
                console.error("Error fetching watch history:", err);
                setError("Failed to load watch history.");
            } finally {
                setLoading(false);
            }
        };

        fetchWatchHistory();
    }, [axiosPrivate]);

    if (loading) {
        return (
            <div className="w-full h-[50vh] flex justify-center items-center">
                <p className="text-gray-500 dark:text-gray-400">
                    Loading history...
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full h-[50vh] flex justify-center items-center text-red-500">
                {error}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-800 pb-4">
                    <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full text-purple-600 dark:text-purple-300">
                        {/* Standard History/Clock SVG */}
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
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Watch History
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Videos you have watched recently
                        </p>
                    </div>
                </div>

                {/* Content Section */}
                {history.length > 0 ? (
                    <VideoGrid videos={history} />
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-full mb-4">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-10 h-10 text-gray-400"
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
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            No history found
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-sm">
                            It looks like you haven't watched any videos yet.
                            Start watching to see your history here!
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WatchHistory;
