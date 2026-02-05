import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth.hooks.js";
import useAxiosPrivate from "../hooks/useAxiosPrivate.hooks.js";

// --- SUB-COMPONENT: PLAYLIST SELECTION MODAL ---
const PlaylistModal = ({ videoId, userId, onClose }) => {
    const axiosPrivate = useAxiosPrivate();
    const [playlists, setPlaylists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newPlaylistName, setNewPlaylistName] = useState("");
    const [showCreateInput, setShowCreateInput] = useState(false);

    // New state to track which playlist is currently being processed
    const [processingId, setProcessingId] = useState(null);

    // 1. Fetch User Playlists on Mount
    useEffect(() => {
        const fetchPlaylists = async () => {
            if (!userId) return;
            try {
                // Route: router.route("/user/:userId").get(getUserPlaylists);
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

    // 2. Handle Adding Video to Specific Playlist
    const handleAddToPlaylist = async (playlistId) => {
        setProcessingId(playlistId); // Show loading state for specific button
        try {
            // Route: router.route("/add/:videoId/:playlistId").patch(...)
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

    // 3. Handle Creating a New Playlist
    const handleCreatePlaylist = async () => {
        if (!newPlaylistName.trim()) return;
        try {
            // Route: router.route("/").post(createPlaylist);
            const response = await axiosPrivate.post("/playlist", {
                name: newPlaylistName,
                description: "Created from video card menu",
            });

            const newPlaylist = response.data.data;

            // Add new playlist to local list
            setPlaylists((prev) => [newPlaylist, ...prev]);

            // Reset input
            setNewPlaylistName("");
            setShowCreateInput(false);

            // Immediately add the video to the new playlist
            await handleAddToPlaylist(newPlaylist._id);
        } catch (error) {
            console.error("Error creating playlist:", error);
            alert("Failed to create playlist");
        }
    };

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={onClose} // Close when clicking background
        >
            <div
                className="bg-gray-900 border border-gray-700 rounded-xl w-full max-w-sm p-5 shadow-2xl relative"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
            >
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-white font-semibold text-lg">
                        Save to...
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white text-xl leading-none"
                    >
                        &times;
                    </button>
                </div>

                {/* Playlist List */}
                <div className="flex flex-col gap-2 max-h-60 overflow-y-auto mb-4 scrollbar-thin scrollbar-thumb-gray-700">
                    {loading ? (
                        <p className="text-gray-400 text-center text-sm py-2">
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
                                className="w-full text-left px-3 py-2 rounded bg-gray-800 hover:bg-gray-700 text-gray-200 text-sm flex items-center justify-between group transition-colors"
                            >
                                <span className="truncate flex-1">
                                    {playlist.name}
                                </span>
                                {processingId === playlist._id ? (
                                    <span className="text-xs text-blue-400 animate-pulse">
                                        Adding...
                                    </span>
                                ) : (
                                    <span className="opacity-0 group-hover:opacity-100 text-xs text-blue-400 font-medium">
                                        Add
                                    </span>
                                )}
                            </button>
                        ))
                    ) : (
                        <p className="text-gray-500 text-sm text-center py-2">
                            No playlists found.
                        </p>
                    )}
                </div>

                {/* Create New Playlist Section */}
                {!showCreateInput ? (
                    <button
                        onClick={() => setShowCreateInput(true)}
                        className="flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
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
                        <label className="text-xs text-gray-400">Name</label>
                        <input
                            type="text"
                            value={newPlaylistName}
                            onChange={(e) => setNewPlaylistName(e.target.value)}
                            placeholder="Enter playlist name..."
                            autoFocus
                            className="bg-gray-800 border border-gray-700 text-white text-sm rounded px-3 py-2 outline-none focus:border-blue-500 transition-all"
                        />
                        <div className="flex justify-end gap-2 mt-1">
                            <button
                                onClick={() => setShowCreateInput(false)}
                                className="text-xs text-gray-400 hover:text-white px-2 py-1"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreatePlaylist}
                                disabled={!newPlaylistName.trim()}
                                className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded disabled:opacity-50 disabled:cursor-not-allowed"
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
    const [showOptions, setShowOptions] = useState(false);
    const [showPlaylistModal, setShowPlaylistModal] = useState(false);
    const menuRef = useRef(null);

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

        // Close the dropdown menu
        setShowOptions(false);

        // Open the modal
        if (!user) {
            alert("Please login to save playlists");
            return;
        }
        setShowPlaylistModal(true);
    };

    const handleTogglePublish = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            await axiosPrivate.patch(`/video/toggle/publish/${video._id}`);
            // Note: Since this changes data, in a real app you might reload the page
            // or update a global context/state to reflect the "Unpublished" UI immediately.
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
                />
            )}

            <div className="w-full flex flex-col gap-3 cursor-pointer group">
                {/* --- THUMBNAIL SECTION --- */}
                <Link
                    to={`/watch/${_id}`}
                    className="relative w-full aspect-video bg-gray-800 rounded-xl overflow-hidden"
                >
                    <img
                        src={thumbnail}
                        alt={title}
                        className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-200 ${!isPublished ? "opacity-50" : ""}`}
                    />
                    <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                        {formatDuration(duration)}
                    </span>
                    {!isPublished && (
                        <span className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded font-bold">
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
                            className="w-9 h-9 rounded-full object-cover bg-gray-700"
                        />
                    </Link>

                    <div className="flex flex-col flex-1">
                        <div className="flex justify-between items-start">
                            <Link to={`/watch/${_id}`} className="flex-1">
                                <h3 className="text-white font-semibold leading-snug line-clamp-2 group-hover:text-blue-400">
                                    {title}
                                </h3>
                            </Link>

                            {/* --- MENU BUTTON --- */}
                            <div className="relative ml-2" ref={menuRef}>
                                <button
                                    onClick={handleToggleMenu}
                                    className="text-white hover:bg-gray-700 p-1 rounded-full transition-colors focus:outline-none"
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
                                    <div className="absolute right-0 top-8 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50 w-48 py-2 flex flex-col">
                                        <button
                                            onClick={handleAddToPlaylistClick}
                                            className="text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 hover:text-white flex items-center gap-2"
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
                                            <button
                                                onClick={handleTogglePublish}
                                                className={`text-left px-4 py-2 text-sm hover:bg-gray-700 flex items-center gap-2 ${isPublished ? "text-red-400 hover:text-red-300" : "text-green-400 hover:text-green-300"}`}
                                            >
                                                {isPublished
                                                    ? "Unpublish"
                                                    : "Publish"}
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        <Link
                            to={`/c/${owner?.username}`}
                            className="text-gray-400 text-sm hover:text-white mt-1"
                        >
                            {owner?.fullName}
                        </Link>
                        <div className="text-gray-400 text-sm">
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
