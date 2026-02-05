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
            if (!userId) {
                console.log("No userId provided, skipping fetch");
                setLoading(false); // <-- ADD THIS LINE to stop infinite loading
                return;
            }
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

export default PlaylistModal;
