// EditPost.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import useAuth from "../../hooks/useAuth.hooks";
import useAxiosPrivate from "../../hooks/useAxiosPrivate.hooks";
import { selectTheme } from "../../features/theme/themeSlice";

const EditPost = () => {
    const { postId } = useParams();
    const navigate = useNavigate();
    const axiosPrivate = useAxiosPrivate();
    const { user } = useAuth();
    const theme = useSelector(selectTheme);
    const isDark = theme === "dark";

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const [poll, setPoll] = useState("");
    const [options, setOptions] = useState([""]);
    const [totalVotes, setTotalVotes] = useState(0);

    // Theme styles
    const themeStyles = {
        dark: {
            bg: "bg-gray-950",
            card: "bg-gray-900 border-gray-700",
            text: "text-white",
            textSecondary: "text-gray-300",
            textMuted: "text-gray-400",
            textFaded: "text-gray-500",
            input: "bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500/20",
            label: "text-gray-300",
            danger: "text-red-400",
            dangerBg: "bg-red-500/10 border-red-500/30 text-red-400",
            warningBg: "bg-yellow-500/10 border-yellow-500/30 text-yellow-400",
            cancelBtn:
                "bg-gray-800 hover:bg-gray-700 text-gray-300 border-gray-700",
            saveBtn:
                "bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50",
            deleteBtn:
                "bg-red-600/10 hover:bg-red-600/20 text-red-400 border-red-500/30",
            backBtn: "text-gray-400 hover:text-white",
            addBtn: "border-gray-700 hover:border-blue-500 text-gray-400 hover:text-blue-400",
            removeBtn: "text-gray-500 hover:text-red-400",
            optionIndex: "bg-gray-800 text-gray-400",
            badge: "bg-gray-800 text-gray-400",
            divider: "border-gray-800",
        },
        light: {
            bg: "bg-gray-50",
            card: "bg-white border-gray-200 shadow-sm",
            text: "text-gray-900",
            textSecondary: "text-gray-700",
            textMuted: "text-gray-500",
            textFaded: "text-gray-400",
            input: "bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/20",
            label: "text-gray-700",
            danger: "text-red-600",
            dangerBg: "bg-red-50 border-red-200 text-red-600",
            warningBg: "bg-yellow-50 border-yellow-200 text-yellow-700",
            cancelBtn:
                "bg-white hover:bg-gray-50 text-gray-700 border-gray-300",
            saveBtn:
                "bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50",
            deleteBtn: "bg-red-50 hover:bg-red-100 text-red-600 border-red-200",
            backBtn: "text-gray-500 hover:text-gray-900",
            addBtn: "border-gray-300 hover:border-blue-400 text-gray-400 hover:text-blue-500",
            removeBtn: "text-gray-400 hover:text-red-500",
            optionIndex: "bg-gray-100 text-gray-500",
            badge: "bg-gray-100 text-gray-500",
            divider: "border-gray-100",
        },
    };

    const t = isDark ? themeStyles.dark : themeStyles.light;

    // Fetch post data
    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await axiosPrivate.get(
                    `/post/user/${user?._id}`,
                );
                const posts = response.data.data || [];
                const post = posts.find((p) => p._id === postId);

                if (!post) {
                    setError("Post not found.");
                    setLoading(false);
                    return;
                }

                // Check ownership
                if (post.owner?._id !== user?._id) {
                    setError("You are not authorized to edit this post.");
                    setLoading(false);
                    return;
                }

                setPoll(post.poll || "");
                setOptions(post.options?.map((opt) => opt.text || "") || [""]);
                setTotalVotes(
                    post.options?.reduce(
                        (sum, opt) => sum + (opt.votes || 0),
                        0,
                    ) || 0,
                );
            } catch (err) {
                console.error("Error fetching post:", err);
                setError("Failed to load post details.");
            } finally {
                setLoading(false);
            }
        };

        if (postId && user?._id) fetchPost();
    }, [postId, axiosPrivate, user]);

    // Option handlers
    const handleOptionChange = (index, value) => {
        const updated = [...options];
        updated[index] = value;
        setOptions(updated);
    };

    const handleAddOption = () => {
        if (options.length >= 10) {
            alert("Maximum 10 options allowed.");
            return;
        }
        setOptions([...options, ""]);
    };

    const handleRemoveOption = (index) => {
        if (options.length <= 1) {
            alert("At least one option is required.");
            return;
        }
        setOptions(options.filter((_, i) => i !== index));
    };

    // Save handler
    const handleSave = async (e) => {
        e.preventDefault();

        if (!poll.trim()) {
            alert("Poll question is required.");
            return;
        }

        const filledOptions = options.filter((opt) => opt.trim() !== "");
        if (filledOptions.length < 2) {
            alert("At least 2 options are required.");
            return;
        }

        setSaving(true);
        try {
            await axiosPrivate.patch(`/post/${postId}`, {
                poll: poll.trim(),
                options: filledOptions.map((text) => text.trim()),
            });
            navigate(-1);
        } catch (err) {
            console.error("Error updating post:", err);
            alert(
                err.response?.data?.message ||
                    "Failed to update post. Please try again.",
            );
        } finally {
            setSaving(false);
        }
    };

    // Delete handler
    const handleDelete = async () => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this post? This action cannot be undone.",
        );
        if (!confirmed) return;

        try {
            await axiosPrivate.delete(`/post/${postId}`);
            navigate(-1, { replace: true });
        } catch (err) {
            console.error("Error deleting post:", err);
            alert("Failed to delete post. Please try again.");
        }
    };

    // --- LOADING STATE ---
    if (loading) {
        return (
            <div
                className={`min-h-screen ${t.bg} flex items-center justify-center`}
            >
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    <p className={`${t.textMuted} text-sm`}>
                        Loading post details...
                    </p>
                </div>
            </div>
        );
    }

    // --- ERROR STATE ---
    if (error) {
        return (
            <div
                className={`min-h-screen ${t.bg} flex items-center justify-center p-4`}
            >
                <div
                    className={`${t.card} border rounded-xl p-8 max-w-md w-full text-center`}
                >
                    <div className="text-red-500 mb-4">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-12 h-12 mx-auto"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                            />
                        </svg>
                    </div>
                    <h3 className={`${t.text} font-semibold text-lg mb-2`}>
                        {error}
                    </h3>
                    <button
                        onClick={() => navigate(-1)}
                        className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    const filledCount = options.filter((opt) => opt.trim() !== "").length;

    // --- MAIN FORM ---
    return (
        <div className={`min-h-screen ${t.bg} py-8 px-4`}>
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                    <button
                        onClick={() => navigate(-1)}
                        className={`${t.backBtn} p-2 rounded-lg transition-colors`}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="w-5 h-5"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                            />
                        </svg>
                    </button>
                    <div>
                        <h1 className={`${t.text} text-2xl font-bold`}>
                            Edit Post
                        </h1>
                        <p className={`${t.textMuted} text-sm mt-1`}>
                            Update your poll details
                        </p>
                    </div>
                </div>

                {/* Votes Warning */}
                {totalVotes > 0 && (
                    <div
                        className={`${t.warningBg} border rounded-lg p-4 mb-6 flex items-start gap-3`}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-5 h-5 shrink-0 mt-0.5"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                            />
                        </svg>
                        <div>
                            <p className="text-sm font-medium">
                                This poll has {totalVotes} vote
                                {totalVotes !== 1 ? "s" : ""}
                            </p>
                            <p className="text-xs mt-1 opacity-80">
                                Editing options may affect existing vote data.
                            </p>
                        </div>
                    </div>
                )}

                {/* Form Card */}
                <form onSubmit={handleSave}>
                    <div
                        className={`${t.card} border rounded-xl overflow-hidden`}
                    >
                        {/* Poll Question */}
                        <div className="p-6 space-y-2">
                            <label
                                htmlFor="poll"
                                className={`block text-sm font-medium ${t.label}`}
                            >
                                Poll Question{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                id="poll"
                                value={poll}
                                onChange={(e) => setPoll(e.target.value)}
                                placeholder="Ask your audience something..."
                                rows={3}
                                maxLength={500}
                                className={`w-full px-4 py-2.5 rounded-lg border outline-none transition-all focus:ring-2 resize-y min-h-[80px] ${t.input}`}
                            />
                            <div
                                className={`flex justify-end text-xs ${t.textFaded}`}
                            >
                                {poll.length}/500
                            </div>
                        </div>

                        {/* Divider */}
                        <div className={`border-t ${t.divider}`} />

                        {/* Options Section */}
                        <div className="p-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <label
                                    className={`block text-sm font-medium ${t.label}`}
                                >
                                    Options{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <span
                                    className={`text-xs ${t.badge} px-2 py-1 rounded-full`}
                                >
                                    {filledCount} of {options.length}
                                    {filledCount < 2 && " (min 2)"}
                                </span>
                            </div>

                            <div className="space-y-3">
                                {options.map((option, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-2"
                                    >
                                        {/* Option Index */}
                                        <span
                                            className={`${t.optionIndex} w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium shrink-0`}
                                        >
                                            {index + 1}
                                        </span>

                                        {/* Option Input */}
                                        <input
                                            type="text"
                                            value={option}
                                            onChange={(e) =>
                                                handleOptionChange(
                                                    index,
                                                    e.target.value,
                                                )
                                            }
                                            placeholder={`Option ${index + 1}...`}
                                            maxLength={200}
                                            className={`flex-1 px-4 py-2.5 rounded-lg border outline-none transition-all focus:ring-2 ${t.input}`}
                                        />

                                        {/* Remove Button */}
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleRemoveOption(index)
                                            }
                                            disabled={options.length <= 1}
                                            className={`p-2 rounded-lg transition-colors ${t.removeBtn} disabled:opacity-30 disabled:cursor-not-allowed`}
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth={1.5}
                                                stroke="currentColor"
                                                className="w-4 h-4"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                                />
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* Add Option Button */}
                            {options.length < 10 && (
                                <button
                                    type="button"
                                    onClick={handleAddOption}
                                    className={`w-full py-2.5 rounded-lg border-2 border-dashed transition-all text-sm font-medium flex items-center justify-center gap-2 ${t.addBtn}`}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={2}
                                        stroke="currentColor"
                                        className="w-4 h-4"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M12 4.5v15m7.5-7.5h-15"
                                        />
                                    </svg>
                                    Add Option ({options.length}/10)
                                </button>
                            )}
                        </div>

                        {/* Divider */}
                        <div className={`border-t ${t.divider}`} />

                        {/* Action Buttons */}
                        <div className="p-6 flex flex-col sm:flex-row justify-between gap-4">
                            {/* Delete Button */}
                            <button
                                type="button"
                                onClick={handleDelete}
                                className={`px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors flex items-center justify-center gap-2 ${t.deleteBtn}`}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="w-4 h-4"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                    />
                                </svg>
                                Delete Post
                            </button>

                            {/* Cancel & Save */}
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => navigate(-1)}
                                    className={`px-5 py-2.5 rounded-lg border text-sm font-medium transition-colors ${t.cancelBtn}`}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={
                                        saving ||
                                        !poll.trim() ||
                                        filledCount < 2
                                    }
                                    className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${t.saveBtn}`}
                                >
                                    {saving ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth={2}
                                                stroke="currentColor"
                                                className="w-4 h-4"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M4.5 12.75l6 6 9-13.5"
                                                />
                                            </svg>
                                            Save Changes
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditPost;
