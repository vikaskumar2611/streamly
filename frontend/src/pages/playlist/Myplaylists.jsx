import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import useAuth from "../../hooks/useAuth.hooks.js";
import useAxiosPrivate from "../../hooks/useAxiosPrivate.hooks.js";
import { selectTheme } from "../../features/theme/themeSlice";
import { Plus, Lock, Globe, Trash2, ListVideo, X } from "lucide-react";

const MyPlaylists = () => {
    const { user } = useAuth();
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const theme = useSelector(selectTheme);
    const isDark = theme === "dark";

    // Theme configuration object
    const themeStyles = {
        dark: {
            background: "bg-gray-900",
            text: "text-white",
            textMuted: "text-gray-400",
            textFaded: "text-gray-500",
            border: "border-gray-800",
            card: "bg-gray-900 border-gray-800",
            cardHover: "hover:shadow-lg hover:shadow-purple-500/10",
            thumbnail: "bg-gray-800",
            thumbnailOverlay: "bg-black/80",
            emptyCard: "bg-gray-900 border-gray-700",
            emptyIconBg: "bg-gray-800",
            deleteBtn: "text-gray-400 hover:text-red-400",
            loadingBg: "bg-gray-900",
            loadingText: "text-gray-400",
        },
        light: {
            background: "bg-gray-50",
            text: "text-gray-900",
            textMuted: "text-gray-600",
            textFaded: "text-gray-500",
            border: "border-gray-200",
            card: "bg-white border-gray-200",
            cardHover: "hover:shadow-lg hover:shadow-gray-200",
            thumbnail: "bg-gray-200",
            thumbnailOverlay: "bg-black/70",
            emptyCard: "bg-white border-gray-300",
            emptyIconBg: "bg-gray-100",
            deleteBtn: "text-gray-400 hover:text-red-500",
            loadingBg: "bg-gray-50",
            loadingText: "text-gray-500",
        },
    };

    const t = isDark ? themeStyles.dark : themeStyles.light;

    const [playlists, setPlaylists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    // Fetch Playlists
    useEffect(() => {
        const fetchPlaylists = async () => {
            if (!user?._id) return;
            try {
                const response = await axiosPrivate.get(
                    `/playlist/user/${user._id}`,
                );
                setPlaylists(response.data.data);
            } catch (error) {
                console.error("Error fetching playlists:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPlaylists();
    }, [user, axiosPrivate]);

    // Handle Create New Playlist
    const handleCreatePlaylist = async (formData) => {
        try {
            const response = await axiosPrivate.post("/playlist", formData);
            setPlaylists([response.data.data, ...playlists]);
            setIsCreateModalOpen(false);
        } catch (error) {
            console.error("Error creating playlist:", error);
            alert("Failed to create playlist");
        }
    };

    // Handle Delete Playlist
    const handleDeletePlaylist = async (e, playlistId) => {
        e.stopPropagation();
        if (!window.confirm("Are you sure you want to delete this playlist?"))
            return;

        try {
            await axiosPrivate.delete(`/playlist/${playlistId}`);
            setPlaylists((prev) => prev.filter((p) => p._id !== playlistId));
        } catch (error) {
            console.error("Error deleting playlist:", error);
        }
    };

    if (loading) {
        return (
            <div
                className={`min-h-screen ${t.loadingBg} flex flex-col justify-center items-center transition-colors duration-300`}
            >
                <svg
                    className={`animate-spin h-8 w-8 mb-3 ${t.loadingText}`}
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
                <p className={`${t.loadingText} font-medium`}>
                    Loading playlists...
                </p>
            </div>
        );
    }

    return (
        <div
            className={`min-h-screen ${t.background} p-4 md:p-8 transition-colors duration-300`}
        >
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1
                            className={`text-2xl font-bold ${t.text} flex items-center gap-2 transition-colors duration-300`}
                        >
                            <ListVideo className="text-purple-500" /> My
                            Playlists
                        </h1>
                        <p
                            className={`${t.textMuted} text-sm mt-1 transition-colors duration-300`}
                        >
                            Manage your collections and saved videos
                        </p>
                    </div>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
                    >
                        <Plus className="w-5 h-5" /> Create New Playlist
                    </button>
                </div>

                {/* Playlist Grid */}
                {playlists.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {playlists.map((playlist) => (
                            <div
                                key={playlist._id}
                                onClick={() =>
                                    navigate(`/playlists/${playlist._id}`)
                                }
                                className={`
                                    group rounded-xl border overflow-hidden transition-all duration-300 cursor-pointer relative
                                    ${t.card} ${t.cardHover}
                                `}
                            >
                                {/* Thumbnail Section */}
                                <div
                                    className={`relative aspect-video ${t.thumbnail} w-full transition-colors duration-300`}
                                >
                                    {playlist.videos &&
                                    playlist.videos.length > 0 ? (
                                        <>
                                            <img
                                                src={
                                                    playlist.videos[0].thumbnail
                                                }
                                                alt={playlist.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                            {/* Video Count Overlay */}
                                            <div
                                                className={`absolute bottom-2 right-2 ${t.thumbnailOverlay} text-white text-xs px-2 py-1 rounded-md flex items-center gap-1`}
                                            >
                                                <ListVideo className="w-3 h-3" />
                                                {playlist.videos.length} videos
                                            </div>
                                        </>
                                    ) : (
                                        <div
                                            className={`flex flex-col items-center justify-center h-full ${t.textMuted}`}
                                        >
                                            <ListVideo className="w-10 h-10 mb-2 opacity-50" />
                                            <span className="text-sm">
                                                Empty Playlist
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Info Section */}
                                <div className="p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3
                                            className={`font-semibold ${t.text} truncate pr-4 text-lg transition-colors duration-300`}
                                        >
                                            {playlist.name}
                                        </h3>
                                        <button
                                            onClick={(e) =>
                                                handleDeletePlaylist(
                                                    e,
                                                    playlist._id,
                                                )
                                            }
                                            className={`${t.deleteBtn} transition-colors p-1`}
                                            title="Delete Playlist"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <p
                                        className={`${t.textMuted} text-sm line-clamp-2 mb-3 h-10 transition-colors duration-300`}
                                    >
                                        {playlist.description ||
                                            "No description provided."}
                                    </p>

                                    <div
                                        className={`flex items-center justify-between text-xs ${t.textFaded} border-t ${t.border} pt-3 transition-colors duration-300`}
                                    >
                                        <span className="flex items-center gap-1">
                                            {playlist.isPublic ? (
                                                <>
                                                    <Globe className="w-3 h-3" />{" "}
                                                    Public
                                                </>
                                            ) : (
                                                <>
                                                    <Lock className="w-3 h-3" />{" "}
                                                    Private
                                                </>
                                            )}
                                        </span>
                                        <span>
                                            Updated{" "}
                                            {new Date(
                                                playlist.updatedAt,
                                            ).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    // Empty State
                    <div
                        className={`flex flex-col items-center justify-center py-20 rounded-xl border border-dashed transition-colors duration-300 ${t.emptyCard}`}
                    >
                        <div
                            className={`${t.emptyIconBg} p-4 rounded-full mb-4 transition-colors duration-300`}
                        >
                            <ListVideo className={`w-8 h-8 ${t.textMuted}`} />
                        </div>
                        <h3
                            className={`text-lg font-medium ${t.text} transition-colors duration-300`}
                        >
                            No playlists found
                        </h3>
                        <p
                            className={`${t.textMuted} mb-6 transition-colors duration-300`}
                        >
                            Create your first collection of videos.
                        </p>
                        <button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 active:scale-95"
                        >
                            Create Playlist
                        </button>
                    </div>
                )}
            </div>

            {/* Create Playlist Modal */}
            {isCreateModalOpen && (
                <CreatePlaylistModal
                    onClose={() => setIsCreateModalOpen(false)}
                    onSubmit={handleCreatePlaylist}
                    isDark={isDark}
                />
            )}
        </div>
    );
};

// --- Sub Component: Create Modal ---
const CreatePlaylistModal = ({ onClose, onSubmit, isDark }) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [isPublic, setIsPublic] = useState(true);

    // Theme configuration for modal
    const themeStyles = {
        dark: {
            overlay: "bg-black/70",
            modal: "bg-gray-900 border-gray-800",
            header: "border-gray-800",
            title: "text-white",
            closeBtn: "text-gray-400 hover:text-gray-200 hover:bg-gray-800",
            label: "text-gray-300",
            input: "border-gray-700 bg-gray-800 text-white placeholder-gray-500 focus:ring-purple-500 focus:border-purple-500",
            checkbox: "bg-gray-800 border-gray-600",
        },
        light: {
            overlay: "bg-black/50",
            modal: "bg-white border-gray-200",
            header: "border-gray-200",
            title: "text-gray-900",
            closeBtn: "text-gray-500 hover:text-gray-700 hover:bg-gray-100",
            label: "text-gray-700",
            input: "border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:ring-purple-500 focus:border-purple-500",
            checkbox: "bg-white border-gray-300",
        },
    };

    const t = isDark ? themeStyles.dark : themeStyles.light;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name.trim() || !description.trim()) return;
        onSubmit({ name, description, isPublic });
    };

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center ${t.overlay} backdrop-blur-sm p-4`}
        >
            <div
                className={`rounded-xl shadow-2xl w-full max-w-md border transition-colors duration-300 ${t.modal}`}
            >
                {/* Header */}
                <div
                    className={`flex justify-between items-center p-6 border-b ${t.header}`}
                >
                    <h2 className={`text-xl font-bold ${t.title}`}>
                        Create New Playlist
                    </h2>
                    <button
                        onClick={onClose}
                        className={`p-2 rounded-lg transition-colors duration-200 ${t.closeBtn}`}
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Name Input */}
                    <div>
                        <label
                            className={`block text-sm font-medium mb-2 ${t.label}`}
                        >
                            Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter playlist name"
                            className={`w-full px-4 py-2.5 rounded-lg border outline-none transition-all duration-200 focus:ring-2 ${t.input}`}
                            required
                        />
                    </div>

                    {/* Description Input */}
                    <div>
                        <label
                            className={`block text-sm font-medium mb-2 ${t.label}`}
                        >
                            Description <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="What is this playlist about?"
                            className={`w-full px-4 py-2.5 rounded-lg border outline-none transition-all duration-200 focus:ring-2 h-24 resize-none ${t.input}`}
                            required
                        />
                    </div>

                    {/* Public Checkbox */}
                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            id="isPublic"
                            checked={isPublic}
                            onChange={(e) => setIsPublic(e.target.checked)}
                            className={`w-5 h-5 text-purple-600 rounded focus:ring-purple-500 focus:ring-2 cursor-pointer ${t.checkbox}`}
                        />
                        <label
                            htmlFor="isPublic"
                            className={`text-sm font-medium cursor-pointer select-none flex items-center gap-2 ${t.label}`}
                        >
                            {isPublic ? (
                                <Globe className="w-4 h-4 text-green-500" />
                            ) : (
                                <Lock className="w-4 h-4 text-yellow-500" />
                            )}
                            Make this playlist {isPublic ? "public" : "private"}
                        </label>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2.5 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg mt-2"
                    >
                        Create Playlist
                    </button>
                </form>
            </div>
        </div>
    );
};

export default MyPlaylists;
