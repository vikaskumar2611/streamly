// components/Pagination.jsx
import React from "react";
import { useSelector } from "react-redux";
import { selectTheme } from "../features/theme/themeSlice";

const Pagination = ({
    currentPage,
    totalPages,
    hasNextPage,
    hasPrevPage,
    onPageChange,
}) => {
    const theme = useSelector(selectTheme);
    const isDark = theme === "dark";

    // Theme configuration object
    const themeStyles = {
        dark: {
            container: "bg-transparent",
            button: "bg-gray-700 hover:bg-gray-600 text-white",
            buttonDisabled: "bg-gray-800 text-gray-500 cursor-not-allowed",
            buttonActive: "bg-blue-600 text-white",
            pageButton: "bg-gray-700 hover:bg-gray-600 text-white",
            pageButtonActive:
                "bg-blue-600 text-white shadow-lg shadow-blue-500/25",
            ellipsis: "text-gray-400",
            info: "text-gray-400",
        },
        light: {
            container: "bg-transparent",
            button: "bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 shadow-sm",
            buttonDisabled:
                "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed",
            buttonActive: "bg-blue-600 text-white border border-blue-600",
            pageButton:
                "bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 shadow-sm",
            pageButtonActive:
                "bg-blue-600 text-white border border-blue-600 shadow-lg shadow-blue-500/25",
            ellipsis: "text-gray-500",
            info: "text-gray-600",
        },
    };

    const t = isDark ? themeStyles.dark : themeStyles.light;

    if (totalPages <= 1) return null;

    const getPageNumbers = () => {
        const pages = [];
        const showPages = 5;

        let start = Math.max(1, currentPage - Math.floor(showPages / 2));
        let end = Math.min(totalPages, start + showPages - 1);

        if (end - start + 1 < showPages) {
            start = Math.max(1, end - showPages + 1);
        }

        // Add first page and ellipsis if needed
        if (start > 1) {
            pages.push(1);
            if (start > 2) {
                pages.push("...");
            }
        }

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        // Add last page and ellipsis if needed
        if (end < totalPages) {
            if (end < totalPages - 1) {
                pages.push("...");
            }
            pages.push(totalPages);
        }

        return pages;
    };

    return (
        <div className={`flex flex-col items-center gap-4 mt-8 ${t.container}`}>
            {/* Page Info */}
            <p className={`text-sm ${t.info}`}>
                Page <span className="font-semibold">{currentPage}</span> of{" "}
                <span className="font-semibold">{totalPages}</span>
            </p>

            {/* Pagination Controls */}
            <div className="flex items-center gap-2">
                {/* First Page Button */}
                <button
                    onClick={() => onPageChange(1)}
                    disabled={!hasPrevPage}
                    className={`hidden sm:flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200 ${
                        hasPrevPage ? t.button : t.buttonDisabled
                    }`}
                    title="First page"
                >
                    <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                        />
                    </svg>
                </button>

                {/* Previous Button */}
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={!hasPrevPage}
                    className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 ${
                        hasPrevPage ? t.button : t.buttonDisabled
                    }`}
                >
                    <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 19l-7-7 7-7"
                        />
                    </svg>
                    <span className="hidden sm:inline">Prev</span>
                </button>

                {/* Page Numbers */}
                <div className="flex gap-1">
                    {getPageNumbers().map((page, index) =>
                        page === "..." ? (
                            <span
                                key={`ellipsis-${index}`}
                                className={`w-10 h-10 flex items-center justify-center ${t.ellipsis}`}
                            >
                                •••
                            </span>
                        ) : (
                            <button
                                key={page}
                                onClick={() => onPageChange(page)}
                                className={`w-10 h-10 rounded-lg transition-all duration-200 font-medium ${
                                    page === currentPage
                                        ? t.pageButtonActive
                                        : t.pageButton
                                }`}
                            >
                                {page}
                            </button>
                        ),
                    )}
                </div>

                {/* Next Button */}
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={!hasNextPage}
                    className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 ${
                        hasNextPage ? t.button : t.buttonDisabled
                    }`}
                >
                    <span className="hidden sm:inline">Next</span>
                    <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                        />
                    </svg>
                </button>

                {/* Last Page Button */}
                <button
                    onClick={() => onPageChange(totalPages)}
                    disabled={!hasNextPage}
                    className={`hidden sm:flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200 ${
                        hasNextPage ? t.button : t.buttonDisabled
                    }`}
                    title="Last page"
                >
                    <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 5l7 7-7 7M5 5l7 7-7 7"
                        />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default Pagination;
