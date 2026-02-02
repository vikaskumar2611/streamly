import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate.hooks";

const Watch = () => {
    const axiosPrivate = useAxiosPrivate();
    const { videoId } = useParams();

    const [video, setVideo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const controller = new AbortController();

        const fetchVideo = async () => {
            try {
                setLoading(true);
                const res = await axiosPrivate.get(`video/${videoId}`, {
                    signal: controller.signal,
                });
                console.log(res.data.data);
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
    }, [videoId]);

    if (loading) return <p className="p-4">Loading video...</p>;
    if (error) return <p className="p-4 text-red-400">{error}</p>;
    if (!video) return <p className="p-4">Video not found</p>;

    return (
        <div className="p-4 max-w-6xl mx-auto">
            {/* Video Player */}
            <video
                controls
                autoPlay
                muted // Remember to add muted for autoplay to work
                // Change: Added max-h-[70vh] (70% of screen height) and object-contain
                className="w-full max-h-[70vh] object-contain rounded-lg bg-black shadow-lg"
                src={video.videoFile}
                poster={video.thumbnail}
            />

            {/* Video Info */}
            <h1 className="text-xl font-bold mt-4">{video.title}</h1>

            <p className="text-gray-400 text-sm">
                {video.views?.toLocaleString()} views •{" "}
                {new Date(video.createdAt).toLocaleDateString()}
            </p>

            {/* Channel */}
            <div className="mt-3 font-semibold">{video.owner?.fullName}</div>

            {/* Description */}
            <div className="mt-4 bg-gray-800 p-3 rounded">
                <p className="text-sm whitespace-pre-line">
                    {video.description}
                </p>
            </div>
        </div>
    );
};

export default Watch;
