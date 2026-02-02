import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ChannelProfileCard from "../../components/ChannelCard.jsx";
import VideoGrid from "../../components/VideoGrid"; // Your existing component
import useAxiosPrivate from "../../hooks/useAxiosPrivate.hooks.js"; // Adjust path to your axios instance
import useAuth from "../../hooks/useAuth.hooks.js";

const UserChannelPage = () => {
    const axiosPrivate = useAxiosPrivate();

    //const { user } = useAuth();
    //const username = user.username;

    const { username } = useParams();

    // State for Channel Profile
    const [channel, setChannel] = useState(null);
    const [channelLoading, setChannelLoading] = useState(true);

    // State for Videos
    const [videos, setVideos] = useState([]);
    const [videosLoading, setVideosLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState({});

    // 1. Fetch Channel Profile Information
    useEffect(() => {
        const fetchChannelProfile = async () => {
            setChannelLoading(true);
            try {
                // Adjust route if your API prefix is different
                const response = await axiosPrivate.get(`/users/c/${username}`);
                setChannel(response.data.data);
            } catch (err) {
                console.error("Failed to fetch channel profile:", err);
            } finally {
                setChannelLoading(false);
            }
        };

        if (username) {
            fetchChannelProfile();
        }
    }, [username]);

    // 2. Fetch Videos (Modified snippet as requested)
    useEffect(() => {
        // We must have the channel ID before fetching their videos
        if (!channel?._id) return;

        const fetchVideos = async () => {
            setVideosLoading(true);
            try {
                const response = await axiosPrivate.get("/video", {
                    params: {
                        query: "",
                        page: currentPage,
                        limit: 12,
                        sortBy: "createdAt",
                        sortType: "desc",
                        userId: channel._id, // <--- PASSED USER ID HERE
                    },
                });

                setVideos(response.data.data.videos);
                setPagination(response.data.data.pagination);
            } catch (err) {
                console.error("Failed to fetch videos:", err);
            } finally {
                setVideosLoading(false);
            }
        };

        fetchVideos();
    }, [currentPage, channel]); // Added channel dependency

    // Toggle Subscribe Handler (passed to card)
    const handleToggleSubscribe = async (channelId) => {
        try {
            await axiosPrivate.post(`/subscriptions/c/${channelId}`);
        } catch (error) {
            console.error("Subscription toggle failed", error);
        }
    };

    if (channelLoading) {
        return (
            <div className="flex justify-center mt-10">Loading Profile...</div>
        );
    }

    if (!channel) {
        return (
            <div className="flex justify-center mt-10">Channel not found</div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black p-4 md:p-8">
            {/* Top Section: Channel Card */}
            <ChannelProfileCard
                channelData={channel}
                onToggleSubscribe={handleToggleSubscribe}
            />

            {/* Divider */}
            <hr className="my-8 border-gray-300 dark:border-gray-800" />

            {/* Bottom Section: Videos */}
            <div className="max-w-7xl mx-auto">
                <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-white pl-2 border-l-4 border-purple-500">
                    Videos
                </h2>

                {videosLoading ? (
                    <div className="text-center text-gray-500">
                        Loading Videos...
                    </div>
                ) : videos.length > 0 ? (
                    <>
                        <VideoGrid videos={videos} />

                        {/* Simple Pagination Control */}
                        {pagination.totalPages > 1 && (
                            <div className="flex justify-center mt-8 gap-4">
                                <button
                                    disabled={!pagination.hasPrevPage}
                                    onClick={() =>
                                        setCurrentPage((prev) => prev - 1)
                                    }
                                    className="px-4 py-2 bg-gray-200 dark:bg-gray-800 rounded disabled:opacity-50"
                                >
                                    Previous
                                </button>
                                <span className="self-center dark:text-white">
                                    Page {currentPage} of{" "}
                                    {pagination.totalPages}
                                </span>
                                <button
                                    disabled={!pagination.hasNextPage}
                                    onClick={() =>
                                        setCurrentPage((prev) => prev + 1)
                                    }
                                    className="px-4 py-2 bg-gray-200 dark:bg-gray-800 rounded disabled:opacity-50"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                        This channel has no videos yet.
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserChannelPage;
