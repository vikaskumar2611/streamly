// components/Pagination.jsx
import React from "react";

const Pagination = ({
    currentPage,
    totalPages,
    hasNextPage,
    hasPrevPage,
    onPageChange,
}) => {
    if (totalPages <= 1) return null;

    const getPageNumbers = () => {
        const pages = [];
        const showPages = 5; // Number of page buttons to show

        let start = Math.max(1, currentPage - Math.floor(showPages / 2));
        let end = Math.min(totalPages, start + showPages - 1);

        if (end - start + 1 < showPages) {
            start = Math.max(1, end - showPages + 1);
        }

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        return pages;
    };

    return (
        <div className="flex items-center justify-center gap-2 mt-8">
            {/* Previous Button */}
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={!hasPrevPage}
                className={`px-3 py-2 rounded-lg transition-colors ${
                    hasPrevPage
                        ? "bg-gray-700 hover:bg-gray-600 text-white"
                        : "bg-gray-800 text-gray-500 cursor-not-allowed"
                }`}
            >
                ← Prev
            </button>

            {/* Page Numbers */}
            <div className="flex gap-1">
                {getPageNumbers().map((page) => (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`w-10 h-10 rounded-lg transition-colors ${
                            page === currentPage
                                ? "bg-blue-600 text-white"
                                : "bg-gray-700 hover:bg-gray-600 text-white"
                        }`}
                    >
                        {page}
                    </button>
                ))}
            </div>

            {/* Next Button */}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={!hasNextPage}
                className={`px-3 py-2 rounded-lg transition-colors ${
                    hasNextPage
                        ? "bg-gray-700 hover:bg-gray-600 text-white"
                        : "bg-gray-800 text-gray-500 cursor-not-allowed"
                }`}
            >
                Next →
            </button>
        </div>
    );
};

export default Pagination;
