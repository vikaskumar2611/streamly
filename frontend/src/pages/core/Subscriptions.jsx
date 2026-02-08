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
} from "lucide-react";

const Subscriptions = () => {
    const axiosPrivate = useAxiosPrivate();
    const { user } = useAuth();
    const theme = useSelector(selectTheme);
    const isDark = theme === "dark";

    // Theme configuration object
    const themeStyles = {
        dark: {
            heading: "text-white",
            text: "text-white",
            textMuted: "text-gray-400",
            textFaded: "text-gray-500",
            card: "bg-gray-800 border-gray-700",
            cardHover: "hover:bg-gray-750",
            cardBorder: "border-gray-700",
            buttonSecondary: "bg-gray-700 hover:bg-gray-600 text-gray-300",
            errorBg: "bg-red-900/50 border-red-500 text-red-300",
            successBg: "bg-green-900/50 border-green-500 text-green-300",
            optionDefault: "border-gray-600 hover:border-blue-500",
            optionVoted: "border-gray-600",
            optionProgress: "bg-blue-600/30",
            optionText: "text-gray-200",
            optionMeta: "text-gray-400",
            emptyBg: "bg-gray-800",
            emptyIcon: "text-gray-600",
            emptyText: "text-gray-400",
            emptySubText: "text-gray-500",
            spinner: "border-blue-500",
            avatarRing: "ring-gray-700",
            divider: "border-gray-700",
            badgeBlue: "text-blue-400",
            badgeGreen: "text-green-400",
        },
        light: {
            heading: "text-gray-900",
            text: "text-gray-900",
            textMuted: "text-gray-600",
            textFaded: "text-gray-500",
            card: "bg-white border-gray-200 shadow-sm",
            cardHover: "hover:shadow-md",
            cardBorder: "border-gray-200",
            buttonSecondary: "bg-gray-100 hover:bg-gray-200 text-gray-700",
            errorBg: "bg-red-50 border-red-500 text-red-700",
            successBg: "bg-green-50 border-green-500 text-green-700",
            optionDefault: "border-gray-200 hover:border-blue-400",
            optionVoted: "border-gray-200",
            optionProgress: "bg-blue-100",
            optionText: "text-gray-700",
            optionMeta: "text-gray-600",
            emptyBg: "bg-white shadow-sm",
            emptyIcon: "text-gray-300",
            emptyText: "text-gray-500",
            emptySubText: "text-gray-400",
            spinner: "border-blue-600",
            avatarRing: "ring-gray-200",
            divider: "border-gray-100",
            badgeBlue: "text-blue-600",
            badgeGreen: "text-green-600",
        },
    };

    const t = isDark ? themeStyles.dark : themeStyles.light;

    // State management
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // Clear messages after timeout
    useEffect(() => {
        if (error || success) {
            const timer = setTimeout(() => {
                setError(null);
                setSuccess(null);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [error, success]);

    // ============ FETCH POSTS ============
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

    // ============ VOTE ON POST ============
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

    // ============ UTILITY FUNCTIONS ============
    const calculatePercentage = (votes, total) => {
        if (total === 0) return 0;
        return Math.round((votes / total) * 100);
    };

    const isOwner = (post) => {
        return post.owner?._id === user?._id;
    };

    const hasVoted = (post) => {
        return post.voters?.includes(user?._id);
    };

    // ============ RENDER ============
    return (
        <div className="min-h-screen py-8">
            <div className="max-w-3xl mx-auto px-4">
                {/* Header */}
                <div className="mb-6">
                    <h1
                        className={`text-3xl font-bold ${t.heading} flex items-center gap-3`}
                    >
                        <BarChart3 className="w-8 h-8 text-blue-500" />
                        Subscription Feed
                    </h1>
                    <p className={`mt-1 ${t.textMuted}`}>
                        Polls from channels you follow
                    </p>
                </div>

                {/* Messages */}
                {error && (
                    <div
                        className={`mb-4 p-4 border-l-4 rounded-lg flex items-center gap-3 ${t.errorBg}`}
                    >
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <span>{error}</span>
                    </div>
                )}
                {success && (
                    <div
                        className={`mb-4 p-4 border-l-4 rounded-lg flex items-center gap-3 ${t.successBg}`}
                    >
                        <CheckCircle className="w-5 h-5 flex-shrink-0" />
                        <span>{success}</span>
                    </div>
                )}

                {/* Loading State */}
                {loading && (
                    <div className="flex flex-col justify-center items-center py-16">
                        <div
                            className={`animate-spin rounded-full h-12 w-12 border-b-2 ${t.spinner}`}
                        ></div>
                        <p className={`mt-4 ${t.textMuted}`}>
                            Loading polls...
                        </p>
                    </div>
                )}

                {/* Empty State */}
                {!loading && posts.length === 0 && (
                    <div
                        className={`text-center py-16 ${t.emptyBg} rounded-xl border ${t.cardBorder}`}
                    >
                        <div
                            className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${isDark ? "bg-gray-700" : "bg-gray-100"}`}
                        >
                            <BarChart3 className={`w-8 h-8 ${t.emptyIcon}`} />
                        </div>
                        <p className={`text-lg font-medium ${t.emptyText}`}>
                            No posts from your subscriptions yet
                        </p>
                        <p className={`mt-2 ${t.emptySubText}`}>
                            Subscribe to channels to see their polls here
                        </p>
                    </div>
                )}

                {/* Posts List */}
                <div className="space-y-6">
                    {posts.map((post) => {
                        const totalVotes =
                            post.options?.reduce(
                                (sum, opt) => sum + (opt.votes || 0),
                                0,
                            ) || 0;
                        const userHasVoted = hasVoted(post);
                        const userIsOwner = isOwner(post);

                        return (
                            <div
                                key={post._id}
                                className={`${t.card} rounded-xl border overflow-hidden ${t.cardHover}`}
                            >
                                {/* Post Header */}
                                <div
                                    className={`p-4 border-b ${t.divider} flex items-center`}
                                >
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={
                                                post.owner?.avatar ||
                                                "/default-avatar.png"
                                            }
                                            alt={post.owner?.username}
                                            className={`w-10 h-10 rounded-full object-cover ring-2 ${t.avatarRing}`}
                                        />
                                        <div>
                                            <p
                                                className={`font-semibold ${t.text}`}
                                            >
                                                {post.owner?.fullName ||
                                                    "Unknown"}
                                            </p>
                                            <p
                                                className={`text-sm ${t.textFaded}`}
                                            >
                                                @{post.owner?.username}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Poll Content */}
                                <div className="p-4">
                                    <h3
                                        className={`text-xl font-semibold ${t.heading} mb-4`}
                                    >
                                        {post.poll}
                                    </h3>

                                    {/* Options */}
                                    <div className="space-y-3">
                                        {post.options?.map((option, index) => {
                                            const percentage =
                                                calculatePercentage(
                                                    option.votes || 0,
                                                    totalVotes,
                                                );

                                            return (
                                                <div
                                                    key={index}
                                                    onClick={() => {
                                                        if (
                                                            !userHasVoted &&
                                                            !userIsOwner
                                                        ) {
                                                            handleVote(
                                                                post._id,
                                                                index,
                                                            );
                                                        }
                                                    }}
                                                    className={`relative overflow-hidden rounded-lg border-2 transition-all duration-300 ${
                                                        userHasVoted ||
                                                        userIsOwner
                                                            ? `${t.optionVoted} cursor-default`
                                                            : `${t.optionDefault} cursor-pointer`
                                                    }`}
                                                >
                                                    {/* Progress Bar Background */}
                                                    <div
                                                        className={`absolute inset-0 ${t.optionProgress} transition-all duration-500`}
                                                        style={{
                                                            width: `${percentage}%`,
                                                        }}
                                                    />

                                                    {/* Option Content */}
                                                    <div className="relative p-3 flex justify-between items-center">
                                                        <span
                                                            className={`font-medium ${t.optionText}`}
                                                        >
                                                            {option.text}
                                                        </span>
                                                        <span
                                                            className={`text-sm font-semibold ${t.optionMeta}`}
                                                        >
                                                            {option.votes || 0}{" "}
                                                            votes ({percentage}
                                                            %)
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Footer */}
                                    <div
                                        className={`mt-4 flex justify-between items-center text-sm ${t.textFaded}`}
                                    >
                                        <span className="flex items-center gap-1.5">
                                            <BarChart3 className="w-4 h-4" />
                                            Total: {totalVotes} vote
                                            {totalVotes !== 1 ? "s" : ""}
                                        </span>
                                        {userHasVoted && (
                                            <span
                                                className={`font-medium flex items-center gap-1.5 ${t.badgeGreen}`}
                                            >
                                                <CheckCircle className="w-4 h-4" />
                                                You voted
                                            </span>
                                        )}
                                        {userIsOwner && (
                                            <span
                                                className={`font-medium flex items-center gap-1.5 ${t.badgeBlue}`}
                                            >
                                                <User className="w-4 h-4" />
                                                Your poll
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Refresh Button */}
                {!loading && posts.length > 0 && (
                    <div className="mt-8 text-center">
                        <button
                            onClick={fetchPosts}
                            className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 mx-auto ${t.buttonSecondary}`}
                        >
                            <RefreshCw className="w-4 h-4" />
                            Refresh Feed
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Subscriptions;
