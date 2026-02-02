import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth.hooks.js";
import useAxiosPrivate from "../../hooks/useAxiosPrivate.hooks.js";
import {
    Play,
    Clock,
    MoreVertical,
    Trash2,
    Edit3,
    Globe,
    Lock,
    Share2,
    X,
    Shuffle,
} from "lucide-react";

const ViewPlaylist = () => {
    const { playlistId } = useParams();
    const { user } = useAuth();
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();

    const [playlist, setPlaylist] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    // Fetch Playlist Data
    useEffect(() => {
        const fetchPlaylist = async () => {
            try {
                const response = await axiosPrivate.get(
                    `/playlist/${playlistId}`,
                );
                setPlaylist(response.data.data);
            } catch (error) {
                console.error("Error fetching playlist:", error);
                // navigate("/playlists"); // Optional: redirect if not found
            } finally {
                setLoading(false);
            }
        };

        if (playlistId) fetchPlaylist();
    }, [playlistId, axiosPrivate]);

    // Derived State (Stats)
    const stats = useMemo(() => {
        if (!playlist?.videos) return { views: 0, duration: 0 };
        return playlist.videos.reduce(
            (acc, video) => ({
                views: acc.views + (video.views || 0),
                duration: acc.duration + (video.duration || 0),
            }),
            { views: 0, duration: 0 },
        );
    }, [playlist]);

    const isOwner = user?._id === playlist?.owner;

    // --- Handlers ---

    // 1. Delete Playlist
    const handleDeletePlaylist = async () => {
        if (
            !window.confirm(
                "Are you sure you want to delete this entire playlist?",
            )
        )
            return;
        try {
            await axiosPrivate.delete(`/playlist/${playlistId}`);
            navigate("/playlists");
        } catch (error) {
            console.error("Error deleting playlist:", error);
        }
    };

    // 2. Remove Video from Playlist
    const handleRemoveVideo = async (videoId) => {
        try {
            // Route: /playlist/remove/:videoId/:playlistId
            await axiosPrivate.patch(
                `/playlist/remove/${videoId}/${playlistId}`,
            );

            // Update UI locally
            setPlaylist((prev) => ({
                ...prev,
                videos: prev.videos.filter((v) => v._id !== videoId),
            }));
        } catch (error) {
            console.error("Error removing video:", error);
        }
    };

    // 3. Toggle Public/Private
    const handleToggleStatus = async () => {
        try {
            const response = await axiosPrivate.patch(
                `/playlist/toggle/status/${playlistId}`,
            );
            setPlaylist((prev) => ({
                ...prev,
                isPublic: response.data.data.isPublic,
            }));
        } catch (error) {
            console.error("Error toggling status:", error);
        }
    };

    // 4. Update Playlist Details (Passed to Modal)
    const handleUpdatePlaylist = async (formData) => {
        try {
            const response = await axiosPrivate.patch(
                `/playlist/${playlistId}`,
                formData,
            );
            setPlaylist((prev) => ({
                ...prev,
                name: response.data.data.name,
                description: response.data.data.description,
            }));
            setIsEditModalOpen(false);
        } catch (error) {
            console.error("Error updating playlist:", error);
        }
    };

    // Helpers
    const formatDuration = (seconds) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        return hrs > 0 ? `${hrs}h ${mins}m` : `${mins} mins`;
    };

    if (loading)
        return (
            <div className="p-8 text-center text-white">
                Loading Playlist...
            </div>
        );
    if (!playlist)
        return (
            <div className="p-8 text-center text-white">
                Playlist not found.
            </div>
        );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black p-4 md:p-8">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Playlist Info Card */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 sticky top-24">
                        {/* Thumbnail Cover */}
                        <div className="aspect-video rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-800 relative group mb-6 shadow-lg">
                            {playlist.videos.length > 0 ? (
                                <img
                                    src={playlist.videos[0].thumbnail}
                                    alt="Playlist Cover"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-500">
                                    No Videos
                                </div>
                            )}
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                                <button className="bg-white/90 text-black px-6 py-2 rounded-full font-bold flex items-center gap-2 hover:bg-white hover:scale-105 transition-all">
                                    <Play className="w-4 h-4 fill-current" />{" "}
                                    Play All
                                </button>
                            </div>
                        </div>

                        {/* Text Details */}
                        <div className="space-y-4">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white break-words">
                                    {playlist.name}
                                </h1>
                                <div className="flex items-center gap-2 mt-2 text-sm text-gray-500 dark:text-gray-400">
                                    <span className="font-medium text-gray-900 dark:text-white">
                                        {playlist.owner === user?._id
                                            ? "You"
                                            : "User"}
                                        {/* Since aggregation didn't populate playlist owner name, only video owners, we use generic or check ID */}
                                    </span>
                                    <span>•</span>
                                    <span>{playlist.videos.length} videos</span>
                                    <span>•</span>
                                    <span>
                                        Updated{" "}
                                        {new Date(
                                            playlist.updatedAt,
                                        ).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>

                            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                                {playlist.description ||
                                    "No description provided."}
                            </p>

                            {/* Stats Row */}
                            <div className="flex items-center justify-between py-4 border-t border-b border-gray-100 dark:border-gray-800">
                                <div className="text-center">
                                    <p className="text-xs text-gray-500 uppercase font-semibold">
                                        Total Views
                                    </p>
                                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                                        {stats.views.toLocaleString()}
                                    </p>
                                </div>
                                <div className="w-px h-8 bg-gray-200 dark:bg-gray-800"></div>
                                <div className="text-center">
                                    <p className="text-xs text-gray-500 uppercase font-semibold">
                                        Duration
                                    </p>
                                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                                        {formatDuration(stats.duration)}
                                    </p>
                                </div>
                                <div className="w-px h-8 bg-gray-200 dark:bg-gray-800"></div>
                                <div className="text-center">
                                    <p className="text-xs text-gray-500 uppercase font-semibold">
                                        Visibility
                                    </p>
                                    <div className="flex items-center gap-1 justify-center text-lg font-bold text-gray-900 dark:text-white">
                                        {playlist.isPublic ? (
                                            <Globe className="w-4 h-4" />
                                        ) : (
                                            <Lock className="w-4 h-4" />
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons (Owner Only) */}
                            {isOwner && (
                                <div className="grid grid-cols-2 gap-3 pt-2">
                                    <button
                                        onClick={() => setIsEditModalOpen(true)}
                                        className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-lg text-sm font-medium transition-colors"
                                    >
                                        <Edit3 className="w-4 h-4" /> Edit
                                    </button>
                                    <button
                                        onClick={handleToggleStatus}
                                        className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
                                            playlist.isPublic
                                                ? "border-green-200 bg-green-50 text-green-700 dark:bg-green-900/20 dark:border-green-900 dark:text-green-400"
                                                : "border-orange-200 bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:border-orange-900 dark:text-orange-400"
                                        }`}
                                    >
                                        {playlist.isPublic
                                            ? "Public"
                                            : "Private"}
                                    </button>
                                    <button
                                        onClick={handleDeletePlaylist}
                                        className="col-span-2 flex items-center justify-center gap-2 px-4 py-2 border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/10 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-900/30 rounded-lg text-sm font-medium transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" /> Delete
                                        Playlist
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column: Video List */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                            Videos
                        </h2>
                        <button className="text-sm font-medium text-purple-600 dark:text-purple-400 flex items-center gap-1 hover:underline">
                            <Shuffle className="w-4 h-4" /> Shuffle Play
                        </button>
                    </div>

                    {playlist.videos.length > 0 ? (
                        <div className="space-y-3">
                            {playlist.videos.map((video, index) => (
                                <div
                                    key={video._id}
                                    className="group flex flex-col sm:flex-row gap-4 p-3 bg-white dark:bg-gray-900 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/60 border border-transparent hover:border-gray-200 dark:hover:border-gray-800 transition-all"
                                >
                                    {/* Index Number */}
                                    <div className="hidden sm:flex items-center justify-center w-8 text-gray-400 font-medium">
                                        {index + 1}
                                    </div>

                                    {/* Thumbnail */}
                                    <div
                                        className="relative w-full sm:w-40 aspect-video rounded-lg overflow-hidden flex-shrink-0 cursor-pointer"
                                        onClick={() =>
                                            navigate(`/video/${video._id}`)
                                        }
                                    >
                                        <img
                                            src={video.thumbnail}
                                            alt={video.title}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute bottom-1 right-1 bg-black/80 text-white text-[10px] px-1.5 py-0.5 rounded">
                                            {formatDuration(video.duration)}
                                        </div>
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                                        <h3
                                            className="text-base font-semibold text-gray-900 dark:text-white truncate cursor-pointer hover:text-purple-500"
                                            onClick={() =>
                                                navigate(`/video/${video._id}`)
                                            }
                                        >
                                            {video.title}
                                        </h3>
                                        <div className="flex items-center gap-2 mt-1 text-sm text-gray-500 dark:text-gray-400">
                                            <span>
                                                {video.owner?.fullName ||
                                                    "Unknown"}
                                            </span>
                                            <span className="w-1 h-1 rounded-full bg-gray-400"></span>
                                            <span>{video.views} views</span>
                                            <span className="w-1 h-1 rounded-full bg-gray-400"></span>
                                            <span>
                                                {new Date(
                                                    video.createdAt,
                                                ).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Options (Remove) */}
                                    {isOwner && (
                                        <div className="flex items-center sm:opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() =>
                                                    handleRemoveVideo(video._id)
                                                }
                                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                                                title="Remove from playlist"
                                            >
                                                <X className="w-5 h-5" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
                            <p className="text-gray-500 dark:text-gray-400">
                                No videos in this playlist yet.
                            </p>
                            <button
                                onClick={() => navigate("/home")}
                                className="mt-4 text-purple-600 hover:underline"
                            >
                                Explore Videos
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Edit Playlist Modal */}
            {isEditModalOpen && (
                <EditPlaylistModal
                    currentData={playlist}
                    onClose={() => setIsEditModalOpen(false)}
                    onSubmit={handleUpdatePlaylist}
                />
            )}
        </div>
    );
};

// --- Sub Component: Edit Modal ---
const EditPlaylistModal = ({ currentData, onClose, onSubmit }) => {
    const [name, setName] = useState(currentData.name);
    const [description, setDescription] = useState(currentData.description);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ name, description });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-md border border-gray-200 dark:border-gray-800">
                <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-800">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        Edit Playlist
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-black text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Description
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-black text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none h-24 resize-none"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2.5 rounded-lg transition-colors mt-2"
                    >
                        Save Changes
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ViewPlaylist;
