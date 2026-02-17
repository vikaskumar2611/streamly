import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import ChannelProfileCard from "../../components/ChannelCard.jsx";
import VideoGrid from "../../components/VideoGrid";
import PostGrid from "../../components/PostGrid";
import useAxiosPrivate from "../../hooks/useAxiosPrivate.hooks.js";
import useAuth from "../../hooks/useAuth.hooks.js";
import { selectTheme } from "../../features/theme/themeSlice";

// ─── Reusable Spinner ────────────────────────────────────────────────
const Spinner = ({ size = 8 }) => (
    <svg
        className={`animate-spin h-${size} w-${size}`}
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
);

// ─── Skeleton Card (for loading state) ───────────────────────────────
const SkeletonCard = ({ isDark }) => (
    <div
        className={`rounded-xl overflow-hidden ${
            isDark ? "bg-gray-800/60" : "bg-gray-200/60"
        } animate-pulse`}
    >
        <div
            className={`aspect-video ${isDark ? "bg-gray-700" : "bg-gray-300"}`}
        />
        <div className="p-4 space-y-3">
            <div
                className={`h-4 rounded-full w-3/4 ${
                    isDark ? "bg-gray-700" : "bg-gray-300"
                }`}
            />
            <div
                className={`h-3 rounded-full w-1/2 ${
                    isDark ? "bg-gray-700" : "bg-gray-300"
                }`}
            />
        </div>
    </div>
);

const SkeletonGrid = ({ isDark, count = 8 }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {Array.from({ length: count }).map((_, i) => (
            <SkeletonCard key={i} isDark={isDark} />
        ))}
    </div>
);

// ─── Pagination Button ───────────────────────────────────────────────
const PaginationButton = ({ children, disabled, onClick, t }) => (
    <button
        disabled={disabled}
        onClick={onClick}
        className={`
            px-5 py-2.5 rounded-xl text-sm font-semibold
            transition-all duration-300 ease-out
            ${
                disabled
                    ? `${t.paginationBtnDisabled} cursor-not-allowed scale-95`
                    : `${t.paginationBtn} cursor-pointer
                       hover:scale-[1.03] hover:shadow-lg
                       active:scale-95`
            }
        `}
    >
        {children}
    </button>
);

// ─── Main Component ──────────────────────────────────────────────────
const UserChannelPage = () => {
    const axiosPrivate = useAxiosPrivate();
    const { username } = useParams();
    const theme = useSelector(selectTheme);
    const isDark = theme === "dark";

    const themeStyles = {
        dark: {
            background: "bg-gray-950",
            text: "text-white",
            textMuted: "text-gray-400",
            textFaded: "text-gray-500",
            border: "border-gray-800/60",
            sectionTitle: "text-white",
            loading: "text-gray-400",
            paginationBtn:
                "bg-gray-800 text-white hover:bg-gray-700 shadow-md shadow-black/20",
            paginationBtnDisabled: "bg-gray-800/50 text-gray-600 opacity-50",
            paginationText: "text-gray-300",
            emptyState: "text-gray-500",
            emptyIconBg: "bg-gray-800/50",
            tabActive: "border-blue-500 text-blue-400 bg-blue-500/5",
            tabInactive:
                "border-transparent text-gray-500 hover:text-gray-300 hover:bg-gray-800/40",
            tabBar: "bg-gray-900/50 border-gray-800/60",
            pageIndicator: "bg-gray-800 text-gray-300",
        },
        light: {
            background: "bg-gray-50",
            text: "text-gray-900",
            textMuted: "text-gray-600",
            textFaded: "text-gray-500",
            border: "border-gray-200",
            sectionTitle: "text-gray-800",
            loading: "text-gray-500",
            paginationBtn:
                "bg-white text-gray-800 hover:bg-gray-100 shadow-md shadow-gray-200/50 border border-gray-200",
            paginationBtnDisabled:
                "bg-gray-100 text-gray-400 opacity-50 border border-gray-200",
            paginationText: "text-gray-600",
            emptyState: "text-gray-400",
            emptyIconBg: "bg-gray-100",
            tabActive: "border-blue-500 text-blue-600 bg-blue-50",
            tabInactive:
                "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100",
            tabBar: "bg-white/80 border-gray-200",
            pageIndicator: "bg-gray-100 text-gray-600",
        },
    };

    const t = isDark ? themeStyles.dark : themeStyles.light;

    // ── State ────────────────────────────────────────────────────────
    const [channel, setChannel] = useState(null);
    const [channelLoading, setChannelLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("videos");

    const [videos, setVideos] = useState([]);
    const [videosLoading, setVideosLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState({});

    const [posts, setPosts] = useState([]);
    const [postsLoading, setPostsLoading] = useState(false);
    const [postsPage, setPostsPage] = useState(1);
    const [postsPagination, setPostsPagination] = useState({});

    // ── Fetch Channel Profile ────────────────────────────────────────
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
        if (username) fetchChannelProfile();
    }, [username]);

    // ── Fetch Videos ─────────────────────────────────────────────────
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

    // ── Fetch Posts ──────────────────────────────────────────────────
    useEffect(() => {
        if (!channel?._id || activeTab !== "posts") return;
        const fetchPosts = async () => {
            setPostsLoading(true);
            try {
                const response = await axiosPrivate.get(
                    `/post/user/${channel._id}`,
                    { params: { page: postsPage, limit: 12 } },
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

    // ── Handlers ─────────────────────────────────────────────────────
    const handleToggleSubscribe = async (channelId) => {
        try {
            await axiosPrivate.post(`users/toggle/subscribe/${channelId}`);
        } catch (error) {
            console.error("Subscription toggle failed", error);
        }
    };

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

    // ── Tab config ───────────────────────────────────────────────────
    const tabs = [
        {
            key: "videos",
            label: "Videos",
            icon: (
                <svg
                    className="w-4 h-4"
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
            ),
            onClick: () => {
                setActiveTab("videos");
                setCurrentPage(1);
            },
        },
        {
            key: "posts",
            label: "Posts",
            icon: (
                <svg
                    className="w-4 h-4"
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
            ),
            onClick: () => {
                setActiveTab("posts");
                setPostsPage(1);
            },
        },
    ];

    // ─── FULL-PAGE LOADING ───────────────────────────────────────────
    if (channelLoading) {
        return (
            <div
                className={`min-h-screen flex justify-center items-center ${t.background}`}
            >
                <div className="flex flex-col items-center gap-4 animate-pulse">
                    <div className="relative">
                        <div
                            className="absolute inset-0 rounded-full
                                        bg-purple-500/20 blur-xl animate-ping"
                        />
                        <Spinner size={10} />
                    </div>
                    <span className={`text-lg font-medium ${t.loading}`}>
                        Loading Profile…
                    </span>
                </div>
            </div>
        );
    }

    // ─── CHANNEL NOT FOUND ───────────────────────────────────────────
    if (!channel) {
        return (
            <div
                className={`min-h-screen flex justify-center items-center ${t.background}`}
            >
                <div className="flex flex-col items-center gap-4 text-center">
                    <div
                        className={`w-20 h-20 rounded-full flex items-center justify-center
                                    ${t.emptyIconBg}`}
                    >
                        <svg
                            className={`w-10 h-10 ${t.emptyState}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </div>
                    <div>
                        <p className={`text-xl font-semibold ${t.text}`}>
                            Channel not found
                        </p>
                        <p className={`text-sm mt-1 ${t.textFaded}`}>
                            The channel you're looking for doesn't exist or was
                            removed.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // ─── EMPTY STATE COMPONENT ───────────────────────────────────────
    const EmptyState = ({ icon, message }) => (
        <div
            className={`flex flex-col items-center justify-center py-20 ${t.emptyState}
                        animate-[fadeIn_0.4s_ease-out]`}
        >
            <div
                className={`w-24 h-24 rounded-2xl flex items-center justify-center mb-5
                            ${t.emptyIconBg}`}
            >
                {icon}
            </div>
            <p className={`text-lg font-semibold ${t.text}`}>{message}</p>
            <p className={`text-sm mt-1 ${t.textFaded}`}>
                Check back later for new content.
            </p>
        </div>
    );

    // ─── PAGINATION CONTROLS ─────────────────────────────────────────
    const PaginationControls = ({ page, setPage, paginationData }) =>
        paginationData.totalPages > 1 && (
            <div
                className="flex items-center justify-center mt-10 gap-3
                            animate-[fadeIn_0.3s_ease-out]"
            >
                <PaginationButton
                    disabled={!paginationData.hasPrevPage}
                    onClick={() => setPage((p) => p - 1)}
                    t={t}
                >
                    <span className="flex items-center gap-1.5">
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 19l-7-7 7-7"
                            />
                        </svg>
                        Prev
                    </span>
                </PaginationButton>

                <span
                    className={`px-4 py-2 rounded-xl text-sm font-medium
                                ${t.pageIndicator}`}
                >
                    {page}
                    <span className={`mx-1 ${t.textFaded}`}>/</span>
                    {paginationData.totalPages}
                </span>

                <PaginationButton
                    disabled={!paginationData.hasNextPage}
                    onClick={() => setPage((p) => p + 1)}
                    t={t}
                >
                    <span className="flex items-center gap-1.5">
                        Next
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                            />
                        </svg>
                    </span>
                </PaginationButton>
            </div>
        );

    // ─── RENDER ──────────────────────────────────────────────────────
    return (
        <div
            className={`min-h-screen ${t.background} transition-colors duration-300`}
        >
            {/* Channel Card */}
            <div className="px-4 pt-6 md:px-8 md:pt-8">
                <div className="max-w-7xl mx-auto">
                    <ChannelProfileCard
                        channelData={channel}
                        onToggleSubscribe={handleToggleSubscribe}
                    />
                </div>
            </div>

            {/* Sticky Tab Bar */}
            <div
                className={`sticky top-0 z-30 mt-6 border-b backdrop-blur-xl
                            ${t.tabBar} transition-colors duration-300`}
            >
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <nav className="flex gap-1" role="tablist">
                        {tabs.map((tab) => (
                            <button
                                key={tab.key}
                                role="tab"
                                aria-selected={activeTab === tab.key}
                                onClick={tab.onClick}
                                className={`
                                    relative flex items-center gap-2
                                    px-5 py-3.5
                                    text-sm font-semibold
                                    border-b-2 rounded-t-lg
                                    transition-all duration-200 ease-out
                                    cursor-pointer
                                    ${
                                        activeTab === tab.key
                                            ? t.tabActive
                                            : t.tabInactive
                                    }
                                `}
                            >
                                {tab.icon}
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>
            </div>

            {/* Content Area */}
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
                {/* ── Videos Tab ──────────────────────────────────── */}
                {activeTab === "videos" && (
                    <div className="animate-[fadeIn_0.3s_ease-out]">
                        {videosLoading ? (
                            <SkeletonGrid isDark={isDark} count={8} />
                        ) : videos.length > 0 ? (
                            <>
                                <VideoGrid videos={videos} />
                                <PaginationControls
                                    page={currentPage}
                                    setPage={setCurrentPage}
                                    paginationData={pagination}
                                />
                            </>
                        ) : (
                            <EmptyState
                                icon={
                                    <svg
                                        className="w-10 h-10"
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
                                }
                                message="No videos yet"
                            />
                        )}
                    </div>
                )}

                {/* ── Posts Tab ───────────────────────────────────── */}
                {activeTab === "posts" && (
                    <div className="animate-[fadeIn_0.3s_ease-out]">
                        {postsLoading ? (
                            <SkeletonGrid isDark={isDark} count={6} />
                        ) : posts.length > 0 ? (
                            <>
                                <PostGrid posts={posts} onVote={handleVote} />
                                <PaginationControls
                                    page={postsPage}
                                    setPage={setPostsPage}
                                    paginationData={postsPagination}
                                />
                            </>
                        ) : (
                            <EmptyState
                                icon={
                                    <svg
                                        className="w-10 h-10"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1.5}
                                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                        />
                                    </svg>
                                }
                                message="No posts yet"
                            />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserChannelPage;
