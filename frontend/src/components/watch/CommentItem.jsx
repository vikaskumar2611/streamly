import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate.hooks";
import Icons from "./Icons";

const CommentItem = ({
    comment,
    videoId,
    currentUserId,
    currentUserAvatar,
    onDelete,
    onUpdate,
    onAddReply,
    depth = 0,
}) => {
    const axiosPrivate = useAxiosPrivate();
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [likeLoading, setLikeLoading] = useState(false);
    const [showReplies, setShowReplies] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(comment.content);
    const [showMenu, setShowMenu] = useState(false);
    const [isReplying, setIsReplying] = useState(false);
    const [replyContent, setReplyContent] = useState("");
    const [replySubmitting, setReplySubmitting] = useState(false);
    const menuRef = useRef(null);

    const isOwner = currentUserId === comment.owner._id;
    const maxDepth = 2;

    useEffect(() => {
        const fetchLikeStatus = async () => {
            try {
                const response = await axiosPrivate.get(
                    `/like/fetch/c/${comment._id}`,
                );
                setIsLiked(response.data.data.isLiked);
                setLikeCount(response.data.data.likeCount);
            } catch (error) {
                console.error("Error fetching comment like status:", error);
            }
        };
        fetchLikeStatus();
    }, [comment._id, axiosPrivate]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setShowMenu(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLike = async () => {
        if (likeLoading) return;
        setLikeLoading(true);
        try {
            const response = await axiosPrivate.post(
                `/like/toggle/c/${comment._id}`,
            );
            setIsLiked(response.data.data.isLiked);
            setLikeCount(response.data.data.likeCount);
        } catch (error) {
            console.error("Error toggling like:", error);
        } finally {
            setLikeLoading(false);
        }
    };

    const handleEdit = async () => {
        if (!editContent.trim()) return;
        try {
            await axiosPrivate.patch(`/comment/c/${comment._id}`, {
                content: editContent.trim(),
            });
            onUpdate(comment._id, editContent.trim());
            setIsEditing(false);
        } catch (error) {
            console.error("Error updating comment:", error);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Delete this comment?")) return;
        try {
            await axiosPrivate.delete(`/comment/c/${comment._id}`);
            onDelete(comment._id);
        } catch (error) {
            console.error("Error deleting comment:", error);
        }
    };

    const handleReply = async () => {
        if (!replyContent.trim() || replySubmitting) return;
        setReplySubmitting(true);
        try {
            const response = await axiosPrivate.post(`/comment/${videoId}`, {
                content: replyContent.trim(),
                parentCommentId: comment._id,
            });
            if (onAddReply) {
                onAddReply(comment._id, response.data.data);
            }
            setReplyContent("");
            setIsReplying(false);
            setShowReplies(true);
        } catch (error) {
            console.error("Error adding reply:", error);
            if (error.response?.status === 429) {
                alert("You've reached the comment limit for this video.");
            }
        } finally {
            setReplySubmitting(false);
        }
    };

    const formatTimeAgo = (date) => {
        const now = new Date();
        const commentDate = new Date(date);
        const diff = now - commentDate;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        const weeks = Math.floor(days / 7);
        const months = Math.floor(days / 30);
        const years = Math.floor(days / 365);

        if (years > 0) return `${years}y ago`;
        if (months > 0) return `${months}mo ago`;
        if (weeks > 0) return `${weeks}w ago`;
        if (days > 0) return `${days}d ago`;
        if (hours > 0) return `${hours}h ago`;
        if (minutes > 0) return `${minutes}m ago`;
        return "now";
    };

    return (
        <div className="flex gap-3 group">
            <Link to={`/c/${comment.owner.username}`}>
                <img
                    src={comment.owner.avatar || "/default-avatar.png"}
                    alt={comment.owner.fullName}
                    className={`rounded-full object-cover flex-shrink-0 ${
                        depth > 0 ? "w-8 h-8" : "w-10 h-10"
                    }`}
                />
            </Link>

            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <Link
                        to={`/c/${comment.owner.username}`}
                        className="text-sm font-medium text-white hover:text-zinc-300"
                    >
                        @{comment.owner.username}
                    </Link>
                    <span className="text-xs text-zinc-500">
                        {formatTimeAgo(comment.createdAt)}
                    </span>
                    {comment.updatedAt !== comment.createdAt && (
                        <span className="text-xs text-zinc-500">(edited)</span>
                    )}
                </div>

                {isEditing ? (
                    <div className="mt-2">
                        <input
                            type="text"
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            className="w-full bg-transparent border-b border-zinc-600 focus:border-blue-500 text-white text-sm py-1 outline-none"
                            autoFocus
                        />
                        <div className="flex justify-end gap-2 mt-2">
                            <button
                                onClick={() => {
                                    setIsEditing(false);
                                    setEditContent(comment.content);
                                }}
                                className="px-3 py-1.5 text-sm text-zinc-400 hover:text-white"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleEdit}
                                disabled={!editContent.trim()}
                                className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-full hover:bg-blue-500 disabled:opacity-50"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                ) : (
                    <p className="text-sm text-zinc-200 mt-1 break-words">
                        {comment.content}
                    </p>
                )}

                {/* Actions */}
                <div className="flex items-center gap-4 mt-2">
                    <button
                        onClick={handleLike}
                        disabled={likeLoading}
                        className={`flex items-center gap-1 text-xs ${
                            isLiked
                                ? "text-blue-400"
                                : "text-zinc-400 hover:text-zinc-200"
                        } disabled:opacity-50`}
                    >
                        <Icons.LikeSmall filled={isLiked} />
                        {likeCount > 0 && <span>{likeCount}</span>}
                    </button>

                    {depth < maxDepth && (
                        <button
                            onClick={() => setIsReplying(!isReplying)}
                            className="text-xs text-zinc-400 hover:text-zinc-200 font-medium"
                        >
                            Reply
                        </button>
                    )}
                </div>

                {/* Reply Input */}
                {isReplying && (
                    <div className="mt-3 flex gap-3">
                        <img
                            src={currentUserAvatar || "/default-avatar.png"}
                            alt="You"
                            className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                        />
                        <div className="flex-1">
                            <input
                                type="text"
                                value={replyContent}
                                onChange={(e) =>
                                    setReplyContent(e.target.value)
                                }
                                placeholder={`Reply to @${comment.owner.username}...`}
                                className="w-full bg-transparent border-b border-zinc-600 focus:border-blue-500 text-white text-sm py-1 outline-none"
                                autoFocus
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                        e.preventDefault();
                                        handleReply();
                                    }
                                }}
                            />
                            <div className="flex justify-end gap-2 mt-2">
                                <button
                                    onClick={() => {
                                        setIsReplying(false);
                                        setReplyContent("");
                                    }}
                                    className="px-3 py-1.5 text-sm text-zinc-400 hover:text-white"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleReply}
                                    disabled={
                                        !replyContent.trim() || replySubmitting
                                    }
                                    className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-full hover:bg-blue-500 disabled:opacity-50 flex items-center gap-2"
                                >
                                    {replySubmitting ? (
                                        <>
                                            <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Posting...
                                        </>
                                    ) : (
                                        "Reply"
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Replies */}
                {comment.replies?.length > 0 && (
                    <div className="mt-2">
                        <button
                            onClick={() => setShowReplies(!showReplies)}
                            className="flex items-center gap-1 text-blue-400 text-sm font-medium hover:text-blue-300"
                        >
                            {showReplies ? (
                                <Icons.ChevronUp />
                            ) : (
                                <Icons.ChevronDown />
                            )}
                            {comment.replies.length}{" "}
                            {comment.replies.length === 1 ? "reply" : "replies"}
                        </button>

                        {showReplies && (
                            <div className="mt-3 space-y-4 pl-2 border-l-2 border-zinc-700">
                                {comment.replies.map((reply) => (
                                    <CommentItem
                                        key={reply._id}
                                        comment={reply}
                                        videoId={videoId}
                                        currentUserId={currentUserId}
                                        currentUserAvatar={currentUserAvatar}
                                        onDelete={onDelete}
                                        onUpdate={onUpdate}
                                        onAddReply={onAddReply}
                                        depth={depth + 1}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Owner menu */}
            {isOwner && !isEditing && (
                <div className="relative" ref={menuRef}>
                    <button
                        onClick={() => setShowMenu(!showMenu)}
                        className="p-1 text-zinc-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <Icons.MoreVert />
                    </button>

                    {showMenu && (
                        <div className="absolute right-0 mt-1 w-32 bg-zinc-800 rounded-lg shadow-xl border border-zinc-700 overflow-hidden z-10">
                            <button
                                onClick={() => {
                                    setIsEditing(true);
                                    setShowMenu(false);
                                }}
                                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-zinc-200 hover:bg-zinc-700"
                            >
                                <Icons.Edit />
                                Edit
                            </button>
                            <button
                                onClick={() => {
                                    handleDelete();
                                    setShowMenu(false);
                                }}
                                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-400 hover:bg-zinc-700"
                            >
                                <Icons.Delete />
                                Delete
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default CommentItem;
