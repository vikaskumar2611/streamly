// VideoCard.jsx
import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import useAuth from "../hooks/useAuth.hooks.js";
import useAxiosPrivate from "../hooks/useAxiosPrivate.hooks.js";
import { selectTheme } from "../features/theme/themeSlice";

// --- SUB-COMPONENT: PLAYLIST SELECTION MODAL ---
const PlaylistModal = ({ videoId, userId, onClose, themeStyles }) => {
    const axiosPrivate = useAxiosPrivate();
    const [playlists, setPlaylists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newPlaylistName, setNewPlaylistName] = useState("");
    const [showCreateInput, setShowCreateInput] = useState(false);
    const [processingId, setProcessingId] = useState(null);

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

    const handleAddToPlaylist = async (playlistId) => {
        setProcessingId(playlistId);
        try {
            await axiosPrivate.patch(`/playlist/add/${videoId}/${playlistId}`);
            alert("Video added to playlist successfully!");
            onClose();
        } catch (error) {
            console.error("Error adding to playlist:", error);
            if (error.response && error.response.status === 409) {
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
            className={`fixed inset-0 z-[100] flex items-center justify-center ${t.overlay} backdrop-blur-sm p-4`}
            onClick={onClose}
        >
            <div
                className={`${t.modal} border rounded-xl w-full max-w-sm p-5 shadow-2xl relative`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <h3 className={`${t.text} font-semibold text-lg`}>
                        Save to...
                    </h3>
                    <button
                        onClick={onClose}
                        className={`${t.textMuted} hover:${t.text} text-xl leading-none transition-colors`}
                    >
                        &times;
                    </button>
                </div>

                {/* Playlist List */}
                <div className="flex flex-col gap-2 max-h-60 overflow-y-auto mb-4 scrollbar-thin scrollbar-thumb-gray-700">
                    {loading ? (
                        <p
                            className={`${t.textMuted} text-center text-sm py-2`}
                        >
                            Loading...
                        </p>
                    ) : playlists.length > 0 ? (
                        playlists.map((playlist) => (
                            <button
                                key={playlist._id}
                                onClick={() =>
                                    handleAddToPlaylist(playlist._id)
                                }
                                disabled={processingId === playlist._id}
                                className={`w-full text-left px-3 py-2 rounded ${t.playlistItem} text-sm flex items-center justify-between group transition-colors`}
                            >
                                <span className="truncate flex-1">
                                    {playlist.name}
                                </span>
                                {processingId === playlist._id ? (
                                    <span
                                        className={`text-xs ${t.accent} animate-pulse`}
                                    >
                                        Adding...
                                    </span>
                                ) : (
                                    <span
                                        className={`opacity-0 group-hover:opacity-100 text-xs ${t.accent} font-medium`}
                                    >
                                        Add
                                    </span>
                                )}
                            </button>
                        ))
                    ) : (
                        <p
                            className={`${t.textFaded} text-sm text-center py-2`}
                        >
                            No playlists found.
                        </p>
                    )}
                </div>

                {/* Create New Playlist Section */}
                {!showCreateInput ? (
                    <button
                        onClick={() => setShowCreateInput(true)}
                        className={`flex items-center gap-2 ${t.accent} hover:opacity-80 text-sm font-medium transition-colors`}
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
                        Create new playlist
                    </button>
                ) : (
                    <div className="flex flex-col gap-2 animate-fade-in mt-2">
                        <label className={`text-xs ${t.textMuted}`}>Name</label>
                        <input
                            type="text"
                            value={newPlaylistName}
                            onChange={(e) => setNewPlaylistName(e.target.value)}
                            placeholder="Enter playlist name..."
                            autoFocus
                            className={`${t.input} text-sm rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
                        />
                        <div className="flex justify-end gap-2 mt-1">
                            <button
                                onClick={() => setShowCreateInput(false)}
                                className={`text-xs ${t.textMuted} hover:${t.text} px-2 py-1 transition-colors`}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreatePlaylist}
                                disabled={!newPlaylistName.trim()}
                                className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Create & Save
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- MAIN COMPONENT ---
const VideoCard = ({ video }) => {
    const axiosPrivate = useAxiosPrivate();
    const { user } = useAuth();
    const navigate = useNavigate();
    const theme = useSelector(selectTheme);
    const isDark = theme === "dark";

    const [showOptions, setShowOptions] = useState(false);
    const [showPlaylistModal, setShowPlaylistModal] = useState(false);
    const menuRef = useRef(null);

    // Theme configuration object
    const themeStyles = {
        dark: {
            card: "bg-gray-900",
            thumbnail: "bg-gray-800",
            text: "text-white",
            textSecondary: "text-gray-300",
            textMuted: "text-gray-400",
            textFaded: "text-gray-500",
            avatar: "bg-gray-700",
            duration: "bg-black/80 text-white",
            unpublishedBadge: "bg-red-600 text-white",
            menuButton: "text-white hover:bg-gray-700",
            dropdown: "bg-gray-800 border-gray-700",
            dropdownItem: "text-gray-200 hover:bg-gray-700 hover:text-white",
            overlay: "bg-black/60",
            modal: "bg-gray-900 border-gray-700",
            playlistItem: "bg-gray-800 hover:bg-gray-700 text-gray-200",
            input: "bg-gray-800 border border-gray-700 text-white",
            accent: "text-blue-400",
            accentHover: "hover:text-blue-300",
            editButton: "text-blue-400 hover:text-blue-300",
            publishButton: "text-green-400 hover:text-green-300",
            unpublishButton: "text-red-400 hover:text-red-300",
            hoverTitle: "group-hover:text-blue-400",
            border: "border-gray-700",
        },
        light: {
            card: "bg-white",
            thumbnail: "bg-gray-200",
            text: "text-gray-900",
            textSecondary: "text-gray-700",
            textMuted: "text-gray-500",
            textFaded: "text-gray-400",
            avatar: "bg-gray-300",
            duration: "bg-black/80 text-white",
            unpublishedBadge: "bg-red-600 text-white",
            menuButton: "text-gray-700 hover:bg-gray-200",
            dropdown: "bg-white border-gray-200 shadow-lg",
            dropdownItem: "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
            overlay: "bg-black/40",
            modal: "bg-white border-gray-200 shadow-xl",
            playlistItem: "bg-gray-100 hover:bg-gray-200 text-gray-700",
            input: "bg-white border border-gray-300 text-gray-900",
            accent: "text-blue-600",
            accentHover: "hover:text-blue-700",
            editButton: "text-blue-600 hover:text-blue-700",
            publishButton: "text-green-600 hover:text-green-700",
            unpublishButton: "text-red-600 hover:text-red-700",
            hoverTitle: "group-hover:text-blue-600",
            border: "border-gray-200",
        },
    };

    const t = isDark ? themeStyles.dark : themeStyles.light;

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

    // --- HANDLERS ---

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
            await axiosPrivate.patch(`/video/toggle/publish/${video._id}`);
            setShowOptions(false);
        } catch (error) {
            console.error("Error toggling publish:", error);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowOptions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const formatDuration = (seconds) => {
        const min = Math.floor(seconds / 60);
        const sec = Math.floor(seconds % 60);
        return `${min}:${sec.toString().padStart(2, "0")}`;
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
        if (diffDays === 0) return "Today";
        if (diffDays === 1) return "Yesterday";
        if (diffDays < 30) return `${diffDays} days ago`;
        if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
        return `${Math.floor(diffDays / 365)} years ago`;
    };

    return (
        <>
            {/* --- RENDER MODAL IF OPEN --- */}
            {showPlaylistModal && (
                <PlaylistModal
                    videoId={_id}
                    userId={user?._id}
                    onClose={() => setShowPlaylistModal(false)}
                    themeStyles={t}
                />
            )}

            <div className="w-full flex flex-col gap-3 cursor-pointer group">
                {/* --- THUMBNAIL SECTION --- */}
                <Link
                    to={`/watch/${_id}`}
                    className={`relative w-full aspect-video ${t.thumbnail} rounded-xl overflow-hidden`}
                >
                    <img
                        src={thumbnail}
                        alt={title}
                        className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-200 ${!isPublished ? "opacity-50" : ""}`}
                    />
                    <span
                        className={`absolute bottom-2 right-2 ${t.duration} text-xs px-2 py-1 rounded`}
                    >
                        {formatDuration(duration)}
                    </span>
                    {!isPublished && (
                        <span
                            className={`absolute top-2 left-2 ${t.unpublishedBadge} text-xs px-2 py-1 rounded font-bold`}
                        >
                            Unpublished
                        </span>
                    )}
                </Link>

                {/* --- DETAILS SECTION --- */}
                <div className="flex gap-3 items-start relative">
                    <Link to={`/c/${owner?.username}`} className="shrink-0">
                        <img
                            src={owner?.avatar}
                            alt="avatar"
                            className={`w-9 h-9 rounded-full object-cover ${t.avatar}`}
                        />
                    </Link>

                    <div className="flex flex-col flex-1">
                        <div className="flex justify-between items-start">
                            <Link to={`/watch/${_id}`} className="flex-1">
                                <h3
                                    className={`${t.text} font-semibold leading-snug line-clamp-2 ${t.hoverTitle} transition-colors`}
                                >
                                    {title}
                                </h3>
                            </Link>

                            {/* --- MENU BUTTON --- */}
                            <div className="relative ml-2" ref={menuRef}>
                                <button
                                    onClick={handleToggleMenu}
                                    className={`${t.menuButton} p-1 rounded-full transition-colors focus:outline-none`}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                        className="w-6 h-6"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
                                        />
                                    </svg>
                                </button>

                                {/* --- DROPDOWN --- */}
                                {showOptions && (
                                    <div
                                        className={`absolute right-0 top-8 ${t.dropdown} border rounded-lg shadow-xl z-50 w-48 py-2 flex flex-col`}
                                    >
                                        <button
                                            onClick={handleAddToPlaylistClick}
                                            className={`text-left px-4 py-2 text-sm ${t.dropdownItem} flex items-center gap-2 transition-colors`}
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
                                                    d="M12 10.5v6m3-3H9m4.06-7.19l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"
                                                />
                                            </svg>
                                            Save to Playlist
                                        </button>

                                        {isOwner && (
                                            <>
                                                <button
                                                    onClick={handleEditClick}
                                                    className={`text-left px-4 py-2 text-sm flex items-center gap-2 transition-colors ${t.editButton}`}
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
                                                            d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                                                        />
                                                    </svg>
                                                    Edit Video
                                                </button>

                                                <button
                                                    onClick={
                                                        handleTogglePublish
                                                    }
                                                    className={`text-left px-4 py-2 text-sm flex items-center gap-2 transition-colors ${
                                                        isPublished
                                                            ? t.unpublishButton
                                                            : t.publishButton
                                                    }`}
                                                >
                                                    {isPublished ? (
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
                                                                d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                                                            />
                                                        </svg>
                                                    ) : (
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
                                                    )}
                                                    {isPublished
                                                        ? "Unpublish"
                                                        : "Publish"}
                                                </button>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        <Link
                            to={`/c/${owner?.username}`}
                            className={`${t.textMuted} text-sm hover:${t.text} mt-1 transition-colors`}
                        >
                            {owner?.fullName}
                        </Link>
                        <div className={`${t.textMuted} text-sm`}>
                            <span>{views} views</span>
                            <span className="mx-1">•</span>
                            <span>{formatDate(createdAt)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default VideoCard;
