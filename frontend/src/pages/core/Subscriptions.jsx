import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import useAxiosPrivate from "../../hooks/useAxiosPrivate.hooks";
import useAuth from "../../hooks/useAuth.hooks";
import { selectTheme } from "../../features/theme/themeSlice";
import {
    RefreshCw,
    CheckCircle,
    AlertCircle,
    BarChart3,
    User,
    Rss,
} from "lucide-react";

const Subscriptions = () => {
    const axiosPrivate = useAxiosPrivate();
    const { user } = useAuth();
    const theme = useSelector(selectTheme);
    const isDark = theme === "dark";

    const t = isDark
        ? {
              page: "bg-gray-900",
              heading: "text-white",
              text: "text-white",
              textMuted: "text-gray-400",
              textFaded: "text-gray-500",
              accent: "text-purple-400",
              card: "bg-gray-800/80 border-gray-700/60 backdrop-blur-sm",
              cardHover:
                  "hover:border-gray-600 hover:shadow-lg hover:shadow-black/20",
              divider: "border-gray-700/50",
              errorBg: "bg-red-500/10 border-red-500/40 text-red-300",
              successBg: "bg-green-500/10 border-green-500/40 text-green-300",
              optionIdle:
                  "border-gray-600/60 hover:border-blue-500/60 hover:bg-blue-500/5",
              optionVoted: "border-gray-700/50 cursor-default",
              optionBar: "bg-blue-500/20",
              optionBarWinner: "bg-blue-500/30",
              optionText: "text-gray-200",
              optionMeta: "text-gray-400",
              emptyBg: "bg-gray-800/60 border-gray-700/50",
              emptyIcon: "text-gray-600",
              emptyText: "text-gray-400",
              emptySubText: "text-gray-500",
              spinner: "border-blue-400",
              avatarRing: "ring-gray-700",
              btnSecondary:
                  "bg-gray-700/80 hover:bg-gray-600 text-gray-300 border border-gray-600/50",
              badgeBlue: "text-blue-400 bg-blue-500/10",
              badgeGreen: "text-green-400 bg-green-500/10",
              skeleton: "bg-gray-700/60",
              headerGradient: "from-blue-600/10 to-purple-600/10",
          }
        : {
              page: "bg-gray-50",
              heading: "text-gray-900",
              text: "text-gray-900",
              textMuted: "text-gray-500",
              textFaded: "text-gray-400",
              accent: "text-purple-600",
              card: "bg-white border-gray-200/80 shadow-sm",
              cardHover: "hover:shadow-md hover:border-gray-300",
              divider: "border-gray-100",
              errorBg: "bg-red-50 border-red-200 text-red-700",
              successBg: "bg-green-50 border-green-200 text-green-700",
              optionIdle:
                  "border-gray-200 hover:border-blue-400 hover:bg-blue-50/50",
              optionVoted: "border-gray-200/80 cursor-default",
              optionBar: "bg-blue-100",
              optionBarWinner: "bg-blue-200",
              optionText: "text-gray-700",
              optionMeta: "text-gray-500",
              emptyBg: "bg-white border-gray-200 shadow-sm",
              emptyIcon: "text-gray-300",
              emptyText: "text-gray-500",
              emptySubText: "text-gray-400",
              spinner: "border-blue-500",
              avatarRing: "ring-gray-200",
              btnSecondary:
                  "bg-white hover:bg-gray-50 text-gray-600 border border-gray-200 shadow-sm",
              badgeBlue: "text-blue-600 bg-blue-50",
              badgeGreen: "text-green-600 bg-green-50",
              skeleton: "bg-gray-200",
              headerGradient: "from-blue-50 to-purple-50",
          };

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        if (error || success) {
            const timer = setTimeout(() => {
                setError(null);
                setSuccess(null);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [error, success]);

    const fetchPosts = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axiosPrivate.get("/post/user/subscriptions");
            setPosts(response.data.data || []);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch posts");
        } finally {
            setLoading(false);
        }
    }, [axiosPrivate]);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchPosts();
        setRefreshing(false);
    };

    const handleVote = async (postId, optionIndex) => {
        try {
            const response = await axiosPrivate.post(`/post/vote/${postId}`, {
                optionIndex,
            });
            setPosts((prev) =>
                prev.map((post) =>
                    post._id === postId
                        ? {
                              ...response.data.data,
                              owner: response.data.data.owner?.username
                                  ? response.data.data.owner
                                  : post.owner,
                          }
                        : post,
                ),
            );
            setSuccess("Vote recorded!");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to vote");
        }
    };

    const pct = (votes, total) =>
        total === 0 ? 0 : Math.round((votes / total) * 100);

    const isOwner = (post) => post.owner?._id === user?._id;
    const hasVoted = (post) => post.voters?.includes(user?._id);

    const timeAgo = (dateStr) => {
        const days = Math.floor((Date.now() - new Date(dateStr)) / 86400000);
        if (days === 0) return "Today";
        if (days === 1) return "Yesterday";
        if (days < 7) return `${days}d ago`;
        if (days < 30) return `${Math.floor(days / 7)}w ago`;
        if (days < 365) return `${Math.floor(days / 30)}mo ago`;
        return `${Math.floor(days / 365)}y ago`;
    };

    return (
        <div
            className={`min-h-screen ${t.page} transition-colors duration-300`}
        >
            {/* Subtle top gradient */}
            <div
                className={`absolute top-0 inset-x-0 h-64 bg-gradient-to-b ${t.headerGradient} to-transparent pointer-events-none`}
            />

            <div className="relative max-w-2xl mx-auto px-4 py-6 sm:px-6 sm:py-8 lg:py-10">
                {/* Header */}
                <div className="mb-6 sm:mb-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 sm:p-2.5 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/20">
                                <Rss className="w-5 h-5 sm:w-6 sm:h-6" />
                            </div>
                            <div>
                                <h1
                                    className={`text-xl sm:text-2xl lg:text-3xl font-bold ${t.heading} tracking-tight`}
                                >
                                    Subscription Feed
                                </h1>
                                <p
                                    className={`text-sm sm:text-base ${t.textMuted} mt-0.5`}
                                >
                                    Polls from channels you follow
                                </p>
                            </div>
                        </div>

                        {!loading && posts.length > 0 && (
                            <button
                                onClick={handleRefresh}
                                disabled={refreshing}
                                className={`p-2 sm:p-2.5 rounded-xl ${t.btnSecondary} transition-all duration-300 active:scale-95 disabled:opacity-50`}
                                title="Refresh"
                            >
                                <RefreshCw
                                    className={`w-4 h-4 sm:w-5 sm:h-5 ${refreshing ? "animate-spin" : ""}`}
                                />
                            </button>
                        )}
                    </div>
                </div>

                {/* Toast Messages */}
                <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
                    {error && (
                        <div
                            className={`px-4 py-3 rounded-xl border flex items-center gap-2.5 text-sm font-medium shadow-lg animate-in slide-in-from-right ${t.errorBg}`}
                        >
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}
                    {success && (
                        <div
                            className={`px-4 py-3 rounded-xl border flex items-center gap-2.5 text-sm font-medium shadow-lg animate-in slide-in-from-right ${t.successBg}`}
                        >
                            <CheckCircle className="w-4 h-4 shrink-0" />
                            <span>{success}</span>
                        </div>
                    )}
                </div>

                {/* Loading Skeleton */}
                {loading && (
                    <div className="space-y-5">
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className={`${t.card} rounded-2xl border overflow-hidden animate-pulse`}
                            >
                                <div
                                    className={`p-4 border-b ${t.divider} flex items-center gap-3`}
                                >
                                    <div
                                        className={`w-10 h-10 rounded-full ${t.skeleton}`}
                                    />
                                    <div className="space-y-2 flex-1">
                                        <div
                                            className={`h-4 w-28 rounded-md ${t.skeleton}`}
                                        />
                                        <div
                                            className={`h-3 w-20 rounded-md ${t.skeleton}`}
                                        />
                                    </div>
                                </div>
                                <div className="p-4 space-y-3">
                                    <div
                                        className={`h-5 w-3/4 rounded-md ${t.skeleton}`}
                                    />
                                    <div
                                        className={`h-11 w-full rounded-lg ${t.skeleton}`}
                                    />
                                    <div
                                        className={`h-11 w-full rounded-lg ${t.skeleton}`}
                                    />
                                    <div
                                        className={`h-11 w-2/3 rounded-lg ${t.skeleton}`}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!loading && posts.length === 0 && (
                    <div
                        className={`text-center py-16 sm:py-20 ${t.emptyBg} rounded-2xl border`}
                    >
                        <div className="flex flex-col items-center gap-4">
                            <div
                                className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center ${isDark ? "bg-gray-700/60" : "bg-gray-100"}`}
                            >
                                <BarChart3
                                    className={`w-8 h-8 sm:w-10 sm:h-10 ${t.emptyIcon}`}
                                />
                            </div>
                            <div>
                                <p
                                    className={`text-lg sm:text-xl font-semibold ${t.emptyText}`}
                                >
                                    No polls yet
                                </p>
                                <p
                                    className={`mt-1.5 text-sm sm:text-base ${t.emptySubText} max-w-xs mx-auto`}
                                >
                                    Subscribe to channels to see their polls
                                    appear here
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Posts */}
                <div className="space-y-4 sm:space-y-5">
                    {posts.map((post) => {
                        const totalVotes =
                            post.options?.reduce(
                                (s, o) => s + (o.votes || 0),
                                0,
                            ) || 0;
                        const voted = hasVoted(post);
                        const owned = isOwner(post);
                        const showResults = voted || owned;
                        const maxVotes = Math.max(
                            ...post.options.map((o) => o.votes || 0),
                        );

                        return (
                            <div
                                key={post._id}
                                className={`${t.card} rounded-2xl border overflow-hidden transition-all duration-300 ${t.cardHover}`}
                            >
                                {/* Author Header */}
                                <div
                                    className={`px-4 py-3 sm:px-5 sm:py-4 border-b ${t.divider} flex items-center justify-between`}
                                >
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={
                                                post.owner?.avatar ||
                                                "/default-avatar.png"
                                            }
                                            alt=""
                                            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover ring-2 ${t.avatarRing}`}
                                        />
                                        <div className="min-w-0">
                                            <p
                                                className={`font-semibold text-sm sm:text-base ${t.text} truncate`}
                                            >
                                                {post.owner?.fullName ||
                                                    "Unknown"}
                                            </p>
                                            <p
                                                className={`text-xs sm:text-sm ${t.textFaded}`}
                                            >
                                                @{post.owner?.username}
                                            </p>
                                        </div>
                                    </div>
                                    {post.createdAt && (
                                        <span
                                            className={`text-xs ${t.textFaded} shrink-0`}
                                        >
                                            {timeAgo(post.createdAt)}
                                        </span>
                                    )}
                                </div>

                                {/* Poll Body */}
                                <div className="px-4 py-4 sm:px-5 sm:py-5">
                                    <h3
                                        className={`text-base sm:text-lg font-semibold ${t.heading} leading-snug mb-4`}
                                    >
                                        {post.poll}
                                    </h3>

                                    {/* Options */}
                                    <div className="space-y-2.5">
                                        {post.options?.map((option, index) => {
                                            const percentage = pct(
                                                option.votes || 0,
                                                totalVotes,
                                            );
                                            const isWinner =
                                                showResults &&
                                                (option.votes || 0) ===
                                                    maxVotes &&
                                                maxVotes > 0;

                                            return (
                                                <button
                                                    key={index}
                                                    type="button"
                                                    disabled={showResults}
                                                    onClick={() =>
                                                        handleVote(
                                                            post._id,
                                                            index,
                                                        )
                                                    }
                                                    className={`relative w-full overflow-hidden rounded-xl border-2 transition-all duration-300 text-left group ${
                                                        showResults
                                                            ? t.optionVoted
                                                            : t.optionIdle
                                                    } ${isWinner ? "ring-1 ring-blue-500/30" : ""}`}
                                                >
                                                    {/* Progress fill */}
                                                    {showResults && (
                                                        <div
                                                            className={`absolute inset-y-0 left-0 ${isWinner ? t.optionBarWinner : t.optionBar} transition-all duration-700 ease-out`}
                                                            style={{
                                                                width: `${percentage}%`,
                                                            }}
                                                        />
                                                    )}

                                                    {/* Content */}
                                                    <div className="relative px-3.5 py-2.5 sm:px-4 sm:py-3 flex items-center justify-between gap-3">
                                                        <span
                                                            className={`text-sm sm:text-base font-medium ${t.optionText} ${!showResults ? "group-hover:translate-x-0.5 transition-transform duration-200" : ""}`}
                                                        >
                                                            {option.text}
                                                        </span>
                                                        {showResults && (
                                                            <span
                                                                className={`text-xs sm:text-sm font-semibold ${t.optionMeta} tabular-nums shrink-0`}
                                                            >
                                                                {percentage}%
                                                            </span>
                                                        )}
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {/* Footer */}
                                    <div
                                        className={`mt-4 pt-3 border-t ${t.divider} flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm ${t.textFaded}`}
                                    >
                                        <span className="flex items-center gap-1.5">
                                            <BarChart3 className="w-3.5 h-3.5" />
                                            {totalVotes} vote
                                            {totalVotes !== 1 ? "s" : ""}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            {voted && (
                                                <span
                                                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${t.badgeGreen}`}
                                                >
                                                    <CheckCircle className="w-3 h-3" />
                                                    Voted
                                                </span>
                                            )}
                                            {owned && (
                                                <span
                                                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${t.badgeBlue}`}
                                                >
                                                    <User className="w-3 h-3" />
                                                    Your poll
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Subscriptions;
