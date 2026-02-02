import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate.hooks"; // Adjust path to your axios instance
import VideoCard from "../../components/VideoCard"; // Adjust path
import Loading from "../../components/Loading"; // Adjust path

const SearchResults = () => {
    const axiosPrivate = useAxiosPrivate();
    const [searchParams] = useSearchParams();
    const query = searchParams.get("q"); // Reads "?q=..." from URL

    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchVideos = async () => {
            if (!query) return;

            setLoading(true);
            setError(false);

            try {
                // Calls your backend 'getAllVideos' controller
                // Endpoint: GET /videos?query=someText
                const response = await axiosPrivate.get("/video", {
                    params: {
                        query: query,
                        page: 1,
                        limit: 20,
                    },
                });

                // Based on your backend response structure:
                // res.status(200).json(new ApiResponse(200, { videos, pagination... }))
                setVideos(response.data.data.videos);
            } catch (err) {
                console.error("Search error:", err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchVideos();
    }, [query]); // Re-run when URL query changes

    if (loading) return <Loading fullScreen={false} />;

    return (
        <div className="p-4 w-full">
            <h2 className="text-xl font-bold mb-4 text-white">
                Results for "{query}"
            </h2>

            {error && (
                <p className="text-red-400">Something went wrong searching.</p>
            )}

            {/* Empty State */}
            {!loading && videos.length === 0 && (
                <p className="text-gray-400">
                    No videos found matching your search.
                </p>
            )}

            {/* Grid of VideoCards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {videos.map((video) => (
                    <VideoCard key={video._id} video={video} />
                ))}
            </div>
        </div>
    );
};

export default SearchResults;
