import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate.hooks.js"; // Adjust path
// import { useAuth } from "../../hooks/useAuth.hooks.js";

const UploadVideo = () => {
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();

    // --- State ---
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    // File states
    const [videoFile, setVideoFile] = useState(null);
    const [videoPreview, setVideoPreview] = useState(null);

    const [thumbnail, setThumbnail] = useState(null);
    const [thumbnailPreview, setThumbnailPreview] = useState(null);

    // UX states
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [message, setMessage] = useState(null); // { type: 'error'|'success', text: '' }

    // Refs for file inputs to trigger clicks programmatically
    const videoInputRef = useRef(null);
    const thumbInputRef = useRef(null);

    // --- Handlers ---

    // Handle Video Selection
    const handleVideoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Limit video size if needed (e.g., 50MB)
            // if (file.size > 50 * 1024 * 1024) return alert("File too big");

            setVideoFile(file);
            setVideoPreview(URL.createObjectURL(file)); // Create local preview URL
        }
    };

    // Handle Thumbnail Selection
    const handleThumbnailChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setThumbnail(file);
            setThumbnailPreview(URL.createObjectURL(file));
        }
    };

    // Handle Submit
    const handlePublish = async (e) => {
        e.preventDefault();

        // Basic Validation
        if (!title.trim() || !description.trim()) {
            setMessage({
                type: "error",
                text: "Title and Description are required.",
            });
            return;
        }
        if (!videoFile) {
            setMessage({ type: "error", text: "Please upload a video file." });
            return;
        }
        if (!thumbnail) {
            setMessage({ type: "error", text: "Please upload a thumbnail." });
            return;
        }

        setUploading(true);
        setMessage(null);

        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("videoFile", videoFile); // Must match backend 'videoFile'
        formData.append("thumbnail", thumbnail); // Must match backend 'thumbnail'

        try {
            const response = await axiosPrivate.post("/video", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                // Calculate Upload Progress
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total,
                    );
                    setUploadProgress(percentCompleted);
                },
            });

            setMessage({
                type: "success",
                text: "Video uploaded successfully!",
            });

            // Redirect after brief delay
            setTimeout(() => {
                navigate(`/watch/${response.data.data._id}`); // Redirect to new video
            }, 2000);
        } catch (error) {
            console.error("Upload failed", error);
            setMessage({
                type: "error",
                text: error.response?.data?.message || "Error uploading video",
            });
            setUploading(false);
            setUploadProgress(0);
        }
    };

    // Helper to reset video selection
    const removeVideo = () => {
        setVideoFile(null);
        setVideoPreview(null);
        if (videoInputRef.current) videoInputRef.current.value = "";
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black p-4 md:p-8 flex justify-center">
            <div className="w-full max-w-3xl bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Upload Video
                    </h1>
                </div>

                {/* Alert Messages */}
                {message && (
                    <div
                        className={`mx-6 mt-6 p-4 rounded-lg ${
                            message.type === "error"
                                ? "bg-red-100 text-red-700"
                                : "bg-green-100 text-green-700"
                        }`}
                    >
                        {message.text}
                    </div>
                )}

                {/* Upload Form */}
                <form onSubmit={handlePublish} className="p-6 space-y-6">
                    {/* 1. Video Upload Area */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Video File
                        </label>

                        <div
                            className={`border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-colors 
                            ${videoPreview ? "border-purple-500 bg-purple-50 dark:bg-gray-800" : "border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"}`}
                        >
                            {videoPreview ? (
                                <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black">
                                    <video
                                        src={videoPreview}
                                        controls
                                        className="w-full h-full"
                                    />
                                    <button
                                        type="button"
                                        onClick={removeVideo}
                                        className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700"
                                        title="Remove Video"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="w-5 h-5"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <line
                                                x1="18"
                                                y1="6"
                                                x2="6"
                                                y2="18"
                                            ></line>
                                            <line
                                                x1="6"
                                                y1="6"
                                                x2="18"
                                                y2="18"
                                            ></line>
                                        </svg>
                                    </button>
                                </div>
                            ) : (
                                <div
                                    onClick={() =>
                                        videoInputRef.current.click()
                                    }
                                    className="w-full h-48 flex flex-col items-center justify-center cursor-pointer text-gray-500 hover:text-purple-600"
                                >
                                    {/* Upload Cloud Icon */}
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="w-12 h-12 mb-3"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                        <polyline points="17 8 12 3 7 8" />
                                        <line x1="12" y1="3" x2="12" y2="15" />
                                    </svg>
                                    <span className="font-medium">
                                        Click to select video
                                    </span>
                                    <span className="text-xs mt-1 text-gray-400">
                                        MP4, WebM, MKV
                                    </span>
                                </div>
                            )}
                            <input
                                ref={videoInputRef}
                                type="file"
                                accept="video/*"
                                onChange={handleVideoChange}
                                className="hidden"
                            />
                        </div>
                    </div>

                    {/* 2. Thumbnail Upload Area */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Thumbnail
                        </label>
                        <div className="flex items-start gap-4">
                            <div
                                onClick={() => thumbInputRef.current.click()}
                                className={`w-40 h-24 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer overflow-hidden
                                    ${thumbnailPreview ? "border-purple-500" : "border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"}`}
                            >
                                {thumbnailPreview ? (
                                    <img
                                        src={thumbnailPreview}
                                        alt="Thumbnail preview"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="text-center p-2">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="w-6 h-6 mx-auto text-gray-400 mb-1"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <rect
                                                x="3"
                                                y="3"
                                                width="18"
                                                height="18"
                                                rx="2"
                                                ry="2"
                                            />
                                            <circle cx="8.5" cy="8.5" r="1.5" />
                                            <polyline points="21 15 16 10 5 21" />
                                        </svg>
                                        <span className="text-xs text-gray-500">
                                            Select Image
                                        </span>
                                    </div>
                                )}
                            </div>
                            <div className="flex-1">
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                    Upload a compelling thumbnail to attract
                                    viewers. Recommended size: 1280x720.
                                </p>
                            </div>
                            <input
                                ref={thumbInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleThumbnailChange}
                                className="hidden"
                            />
                        </div>
                    </div>

                    {/* 3. Text Inputs */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Title
                            </label>
                            <input
                                type="text"
                                placeholder="Video title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Description
                            </label>
                            <textarea
                                rows="5"
                                placeholder="Tell viewers about your video..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none resize-none"
                            />
                        </div>
                    </div>

                    {/* 4. Action Buttons & Progress */}
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                        {uploading ? (
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm font-medium text-gray-700 dark:text-gray-300">
                                    <span>Uploading...</span>
                                    <span>{uploadProgress}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                                    <div
                                        className="bg-purple-600 h-2.5 rounded-full transition-all duration-300"
                                        style={{ width: `${uploadProgress}%` }}
                                    ></div>
                                </div>
                                <p className="text-xs text-center text-gray-500">
                                    Please do not close this window.
                                </p>
                            </div>
                        ) : (
                            <button
                                type="submit"
                                disabled={uploading}
                                className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg shadow-md transition-all disabled:opacity-50"
                            >
                                Publish Video
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UploadVideo;
