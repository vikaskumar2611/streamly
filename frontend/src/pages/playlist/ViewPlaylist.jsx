import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import useAuth from "../../hooks/useAuth.hooks.js";
import useAxiosPrivate from "../../hooks/useAxiosPrivate.hooks.js";
import { selectTheme } from "../../features/theme/themeSlice";
import { Clock, Trash2, Edit3, Globe, Lock, X } from "lucide-react";

const ViewPlaylist = () => {
    const { playlistId } = useParams();
    const { user } = useAuth();
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const theme = useSelector(selectTheme);
    const isDark = theme === "dark";

    const [playlist, setPlaylist] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const themeStyles = {
        dark: {
            page: "bg-black",
            card: "bg-gray-900 border-gray-800",
            cardHover: "hover:bg-gray-800/60 hover:border-gray-800",
            text: "text-white",
            textSecondary: "text-gray-300",
            textMuted: "text-gray-400",
            textFaded: "text-gray-500",
            border: "border-gray-800",
            borderLight: "border-gray-700",
            divider: "bg-gray-800",
            button: "bg-gray-800 hover:bg-gray-700 text-white",
            buttonSecondary: "bg-gray-700 hover:bg-gray-600 text-white",
            thumbnail: "bg-gray-800",
            statsLabel: "text-gray-500",
            indexNumber: "text-gray-400",
            duration: "bg-black/80 text-white",
            dot: "bg-gray-400",
            emptyState: "bg-gray-900 border-gray-700",
            publicBadge: "border-green-900 bg-green-900/20 text-green-400",
            privateBadge: "border-orange-900 bg-orange-900/20 text-orange-400",
            deleteButton:
                "border-red-900 bg-red-900/10 text-red-400 hover:bg-red-900/30",
            removeButton:
                "text-gray-400 hover:text-red-500 hover:bg-red-900/20",
            link: "text-purple-400 hover:text-purple-300",
            overlay: "bg-black/60",
            modal: "bg-gray-900 border-gray-800",
            input: "border-gray-700 bg-black text-white",
            inputLabel: "text-gray-300",
        },
        light: {
            page: "bg-gray-50",
            card: "bg-white border-gray-200",
            cardHover: "hover:bg-gray-50 hover:border-gray-200",
            text: "text-gray-900",
            textSecondary: "text-gray-600",
            textMuted: "text-gray-500",
            textFaded: "text-gray-400",
            border: "border-gray-200",
            borderLight: "border-gray-100",
            divider: "bg-gray-200",
            button: "bg-gray-100 hover:bg-gray-200 text-gray-900",
            buttonSecondary: "bg-gray-200 hover:bg-gray-300 text-gray-900",
            thumbnail: "bg-gray-200",
            statsLabel: "text-gray-500",
            indexNumber: "text-gray-400",
            duration: "bg-black/80 text-white",
            dot: "bg-gray-400",
            emptyState: "bg-white border-gray-300",
            publicBadge: "border-green-200 bg-green-50 text-green-700",
            privateBadge: "border-orange-200 bg-orange-50 text-orange-700",
            deleteButton:
                "border-red-200 bg-red-50 text-red-600 hover:bg-red-100",
            removeButton: "text-gray-400 hover:text-red-500 hover:bg-red-50",
            link: "text-purple-600 hover:text-purple-700",
            overlay: "bg-black/40",
            modal: "bg-white border-gray-200",
            input: "border-gray-300 bg-white text-gray-900",
            inputLabel: "text-gray-700",
        },
    };

    const t = isDark ? themeStyles.dark : themeStyles.light;

    useEffect(() => {
        const fetchPlaylist = async () => {
            try {
                const response = await axiosPrivate.get(
                    `/playlist/${playlistId}`,
                );
                setPlaylist(response.data.data);
            } catch (error) {
                console.error("Error fetching playlist:", error);
            } finally {
                setLoading(false);
            }
        };

        if (playlistId) fetchPlaylist();
    }, [playlistId, axiosPrivate]);

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

    const handleRemoveVideo = async (videoId) => {
        try {
            await axiosPrivate.patch(
                `/playlist/remove/${videoId}/${playlistId}`,
            );
            setPlaylist((prev) => ({
                ...prev,
                videos: prev.videos.filter((v) => v._id !== videoId),
            }));
        } catch (error) {
            console.error("Error removing video:", error);
        }
    };

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

    const formatDuration = (seconds) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        return hrs > 0 ? `${hrs}h ${mins}m` : `${mins} mins`;
    };

    if (loading)
        return (
            <div className={`p-8 text-center ${t.text} ${t.page} min-h-screen`}>
                Loading Playlist...
            </div>
        );
    if (!playlist)
        return (
            <div className={`p-8 text-center ${t.text} ${t.page} min-h-screen`}>
                Playlist not found.
            </div>
        );

    return (
        <div className={`min-h-screen ${t.page} p-4 md:p-8`}>
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Playlist Info Card */}
                <div className="lg:col-span-1 space-y-6">
                    <div
                        className={`${t.card} rounded-2xl p-6 border sticky top-24`}
                    >
                        {/* Thumbnail Cover */}
                        <div
                            className={`aspect-video rounded-xl overflow-hidden ${t.thumbnail} mb-6 shadow-lg`}
                        >
                            {playlist.videos.length > 0 ? (
                                <img
                                    src={playlist.videos[0].thumbnail}
                                    alt="Playlist Cover"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div
                                    className={`flex items-center justify-center h-full ${t.textMuted}`}
                                >
                                    No Videos
                                </div>
                            )}
                        </div>

                        {/* Text Details */}
                        <div className="space-y-4">
                            <div>
                                <h1
                                    className={`text-2xl font-bold ${t.text} break-words`}
                                >
                                    {playlist.name}
                                </h1>
                                <div
                                    className={`flex items-center gap-2 mt-2 text-sm ${t.textMuted}`}
                                >
                                    <span className={`font-medium ${t.text}`}>
                                        {playlist.owner === user?._id
                                            ? "You"
                                            : "User"}
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

                            <p
                                className={`${t.textSecondary} text-sm leading-relaxed`}
                            >
                                {playlist.description ||
                                    "No description provided."}
                            </p>

                            {/* Stats Row */}
                            <div
                                className={`flex items-center justify-between py-4 border-t border-b ${t.borderLight}`}
                            >
                                <div className="text-center">
                                    <p
                                        className={`text-xs ${t.statsLabel} uppercase font-semibold`}
                                    >
                                        Total Views
                                    </p>
                                    <p
                                        className={`text-lg font-bold ${t.text}`}
                                    >
                                        {stats.views.toLocaleString()}
                                    </p>
                                </div>
                                <div className={`w-px h-8 ${t.divider}`}></div>
                                <div className="text-center">
                                    <p
                                        className={`text-xs ${t.statsLabel} uppercase font-semibold`}
                                    >
                                        Duration
                                    </p>
                                    <p
                                        className={`text-lg font-bold ${t.text}`}
                                    >
                                        {formatDuration(stats.duration)}
                                    </p>
                                </div>
                                <div className={`w-px h-8 ${t.divider}`}></div>
                                <div className="text-center">
                                    <p
                                        className={`text-xs ${t.statsLabel} uppercase font-semibold`}
                                    >
                                        Visibility
                                    </p>
                                    <div
                                        className={`flex items-center gap-1 justify-center text-lg font-bold ${t.text}`}
                                    >
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
                                        className={`flex items-center justify-center gap-2 px-4 py-2 ${t.button} rounded-lg text-sm font-medium transition-colors`}
                                    >
                                        <Edit3 className="w-4 h-4" /> Edit
                                    </button>
                                    <button
                                        onClick={handleToggleStatus}
                                        className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
                                            playlist.isPublic
                                                ? t.publicBadge
                                                : t.privateBadge
                                        }`}
                                    >
                                        {playlist.isPublic
                                            ? "Public"
                                            : "Private"}
                                    </button>
                                    <button
                                        onClick={handleDeletePlaylist}
                                        className={`col-span-2 flex items-center justify-center gap-2 px-4 py-2 border ${t.deleteButton} rounded-lg text-sm font-medium transition-colors`}
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
                    <div className="mb-4">
                        <h2 className={`text-xl font-bold ${t.text}`}>
                            Videos
                        </h2>
                    </div>

                    {playlist.videos.length > 0 ? (
                        <div className="space-y-3">
                            {playlist.videos.map((video, index) => (
                                <div
                                    key={video._id}
                                    className={`group flex flex-col sm:flex-row gap-4 p-3 ${t.card} rounded-xl ${t.cardHover} border border-transparent transition-all`}
                                >
                                    {/* Index Number */}
                                    <div
                                        className={`hidden sm:flex items-center justify-center w-8 ${t.indexNumber} font-medium`}
                                    >
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
                                        <div
                                            className={`absolute bottom-1 right-1 ${t.duration} text-[10px] px-1.5 py-0.5 rounded`}
                                        >
                                            {formatDuration(video.duration)}
                                        </div>
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                                        <h3
                                            className={`text-base font-semibold ${t.text} truncate cursor-pointer hover:text-purple-500`}
                                            onClick={() =>
                                                navigate(`/video/${video._id}`)
                                            }
                                        >
                                            {video.title}
                                        </h3>
                                        <div
                                            className={`flex items-center gap-2 mt-1 text-sm ${t.textMuted}`}
                                        >
                                            <span>
                                                {video.owner?.fullName ||
                                                    "Unknown"}
                                            </span>
                                            <span
                                                className={`w-1 h-1 rounded-full ${t.dot}`}
                                            ></span>
                                            <span>{video.views} views</span>
                                            <span
                                                className={`w-1 h-1 rounded-full ${t.dot}`}
                                            ></span>
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
                                                className={`p-2 ${t.removeButton} rounded-full transition-colors`}
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
                        <div
                            className={`text-center py-12 ${t.emptyState} rounded-xl border border-dashed`}
                        >
                            <p className={t.textMuted}>
                                No videos in this playlist yet.
                            </p>
                            <button
                                onClick={() => navigate("/home")}
                                className={`mt-4 ${t.link}`}
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
                    themeStyles={t}
                />
            )}
        </div>
    );
};

// --- Sub Component: Edit Modal ---
const EditPlaylistModal = ({ currentData, onClose, onSubmit, themeStyles }) => {
    const [name, setName] = useState(currentData.name);
    const [description, setDescription] = useState(currentData.description);
    const t = themeStyles;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ name, description });
    };

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center ${t.overlay} backdrop-blur-sm p-4`}
        >
            <div
                className={`${t.modal} rounded-xl shadow-2xl w-full max-w-md border`}
            >
                <div
                    className={`flex justify-between items-center p-6 border-b ${t.border}`}
                >
                    <h2 className={`text-xl font-bold ${t.text}`}>
                        Edit Playlist
                    </h2>
                    <button
                        onClick={onClose}
                        className={`${t.textMuted} hover:${t.textSecondary} transition-colors`}
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label
                            className={`block text-sm font-medium ${t.inputLabel} mb-1`}
                        >
                            Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className={`w-full px-4 py-2 rounded-lg border ${t.input} focus:ring-2 focus:ring-purple-500 outline-none transition-all`}
                            required
                        />
                    </div>
                    <div>
                        <label
                            className={`block text-sm font-medium ${t.inputLabel} mb-1`}
                        >
                            Description
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className={`w-full px-4 py-2 rounded-lg border ${t.input} focus:ring-2 focus:ring-purple-500 outline-none h-24 resize-none transition-all`}
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
