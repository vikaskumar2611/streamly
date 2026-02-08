import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import useAxiosPrivate from "../../hooks/useAxiosPrivate.hooks.js";
import { selectTheme } from "../../features/theme/themeSlice";

const UploadVideo = () => {
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const theme = useSelector(selectTheme);
    const isDark = theme === "dark";

    const themeStyles = {
        dark: {
            background: "bg-gray-900",
            card: "bg-gray-900 border-gray-800",
            cardShadow: "shadow-lg shadow-black/20",
            header: "border-gray-800",
            title: "text-white",
            text: "text-white",
            textMuted: "text-gray-400",
            textFaded: "text-gray-500",
            border: "border-gray-800",
            label: "text-gray-300",
            input: "border-gray-700 bg-gray-800 text-white placeholder-gray-500",
            inputFocus: "focus:ring-purple-500 focus:border-purple-500",
            dropzone: "border-gray-700 hover:bg-gray-800",
            dropzoneActive: "border-purple-500 bg-purple-900/20",
            dropzoneIcon: "text-gray-500 hover:text-purple-400",
            dropzoneText: "text-gray-400",
            thumbnailDropzone: "border-gray-700 hover:bg-gray-800",
            progressBg: "bg-gray-700",
            progressBar: "bg-purple-600",
            progressText: "text-gray-300",
            alertError: "bg-red-900/50 text-red-300 border border-red-800",
            alertSuccess:
                "bg-green-900/50 text-green-300 border border-green-800",
            removeBtn: "bg-red-600 hover:bg-red-700",
            cancelHover: "hover:bg-gray-800",
        },
        light: {
            background: "bg-gray-50",
            card: "bg-white border-gray-200",
            cardShadow: "shadow-lg shadow-gray-200/50",
            header: "border-gray-200",
            title: "text-gray-900",
            text: "text-gray-900",
            textMuted: "text-gray-600",
            textFaded: "text-gray-500",
            border: "border-gray-200",
            label: "text-gray-700",
            input: "border-gray-300 bg-white text-gray-900 placeholder-gray-400",
            inputFocus: "focus:ring-purple-500 focus:border-purple-500",
            dropzone: "border-gray-300 hover:bg-gray-50",
            dropzoneActive: "border-purple-500 bg-purple-50",
            dropzoneIcon: "text-gray-400 hover:text-purple-600",
            dropzoneText: "text-gray-500",
            thumbnailDropzone: "border-gray-300 hover:bg-gray-50",
            progressBg: "bg-gray-200",
            progressBar: "bg-purple-600",
            progressText: "text-gray-700",
            alertError: "bg-red-100 text-red-700 border border-red-200",
            alertSuccess: "bg-green-100 text-green-700 border border-green-200",
            removeBtn: "bg-red-600 hover:bg-red-700",
            cancelHover: "hover:bg-gray-100",
        },
    };

    const t = isDark ? themeStyles.dark : themeStyles.light;

    // --- State ---
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const [videoFile, setVideoFile] = useState(null);
    const [videoPreview, setVideoPreview] = useState(null);

    const [thumbnail, setThumbnail] = useState(null);
    const [thumbnailPreview, setThumbnailPreview] = useState(null);

    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [message, setMessage] = useState(null);

    const [videoDragActive, setVideoDragActive] = useState(false);
    const [thumbDragActive, setThumbDragActive] = useState(false);

    const videoInputRef = useRef(null);
    const thumbInputRef = useRef(null);

    // --- Handlers ---
    const handleVideoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setVideoFile(file);
            setVideoPreview(URL.createObjectURL(file));
        }
    };

    const handleThumbnailChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setThumbnail(file);
            setThumbnailPreview(URL.createObjectURL(file));
        }
    };

    const handleVideoDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setVideoDragActive(true);
        } else if (e.type === "dragleave") {
            setVideoDragActive(false);
        }
    };

    const handleVideoDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setVideoDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            if (file.type.startsWith("video/")) {
                setVideoFile(file);
                setVideoPreview(URL.createObjectURL(file));
            }
        }
    };

    const handleThumbDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setThumbDragActive(true);
        } else if (e.type === "dragleave") {
            setThumbDragActive(false);
        }
    };

    const handleThumbDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setThumbDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            if (file.type.startsWith("image/")) {
                setThumbnail(file);
                setThumbnailPreview(URL.createObjectURL(file));
            }
        }
    };

    const handlePublish = async (e) => {
        e.preventDefault();

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
        formData.append("videoFile", videoFile);
        formData.append("thumbnail", thumbnail);

        try {
            const response = await axiosPrivate.post("/video", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total,
                    );
                    setUploadProgress(percentCompleted);
                },
            });

            setMessage({
                type: "success",
                text: "Video uploaded successfully! Redirecting...",
            });

            setTimeout(() => {
                navigate(`/watch/${response.data.data._id}`);
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

    const removeVideo = () => {
        setVideoFile(null);
        setVideoPreview(null);
        if (videoInputRef.current) videoInputRef.current.value = "";
    };

    const removeThumbnail = () => {
        setThumbnail(null);
        setThumbnailPreview(null);
        if (thumbInputRef.current) thumbInputRef.current.value = "";
    };

    return (
        <div
            className={`min-h-screen ${t.background} px-2 py-4 sm:px-4 sm:py-6 md:px-6 md:py-8 lg:px-8 flex justify-center transition-colors duration-300`}
        >
            <div
                className={`w-full max-w-3xl rounded-none sm:rounded-xl border overflow-hidden transition-colors duration-300 ${t.card} ${t.cardShadow}`}
            >
                {/* Header */}
                <div
                    className={`p-4 sm:p-6 border-b ${t.header} flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 transition-colors duration-300`}
                >
                    <div className="flex items-center gap-3">
                        <div className="p-1.5 sm:p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex-shrink-0">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 dark:text-purple-400"
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
                        </div>
                        <div>
                            <h1
                                className={`text-lg sm:text-xl md:text-2xl font-bold ${t.title} transition-colors duration-300`}
                            >
                                Upload Video
                            </h1>
                            <p
                                className={`text-xs sm:text-sm ${t.textMuted} transition-colors duration-300`}
                            >
                                Share your content with the world
                            </p>
                        </div>
                    </div>
                </div>

                {/* Alert Messages */}
                {message && (
                    <div
                        className={`mx-3 sm:mx-6 mt-4 sm:mt-6 p-3 sm:p-4 rounded-lg flex items-start sm:items-center gap-2 sm:gap-3 text-sm transition-all duration-300 ${
                            message.type === "error"
                                ? t.alertError
                                : t.alertSuccess
                        }`}
                    >
                        {message.type === "error" ? (
                            <svg
                                className="w-5 h-5 flex-shrink-0 mt-0.5 sm:mt-0"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        ) : (
                            <svg
                                className="w-5 h-5 flex-shrink-0 mt-0.5 sm:mt-0"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        )}
                        <span className="font-medium text-xs sm:text-sm">
                            {message.text}
                        </span>
                    </div>
                )}

                {/* Upload Form */}
                <form
                    onSubmit={handlePublish}
                    className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6"
                >
                    {/* 1. Video Upload Area */}
                    <div className="space-y-1.5 sm:space-y-2">
                        <label
                            className={`block text-xs sm:text-sm font-medium ${t.label} transition-colors duration-300`}
                        >
                            Video File <span className="text-red-500">*</span>
                        </label>

                        <div
                            onDragEnter={handleVideoDrag}
                            onDragLeave={handleVideoDrag}
                            onDragOver={handleVideoDrag}
                            onDrop={handleVideoDrop}
                            className={`
                                border-2 border-dashed rounded-lg sm:rounded-xl flex flex-col items-center justify-center transition-all duration-300
                                ${
                                    videoPreview
                                        ? t.dropzoneActive
                                        : videoDragActive
                                          ? t.dropzoneActive
                                          : t.dropzone
                                }
                            `}
                        >
                            {videoPreview ? (
                                <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black">
                                    <video
                                        src={videoPreview}
                                        controls
                                        className="w-full h-full object-contain"
                                    />
                                    <button
                                        type="button"
                                        onClick={removeVideo}
                                        className={`absolute top-1.5 right-1.5 sm:top-2 sm:right-2 p-1 sm:p-1.5 text-white rounded-full transition-colors duration-200 ${t.removeBtn}`}
                                        title="Remove Video"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="w-4 h-4 sm:w-5 sm:h-5"
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
                                            />
                                            <line
                                                x1="6"
                                                y1="6"
                                                x2="18"
                                                y2="18"
                                            />
                                        </svg>
                                    </button>
                                    {/* Video Info Badge */}
                                    <div className="absolute bottom-1.5 left-1.5 sm:bottom-2 sm:left-2 bg-black/70 text-white text-[10px] sm:text-xs px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-md max-w-[70%] truncate">
                                        {videoFile?.name}
                                    </div>
                                </div>
                            ) : (
                                <div
                                    onClick={() =>
                                        videoInputRef.current.click()
                                    }
                                    className={`w-full h-36 sm:h-44 md:h-48 flex flex-col items-center justify-center cursor-pointer transition-colors duration-200 ${t.dropzoneIcon}`}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 mb-2 sm:mb-3"
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
                                    <span className="font-medium text-sm sm:text-base text-center px-4">
                                        {videoDragActive
                                            ? "Drop your video here"
                                            : "Click to select or drag & drop"}
                                    </span>
                                    <span
                                        className={`text-[10px] sm:text-xs mt-1 ${t.textFaded}`}
                                    >
                                        MP4, WebM, MKV (Max 100MB)
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
                    <div className="space-y-1.5 sm:space-y-2">
                        <label
                            className={`block text-xs sm:text-sm font-medium ${t.label} transition-colors duration-300`}
                        >
                            Thumbnail <span className="text-red-500">*</span>
                        </label>
                        <div
                            className="flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-4"
                            onDragEnter={handleThumbDrag}
                            onDragLeave={handleThumbDrag}
                            onDragOver={handleThumbDrag}
                            onDrop={handleThumbDrop}
                        >
                            <div
                                onClick={() => thumbInputRef.current.click()}
                                className={`
                                    relative w-full sm:w-40 h-32 sm:h-24 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-all duration-300 flex-shrink-0
                                    ${
                                        thumbnailPreview
                                            ? t.dropzoneActive
                                            : thumbDragActive
                                              ? t.dropzoneActive
                                              : t.thumbnailDropzone
                                    }
                                `}
                            >
                                {thumbnailPreview ? (
                                    <>
                                        <img
                                            src={thumbnailPreview}
                                            alt="Thumbnail preview"
                                            className="w-full h-full object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeThumbnail();
                                            }}
                                            className={`absolute top-1 right-1 p-1 text-white rounded-full transition-colors duration-200 ${t.removeBtn}`}
                                            title="Remove Thumbnail"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="w-3 h-3"
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
                                                />
                                                <line
                                                    x1="6"
                                                    y1="6"
                                                    x2="18"
                                                    y2="18"
                                                />
                                            </svg>
                                        </button>
                                    </>
                                ) : (
                                    <div className="text-center p-2">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className={`w-6 h-6 mx-auto mb-1 ${t.textFaded}`}
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
                                        <span
                                            className={`text-xs ${t.textFaded}`}
                                        >
                                            {thumbDragActive
                                                ? "Drop image here"
                                                : "Select Image"}
                                        </span>
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 text-center sm:text-left">
                                <p
                                    className={`text-xs sm:text-sm ${t.textMuted} sm:mt-2 transition-colors duration-300`}
                                >
                                    Upload a compelling thumbnail to attract
                                    viewers.
                                </p>
                                <p
                                    className={`text-[10px] sm:text-xs ${t.textFaded} mt-1`}
                                >
                                    Recommended: 1280×720 (16:9 ratio)
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
                    <div className="space-y-3 sm:space-y-4">
                        <div>
                            <label
                                className={`block text-xs sm:text-sm font-medium ${t.label} mb-1 sm:mb-1.5 transition-colors duration-300`}
                            >
                                Title <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Enter an attention-grabbing title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                maxLength={100}
                                className={`w-full px-3 py-2 sm:px-4 sm:py-2.5 text-sm sm:text-base rounded-lg border outline-none transition-all duration-200 focus:ring-2 ${t.input} ${t.inputFocus}`}
                            />
                            <p
                                className={`text-[10px] sm:text-xs mt-1 text-right ${t.textFaded}`}
                            >
                                {title.length}/100
                            </p>
                        </div>
                        <div>
                            <label
                                className={`block text-xs sm:text-sm font-medium ${t.label} mb-1 sm:mb-1.5 transition-colors duration-300`}
                            >
                                Description{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                rows="4"
                                placeholder="Tell viewers about your video..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                maxLength={5000}
                                className={`w-full px-3 py-2 sm:px-4 sm:py-2.5 text-sm sm:text-base rounded-lg border outline-none transition-all duration-200 focus:ring-2 resize-none sm:rows-5 ${t.input} ${t.inputFocus}`}
                            />
                            <p
                                className={`text-[10px] sm:text-xs mt-1 text-right ${t.textFaded}`}
                            >
                                {description.length}/5000
                            </p>
                        </div>
                    </div>

                    {/* 4. Action Buttons & Progress */}
                    <div
                        className={`pt-3 sm:pt-4 border-t ${t.border} transition-colors duration-300`}
                    >
                        {uploading ? (
                            <div className="space-y-2 sm:space-y-3">
                                <div
                                    className={`flex justify-between text-xs sm:text-sm font-medium ${t.progressText}`}
                                >
                                    <span className="flex items-center gap-1.5 sm:gap-2">
                                        <svg
                                            className="animate-spin h-3.5 w-3.5 sm:h-4 sm:w-4"
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
                                        Uploading...
                                    </span>
                                    <span>{uploadProgress}%</span>
                                </div>
                                <div
                                    className={`w-full rounded-full h-2 sm:h-3 overflow-hidden ${t.progressBg}`}
                                >
                                    <div
                                        className={`h-full rounded-full transition-all duration-300 ease-out ${t.progressBar}`}
                                        style={{
                                            width: `${uploadProgress}%`,
                                        }}
                                    />
                                </div>
                                <p
                                    className={`text-[10px] sm:text-xs text-center ${t.textFaded}`}
                                >
                                    Please do not close this window while
                                    uploading.
                                </p>
                            </div>
                        ) : (
                            <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3">
                                <button
                                    type="button"
                                    onClick={() => navigate(-1)}
                                    className={`w-full sm:flex-1 py-2.5 sm:py-3 border rounded-lg font-medium text-sm sm:text-base transition-all duration-200 ${t.cancelHover} ${t.border} ${t.textMuted}`}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={
                                        uploading ||
                                        !videoFile ||
                                        !thumbnail ||
                                        !title.trim() ||
                                        !description.trim()
                                    }
                                    className="w-full sm:flex-[2] py-2.5 sm:py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm sm:text-base rounded-lg shadow-md transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="w-4 h-4 sm:w-5 sm:h-5"
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
                                    Publish Video
                                </button>
                            </div>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UploadVideo;
