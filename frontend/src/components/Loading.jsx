import React from "react";

const Loading = ({ fullScreen = true }) => {
    // Base classes for the spinner animation
    const spinnerClasses =
        "w-16 h-16 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin";

    if (fullScreen) {
        return (
            <div className="min-h-screen w-full bg-gray-900 flex flex-col justify-center items-center z-50 fixed top-0 left-0">
                <div className={spinnerClasses}></div>
                <p className="mt-4 text-gray-400 text-lg font-semibold animate-pulse">
                    Loading...
                </p>
            </div>
        );
    }

    // Inline version (for inside components like CommentSection)
    return (
        <div className="w-full h-full py-10 flex justify-center items-center bg-transparent">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>
        </div>
    );
};

export default Loading;
