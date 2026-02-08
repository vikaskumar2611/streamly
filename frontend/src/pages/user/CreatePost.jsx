// CreatePost.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import useAuth from "../../hooks/useAuth.hooks";
import useAxiosPrivate from "../../hooks/useAxiosPrivate.hooks";
import { selectTheme } from "../../features/theme/themeSlice";

const CreatePost = () => {
    const navigate = useNavigate();
    const axiosPrivate = useAxiosPrivate();
    const { user } = useAuth();
    const theme = useSelector(selectTheme);
    const isDark = theme === "dark";

    const [saving, setSaving] = useState(false);
    const [poll, setPoll] = useState("");
    const [options, setOptions] = useState(["", ""]);

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
            cancelBtn:
                "bg-gray-800 hover:bg-gray-700 text-gray-300 border-gray-700",
            saveBtn:
                "bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed",
            backBtn: "text-gray-400 hover:text-white",
            addBtn: "border-gray-700 hover:border-blue-500 text-gray-400 hover:text-blue-400",
            removeBtn: "text-gray-500 hover:text-red-400",
            optionIndex: "bg-gray-800 text-gray-400",
            badge: "bg-gray-800 text-gray-400",
            divider: "border-gray-800",
            previewCard: "bg-gray-800 border-gray-700",
            previewOption: "bg-gray-700/50 border-gray-600",
            tipBg: "bg-blue-500/10 border-blue-500/30 text-blue-400",
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
            cancelBtn:
                "bg-white hover:bg-gray-50 text-gray-700 border-gray-300",
            saveBtn:
                "bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed",
            backBtn: "text-gray-500 hover:text-gray-900",
            addBtn: "border-gray-300 hover:border-blue-400 text-gray-400 hover:text-blue-500",
            removeBtn: "text-gray-400 hover:text-red-500",
            optionIndex: "bg-gray-100 text-gray-500",
            badge: "bg-gray-100 text-gray-500",
            divider: "border-gray-100",
            previewCard: "bg-gray-50 border-gray-200",
            previewOption: "bg-gray-100 border-gray-200",
            tipBg: "bg-blue-50 border-blue-200 text-blue-600",
        },
    };

    const t = isDark ? themeStyles.dark : themeStyles.light;

    // --- OPTION HANDLERS ---
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
        if (options.length <= 2) {
            alert("At least 2 options are required.");
            return;
        }
        setOptions(options.filter((_, i) => i !== index));
    };

    // --- SUBMIT HANDLER ---
    const handleSubmit = async (e) => {
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

        // Check for duplicate options
        const uniqueOptions = new Set(
            filledOptions.map((opt) => opt.trim().toLowerCase()),
        );
        if (uniqueOptions.size !== filledOptions.length) {
            alert("Duplicate options are not allowed.");
            return;
        }

        setSaving(true);
        try {
            await axiosPrivate.post("/post", {
                poll: poll.trim(),
                options: filledOptions.map((text) => text.trim()),
            });
            navigate(`/c/${user?.username}`, { replace: true });
        } catch (err) {
            console.error("Error creating post:", err);
            alert(
                err.response?.data?.message ||
                    "Failed to create post. Please try again.",
            );
        } finally {
            setSaving(false);
        }
    };

    // --- RESET HANDLER ---
    const handleReset = () => {
        const confirmed = window.confirm(
            "Are you sure you want to clear everything?",
        );
        if (!confirmed) return;
        setPoll("");
        setOptions(["", ""]);
    };

    const filledCount = options.filter((opt) => opt.trim() !== "").length;
    const isValid = poll.trim() && filledCount >= 2;

    // --- RENDER ---
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
                            Create Post
                        </h1>
                        <p className={`${t.textMuted} text-sm mt-1`}>
                            Create a poll for your audience
                        </p>
                    </div>
                </div>

                {/* Tips */}
                <div
                    className={`${t.tipBg} border rounded-lg p-4 mb-6 flex items-start gap-3`}
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
                            d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"
                        />
                    </svg>
                    <div>
                        <p className="text-sm font-medium">
                            Tips for a great poll
                        </p>
                        <ul className="text-xs mt-1 opacity-80 list-disc list-inside space-y-0.5">
                            <li>Keep your question clear and concise</li>
                            <li>Add 2–10 distinct options</li>
                            <li>Avoid duplicate or overlapping choices</li>
                        </ul>
                    </div>
                </div>

                {/* Form Card */}
                <form onSubmit={handleSubmit}>
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
                                autoFocus
                                className={`w-full px-4 py-2.5 rounded-lg border outline-none transition-all focus:ring-2 resize-y min-h-[80px] ${t.input}`}
                            />
                            <div
                                className={`flex justify-between text-xs ${t.textFaded}`}
                            >
                                <span>
                                    {!poll.trim() && (
                                        <span className="text-red-400">
                                            Question is required
                                        </span>
                                    )}
                                </span>
                                <span>{poll.length}/500</span>
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
                                    {filledCount} of {options.length} filled
                                    {filledCount < 2 && (
                                        <span className="text-red-400 ml-1">
                                            (min 2)
                                        </span>
                                    )}
                                </span>
                            </div>

                            <div className="space-y-3">
                                {options.map((option, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-2 group"
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

                                        {/* Character count */}
                                        <span
                                            className={`text-xs ${t.textFaded} w-12 text-right hidden sm:block`}
                                        >
                                            {option.length}/200
                                        </span>

                                        {/* Remove Button */}
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleRemoveOption(index)
                                            }
                                            disabled={options.length <= 2}
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
                                                    d="M6 18L18 6M6 6l12 12"
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

                        {/* Live Preview */}
                        {isValid && (
                            <>
                                <div className="p-6 space-y-3">
                                    <h4
                                        className={`text-sm font-medium ${t.label} flex items-center gap-2`}
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
                                                d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                                            />
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                            />
                                        </svg>
                                        Preview
                                    </h4>

                                    <div
                                        className={`${t.previewCard} border rounded-lg p-4 space-y-3`}
                                    >
                                        {/* Preview Header */}
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={
                                                    user?.avatar ||
                                                    "/default-avatar.png"
                                                }
                                                alt="avatar"
                                                className="w-8 h-8 rounded-full object-cover"
                                            />
                                            <div>
                                                <p
                                                    className={`text-sm font-semibold ${t.text}`}
                                                >
                                                    {user?.fullName || "You"}
                                                </p>
                                                <p
                                                    className={`text-xs ${t.textFaded}`}
                                                >
                                                    Just now
                                                </p>
                                            </div>
                                        </div>

                                        {/* Preview Question */}
                                        <p
                                            className={`font-semibold ${t.text}`}
                                        >
                                            {poll}
                                        </p>

                                        {/* Preview Options */}
                                        <div className="space-y-2">
                                            {options
                                                .filter(
                                                    (opt) => opt.trim() !== "",
                                                )
                                                .map((option, index) => (
                                                    <div
                                                        key={index}
                                                        className={`${t.previewOption} border rounded-lg p-2.5 text-sm ${t.textSecondary}`}
                                                    >
                                                        {option}
                                                    </div>
                                                ))}
                                        </div>

                                        {/* Preview Footer */}
                                        <p className={`text-xs ${t.textFaded}`}>
                                            0 votes • Poll
                                        </p>
                                    </div>
                                </div>

                                {/* Divider */}
                                <div className={`border-t ${t.divider}`} />
                            </>
                        )}

                        {/* Action Buttons */}
                        <div className="p-6 flex flex-col sm:flex-row justify-between gap-4">
                            {/* Reset Button */}
                            <button
                                type="button"
                                onClick={handleReset}
                                disabled={
                                    !poll.trim() &&
                                    options.every((opt) => !opt.trim())
                                }
                                className={`px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors flex items-center justify-center gap-2 ${t.cancelBtn} disabled:opacity-30 disabled:cursor-not-allowed`}
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
                                        d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182"
                                    />
                                </svg>
                                Reset
                            </button>

                            {/* Cancel & Create */}
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
                                    disabled={saving || !isValid}
                                    className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${t.saveBtn}`}
                                >
                                    {saving ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Creating...
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
                                                    d="M12 4.5v15m7.5-7.5h-15"
                                                />
                                            </svg>
                                            Create Post
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

export default CreatePost;
