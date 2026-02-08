import { useRef, useState, useEffect, useCallback } from "react";

const VideoPlayer = ({ video }) => {
    const videoRef = useRef(null);
    const containerRef = useRef(null);
    const hideControlsTimeout = useRef(null);

    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showControls, setShowControls] = useState(true);
    const [buffered, setBuffered] = useState(0);
    const [isVolumeHovered, setIsVolumeHovered] = useState(false);

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

            {/* Big play button overlay */}
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

            {/* Controls bar */}
            <div
                className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent pt-16 pb-3 px-4 transition-opacity duration-300 ${
                    showControls || !isPlaying ? "opacity-100" : "opacity-0"
                }`}
            >
                {/* Progress bar */}
                <div
                    className="relative h-1 bg-white/30 rounded-full cursor-pointer group/progress mb-3"
                    onClick={handleSeek}
                >
                    <div
                        className="absolute h-full bg-white/50 rounded-full"
                        style={{ width: `${(buffered / duration) * 100}%` }}
                    />
                    <div
                        className="absolute h-full bg-blue-500 rounded-full"
                        style={{ width: `${(currentTime / duration) * 100}%` }}
                    />
                    <div
                        className="absolute w-3 h-3 bg-blue-500 rounded-full -top-1 transform -translate-x-1/2 opacity-0 group-hover/progress:opacity-100 transition-opacity"
                        style={{ left: `${(currentTime / duration) * 100}%` }}
                    />
                </div>

                <div className="flex items-center justify-between">
                    {/* Left controls */}
                    <div className="flex items-center gap-3">
                        {/* Play/Pause */}
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

                        {/* Volume */}
                        <div
                            className="flex items-center gap-2"
                            onMouseEnter={() => setIsVolumeHovered(true)}
                            onMouseLeave={() => setIsVolumeHovered(false)}
                        >
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
                            <div
                                className="overflow-hidden transition-all duration-200"
                                style={{
                                    width: isVolumeHovered ? "80px" : "0px",
                                }}
                            >
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.01"
                                    value={isMuted ? 0 : volume}
                                    onChange={handleVolumeChange}
                                    className="w-20 accent-white"
                                />
                            </div>
                        </div>

                        {/* Time */}
                        <span className="text-white text-sm">
                            {formatTime(currentTime)} / {formatTime(duration)}
                        </span>
                    </div>

                    {/* Right controls */}
                    <div className="flex items-center gap-2">
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

export default VideoPlayer;
