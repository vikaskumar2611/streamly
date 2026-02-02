// pages/Home.jsx
import React, { useState, useEffect } from "react";
import VideoGrid from "../../components/VideoGrid";
import Pagination from "../../components/Pagination";
import useAxiosPrivate from "../../hooks/useAxiosPrivate.hooks";

const Home = () => {
    const axiosPrivate = useAxiosPrivate();
    const [videos, setVideos] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const fetchVideos = async () => {
            setLoading(true);
            try {
                const response = await axiosPrivate.get("/video", {
                    params: {
                        query: "",
                        page: currentPage,
                        limit: 12,
                        sortBy: "createdAt",
                        sortType: "desc",
                    },
                });

                setVideos(response.data.data.videos);
                setPagination(response.data.data.pagination);
            } catch (err) {
                console.error("Failed to fetch videos:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchVideos();
    }, [currentPage]);

    return (
        <div>
            <h1 className="text-2xl font-bold text-white mb-6">
                Recommended Videos
            </h1>

            <VideoGrid
                videos={videos}
                layout="grid"
                loading={loading}
                columns={4}
                emptyMessage="No videos available"
            />

            {pagination && (
                <Pagination
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                    hasNextPage={pagination.hasNextPage}
                    hasPrevPage={pagination.hasPrevPage}
                    onPageChange={(page) => {
                        setCurrentPage(page);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                />
            )}
        </div>
    );
};

export default Home;
