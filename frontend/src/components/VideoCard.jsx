import React, { useState, useRef, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import useAuth from "../hooks/useAuth.hooks.js";
import useAxiosPrivate from "../hooks/useAxiosPrivate.hooks.js";
import { selectTheme } from "../features/theme/themeSlice";

// ─── Utility Helpers ─────────────────────────────────────────────────
const formatDuration = (seconds) => {
    if (!seconds) return "0:00";
    const hrs = Math.floor(seconds / 3600);
    const min = Math.floor((seconds % 3600) / 60);
    const sec = Math.floor(seconds % 60);
    if (hrs > 0) {
        return `${hrs}:${min.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
    }
    return `${min}:${sec.toString().padStart(2, "0")}`;
};

const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffSeconds = Math.floor((now - date) / 1000);

    if (diffSeconds < 60) return "Just now";
    if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)}m ago`;

    const diffDays = Math.floor(diffSeconds / 86400);
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo ago`;
    return `${Math.floor(diffDays / 365)}y ago`;
};

const formatViews = (count) => {
    if (!count) return "0 views";
    if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M views`;
    if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K views`;
    return `${count} views`;
};

// ─── Playlist Modal ──────────────────────────────────────────────────
const PlaylistModal = ({ videoId, userId, onClose, themeStyles }) => {
    const axiosPrivate = useAxiosPrivate();
    const [playlists, setPlaylists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newPlaylistName, setNewPlaylistName] = useState("");
    const [showCreateInput, setShowCreateInput] = useState(false);
    const [processingId, setProcessingId] = useState(null);
    const modalRef = useRef(null);

    const t = themeStyles;

    useEffect(() => {
        const fetchPlaylists = async () => {
            if (!userId) return;
            try {
                const response = await axiosPrivate.get(
                    `/playlist/user/${userId}`,
                );
                setPlaylists(response.data.data || []);
            } catch (error) {
                console.error("Error fetching playlists:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPlaylists();
    }, [userId, axiosPrivate]);

    // Trap focus inside modal & close on Escape
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", handleKeyDown);
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "";
        };
    }, [onClose]);

    const handleAddToPlaylist = async (playlistId) => {
        setProcessingId(playlistId);
        try {
            await axiosPrivate.patch(`/playlist/add/${videoId}/${playlistId}`);
            alert("Video added to playlist successfully!");
            onClose();
        } catch (error) {
            console.error("Error adding to playlist:", error);
            if (error.response?.status === 409) {
                alert("Video is already in this playlist.");
            } else {
                alert("Could not add to playlist. Please try again.");
            }
        } finally {
            setProcessingId(null);
        }
    };

    const handleCreatePlaylist = async () => {
        if (!newPlaylistName.trim()) return;
        try {
            const response = await axiosPrivate.post("/playlist", {
                name: newPlaylistName,
                description: "Created from video card menu",
            });
            const newPlaylist = response.data.data;
            setPlaylists((prev) => [newPlaylist, ...prev]);
            setNewPlaylistName("");
            setShowCreateInput(false);
            await handleAddToPlaylist(newPlaylist._id);
        } catch (error) {
            console.error("Error creating playlist:", error);
            alert("Failed to create playlist");
        }
    };

    return (
        <div
            className={`
                fixed inset-0 z-[100] flex items-center justify-center
                ${t.overlay} backdrop-blur-md p-4
                animate-[fadeIn_0.2s_ease-out]
            `}
            onClick={onClose}
        >
            <div
                ref={modalRef}
                className={`
                    ${t.modal} border rounded-2xl w-full max-w-sm
                    shadow-2xl relative overflow-hidden
                    animate-[scaleIn_0.2s_ease-out]
                `}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div
                    className={`
                        flex justify-between items-center px-5 py-4
                        border-b ${t.border}
                    `}
                >
                    <div className="flex items-center gap-2.5">
                        <svg
                            className={`w-5 h-5 ${t.accent}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M12 10.5v6m3-3H9m4.06-7.19l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"
                            />
                        </svg>
                        <h3 className={`${t.text} font-semibold text-base`}>
                            Save to playlist
                        </h3>
                    </div>
                    <button
                        onClick={onClose}
                        className={`
                            ${t.textMuted} p-1.5 rounded-lg
                            hover:${t.text} hover:bg-gray-500/10
                            transition-all duration-200
                        `}
                    >
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                {/* Playlist List */}
                <div
                    className="flex flex-col gap-1 max-h-60 overflow-y-auto p-2
                               scrollbar-thin scrollbar-thumb-gray-600/30"
                >
                    {loading ? (
                        <div className="flex flex-col gap-2 p-2">
                            {[1, 2, 3].map((i) => (
                                <div
                                    key={i}
                                    className={`h-10 rounded-lg ${t.skeleton || "bg-gray-700/30"} animate-pulse`}
                                />
                            ))}
                        </div>
                    ) : playlists.length > 0 ? (
                        playlists.map((playlist) => (
                            <button
                                key={playlist._id}
                                onClick={() =>
                                    handleAddToPlaylist(playlist._id)
                                }
                                disabled={processingId === playlist._id}
                                className={`
                                    w-full text-left px-3.5 py-2.5 rounded-lg
                                    ${t.playlistItem} text-sm
                                    flex items-center justify-between group
                                    transition-all duration-200
                                    disabled:opacity-60
                                `}
                            >
                                <span className="truncate flex-1 font-medium">
                                    {playlist.name}
                                </span>
                                {processingId === playlist._id ? (
                                    <svg
                                        className={`w-4 h-4 animate-spin ${t.accent}`}
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
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                        />
                                    </svg>
                                ) : (
                                    <svg
                                        className={`
                                            w-4 h-4 opacity-0 group-hover:opacity-100
                                            ${t.accent} transition-opacity duration-200
                                        `}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 4.5v15m7.5-7.5h-15"
                                        />
                                    </svg>
                                )}
                            </button>
                        ))
                    ) : (
                        <p
                            className={`${t.textFaded} text-sm text-center py-6`}
                        >
                            No playlists yet. Create one below!
                        </p>
                    )}
                </div>

                {/* Create New */}
                <div className={`border-t ${t.border} p-4`}>
                    {!showCreateInput ? (
                        <button
                            onClick={() => setShowCreateInput(true)}
                            className={`
                                flex items-center gap-2.5 w-full
                                px-3.5 py-2.5 rounded-lg
                                ${t.accent} text-sm font-medium
                                hover:bg-blue-500/10
                                transition-all duration-200
                            `}
                        >
                            <svg
                                className="w-4.5 h-4.5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 4.5v15m7.5-7.5h-15"
                                />
                            </svg>
                            Create new playlist
                        </button>
                    ) : (
                        <div className="flex flex-col gap-3 animate-[fadeIn_0.2s_ease-out]">
                            <input
                                type="text"
                                value={newPlaylistName}
                                onChange={(e) =>
                                    setNewPlaylistName(e.target.value)
                                }
                                onKeyDown={(e) =>
                                    e.key === "Enter" && handleCreatePlaylist()
                                }
                                placeholder="Playlist name..."
                                autoFocus
                                className={`
                                    ${t.input} text-sm rounded-lg px-3.5 py-2.5
                                    outline-none
                                    focus:ring-2 focus:ring-blue-500/50
                                    transition-all duration-200
                                `}
                            />
                            <div className="flex justify-end gap-2">
                                <button
                                    onClick={() => {
                                        setShowCreateInput(false);
                                        setNewPlaylistName("");
                                    }}
                                    className={`
                                        text-sm ${t.textMuted} px-3.5 py-1.5
                                        rounded-lg hover:bg-gray-500/10
                                        transition-all duration-200
                                    `}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleCreatePlaylist}
                                    disabled={!newPlaylistName.trim()}
                                    className="
                                        text-sm bg-blue-600 hover:bg-blue-500
                                        text-white px-4 py-1.5 rounded-lg
                                        font-medium
                                        disabled:opacity-40 disabled:cursor-not-allowed
                                        transition-all duration-200
                                        hover:shadow-lg hover:shadow-blue-500/25
                                    "
                                >
                                    Create & Save
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// ─── Dropdown Menu Item ──────────────────────────────────────────────
const MenuItem = ({ onClick, icon, label, className = "" }) => (
    <button
        onClick={onClick}
        className={`
            w-full text-left px-4 py-2.5 text-sm
            flex items-center gap-3
            transition-all duration-200
            ${className}
        `}
    >
        {icon}
        <span className="font-medium">{label}</span>
    </button>
);

// ─── Main VideoCard ──────────────────────────────────────────────────
const VideoCard = ({ video }) => {
    const axiosPrivate = useAxiosPrivate();
    const { user } = useAuth();
    const navigate = useNavigate();
    const theme = useSelector(selectTheme);
    const isDark = theme === "dark";

    const [showOptions, setShowOptions] = useState(false);
    const [showPlaylistModal, setShowPlaylistModal] = useState(false);
    const [imgLoaded, setImgLoaded] = useState(false);
    const menuRef = useRef(null);

    const themeStyles = {
        dark: {
            card: "bg-gray-900",
            thumbnail: "bg-gray-800",
            thumbnailOverlay: "from-transparent via-transparent to-black/40",
            text: "text-white",
            textSecondary: "text-gray-300",
            textMuted: "text-gray-400",
            textFaded: "text-gray-500",
            avatar: "ring-gray-700",
            avatarBg: "bg-gray-700",
            duration: "bg-black/80 text-white backdrop-blur-sm",
            unpublishedBadge: "bg-red-500/90 text-white backdrop-blur-sm",
            menuButton: "text-white/70 hover:text-white hover:bg-white/10",
            menuButtonVisible: "sm:opacity-0 sm:group-hover:opacity-100",
            dropdown:
                "bg-gray-800/95 border-gray-700/50 backdrop-blur-xl shadow-2xl shadow-black/40",
            dropdownItem: "text-gray-300 hover:bg-white/5 hover:text-white",
            overlay: "bg-black/60",
            modal: "bg-gray-900 border-gray-700/50",
            playlistItem: "hover:bg-white/5 text-gray-300",
            input: "bg-gray-800 border border-gray-700 text-white placeholder-gray-500",
            accent: "text-blue-400",
            editButton: "text-blue-400 hover:bg-blue-500/10",
            publishButton: "text-emerald-400 hover:bg-emerald-500/10",
            unpublishButton: "text-red-400 hover:bg-red-500/10",
            hoverTitle: "group-hover:text-blue-400",
            border: "border-gray-700/50",
            playOverlay: "bg-black/30",
            skeleton: "bg-gray-700/40",
            dot: "bg-gray-500",
        },
        light: {
            card: "bg-white",
            thumbnail: "bg-gray-100",
            thumbnailOverlay: "from-transparent via-transparent to-black/20",
            text: "text-gray-900",
            textSecondary: "text-gray-700",
            textMuted: "text-gray-500",
            textFaded: "text-gray-400",
            avatar: "ring-gray-200",
            avatarBg: "bg-gray-200",
            duration: "bg-black/75 text-white backdrop-blur-sm",
            unpublishedBadge: "bg-red-500/90 text-white backdrop-blur-sm",
            menuButton: "text-gray-500 hover:text-gray-800 hover:bg-gray-100",
            menuButtonVisible: "sm:opacity-0 sm:group-hover:opacity-100",
            dropdown:
                "bg-white/95 border-gray-200 backdrop-blur-xl shadow-xl shadow-gray-200/50",
            dropdownItem: "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
            overlay: "bg-black/40",
            modal: "bg-white border-gray-200 shadow-2xl",
            playlistItem: "hover:bg-gray-50 text-gray-700",
            input: "bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400",
            accent: "text-blue-600",
            editButton: "text-blue-600 hover:bg-blue-50",
            publishButton: "text-emerald-600 hover:bg-emerald-50",
            unpublishButton: "text-red-600 hover:bg-red-50",
            hoverTitle: "group-hover:text-blue-600",
            border: "border-gray-200",
            playOverlay: "bg-black/20",
            skeleton: "bg-gray-200/60",
            dot: "bg-gray-400",
        },
    };

    const t = isDark ? themeStyles.dark : themeStyles.light;

    // Close menu on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowOptions(false);
            }
        };
        if (showOptions) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, [showOptions]);

    if (!video) return null;

    const {
        _id,
        title,
        thumbnail,
        duration,
        views,
        createdAt,
        owner,
        isPublished,
    } = video;

    const isOwner = user?._id === owner?._id;

    // ── Handlers ─────────────────────────────────────────────────────
    const handleToggleMenu = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setShowOptions((prev) => !prev);
    };

    const handleAddToPlaylistClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setShowOptions(false);
        if (!user) {
            alert("Please login to save playlists");
            return;
        }
        setShowPlaylistModal(true);
    };

    const handleEditClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setShowOptions(false);
        navigate(`/edit/video/${_id}`);
    };

    const handleTogglePublish = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            await axiosPrivate.patch(`/video/toggle/publish/${_id}`);
            setShowOptions(false);
        } catch (error) {
            console.error("Error toggling publish:", error);
        }
    };

    return (
        <>
            {/* Playlist Modal */}
            {showPlaylistModal && (
                <PlaylistModal
                    videoId={_id}
                    userId={user?._id}
                    onClose={() => setShowPlaylistModal(false)}
                    themeStyles={t}
                />
            )}

            <div className="w-full flex flex-col gap-3 group">
                {/* ── Thumbnail ────────────────────────────────────── */}
                <Link
                    to={`/watch/${_id}`}
                    className={`
                        relative w-full aspect-video rounded-xl overflow-hidden
                        ${t.thumbnail}
                    `}
                >
                    {/* Placeholder while image loads */}
                    {!imgLoaded && (
                        <div
                            className={`absolute inset-0 ${t.skeleton} animate-pulse`}
                        />
                    )}

                    <img
                        src={thumbnail}
                        alt={title}
                        loading="lazy"
                        onLoad={() => setImgLoaded(true)}
                        className={`
                            w-full h-full object-cover
                            transition-all duration-300 ease-out
                            group-hover:scale-105
                            ${!isPublished ? "opacity-50 grayscale-[30%]" : ""}
                            ${imgLoaded ? "opacity-100" : "opacity-0"}
                        `}
                    />

                    {/* Hover gradient overlay */}
                    <div
                        className={`
                            absolute inset-0
                            bg-gradient-to-t ${t.thumbnailOverlay}
                            opacity-0 group-hover:opacity-100
                            transition-opacity duration-300
                        `}
                    />

                    {/* Play icon on hover */}
                    <div
                        className="
                            absolute inset-0 flex items-center justify-center
                            opacity-0 group-hover:opacity-100
                            transition-all duration-300
                            pointer-events-none
                        "
                    >
                        <div
                            className={`
                                w-12 h-12 rounded-full
                                ${t.playOverlay} backdrop-blur-sm
                                flex items-center justify-center
                                scale-75 group-hover:scale-100
                                transition-transform duration-300
                            `}
                        >
                            <svg
                                className="w-6 h-6 text-white ml-0.5"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        </div>
                    </div>

                    {/* Duration badge */}
                    <span
                        className={`
                            absolute bottom-2 right-2
                            ${t.duration}
                            text-xs font-medium tracking-wide
                            px-2 py-0.5 rounded-md
                            transition-transform duration-300
                            group-hover:translate-y-[-2px]
                        `}
                    >
                        {formatDuration(duration)}
                    </span>

                    {/* Unpublished badge */}
                    {!isPublished && (
                        <span
                            className={`
                                absolute top-2.5 left-2.5
                                ${t.unpublishedBadge}
                                text-[11px] font-bold uppercase tracking-wider
                                px-2.5 py-1 rounded-md
                            `}
                        >
                            Unpublished
                        </span>
                    )}
                </Link>

                {/* ── Details ──────────────────────────────────────── */}
                <div className="flex gap-3 items-start">
                    {/* Avatar */}
                    <Link
                        to={`/c/${owner?.username}`}
                        className="shrink-0 mt-0.5"
                    >
                        <img
                            src={owner?.avatar}
                            alt={owner?.fullName}
                            className={`
                                w-9 h-9 rounded-full object-cover
                                ring-2 ${t.avatar}
                                transition-all duration-200
                                hover:ring-blue-500 hover:scale-105
                            `}
                        />
                    </Link>

                    {/* Meta */}
                    <div className="flex flex-col flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-1">
                            <Link
                                to={`/watch/${_id}`}
                                className="flex-1 min-w-0"
                            >
                                <h3
                                    className={`
                                        ${t.text} font-semibold text-sm
                                        leading-snug line-clamp-2
                                        ${t.hoverTitle}
                                        transition-colors duration-200
                                    `}
                                >
                                    {title}
                                </h3>
                            </Link>

                            {/* Menu Button */}
                            <div className="relative shrink-0" ref={menuRef}>
                                <button
                                    onClick={handleToggleMenu}
                                    className={`
                                        ${t.menuButton} ${t.menuButtonVisible}
                                        p-1.5 rounded-full
                                        transition-all duration-200
                                        focus:outline-none focus:opacity-100
                                    `}
                                    aria-label="Video options"
                                >
                                    <svg
                                        className="w-5 h-5"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle cx="12" cy="6" r="1.5" />
                                        <circle cx="12" cy="12" r="1.5" />
                                        <circle cx="12" cy="18" r="1.5" />
                                    </svg>
                                </button>

                                {/* Dropdown */}
                                {showOptions && (
                                    <div
                                        className={`
                                            absolute right-0 top-9
                                            ${t.dropdown} border rounded-xl
                                            z-50 w-52 py-1.5
                                            animate-[scaleIn_0.15s_ease-out]
                                            origin-top-right
                                        `}
                                    >
                                        <MenuItem
                                            onClick={handleAddToPlaylistClick}
                                            className={t.dropdownItem}
                                            icon={
                                                <svg
                                                    className="w-4.5 h-4.5"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth={1.5}
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M12 10.5v6m3-3H9m4.06-7.19l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"
                                                    />
                                                </svg>
                                            }
                                            label="Save to Playlist"
                                        />

                                        {isOwner && (
                                            <>
                                                <div
                                                    className={`my-1 border-t ${t.border}`}
                                                />

                                                <MenuItem
                                                    onClick={handleEditClick}
                                                    className={t.editButton}
                                                    icon={
                                                        <svg
                                                            className="w-4.5 h-4.5"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                            strokeWidth={1.5}
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                                                            />
                                                        </svg>
                                                    }
                                                    label="Edit Video"
                                                />

                                                <MenuItem
                                                    onClick={
                                                        handleTogglePublish
                                                    }
                                                    className={
                                                        isPublished
                                                            ? t.unpublishButton
                                                            : t.publishButton
                                                    }
                                                    icon={
                                                        isPublished ? (
                                                            <svg
                                                                className="w-4.5 h-4.5"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                viewBox="0 0 24 24"
                                                                strokeWidth={
                                                                    1.5
                                                                }
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                                                                />
                                                            </svg>
                                                        ) : (
                                                            <svg
                                                                className="w-4.5 h-4.5"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                viewBox="0 0 24 24"
                                                                strokeWidth={
                                                                    1.5
                                                                }
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
                                                        )
                                                    }
                                                    label={
                                                        isPublished
                                                            ? "Unpublish"
                                                            : "Publish"
                                                    }
                                                />
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Channel name */}
                        <Link
                            to={`/c/${owner?.username}`}
                            className={`
                                ${t.textMuted} text-[13px] mt-1
                                hover:${t.textSecondary}
                                transition-colors duration-200
                                truncate block
                            `}
                        >
                            {owner?.fullName}
                        </Link>

                        {/* Views & date */}
                        <div
                            className={`
                                ${t.textFaded} text-[13px]
                                flex items-center gap-1.5
                                mt-0.5
                            `}
                        >
                            <span>{formatViews(views)}</span>
                            <span className={`w-1 h-1 rounded-full ${t.dot}`} />
                            <span>{formatDate(createdAt)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default VideoCard;
