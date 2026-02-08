import { useEffect, useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate.hooks";
import useAuth from "../../hooks/useAuth.hooks";
import PlaylistModal from "../PlaylistModal.jsx";
import Icons from "./Icons";

const VideoActions = ({ video, videoId }) => {
    const axiosPrivate = useAxiosPrivate();
    const { auth } = useAuth();
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
                        className={`flex items-center gap-2 px-4 py-2 rounded-full hover:bg-zinc-700 transition-colors ${
                            isLiked ? "text-blue-400" : "text-white"
                        } disabled:opacity-50`}
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
                    userId={auth?.user?._id}
                    onClose={() => setShowPlaylistModal(false)}
                />
            )}
        </>
    );
};

export default VideoActions;
