// pages/core/Watch.jsx
import { useParams, Link } from "react-router-dom";
import { useEffect, useState, useRef, useCallback } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate.hooks";
import useAuth from "../../hooks/useAuth.hooks";
import PlaylistModal from "../../components/PlaylistModal.jsx";
import Icons from "../../components/watch/Icons.jsx";
import VideoPlayer from "../../components/watch/VideoPlayer.jsx";
import VideoActions from "../../components/watch/VideoActions.jsx";
import ChannelInfo from "../../components/watch/ChannelInfo.jsx";
import VideoDescription from "../../components/watch/VideoDescription.jsx";
import CommentItem from "../../components/watch/CommentItem.jsx";
import CommentSection from "../../components/watch/CommentSection.jsx";

const Watch = () => {
    const axiosPrivate = useAxiosPrivate();
    const { auth } = useAuth();
    const { videoId } = useParams();

    const [video, setVideo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const controller = new AbortController();

        const fetchVideo = async () => {
            try {
                setLoading(true);
                const res = await axiosPrivate.get(`/video/${videoId}`, {
                    signal: controller.signal,
                });
                setVideo(res.data.data);
            } catch (err) {
                if (err.name !== "CanceledError") {
                    setError("Failed to load video");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchVideo();
        return () => controller.abort();
    }, [videoId, axiosPrivate]);

    if (loading) {
        return (
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-zinc-400">Loading video...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-400 text-xl mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (!video) {
        return (
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
                <p className="text-zinc-400 text-xl">Video not found</p>
            </div>
        );
    }

    // Resolve avatar at top level to pass down
    const currentUserAvatar = auth?.user?.avatar || auth?.avatar;

    return (
        <div className="min-h-screen bg-zinc-950">
            <div className="max-w-[1400px] mx-auto p-4 lg:p-6">
                <div className="max-w-[1280px] mx-auto">
                    <VideoPlayer video={video} />

                    <h1 className="text-xl lg:text-2xl font-bold text-white mt-4 leading-tight">
                        {video.title}
                    </h1>

                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mt-4">
                        <ChannelInfo
                            owner={video.owner}
                            currentUserId={auth?.user?._id || auth?._id}
                        />
                        <VideoActions video={video} videoId={videoId} />
                    </div>

                    <VideoDescription video={video} />

                    <CommentSection
                        videoId={videoId}
                        userAvatar={currentUserAvatar}
                    />
                </div>
            </div>
        </div>
    );
};

export default Watch;
