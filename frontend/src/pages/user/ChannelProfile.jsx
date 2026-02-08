import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import ChannelProfileCard from "../../components/ChannelCard.jsx";
import VideoGrid from "../../components/VideoGrid";
import PostGrid from "../../components/PostGrid";
import useAxiosPrivate from "../../hooks/useAxiosPrivate.hooks.js";
import useAuth from "../../hooks/useAuth.hooks.js";
import { selectTheme } from "../../features/theme/themeSlice";

const UserChannelPage = () => {
    const axiosPrivate = useAxiosPrivate();
    const { username } = useParams();
    const theme = useSelector(selectTheme);
    const isDark = theme === "dark";

    const themeStyles = {
        dark: {
            background: "bg-gray-900",
            text: "text-white",
            textMuted: "text-gray-400",
            textFaded: "text-gray-500",
            border: "border-gray-800",
            sectionTitle: "text-white",
            loading: "text-gray-400",
            paginationBtn: "bg-gray-800 text-white hover:bg-gray-700",
            paginationBtnDisabled: "bg-gray-800 text-gray-500 opacity-50",
            paginationText: "text-white",
            emptyState: "text-gray-400",
            accentBorder: "border-purple-500",
            tabActive: "border-purple-500 text-purple-400",
            tabInactive: "border-transparent text-gray-400 hover:text-gray-300",
        },
        light: {
            background: "bg-gray-50",
            text: "text-gray-900",
            textMuted: "text-gray-600",
            textFaded: "text-gray-500",
            border: "border-gray-300",
            sectionTitle: "text-gray-800",
            loading: "text-gray-500",
            paginationBtn: "bg-gray-200 text-gray-800 hover:bg-gray-300",
            paginationBtnDisabled: "bg-gray-200 text-gray-400 opacity-50",
            paginationText: "text-gray-800",
            emptyState: "text-gray-500",
            accentBorder: "border-purple-500",
            tabActive: "border-purple-500 text-purple-600",
            tabInactive: "border-transparent text-gray-500 hover:text-gray-700",
        },
    };

    const t = isDark ? themeStyles.dark : themeStyles.light;

    // State for Channel Profile
    const [channel, setChannel] = useState(null);
    const [channelLoading, setChannelLoading] = useState(true);

    // State for Active Tab
    const [activeTab, setActiveTab] = useState("videos");

    // State for Videos
    const [videos, setVideos] = useState([]);
    const [videosLoading, setVideosLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState({});

    // State for Posts
    const [posts, setPosts] = useState([]);
    const [postsLoading, setPostsLoading] = useState(false);
    const [postsPage, setPostsPage] = useState(1);
    const [postsPagination, setPostsPagination] = useState({});

    // 1. Fetch Channel Profile Information
    useEffect(() => {
        const fetchChannelProfile = async () => {
            setChannelLoading(true);
            try {
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

    // 2. Fetch Videos
    useEffect(() => {
        if (!channel?._id || activeTab !== "videos") return;

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
                        userId: channel._id,
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
    }, [currentPage, channel, activeTab]);

    // 3. Fetch Posts
    useEffect(() => {
        if (!channel?._id || activeTab !== "posts") return;

        const fetchPosts = async () => {
            setPostsLoading(true);
            try {
                const response = await axiosPrivate.get(
                    `/post/user/${channel._id}`,
                    {
                        params: {
                            page: postsPage,
                            limit: 12,
                        },
                    },
                );

                setPosts(response.data.data.posts || response.data.data || []);
                setPostsPagination(response.data.data.pagination || {});
            } catch (err) {
                console.error("Failed to fetch posts:", err);
            } finally {
                setPostsLoading(false);
            }
        };

        fetchPosts();
    }, [postsPage, channel, activeTab]);

    // Toggle Subscribe Handler
    const handleToggleSubscribe = async (channelId) => {
        try {
            await axiosPrivate.post(`users/toggle/subscribe/${channelId}`);
        } catch (error) {
            console.error("Subscription toggle failed", error);
        }
    };

    // Vote Handler
    const handleVote = async (postId, optionIndex) => {
        try {
            const response = await axiosPrivate.post(`/post/vote/${postId}`, {
                optionIndex,
            });

            setPosts((prev) =>
                prev.map((post) =>
                    post._id === postId ? response.data.data : post,
                ),
            );
        } catch (err) {
            console.error("Failed to vote:", err);
        }
    };

    if (channelLoading) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <div
                    className={`flex flex-col items-center gap-3 ${t.loading}`}
                >
                    <svg
                        className="animate-spin h-8 w-8"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                    </svg>
                    <span className="text-lg font-medium">
                        Loading Profile...
                    </span>
                </div>
            </div>
        );
    }

    if (!channel) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <div className={`text-center ${t.textMuted}`}>
                    <svg
                        className="w-16 h-16 mx-auto mb-4 opacity-50"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    <p className="text-xl font-semibold">Channel not found</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-4 md:p-8">
            {/* Top Section: Channel Card */}
            <ChannelProfileCard
                channelData={channel}
                onToggleSubscribe={handleToggleSubscribe}
            />

            {/* Divider */}
            <hr className={`my-8 ${t.border}`} />

            {/* Tabs */}
            <div className="max-w-7xl mx-auto">
                <div className={`flex gap-8 border-b ${t.border} mb-6`}>
                    <button
                        onClick={() => {
                            setActiveTab("videos");
                            setCurrentPage(1);
                        }}
                        className={`pb-3 px-1 font-semibold text-sm border-b-2 transition-colors duration-200 ${
                            activeTab === "videos" ? t.tabActive : t.tabInactive
                        }`}
                    >
                        Videos
                    </button>
                    <button
                        onClick={() => {
                            setActiveTab("posts");
                            setPostsPage(1);
                        }}
                        className={`pb-3 px-1 font-semibold text-sm border-b-2 transition-colors duration-200 ${
                            activeTab === "posts" ? t.tabActive : t.tabInactive
                        }`}
                    >
                        Posts
                    </button>
                </div>

                {/* Videos Tab */}
                {activeTab === "videos" && (
                    <>
                        {videosLoading ? (
                            <div className={`text-center py-10 ${t.loading}`}>
                                <svg
                                    className="animate-spin h-8 w-8 mx-auto mb-3"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    />
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    />
                                </svg>
                                <span>Loading Videos...</span>
                            </div>
                        ) : videos.length > 0 ? (
                            <>
                                <VideoGrid videos={videos} />

                                {/* Pagination Control */}
                                {pagination.totalPages > 1 && (
                                    <div className="flex justify-center mt-8 gap-4">
                                        <button
                                            disabled={!pagination.hasPrevPage}
                                            onClick={() =>
                                                setCurrentPage(
                                                    (prev) => prev - 1,
                                                )
                                            }
                                            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                                                pagination.hasPrevPage
                                                    ? t.paginationBtn
                                                    : t.paginationBtnDisabled
                                            } disabled:cursor-not-allowed`}
                                        >
                                            Previous
                                        </button>
                                        <span
                                            className={`self-center font-medium ${t.paginationText}`}
                                        >
                                            Page {currentPage} of{" "}
                                            {pagination.totalPages}
                                        </span>
                                        <button
                                            disabled={!pagination.hasNextPage}
                                            onClick={() =>
                                                setCurrentPage(
                                                    (prev) => prev + 1,
                                                )
                                            }
                                            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                                                pagination.hasNextPage
                                                    ? t.paginationBtn
                                                    : t.paginationBtnDisabled
                                            } disabled:cursor-not-allowed`}
                                        >
                                            Next
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div
                                className={`text-center py-10 ${t.emptyState}`}
                            >
                                <svg
                                    className="w-16 h-16 mx-auto mb-4 opacity-50"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                                    />
                                </svg>
                                <p className="text-lg font-medium">
                                    This channel has no videos yet.
                                </p>
                            </div>
                        )}
                    </>
                )}

                {/* Posts Tab */}
                {activeTab === "posts" && (
                    <>
                        {postsLoading ? (
                            <div className={`text-center py-10 ${t.loading}`}>
                                <svg
                                    className="animate-spin h-8 w-8 mx-auto mb-3"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    />
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    />
                                </svg>
                                <span>Loading Posts...</span>
                            </div>
                        ) : posts.length > 0 ? (
                            <>
                                <PostGrid posts={posts} onVote={handleVote} />

                                {/* Pagination Control */}
                                {postsPagination.totalPages > 1 && (
                                    <div className="flex justify-center mt-8 gap-4">
                                        <button
                                            disabled={
                                                !postsPagination.hasPrevPage
                                            }
                                            onClick={() =>
                                                setPostsPage((prev) => prev - 1)
                                            }
                                            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                                                postsPagination.hasPrevPage
                                                    ? t.paginationBtn
                                                    : t.paginationBtnDisabled
                                            } disabled:cursor-not-allowed`}
                                        >
                                            Previous
                                        </button>
                                        <span
                                            className={`self-center font-medium ${t.paginationText}`}
                                        >
                                            Page {postsPage} of{" "}
                                            {postsPagination.totalPages}
                                        </span>
                                        <button
                                            disabled={
                                                !postsPagination.hasNextPage
                                            }
                                            onClick={() =>
                                                setPostsPage((prev) => prev + 1)
                                            }
                                            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                                                postsPagination.hasNextPage
                                                    ? t.paginationBtn
                                                    : t.paginationBtnDisabled
                                            } disabled:cursor-not-allowed`}
                                        >
                                            Next
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div
                                className={`text-center py-10 ${t.emptyState}`}
                            >
                                <svg
                                    className="w-16 h-16 mx-auto mb-4 opacity-50"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                    />
                                </svg>
                                <p className="text-lg font-medium">
                                    This channel has no posts yet.
                                </p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default UserChannelPage;
