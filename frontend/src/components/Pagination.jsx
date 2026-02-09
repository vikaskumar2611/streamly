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

    const themeStyles = {
        dark: {
            container: "bg-gray-900/50 border-gray-800/60",
            button: "bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white ring-1 ring-gray-700/50",
            buttonDisabled:
                "bg-gray-800/40 text-gray-600 ring-1 ring-gray-800/50 cursor-not-allowed",
            pageButton:
                "bg-transparent hover:bg-gray-800 text-gray-400 hover:text-white",
            pageButtonActive:
                "bg-purple-600 text-white shadow-lg shadow-purple-500/30 ring-1 ring-purple-500/50",
            ellipsis: "text-gray-600",
            info: "text-gray-500",
            infoHighlight: "text-gray-300",
            divider: "bg-gray-700/50",
            tooltip: "bg-gray-700 text-gray-200",
        },
        light: {
            container: "bg-white/80 border-gray-200",
            button: "bg-white hover:bg-gray-50 text-gray-600 hover:text-gray-900 ring-1 ring-gray-200 shadow-sm",
            buttonDisabled:
                "bg-gray-50 text-gray-300 ring-1 ring-gray-200 cursor-not-allowed",
            pageButton:
                "bg-transparent hover:bg-gray-100 text-gray-500 hover:text-gray-900",
            pageButtonActive:
                "bg-purple-600 text-white shadow-lg shadow-purple-300/40 ring-1 ring-purple-500/50",
            ellipsis: "text-gray-400",
            info: "text-gray-400",
            infoHighlight: "text-gray-700",
            divider: "bg-gray-200",
            tooltip: "bg-gray-800 text-white",
        },
    };

    const t = isDark ? themeStyles.dark : themeStyles.light;

    if (totalPages <= 1) return null;

    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;

        let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
        let end = Math.min(totalPages, start + maxVisible - 1);

        if (end - start + 1 < maxVisible) {
            start = Math.max(1, end - maxVisible + 1);
        }

        if (start > 1) {
            pages.push(1);
            if (start > 2) pages.push("start-ellipsis");
        }

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        if (end < totalPages) {
            if (end < totalPages - 1) pages.push("end-ellipsis");
            pages.push(totalPages);
        }

        return pages;
    };

    // ── Nav Button ───────────────────────────────────────────────────
    const NavButton = ({
        onClick,
        disabled,
        children,
        label,
        className = "",
    }) => (
        <button
            onClick={onClick}
            disabled={disabled}
            aria-label={label}
            title={label}
            className={`
                flex items-center justify-center
                rounded-xl
                transition-all duration-200 ease-out
                ${
                    disabled
                        ? t.buttonDisabled
                        : `${t.button} hover:scale-[1.04] active:scale-95`
                }
                disabled:pointer-events-none
                ${className}
            `}
        >
            {children}
        </button>
    );

    return (
        <div
            className="flex flex-col items-center gap-4 mt-10
                        animate-[fadeIn_0.3s_ease-out]"
        >
            {/* ── Main Controls ────────────────────────────────────── */}
            <div
                className={`
                    inline-flex items-center gap-1.5
                    px-2 py-2 rounded-2xl
                    border backdrop-blur-sm
                    ${t.container}
                    transition-colors duration-300
                `}
            >
                {/* First Page */}
                <NavButton
                    onClick={() => onPageChange(1)}
                    disabled={!hasPrevPage}
                    label="First page"
                    className="hidden sm:flex w-10 h-10"
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
                </NavButton>

                {/* Previous */}
                <NavButton
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={!hasPrevPage}
                    label="Previous page"
                    className="h-10 px-3 gap-1.5"
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
                    <span className="hidden sm:inline text-sm font-medium">
                        Prev
                    </span>
                </NavButton>

                {/* Divider */}
                <div
                    className={`hidden sm:block w-px h-6 mx-0.5 ${t.divider}`}
                />

                {/* Page Numbers */}
                <div className="flex items-center gap-0.5">
                    {getPageNumbers().map((page, index) =>
                        typeof page === "string" ? (
                            // Ellipsis
                            <span
                                key={page}
                                className={`
                                    w-9 h-10 flex items-center justify-center
                                    text-sm select-none ${t.ellipsis}
                                `}
                            >
                                <svg
                                    className="w-4 h-4"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <circle cx="5" cy="12" r="2" />
                                    <circle cx="12" cy="12" r="2" />
                                    <circle cx="19" cy="12" r="2" />
                                </svg>
                            </span>
                        ) : (
                            // Page number
                            <button
                                key={page}
                                onClick={() => onPageChange(page)}
                                aria-label={`Page ${page}`}
                                aria-current={
                                    page === currentPage ? "page" : undefined
                                }
                                className={`
                                    w-10 h-10 rounded-xl
                                    text-sm font-semibold
                                    transition-all duration-200 ease-out
                                    ${
                                        page === currentPage
                                            ? `${t.pageButtonActive} scale-105`
                                            : `${t.pageButton} hover:scale-[1.06] active:scale-95`
                                    }
                                `}
                            >
                                {page}
                            </button>
                        ),
                    )}
                </div>

                {/* Divider */}
                <div
                    className={`hidden sm:block w-px h-6 mx-0.5 ${t.divider}`}
                />

                {/* Next */}
                <NavButton
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={!hasNextPage}
                    label="Next page"
                    className="h-10 px-3 gap-1.5"
                >
                    <span className="hidden sm:inline text-sm font-medium">
                        Next
                    </span>
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
                </NavButton>

                {/* Last Page */}
                <NavButton
                    onClick={() => onPageChange(totalPages)}
                    disabled={!hasNextPage}
                    label="Last page"
                    className="hidden sm:flex w-10 h-10"
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
                </NavButton>
            </div>

            {/* ── Page Info ────────────────────────────────────────── */}
            <p className={`text-xs ${t.info} transition-colors duration-300`}>
                Page{" "}
                <span className={`font-semibold ${t.infoHighlight}`}>
                    {currentPage}
                </span>{" "}
                of{" "}
                <span className={`font-semibold ${t.infoHighlight}`}>
                    {totalPages}
                </span>
            </p>
        </div>
    );
};

export default Pagination;
