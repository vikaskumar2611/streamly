import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate.hooks";
import Icons from "./Icons";

const ChannelInfo = ({ owner, currentUserId }) => {
    const axiosPrivate = useAxiosPrivate();
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [subscriberCount, setSubscriberCount] = useState(
        owner.subscribersCount || 0,
    );
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);

    const isOwnChannel = currentUserId === owner._id;

    useEffect(() => {
        const fetchSubscriptionStatus = async () => {
            if (isOwnChannel) {
                setInitialLoading(false);
                return;
            }
            try {
                const response = await axiosPrivate.get(
                    `/users/c/${owner.username}`,
                );
                if (response.data.data) {
                    setIsSubscribed(response.data.data.isSubscribed || false);
                    setSubscriberCount(
                        response.data.data.subscribersCount || 0,
                    );
                }
            } catch (error) {
                console.error("Error fetching subscription status:", error);
            } finally {
                setInitialLoading(false);
            }
        };
        fetchSubscriptionStatus();
    }, [owner._id, owner.username, axiosPrivate, isOwnChannel]);

    const handleSubscribe = async () => {
        if (loading || isOwnChannel) return;
        setLoading(true);

        const wasSubscribed = isSubscribed;
        setIsSubscribed(!wasSubscribed);
        setSubscriberCount((prev) => (wasSubscribed ? prev - 1 : prev + 1));

        try {
            const response = await axiosPrivate.post(
                `/users/toggle/subscribe/${owner._id}`,
            );
            setIsSubscribed(response.data.data);
        } catch (error) {
            console.error("Error toggling subscription:", error);
            setIsSubscribed(wasSubscribed);
            setSubscriberCount((prev) => (wasSubscribed ? prev + 1 : prev - 1));
        } finally {
            setLoading(false);
        }
    };

    const formatSubscriberCount = (count) => {
        if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
        if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
        return count.toString();
    };

    return (
        <div className="flex items-center justify-between gap-4 mt-4">
            <Link
                to={`/c/${owner.username}`}
                className="flex items-center gap-3 group"
            >
                <img
                    src={owner.avatar || "/default-avatar.png"}
                    alt={owner.fullName}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-transparent group-hover:ring-zinc-500 transition-all"
                />
                <div>
                    <h3 className="font-semibold text-white group-hover:text-zinc-300 transition-colors">
                        {owner.fullName}
                    </h3>
                    <p className="text-sm text-zinc-400">
                        {formatSubscriberCount(subscriberCount)} subscribers
                    </p>
                </div>
            </Link>

            {!isOwnChannel && (
                <button
                    onClick={handleSubscribe}
                    disabled={loading || initialLoading}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm transition-all disabled:opacity-50 ${
                        isSubscribed
                            ? "bg-zinc-700 text-zinc-300 hover:bg-zinc-600"
                            : "bg-white text-black hover:bg-zinc-200"
                    }`}
                >
                    {isSubscribed && <Icons.Bell filled />}
                    {initialLoading ? (
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : isSubscribed ? (
                        "Subscribed"
                    ) : (
                        "Subscribe"
                    )}
                </button>
            )}
        </div>
    );
};

export default ChannelInfo;
