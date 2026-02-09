import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectTheme } from "../features/theme/themeSlice";
import useAuth from "../hooks/useAuth.hooks";
import {
    Edit3,
    BarChart3,
    Users,
    CheckCircle,
    User,
    ChevronRight,
} from "lucide-react";

const PostGrid = ({ posts = [], onVote, loading = false }) => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const theme = useSelector(selectTheme);
    const isDark = theme === "dark";

    const t = isDark
        ? {
              card: "bg-gray-800/80 border-gray-700/60 backdrop-blur-sm",
              cardHover:
                  "hover:border-gray-600 hover:shadow-lg hover:shadow-black/20",
              text: "text-white",
              heading: "text-white",
              textMuted: "text-gray-400",
              textFaded: "text-gray-500",
              divider: "border-gray-700/50",
              avatarRing: "ring-gray-700",
              avatarHover: "hover:ring-purple-500/50",

              // Options
              optionIdle:
                  "border-gray-600/60 hover:border-blue-500/60 hover:bg-blue-500/5",
              optionVoted: "border-gray-700/50 cursor-default",
              optionBar: "bg-blue-500/20",
              optionBarWinner: "bg-blue-500/30",
              optionText: "text-gray-200",
              optionMeta: "text-gray-400",
              optionRingWinner: "ring-1 ring-blue-500/30",

              // Badges
              badgePoll: "text-blue-400 bg-blue-500/10",
              badgeGreen: "text-green-400 bg-green-500/10",
              badgeBlue: "text-blue-400 bg-blue-500/10",

              // Buttons
              editBtn:
                  "bg-gray-700/60 hover:bg-gray-600 text-gray-300 ring-1 ring-gray-600/50",
              moreOptions: "text-gray-500 hover:text-gray-300",

              // Skeleton
              skeleton: "bg-gray-700/60",
              skeletonShimmer:
                  "bg-gradient-to-r from-gray-700/60 via-gray-600/40 to-gray-700/60",

              // Empty
              emptyBg: "bg-gray-800/60 border-gray-700/50",
              emptyIcon: "text-gray-600",
              emptyText: "text-gray-400",
              emptySubText: "text-gray-500",
          }
        : {
              card: "bg-white border-gray-200/80 shadow-sm",
              cardHover: "hover:shadow-md hover:border-gray-300",
              text: "text-gray-900",
              heading: "text-gray-900",
              textMuted: "text-gray-500",
              textFaded: "text-gray-400",
              divider: "border-gray-100",
              avatarRing: "ring-gray-200",
              avatarHover: "hover:ring-purple-400/50",

              // Options
              optionIdle:
                  "border-gray-200 hover:border-blue-400 hover:bg-blue-50/50",
              optionVoted: "border-gray-200/80 cursor-default",
              optionBar: "bg-blue-100",
              optionBarWinner: "bg-blue-200",
              optionText: "text-gray-700",
              optionMeta: "text-gray-500",
              optionRingWinner: "ring-1 ring-blue-400/30",

              // Badges
              badgePoll: "text-blue-600 bg-blue-50",
              badgeGreen: "text-green-600 bg-green-50",
              badgeBlue: "text-blue-600 bg-blue-50",

              // Buttons
              editBtn:
                  "bg-gray-50 hover:bg-gray-100 text-gray-600 ring-1 ring-gray-200",
              moreOptions: "text-gray-400 hover:text-gray-600",

              // Skeleton
              skeleton: "bg-gray-200",
              skeletonShimmer:
                  "bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200",

              // Empty
              emptyBg: "bg-white border-gray-200 shadow-sm",
              emptyIcon: "text-gray-300",
              emptyText: "text-gray-500",
              emptySubText: "text-gray-400",
          };

    // ── Helpers ───────────────────────────────────────────────────────
    const pct = (votes, total) =>
        total === 0 ? 0 : Math.round((votes / total) * 100);

    const isOwner = (post) => post.owner?._id === user?._id;
    const hasVoted = (post) => post.voters?.includes(user?._id);

    const timeAgo = (dateStr) => {
        if (!dateStr) return "";
        const seconds = Math.floor((Date.now() - new Date(dateStr)) / 1000);
        if (seconds < 60) return "Just now";
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        const days = Math.floor(seconds / 86400);
        if (days === 0) return "Today";
        if (days === 1) return "Yesterday";
        if (days < 7) return `${days}d ago`;
        if (days < 30) return `${Math.floor(days / 7)}w ago`;
        if (days < 365) return `${Math.floor(days / 30)}mo ago`;
        return `${Math.floor(days / 365)}y ago`;
    };

    const handleVote = (postId, optionIndex) => {
        if (onVote) onVote(postId, optionIndex);
    };

    const handleEditClick = (e, postId) => {
        e.stopPropagation();
        navigate(`/edit/post/${postId}`);
    };

    // ── Loading Skeleton ─────────────────────────────────────────────
    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <PostCardSkeleton key={i} t={t} index={i} />
                ))}
            </div>
        );
    }

    // ── Empty State ──────────────────────────────────────────────────
    if (!posts || posts.length === 0) {
        return (
            <div
                className={`
                    text-center py-16 sm:py-20
                    ${t.emptyBg} rounded-2xl border
                    animate-[fadeIn_0.4s_ease-out]
                `}
            >
                <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                        <div className="absolute inset-0 rounded-full bg-purple-500/10 blur-2xl scale-150" />
                        <div
                            className={`
                                relative w-20 h-20 rounded-2xl
                                flex items-center justify-center
                                ${isDark ? "bg-gray-700/60" : "bg-gray-100"}
                            `}
                        >
                            <BarChart3 className={`w-10 h-10 ${t.emptyIcon}`} />
                        </div>
                    </div>
                    <div>
                        <p
                            className={`text-lg sm:text-xl font-semibold ${t.emptyText}`}
                        >
                            No polls yet
                        </p>
                        <p
                            className={`mt-1.5 text-sm ${t.emptySubText} max-w-xs mx-auto`}
                        >
                            Check back later for new polls and community posts.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // ── Grid ─────────────────────────────────────────────────────────
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {posts.map((post, index) => {
                const totalVotes =
                    post.options?.reduce(
                        (sum, opt) => sum + (opt.votes || 0),
                        0,
                    ) || 0;
                const voted = hasVoted(post);
                const owned = isOwner(post);
                const showResults = voted || owned;
                const maxVotes = Math.max(
                    ...(post.options?.map((o) => o.votes || 0) || [0]),
                );

                return (
                    <div
                        key={post._id}
                        className={`
                            ${t.card} rounded-2xl border overflow-hidden
                            transition-all duration-300
                            ${t.cardHover}
                            animate-[fadeInUp_0.4s_ease-out_both]
                        `}
                        style={{ animationDelay: `${index * 60}ms` }}
                    >
                        {/* ── Author Header ────────────────────────── */}
                        <div
                            className={`
                                px-4 py-3 sm:px-5 sm:py-3.5
                                border-b ${t.divider}
                                flex items-center justify-between
                            `}
                        >
                            <div className="flex items-center gap-3 min-w-0">
                                {post.owner?.avatar ? (
                                    <Link
                                        to={`/c/${post.owner?.username}`}
                                        className="shrink-0"
                                    >
                                        <img
                                            src={post.owner.avatar}
                                            alt={post.owner.fullName}
                                            className={`
                                                w-9 h-9 sm:w-10 sm:h-10
                                                rounded-full object-cover
                                                ring-2 ${t.avatarRing}
                                                ${t.avatarHover}
                                                transition-all duration-200
                                                hover:scale-105
                                            `}
                                        />
                                    </Link>
                                ) : (
                                    <div
                                        className={`
                                            w-9 h-9 sm:w-10 sm:h-10
                                            rounded-full flex items-center justify-center
                                            ${isDark ? "bg-gray-700" : "bg-gray-200"}
                                        `}
                                    >
                                        <User
                                            className={`w-4 h-4 ${t.textFaded}`}
                                        />
                                    </div>
                                )}

                                <div className="min-w-0 flex-1">
                                    <Link
                                        to={`/c/${post.owner?.username}`}
                                        className={`
                                            font-semibold text-sm ${t.text}
                                            hover:underline truncate block
                                        `}
                                    >
                                        {post.owner?.fullName || "Unknown"}
                                    </Link>
                                    <div
                                        className={`flex items-center gap-1.5 text-xs ${t.textFaded}`}
                                    >
                                        {post.owner?.username && (
                                            <span>@{post.owner.username}</span>
                                        )}
                                        {post.createdAt && (
                                            <>
                                                <span
                                                    className={`
                                                        w-1 h-1 rounded-full
                                                        ${isDark ? "bg-gray-600" : "bg-gray-400"}
                                                    `}
                                                />
                                                <span>
                                                    {timeAgo(post.createdAt)}
                                                </span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Right side: Badge + Edit */}
                            <div className="flex items-center gap-2 shrink-0 ml-2">
                                <span
                                    className={`
                                        hidden sm:inline-flex items-center gap-1
                                        px-2 py-0.5 rounded-full
                                        text-[11px] font-semibold uppercase tracking-wider
                                        ${t.badgePoll}
                                    `}
                                >
                                    <BarChart3 className="w-3 h-3" />
                                    Poll
                                </span>

                                {owned && (
                                    <button
                                        onClick={(e) =>
                                            handleEditClick(e, post._id)
                                        }
                                        className={`
                                            p-1.5 sm:p-2 rounded-lg
                                            ${t.editBtn}
                                            transition-all duration-200
                                            hover:scale-105 active:scale-95
                                        `}
                                        title="Edit poll"
                                    >
                                        <Edit3 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* ── Poll Body ────────────────────────────── */}
                        <div className="px-4 py-4 sm:px-5 sm:py-5">
                            {/* Question */}
                            <h3
                                className={`
                                    text-base sm:text-lg font-semibold
                                    ${t.heading} leading-snug
                                    line-clamp-3 mb-4
                                `}
                            >
                                {post.poll}
                            </h3>

                            {/* Options */}
                            <div className="space-y-2">
                                {post.options?.map((option, optIndex) => {
                                    const percentage = pct(
                                        option.votes || 0,
                                        totalVotes,
                                    );
                                    const isWinner =
                                        showResults &&
                                        (option.votes || 0) === maxVotes &&
                                        maxVotes > 0;

                                    return (
                                        <button
                                            key={optIndex}
                                            type="button"
                                            disabled={showResults}
                                            onClick={() =>
                                                handleVote(post._id, optIndex)
                                            }
                                            className={`
                                                relative w-full overflow-hidden
                                                rounded-xl border-2
                                                transition-all duration-300
                                                text-left group
                                                ${
                                                    showResults
                                                        ? t.optionVoted
                                                        : t.optionIdle
                                                }
                                                ${isWinner ? t.optionRingWinner : ""}
                                            `}
                                        >
                                            {/* Progress fill */}
                                            {showResults && (
                                                <div
                                                    className={`
                                                        absolute inset-y-0 left-0
                                                        ${isWinner ? t.optionBarWinner : t.optionBar}
                                                        transition-all duration-700 ease-out
                                                    `}
                                                    style={{
                                                        width: `${percentage}%`,
                                                    }}
                                                />
                                            )}

                                            {/* Content */}
                                            <div
                                                className="
                                                    relative px-3.5 py-2.5
                                                    flex items-center justify-between gap-3
                                                "
                                            >
                                                <span
                                                    className={`
                                                        text-sm font-medium
                                                        ${t.optionText}
                                                        truncate flex-1
                                                        ${
                                                            !showResults
                                                                ? "group-hover:translate-x-0.5 transition-transform duration-200"
                                                                : ""
                                                        }
                                                    `}
                                                >
                                                    {option.text}
                                                </span>

                                                {showResults ? (
                                                    <span
                                                        className={`
                                                            text-xs font-bold
                                                            ${t.optionMeta}
                                                            tabular-nums shrink-0
                                                            ${isWinner ? (isDark ? "text-blue-400" : "text-blue-600") : ""}
                                                        `}
                                                    >
                                                        {percentage}%
                                                    </span>
                                                ) : (
                                                    <ChevronRight
                                                        className={`
                                                            w-4 h-4 shrink-0
                                                            ${t.textFaded}
                                                            opacity-0 group-hover:opacity-100
                                                            -translate-x-1 group-hover:translate-x-0
                                                            transition-all duration-200
                                                        `}
                                                    />
                                                )}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* ── Footer ───────────────────────────────── */}
                        <div
                            className={`
                                px-4 py-3 sm:px-5
                                border-t ${t.divider}
                                flex flex-wrap items-center justify-between gap-2
                            `}
                        >
                            <span
                                className={`
                                    flex items-center gap-1.5
                                    text-xs sm:text-sm ${t.textFaded}
                                `}
                            >
                                <Users className="w-3.5 h-3.5" />
                                <span className="tabular-nums">
                                    {totalVotes}
                                </span>
                                vote{totalVotes !== 1 ? "s" : ""}
                            </span>

                            <div className="flex items-center gap-2">
                                {voted && (
                                    <span
                                        className={`
                                            inline-flex items-center gap-1
                                            px-2 py-0.5 rounded-full
                                            text-[11px] font-semibold
                                            ${t.badgeGreen}
                                        `}
                                    >
                                        <CheckCircle className="w-3 h-3" />
                                        Voted
                                    </span>
                                )}
                                {owned && (
                                    <span
                                        className={`
                                            inline-flex items-center gap-1
                                            px-2 py-0.5 rounded-full
                                            text-[11px] font-semibold
                                            ${t.badgeBlue}
                                        `}
                                    >
                                        <User className="w-3 h-3" />
                                        Your poll
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

// ─── Skeleton Card ───────────────────────────────────────────────────
const PostCardSkeleton = ({ t, index = 0 }) => (
    <div
        className={`${t.card} rounded-2xl border overflow-hidden animate-pulse`}
        style={{ animationDelay: `${index * 100}ms` }}
    >
        {/* Header skeleton */}
        <div
            className={`px-4 py-3 sm:px-5 border-b ${t.divider} flex items-center gap-3`}
        >
            <div className={`w-10 h-10 rounded-full ${t.skeleton}`} />
            <div className="space-y-2 flex-1">
                <div className={`h-4 w-28 rounded-md ${t.skeleton}`} />
                <div className={`h-3 w-20 rounded-md ${t.skeleton}`} />
            </div>
            <div className={`h-5 w-12 rounded-full ${t.skeleton}`} />
        </div>

        {/* Body skeleton */}
        <div className="px-4 py-4 sm:px-5 sm:py-5 space-y-3">
            {/* Question */}
            <div className={`h-5 w-4/5 rounded-md ${t.skeleton}`} />
            <div className={`h-5 w-3/5 rounded-md ${t.skeleton}`} />

            {/* Options */}
            <div className="space-y-2 pt-1">
                <div className={`h-11 w-full rounded-xl ${t.skeleton}`} />
                <div className={`h-11 w-full rounded-xl ${t.skeleton}`} />
                <div className={`h-11 w-4/5 rounded-xl ${t.skeleton}`} />
            </div>
        </div>

        {/* Footer skeleton */}
        <div
            className={`px-4 py-3 sm:px-5 border-t ${t.divider} flex justify-between`}
        >
            <div className={`h-4 w-16 rounded-md ${t.skeleton}`} />
            <div className={`h-4 w-14 rounded-full ${t.skeleton}`} />
        </div>
    </div>
);

export default PostGrid;
