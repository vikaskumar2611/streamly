import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectTheme } from "../features/theme/themeSlice";
import useAuth from "../hooks/useAuth.hooks";
import { Edit3, BarChart3, Users } from "lucide-react";

const PostGrid = ({ posts = [], onVote }) => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const theme = useSelector(selectTheme);
    const isDark = theme === "dark";

    const themeStyles = {
        dark: {
            card: "bg-gray-800 border-gray-700",
            cardHover: "hover:bg-gray-750 hover:border-gray-600",
            text: "text-white",
            textMuted: "text-gray-400",
            textFaded: "text-gray-500",
            optionDefault: "border-gray-600 hover:border-blue-500",
            optionVoted: "border-gray-600",
            optionProgress: "bg-blue-600/30",
            optionText: "text-gray-200",
            optionMeta: "text-gray-400",
            editBtn: "bg-blue-600/20 hover:bg-blue-600/30 text-blue-400",
            badge: "bg-gray-700 text-gray-300",
            badgeGreen: "text-green-400",
        },
        light: {
            card: "bg-white border-gray-200 shadow-sm",
            cardHover: "hover:shadow-md hover:border-gray-300",
            text: "text-gray-900",
            textMuted: "text-gray-600",
            textFaded: "text-gray-500",
            optionDefault: "border-gray-200 hover:border-blue-400",
            optionVoted: "border-gray-200",
            optionProgress: "bg-blue-100",
            optionText: "text-gray-700",
            optionMeta: "text-gray-600",
            editBtn: "bg-blue-50 hover:bg-blue-100 text-blue-600",
            badge: "bg-gray-100 text-gray-600",
            badgeGreen: "text-green-600",
        },
    };

    const t = isDark ? themeStyles.dark : themeStyles.light;

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

    const handleEditClick = (e, postId) => {
        e.stopPropagation();
        navigate(`/edit/post/${postId}`);
    };

    const handleVote = (postId, optionIndex) => {
        if (onVote) {
            onVote(postId, optionIndex);
        }
    };

    if (!posts || posts.length === 0) {
        return null;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                        className={`${t.card} rounded-xl border overflow-hidden transition-all duration-300 ${t.cardHover}`}
                    >
                        {/* Post Header */}
                        <div className="p-4 flex justify-between items-start">
                            <div className="flex items-center gap-2">
                                <BarChart3 className="w-5 h-5 text-blue-500" />
                                <span
                                    className={`text-xs font-medium ${t.badge} px-2 py-1 rounded-full`}
                                >
                                    Poll
                                </span>
                            </div>

                            {/* Edit Button - Only for owner */}
                            {userIsOwner && (
                                <button
                                    onClick={(e) =>
                                        handleEditClick(e, post._id)
                                    }
                                    className={`p-2 rounded-lg transition-colors duration-200 flex items-center gap-1.5 text-sm font-medium ${t.editBtn}`}
                                >
                                    <Edit3 className="w-4 h-4" />
                                    Edit
                                </button>
                            )}
                        </div>

                        {/* Poll Question */}
                        <div className="px-4 pb-2">
                            <h3
                                className={`text-lg font-semibold ${t.text} line-clamp-2`}
                            >
                                {post.poll}
                            </h3>
                        </div>

                        {/* Options */}
                        <div className="px-4 pb-4 space-y-2">
                            {post.options?.slice(0, 3).map((option, index) => {
                                const percentage = calculatePercentage(
                                    option.votes || 0,
                                    totalVotes,
                                );

                                return (
                                    <div
                                        key={index}
                                        onClick={() => {
                                            if (!userHasVoted && !userIsOwner) {
                                                handleVote(post._id, index);
                                            }
                                        }}
                                        className={`relative overflow-hidden rounded-lg border transition-all duration-300 ${
                                            userHasVoted || userIsOwner
                                                ? `${t.optionVoted} cursor-default`
                                                : `${t.optionDefault} cursor-pointer`
                                        }`}
                                    >
                                        {/* Progress Bar */}
                                        <div
                                            className={`absolute inset-0 ${t.optionProgress} transition-all duration-500`}
                                            style={{ width: `${percentage}%` }}
                                        />

                                        {/* Option Content */}
                                        <div className="relative p-2.5 flex justify-between items-center">
                                            <span
                                                className={`text-sm font-medium ${t.optionText} truncate flex-1`}
                                            >
                                                {option.text}
                                            </span>
                                            <span
                                                className={`text-xs font-semibold ${t.optionMeta} ml-2`}
                                            >
                                                {percentage}%
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}

                            {/* Show more options indicator */}
                            {post.options?.length > 3 && (
                                <p
                                    className={`text-xs ${t.textFaded} text-center`}
                                >
                                    +{post.options.length - 3} more option(s)
                                </p>
                            )}
                        </div>

                        {/* Footer */}
                        <div
                            className={`px-4 py-3 border-t ${isDark ? "border-gray-700" : "border-gray-100"} flex justify-between items-center`}
                        >
                            <span
                                className={`text-sm ${t.textFaded} flex items-center gap-1.5`}
                            >
                                <Users className="w-4 h-4" />
                                {totalVotes} vote{totalVotes !== 1 ? "s" : ""}
                            </span>

                            {userHasVoted && (
                                <span
                                    className={`text-xs font-medium ${t.badgeGreen}`}
                                >
                                    ✓ Voted
                                </span>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default PostGrid;
