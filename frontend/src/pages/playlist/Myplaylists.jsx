import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth.hooks.js";
import useAxiosPrivate from "../../hooks/useAxiosPrivate.hooks.js";
import {
    Plus,
    Lock,
    Globe,
    Trash2,
    ListVideo,
    MoreVertical,
    X,
} from "lucide-react";

const MyPlaylists = () => {
    const { user } = useAuth();
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();

    const [playlists, setPlaylists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    // Fetch Playlists
    useEffect(() => {
        const fetchPlaylists = async () => {
            if (!user?._id) return;
            try {
                // Mapping to: router.route("/user/:userId").get(getUserPlaylists);
                // Assuming base route is /playlist or /playlists
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
            // Add the new playlist to the top of the list
            setPlaylists([response.data.data, ...playlists]);
            setIsCreateModalOpen(false);
        } catch (error) {
            console.error("Error creating playlist:", error);
            alert("Failed to create playlist");
        }
    };

    // Handle Delete Playlist
    const handleDeletePlaylist = async (e, playlistId) => {
        e.stopPropagation(); // Prevent navigating to the playlist
        if (!window.confirm("Are you sure you want to delete this playlist?"))
            return;

        try {
            await axiosPrivate.delete(`/playlist/${playlistId}`);
            setPlaylists((prev) => prev.filter((p) => p._id !== playlistId));
        } catch (error) {
            console.error("Error deleting playlist:", error);
        }
    };

    if (loading)
        return (
            <div className="text-center p-8 text-white">
                Loading playlists...
            </div>
        );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black p-4 md:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <ListVideo className="text-purple-500" /> My
                            Playlists
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                            Manage your collections and saved videos
                        </p>
                    </div>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
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
                                className="group bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-lg transition-all cursor-pointer relative"
                            >
                                {/* Thumbnail Section */}
                                <div className="relative aspect-video bg-gray-200 dark:bg-gray-800 w-full">
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
                                            <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded-md flex items-center gap-1">
                                                <ListVideo className="w-3 h-3" />
                                                {playlist.videos.length} videos
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-full text-gray-400">
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
                                        <h3 className="font-semibold text-gray-900 dark:text-white truncate pr-4 text-lg">
                                            {playlist.name}
                                        </h3>
                                        <button
                                            onClick={(e) =>
                                                handleDeletePlaylist(
                                                    e,
                                                    playlist._id,
                                                )
                                            }
                                            className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                            title="Delete Playlist"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 mb-3 h-10">
                                        {playlist.description ||
                                            "No description provided."}
                                    </p>

                                    <div className="flex items-center justify-between text-xs text-gray-400 border-t border-gray-100 dark:border-gray-800 pt-3">
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
                    <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-gray-900 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
                        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-full mb-4">
                            <ListVideo className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                            No playlists found
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">
                            Create your first collection of videos.
                        </p>
                        <button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
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
                />
            )}
        </div>
    );
};

// --- Sub Component: Create Modal ---
const CreatePlaylistModal = ({ onClose, onSubmit }) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [isPublic, setIsPublic] = useState(true);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name.trim() || !description.trim()) return;
        onSubmit({ name, description, isPublic });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-md border border-gray-200 dark:border-gray-800">
                <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-800">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        Create New Playlist
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
                            Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter playlist name"
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-black text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Description <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="What is this playlist about?"
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-black text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none h-24 resize-none"
                            required
                        />
                    </div>

                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            id="isPublic"
                            checked={isPublic}
                            onChange={(e) => setIsPublic(e.target.checked)}
                            className="w-5 h-5 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                        />
                        <label
                            htmlFor="isPublic"
                            className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer select-none"
                        >
                            Make this playlist public
                        </label>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2.5 rounded-lg transition-colors mt-2"
                    >
                        Create Playlist
                    </button>
                </form>
            </div>
        </div>
    );
};

export default MyPlaylists;
