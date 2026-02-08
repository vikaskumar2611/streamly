import { useState, useEffect, useRef } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate.hooks";
import useAuth from "../../hooks/useAuth.hooks";
import CommentItem from "./CommentItem";

const CommentSection = ({ videoId, userAvatar }) => {
    const axiosPrivate = useAxiosPrivate();
    const { user } = useAuth();
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newComment, setNewComment] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [totalComments, setTotalComments] = useState(0);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef(null);

    const resolvedAvatar = userAvatar || user?.avatar;
    ("/default-avatar.png");
    const resolvedUserId = user?._id;

    const fetchComments = async (pageNum = 1, reset = false) => {
        try {
            setLoading(true);
            const response = await axiosPrivate.get(`/comment/${videoId}`, {
                params: { page: pageNum, limit: 10 },
            });

            const { comments: newComments, pagination } = response.data.data;

            if (reset) {
                setComments(newComments);
            } else {
                setComments((prev) => [...prev, ...newComments]);
            }

            setTotalComments(pagination.totalComments);
            setHasMore(pagination.hasNextPage);
            setPage(pageNum);
        } catch (error) {
            console.error("Error fetching comments:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComments(1, true);
    }, [videoId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim() || submitting) return;

        try {
            setSubmitting(true);
            const response = await axiosPrivate.post(`/comment/${videoId}`, {
                content: newComment.trim(),
            });

            setComments((prev) => [response.data.data, ...prev]);
            setTotalComments((prev) => prev + 1);
            setNewComment("");
            setIsFocused(false);
        } catch (error) {
            console.error("Error adding comment:", error);
            if (error.response?.status === 429) {
                alert("You've reached the comment limit for this video.");
            }
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = (commentId) => {
        const removeComment = (commentsList, targetId) => {
            return commentsList.filter((c) => {
                if (c._id === targetId) return false;
                if (c.replies) {
                    c.replies = removeComment(c.replies, targetId);
                }
                return true;
            });
        };

        setComments((prev) => removeComment(prev, commentId));
        setTotalComments((prev) => prev - 1);
    };

    const handleUpdate = (commentId, newContent) => {
        const updateComment = (commentsList, targetId, content) => {
            return commentsList.map((c) => {
                if (c._id === targetId) {
                    return { ...c, content };
                }
                if (c.replies) {
                    c.replies = updateComment(c.replies, targetId, content);
                }
                return c;
            });
        };

        setComments((prev) => updateComment(prev, commentId, newContent));
    };

    const handleAddReply = (parentId, reply) => {
        const addReply = (commentsList, targetId, newReply) => {
            return commentsList.map((c) => {
                if (c._id === targetId) {
                    return {
                        ...c,
                        replies: [...(c.replies || []), newReply],
                        repliesCount: (c.repliesCount || 0) + 1,
                    };
                }
                if (c.replies) {
                    c.replies = addReply(c.replies, targetId, newReply);
                }
                return c;
            });
        };

        setComments((prev) => addReply(prev, parentId, reply));
        setTotalComments((prev) => prev + 1);
    };

    return (
        <div className="mt-6">
            {/* Header */}
            <div className="flex items-center gap-6 mb-6">
                <h2 className="text-xl font-bold text-white">
                    {totalComments.toLocaleString()} Comments
                </h2>
            </div>

            {/* Add Comment */}
            <form onSubmit={handleSubmit} className="flex gap-3 mb-8">
                <img
                    src={resolvedAvatar}
                    alt="You"
                    className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                />
                <div className="flex-1">
                    <input
                        ref={inputRef}
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        placeholder="Add a comment..."
                        className="w-full bg-transparent border-b border-zinc-600 focus:border-zinc-400 text-white placeholder-zinc-500 py-2 outline-none transition-colors"
                    />

                    {isFocused && (
                        <div className="flex justify-end gap-2 mt-3">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsFocused(false);
                                    setNewComment("");
                                }}
                                className="px-4 py-2 text-sm text-zinc-400 hover:text-white font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={!newComment.trim() || submitting}
                                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-full font-medium hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                            >
                                {submitting ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Posting...
                                    </>
                                ) : (
                                    "Comment"
                                )}
                            </button>
                        </div>
                    )}
                </div>
            </form>

            {/* Comments List */}
            <div className="space-y-6">
                {loading && comments.length === 0 ? (
                    <div className="flex justify-center py-8">
                        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : comments.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-zinc-400">No comments yet</p>
                        <p className="text-zinc-500 text-sm mt-1">
                            Be the first to comment!
                        </p>
                    </div>
                ) : (
                    <>
                        {comments.map((comment) => (
                            <CommentItem
                                key={comment._id}
                                comment={comment}
                                videoId={videoId}
                                currentUserId={resolvedUserId}
                                currentUserAvatar={resolvedAvatar}
                                onDelete={handleDelete}
                                onUpdate={handleUpdate}
                                onAddReply={handleAddReply}
                            />
                        ))}

                        {hasMore && (
                            <button
                                onClick={() => fetchComments(page + 1)}
                                disabled={loading}
                                className="w-full py-3 text-blue-400 hover:text-blue-300 font-medium text-sm flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    "Load more comments"
                                )}
                            </button>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default CommentSection;
