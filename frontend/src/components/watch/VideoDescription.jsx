import { useState } from "react";

const VideoDescription = ({ video }) => {
  const [expanded, setExpanded] = useState(false);

  const formatDate = (date) => {
    const now = new Date();
    const videoDate = new Date(date);
    const diff = now - videoDate;

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (years > 0) return `${years} year${years > 1 ? "s" : ""} ago`;
    if (months > 0) return `${months} month${months > 1 ? "s" : ""} ago`;
    if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    return "Just now";
  };

  return (
    <div
      className={`mt-4 bg-zinc-800 rounded-xl p-3 cursor-pointer hover:bg-zinc-700/80 transition-colors ${
        expanded ? "cursor-default hover:bg-zinc-800" : ""
      }`}
      onClick={() => !expanded && setExpanded(true)}
    >
      <div className="flex items-center gap-2 text-sm font-medium text-white mb-2">
        <span>{video.views?.toLocaleString()} views</span>
        <span>•</span>
        <span>{formatDate(video.createdAt)}</span>
      </div>

      <div
        className={`relative ${expanded ? "" : "max-h-12 overflow-hidden"}`}
      >
        <p className="text-sm text-zinc-300 whitespace-pre-line">
          {video.description}
        </p>
        {!expanded && (
          <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-zinc-800 to-transparent" />
        )}
      </div>

      {expanded ? (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setExpanded(false);
          }}
          className="mt-2 text-sm font-medium text-white hover:text-zinc-300"
        >
          Show less
        </button>
      ) : (
        <button className="text-sm font-medium text-white mt-1">
          ...more
        </button>
      )}
    </div>
  );
};

export default VideoDescription;