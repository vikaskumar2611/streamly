// pages/core/Watch.jsx
import { useParams, Link } from "react-router-dom";
import { useEffect, useState, useRef, useCallback } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate.hooks";
import useAuth from "../../hooks/useAuth.hooks";
import PlaylistModal from "../../components/PlaylistModal.jsx";

// ==================== ICONS ====================
const Icons = {
    Like: ({ filled }) => (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill={filled ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth={1.5}
            className="w-6 h-6"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z"
            />
        </svg>
    ),
    LikeSmall: ({ filled }) => (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill={filled ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth={1.5}
            className="w-4 h-4"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z"
            />
        </svg>
    ),
    Share: () => (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z"
            />
        </svg>
    ),
    Save: () => (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
            />
        </svg>
    ),
    MoreVert: () => (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"
            />
        </svg>
    ),
    Sort: () => (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5"
            />
        </svg>
    ),
    Close: () => (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
            />
        </svg>
    ),
    Plus: () => (
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
    ),
    Edit: () => (
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
                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
            />
        </svg>
    ),
    Delete: () => (
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
                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
            />
        </svg>
    ),
    ChevronDown: () => (
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
                d="m19.5 8.25-7.5 7.5-7.5-7.5"
            />
        </svg>
    ),
    ChevronUp: () => (
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
                d="m4.5 15.75 7.5-7.5 7.5 7.5"
            />
        </svg>
    ),
    Bell: ({ filled }) => (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill={filled ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth={1.5}
            className="w-5 h-5"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
            />
        </svg>
    ),
};

// ==================== VIDEO PLAYER ====================
const VideoPlayer = ({ video }) => {
    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showControls, setShowControls] = useState(true);
    const [buffered, setBuffered] = useState(0);
    const containerRef = useRef(null);
    const hideControlsTimeout = useRef(null);

    const formatTime = (time) => {
        const hours = Math.floor(time / 3600);
        const minutes = Math.floor((time % 3600) / 60);
        const seconds = Math.floor(time % 60);

        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
        }
        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    };

    const handlePlayPause = () => {
        if (videoRef.current.paused) {
            videoRef.current.play();
        } else {
            videoRef.current.pause();
        }
    };

    const handleTimeUpdate = () => {
        setCurrentTime(videoRef.current.currentTime);
        if (videoRef.current.buffered.length > 0) {
            setBuffered(
                videoRef.current.buffered.end(
                    videoRef.current.buffered.length - 1,
                ),
            );
        }
    };

    const handleSeek = (e) => {
        const rect = e.target.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        videoRef.current.currentTime = percent * duration;
    };

    const handleVolumeChange = (e) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        videoRef.current.volume = newVolume;
        setIsMuted(newVolume === 0);
    };

    const toggleMute = () => {
        if (isMuted) {
            videoRef.current.muted = false;
            setIsMuted(false);
            if (volume === 0) {
                setVolume(1);
                videoRef.current.volume = 1;
            }
        } else {
            videoRef.current.muted = true;
            setIsMuted(true);
        }
    };

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            containerRef.current.requestFullscreen();
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    const handleMouseMove = () => {
        setShowControls(true);
        if (hideControlsTimeout.current) {
            clearTimeout(hideControlsTimeout.current);
        }
        hideControlsTimeout.current = setTimeout(() => {
            if (isPlaying) setShowControls(false);
        }, 3000);
    };

    const handleKeyDown = useCallback(
        (e) => {
            if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA")
                return;

            switch (e.key) {
                case " ":
                case "k":
                    e.preventDefault();
                    handlePlayPause();
                    break;
                case "ArrowLeft":
                    e.preventDefault();
                    videoRef.current.currentTime -= 5;
                    break;
                case "ArrowRight":
                    e.preventDefault();
                    videoRef.current.currentTime += 5;
                    break;
                case "ArrowUp":
                    e.preventDefault();
                    setVolume((prev) => Math.min(1, prev + 0.1));
                    videoRef.current.volume = Math.min(1, volume + 0.1);
                    break;
                case "ArrowDown":
                    e.preventDefault();
                    setVolume((prev) => Math.max(0, prev - 0.1));
                    videoRef.current.volume = Math.max(0, volume - 0.1);
                    break;
                case "m":
                    toggleMute();
                    break;
                case "f":
                    toggleFullscreen();
                    break;
            }
        },
        [isPlaying, volume],
    );

    useEffect(() => {
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [handleKeyDown]);

    return (
        <div
            ref={containerRef}
            className="relative bg-black rounded-xl overflow-hidden group aspect-video"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => isPlaying && setShowControls(false)}
        >
            <video
                ref={videoRef}
                src={video.videoFile}
                poster={video.thumbnail}
                className="w-full h-full object-contain"
                onClick={handlePlayPause}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={() => setDuration(videoRef.current.duration)}
                autoPlay
                muted={isMuted}
            />

            {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <button
                        onClick={handlePlayPause}
                        className="w-20 h-20 bg-black/60 rounded-full flex items-center justify-center hover:bg-black/80 transition-colors"
                    >
                        <svg
                            className="w-12 h-12 text-white ml-1"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path d="M8 5v14l11-7z" />
                        </svg>
                    </button>
                </div>
            )}

            <div
                className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent pt-16 pb-3 px-4 transition-opacity duration-300 ${showControls || !isPlaying ? "opacity-100" : "opacity-0"}`}
            >
                <div
                    className="relative h-1 bg-white/30 rounded-full cursor-pointer group/progress mb-3"
                    onClick={handleSeek}
                >
                    <div
                        className="absolute h-full bg-white/50 rounded-full"
                        style={{ width: `${(buffered / duration) * 100}%` }}
                    />
                    <div
                        className="absolute h-full bg-red-600 rounded-full"
                        style={{ width: `${(currentTime / duration) * 100}%` }}
                    />
                    <div
                        className="absolute w-3 h-3 bg-red-600 rounded-full -top-1 transform -translate-x-1/2 opacity-0 group-hover/progress:opacity-100 transition-opacity"
                        style={{ left: `${(currentTime / duration) * 100}%` }}
                    />
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handlePlayPause}
                            className="text-white hover:text-white/80"
                        >
                            {isPlaying ? (
                                <svg
                                    className="w-7 h-7"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                                </svg>
                            ) : (
                                <svg
                                    className="w-7 h-7"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                            )}
                        </button>

                        <div className="flex items-center gap-2 group/volume">
                            <button
                                onClick={toggleMute}
                                className="text-white hover:text-white/80"
                            >
                                {isMuted || volume === 0 ? (
                                    <svg
                                        className="w-6 h-6"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                                    </svg>
                                ) : volume < 0.5 ? (
                                    <svg
                                        className="w-6 h-6"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z" />
                                    </svg>
                                ) : (
                                    <svg
                                        className="w-6 h-6"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                                    </svg>
                                )}
                            </button>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.01"
                                value={isMuted ? 0 : volume}
                                onChange={handleVolumeChange}
                                className="w-0 group-hover/volume:w-20 transition-all duration-200 accent-white"
                            />
                        </div>

                        <span className="text-white text-sm">
                            {formatTime(currentTime)} / {formatTime(duration)}
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <button className="text-white hover:text-white/80 p-1">
                            <svg
                                className="w-6 h-6"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path d="M19.14 12.94c.04-.31.06-.63.06-.94 0-.31-.02-.63-.06-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
                            </svg>
                        </button>

                        <button
                            onClick={toggleFullscreen}
                            className="text-white hover:text-white/80 p-1"
                        >
                            {isFullscreen ? (
                                <svg
                                    className="w-6 h-6"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" />
                                </svg>
                            ) : (
                                <svg
                                    className="w-6 h-6"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ==================== VIDEO ACTIONS ====================
const VideoActions = ({ video, videoId }) => {
    const axiosPrivate = useAxiosPrivate();
    const { user } = useAuth();
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [showPlaylistModal, setShowPlaylistModal] = useState(false);
    const [copied, setCopied] = useState(false);
    const [likeLoading, setLikeLoading] = useState(false);

    useEffect(() => {
        const fetchLikeStatus = async () => {
            try {
                const response = await axiosPrivate.get(
                    `/like/fetch/v/${videoId}`,
                );
                setIsLiked(response.data.data.isLiked);
                setLikeCount(response.data.data.likeCount);
            } catch (error) {
                console.error("Error fetching like status:", error);
                setLikeCount(video.likes || 0);
            }
        };
        fetchLikeStatus();
    }, [videoId, axiosPrivate, video.likes]);

    const handleLike = async () => {
        if (likeLoading) return;
        setLikeLoading(true);
        try {
            const response = await axiosPrivate.post(
                `/like/toggle/v/${videoId}`,
            );
            setIsLiked(response.data.data.isLiked);
            setLikeCount(response.data.data.likeCount);
        } catch (error) {
            console.error("Error toggling like:", error);
        } finally {
            setLikeLoading(false);
        }
    };

    const handleShare = async () => {
        const url = window.location.href;
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            const input = document.createElement("input");
            input.value = url;
            document.body.appendChild(input);
            input.select();
            document.execCommand("copy");
            document.body.removeChild(input);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <>
            <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center bg-zinc-800 rounded-full">
                    <button
                        onClick={handleLike}
                        disabled={likeLoading}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full hover:bg-zinc-700 transition-colors ${isLiked ? "text-blue-400" : "text-white"} disabled:opacity-50`}
                    >
                        <Icons.Like filled={isLiked} />
                        <span className="text-sm font-medium">
                            {likeCount.toLocaleString()}
                        </span>
                    </button>
                </div>

                <button
                    onClick={handleShare}
                    className="flex items-center gap-2 px-4 py-2 bg-zinc-800 rounded-full hover:bg-zinc-700 transition-colors text-white"
                >
                    <Icons.Share />
                    <span className="text-sm font-medium">
                        {copied ? "Copied!" : "Share"}
                    </span>
                </button>

                <button
                    onClick={() => setShowPlaylistModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-zinc-800 rounded-full hover:bg-zinc-700 transition-colors text-white"
                >
                    <Icons.Save />
                    <span className="text-sm font-medium">Save</span>
                </button>
            </div>

            {showPlaylistModal && (
                <PlaylistModal
                    videoId={videoId}
                    userId={user?._id}
                    onClose={() => setShowPlaylistModal(false)}
                />
            )}
        </>
    );
};

// ==================== CHANNEL INFO ====================
const ChannelInfo = ({ owner, currentUserId }) => {
    const axiosPrivate = useAxiosPrivate();
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [subscriberCount, setSubscriberCount] = useState(
        owner.subscribersCount || 0,
    );
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);

    const isOwnChannel = currentUserId === owner._id;

    // Fetch initial subscription status
    useEffect(() => {
        const fetchSubscriptionStatus = async () => {
            if (isOwnChannel) {
                setInitialLoading(false);
                return;
            }
            try {
                // If your backend has an endpoint to check subscription status
                const response = await axiosPrivate.get(
                    `/users/c/${owner.username}`,
                );
                if (response.data.data) {
                    setIsSubscribed(response.data.data.isSubscribed || false);
                    setSubscriberCount(
                        response.data.data.subscribersCount || 0,
                    );
                }
            } catch (error) {
                console.error("Error fetching subscription status:", error);
            } finally {
                setInitialLoading(false);
            }
        };
        fetchSubscriptionStatus();
    }, [owner._id, owner.username, axiosPrivate, isOwnChannel]);

    const handleSubscribe = async () => {
        if (loading || isOwnChannel) return;
        setLoading(true);

        // Optimistic update
        const wasSubscribed = isSubscribed;
        setIsSubscribed(!wasSubscribed);
        setSubscriberCount((prev) => (wasSubscribed ? prev - 1 : prev + 1));

        try {
            const response = await axiosPrivate.post(
                `/users/toggle/subscribe/${owner._id}`,
            );
            // Sync with server response
            setIsSubscribed(response.data.data);
        } catch (error) {
            console.error("Error toggling subscription:", error);
            // Revert on error
            setIsSubscribed(wasSubscribed);
            setSubscriberCount((prev) => (wasSubscribed ? prev + 1 : prev - 1));
        } finally {
            setLoading(false);
        }
    };

    const formatSubscriberCount = (count) => {
        if (count >= 1000000) {
            return `${(count / 1000000).toFixed(1)}M`;
        }
        if (count >= 1000) {
            return `${(count / 1000).toFixed(1)}K`;
        }
        return count.toString();
    };

    return (
        <div className="flex items-center justify-between gap-4 mt-4">
            <Link
                to={`/c/${owner.username}`}
                className="flex items-center gap-3 group"
            >
                <img
                    src={owner.avatar || "/default-avatar.png"}
                    alt={owner.fullName}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-transparent group-hover:ring-zinc-500 transition-all"
                />
                <div>
                    <h3 className="font-semibold text-white group-hover:text-zinc-300 transition-colors">
                        {owner.fullName}
                    </h3>
                    <p className="text-sm text-zinc-400">
                        {formatSubscriberCount(subscriberCount)} subscribers
                    </p>
                </div>
            </Link>

            {!isOwnChannel && (
                <button
                    onClick={handleSubscribe}
                    disabled={loading || initialLoading}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm transition-all disabled:opacity-50 ${
                        isSubscribed
                            ? "bg-zinc-700 text-zinc-300 hover:bg-zinc-600"
                            : "bg-white text-black hover:bg-zinc-200"
                    }`}
                >
                    {isSubscribed && <Icons.Bell filled />}
                    {initialLoading ? (
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : isSubscribed ? (
                        "Subscribed"
                    ) : (
                        "Subscribe"
                    )}
                </button>
            )}
        </div>
    );
};

// ==================== VIDEO DESCRIPTION ====================
const VideoDescription = ({ video }) => {
    const [expanded, setExpanded] = useState(false);

    const formatDate = (date) => {
        const now = new Date();
        const videoDate = new Date(date);
        const diff = now - videoDate;

        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        const months = Math.floor(days / 30);
        const years = Math.floor(days / 365);

        if (years > 0) return `${years} year${years > 1 ? "s" : ""} ago`;
        if (months > 0) return `${months} month${months > 1 ? "s" : ""} ago`;
        if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
        if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
        if (minutes > 0)
            return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
        return "Just now";
    };

    return (
        <div
            className={`mt-4 bg-zinc-800 rounded-xl p-3 cursor-pointer hover:bg-zinc-700/80 transition-colors ${expanded ? "cursor-default hover:bg-zinc-800" : ""}`}
            onClick={() => !expanded && setExpanded(true)}
        >
            <div className="flex items-center gap-2 text-sm font-medium text-white mb-2">
                <span>{video.views?.toLocaleString()} views</span>
                <span>•</span>
                <span>{formatDate(video.createdAt)}</span>
            </div>

            <div
                className={`relative ${expanded ? "" : "max-h-12 overflow-hidden"}`}
            >
                <p className="text-sm text-zinc-300 whitespace-pre-line">
                    {video.description}
                </p>

                {!expanded && (
                    <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-zinc-800 to-transparent" />
                )}
            </div>

            {expanded ? (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setExpanded(false);
                    }}
                    className="mt-2 text-sm font-medium text-white hover:text-zinc-300"
                >
                    Show less
                </button>
            ) : (
                <button className="text-sm font-medium text-white mt-1">
                    ...more
                </button>
            )}
        </div>
    );
};

// ==================== COMMENT ITEM ====================
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
    const maxDepth = 2; // Limit nesting depth

    // Fetch like status on mount
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

    // Close menu when clicking outside
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

            // Add the reply to the local state
            if (onAddReply) {
                onAddReply(comment._id, response.data.data);
            }

            setReplyContent("");
            setIsReplying(false);
            setShowReplies(true); // Show replies after adding one
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
                    className={`rounded-full object-cover flex-shrink-0 ${depth > 0 ? "w-8 h-8" : "w-10 h-10"}`}
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
                        className={`flex items-center gap-1 text-xs ${isLiked ? "text-blue-400" : "text-zinc-400 hover:text-zinc-200"} disabled:opacity-50`}
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

            {/* Menu */}
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

// ==================== COMMENT SECTION ====================
const CommentSection = ({ videoId }) => {
    const axiosPrivate = useAxiosPrivate();
    const { auth } = useAuth();
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newComment, setNewComment] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [totalComments, setTotalComments] = useState(0);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const [sortBy, setSortBy] = useState("newest");
    const [showSortMenu, setShowSortMenu] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef(null);

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
        // Remove comment and its replies recursively
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

                <div className="relative">
                    <button
                        onClick={() => setShowSortMenu(!showSortMenu)}
                        className="flex items-center gap-2 text-sm text-zinc-300 hover:text-white"
                    >
                        <Icons.Sort />
                        Sort by
                    </button>

                    {showSortMenu && (
                        <div className="absolute top-full mt-2 left-0 bg-zinc-800 rounded-lg shadow-xl border border-zinc-700 overflow-hidden z-10">
                            <button
                                onClick={() => {
                                    setSortBy("newest");
                                    setShowSortMenu(false);
                                }}
                                className={`block w-full text-left px-4 py-2 text-sm hover:bg-zinc-700 ${sortBy === "newest" ? "text-blue-400" : "text-zinc-200"}`}
                            >
                                Newest first
                            </button>
                            <button
                                onClick={() => {
                                    setSortBy("top");
                                    setShowSortMenu(false);
                                }}
                                className={`block w-full text-left px-4 py-2 text-sm hover:bg-zinc-700 ${sortBy === "top" ? "text-blue-400" : "text-zinc-200"}`}
                            >
                                Top comments
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Add Comment */}
            <form onSubmit={handleSubmit} className="flex gap-3 mb-8">
                <img
                    src={auth?.user?.avatar || "/default-avatar.png"}
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
                                currentUserId={auth?.user?._id}
                                currentUserAvatar={auth?.user?.avatar}
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

// ==================== MAIN WATCH COMPONENT ====================
const Watch = () => {
    const axiosPrivate = useAxiosPrivate();
    const { auth } = useAuth();
    const { videoId } = useParams();

    const [video, setVideo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const controller = new AbortController();

        const fetchVideo = async () => {
            try {
                setLoading(true);
                const res = await axiosPrivate.get(`/video/${videoId}`, {
                    signal: controller.signal,
                });
                setVideo(res.data.data);
            } catch (err) {
                if (err.name !== "CanceledError") {
                    setError("Failed to load video");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchVideo();

        return () => controller.abort();
    }, [videoId, axiosPrivate]);

    if (loading) {
        return (
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-zinc-400">Loading video...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-400 text-xl mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (!video) {
        return (
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
                <p className="text-zinc-400 text-xl">Video not found</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-950">
            <div className="max-w-[1400px] mx-auto p-4 lg:p-6">
                <div className="max-w-[1280px] mx-auto">
                    {/* Video Player */}
                    <VideoPlayer video={video} />

                    {/* Video Title */}
                    <h1 className="text-xl lg:text-2xl font-bold text-white mt-4 leading-tight">
                        {video.title}
                    </h1>

                    {/* Channel Info & Actions */}
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mt-4">
                        <ChannelInfo
                            owner={video.owner}
                            currentUserId={auth?.user?._id}
                        />
                        <VideoActions video={video} videoId={videoId} />
                    </div>

                    {/* Description */}
                    <VideoDescription video={video} />

                    {/* Comments */}
                    <CommentSection videoId={videoId} />
                </div>
            </div>
        </div>
    );
};

export default Watch;
