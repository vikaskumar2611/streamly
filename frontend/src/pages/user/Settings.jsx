import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import useAxiosPrivate from "../../hooks/useAxiosPrivate.hooks";
import { selectTheme } from "../../features/theme/themeSlice";

const Settings = () => {
    // --- STATE MANAGEMENT ---
    const axiosPrivate = useAxiosPrivate();
    const theme = useSelector(selectTheme);
    const isDark = theme === "dark";

    // Theme configuration object
    const themeStyles = {
        dark: {
            background: "bg-gray-900",
            text: "text-white",
            textMuted: "text-gray-400",
            textFaded: "text-gray-500",
            border: "border-gray-800",
            card: "bg-gray-900 border-gray-800",
            cardShadow: "shadow-lg shadow-black/20",
            cardHeader: "border-gray-800",
            label: "text-gray-300",
            input: "border-gray-700 bg-gray-800 text-white placeholder-gray-500",
            inputFocus: "focus:ring-purple-500 focus:border-purple-500",
            accordionBtn: "bg-gray-900 hover:bg-gray-800",
            accordionContent: "border-gray-800",
            chevron: "text-gray-400",
            avatarBorder: "border-gray-900",
            coverPlaceholder: "bg-gray-800 text-gray-500",
            alertSuccess:
                "bg-green-900/50 text-green-300 border border-green-800",
            alertError: "bg-red-900/50 text-red-300 border border-red-800",
            primaryBtn: "bg-purple-600 hover:bg-purple-700",
            secondaryBtn: "bg-gray-700 hover:bg-gray-600",
            overlayBg: "bg-black/50",
            loadingOverlay: "bg-black/60",
        },
        light: {
            background: "bg-gray-50",
            text: "text-gray-900",
            textMuted: "text-gray-600",
            textFaded: "text-gray-500",
            border: "border-gray-200",
            card: "bg-white border-gray-200",
            cardShadow: "shadow-lg shadow-gray-200/50",
            cardHeader: "border-gray-200",
            label: "text-gray-700",
            input: "border-gray-300 bg-white text-gray-900 placeholder-gray-400",
            inputFocus: "focus:ring-purple-500 focus:border-purple-500",
            accordionBtn: "bg-white hover:bg-gray-50",
            accordionContent: "border-gray-200",
            chevron: "text-gray-500",
            avatarBorder: "border-white",
            coverPlaceholder: "bg-gray-200 text-gray-400",
            alertSuccess: "bg-green-100 text-green-700 border border-green-200",
            alertError: "bg-red-100 text-red-700 border border-red-200",
            primaryBtn: "bg-purple-600 hover:bg-purple-700",
            secondaryBtn: "bg-gray-800 hover:bg-gray-900",
            overlayBg: "bg-black/40",
            loadingOverlay: "bg-black/50",
        },
    };

    const t = isDark ? themeStyles.dark : themeStyles.light;

    // User Data
    const [user, setUser] = useState({
        fullName: "",
        email: "",
        avatar: "",
        coverImage: "",
    });

    // Password Data
    const [passwords, setPasswords] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    // Accordion Toggles
    const [isProfileOpen, setIsProfileOpen] = useState(true);
    const [isPasswordOpen, setIsPasswordOpen] = useState(false);

    // Loading States
    const [loadingInfo, setLoadingInfo] = useState(false);
    const [loadingPassword, setLoadingPassword] = useState(false);
    const [loadingAvatar, setLoadingAvatar] = useState(false);
    const [loadingCover, setLoadingCover] = useState(false);

    // Feedback
    const [message, setMessage] = useState({ type: "", text: "" });

    // --- EFFECTS ---

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const response = await axiosPrivate.get("/users/current-user");
                setUser(response.data.data);
            } catch (error) {
                console.error("Error fetching user details", error);
            }
        };
        fetchCurrentUser();
    }, []);

    // Helper for messages
    const showMessage = (type, text) => {
        setMessage({ type, text });
        setTimeout(() => setMessage({ type: "", text: "" }), 5000);
    };

    // --- API HANDLERS ---

    const handleImageUpdate = async (e, type) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append(type, file);

        type === "avatar" ? setLoadingAvatar(true) : setLoadingCover(true);

        try {
            const endpoint =
                type === "avatar" ? "/users/avatar" : "/users/cover-image";
            const response = await axiosPrivate.patch(endpoint, formData);

            setUser((prev) => ({ ...prev, [type]: response.data.data[type] }));
            showMessage(
                "success",
                `${type === "avatar" ? "Avatar" : "Cover image"} updated!`,
            );
        } catch (error) {
            showMessage("error", "Failed to upload image.");
        } finally {
            type === "avatar"
                ? setLoadingAvatar(false)
                : setLoadingCover(false);
        }
    };

    const handleAccountUpdate = async (e) => {
        e.preventDefault();
        setLoadingInfo(true);
        const formData = new FormData();
        formData.append("fullName", user.fullName);
        formData.append("email", user.email);

        try {
            await axiosPrivate.patch("/users/update-account", formData);
            showMessage("success", "Account details updated!");
        } catch (error) {
            showMessage("error", "Failed to update details.");
        } finally {
            setLoadingInfo(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (passwords.newPassword !== passwords.confirmPassword) {
            showMessage("error", "New passwords do not match.");
            return;
        }

        setLoadingPassword(true);
        const formData = new FormData();
        formData.append("oldPassword", passwords.oldPassword);
        formData.append("newPassword", passwords.newPassword);

        try {
            await axiosPrivate.post("/users/change-password", formData);
            setPasswords({
                oldPassword: "",
                newPassword: "",
                confirmPassword: "",
            });
            showMessage("success", "Password changed successfully!");
        } catch (error) {
            showMessage(
                "error",
                error.response?.data?.message || "Failed to change password.",
            );
        } finally {
            setLoadingPassword(false);
        }
    };

    // --- RENDER ---

    return (
        <div
            className={`min-h-screen ${t.background} p-4 md:p-8 transition-colors duration-300`}
        >
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Page Title */}
                <div className="mb-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg transition-colors duration-300">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-6 h-6 text-purple-600 dark:text-purple-400"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <circle cx="12" cy="12" r="3" />
                                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                            </svg>
                        </div>
                        <div>
                            <h1
                                className={`text-3xl font-bold ${t.text} transition-colors duration-300`}
                            >
                                Settings
                            </h1>
                            <p
                                className={`${t.textMuted} transition-colors duration-300`}
                            >
                                Manage your channel profile and security
                            </p>
                        </div>
                    </div>
                </div>

                {/* Alert Message */}
                {message.text && (
                    <div
                        className={`p-4 rounded-lg flex items-center gap-3 transition-all duration-300 ${
                            message.type === "success"
                                ? t.alertSuccess
                                : t.alertError
                        }`}
                    >
                        {message.type === "success" ? (
                            <svg
                                className="w-5 h-5 flex-shrink-0"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        ) : (
                            <svg
                                className="w-5 h-5 flex-shrink-0"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        )}
                        <span className="font-medium">{message.text}</span>
                        <button
                            onClick={() => setMessage({ type: "", text: "" })}
                            className="ml-auto p-1 hover:opacity-70 transition-opacity"
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
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>
                )}

                {/* 1. BRANDING (Always Visible) */}
                <div
                    className={`rounded-xl shadow border overflow-hidden transition-colors duration-300 ${t.card} ${t.cardShadow}`}
                >
                    <div
                        className={`p-4 border-b ${t.cardHeader} transition-colors duration-300`}
                    >
                        <div className="flex items-center gap-2">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-5 h-5 text-purple-500"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <rect
                                    x="3"
                                    y="3"
                                    width="18"
                                    height="18"
                                    rx="2"
                                    ry="2"
                                />
                                <circle cx="8.5" cy="8.5" r="1.5" />
                                <polyline points="21 15 16 10 5 21" />
                            </svg>
                            <h2
                                className={`text-lg font-semibold ${t.text} transition-colors duration-300`}
                            >
                                Profile Visuals
                            </h2>
                        </div>
                        <p
                            className={`text-sm ${t.textMuted} mt-1 ml-7 transition-colors duration-300`}
                        >
                            Update your avatar and cover image
                        </p>
                    </div>

                    {/* Cover Image */}
                    <div
                        className={`relative h-40 w-full group ${t.coverPlaceholder} transition-colors duration-300`}
                    >
                        {user.coverImage ? (
                            <img
                                src={user.coverImage}
                                alt="Cover"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-8 h-8 mb-2 opacity-50"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <rect
                                        x="3"
                                        y="3"
                                        width="18"
                                        height="18"
                                        rx="2"
                                        ry="2"
                                    />
                                    <circle cx="8.5" cy="8.5" r="1.5" />
                                    <polyline points="21 15 16 10 5 21" />
                                </svg>
                                <span>No Cover Image</span>
                            </div>
                        )}
                        <label
                            className={`absolute inset-0 ${t.overlayBg} flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer`}
                        >
                            <span className="bg-white text-black px-4 py-2 rounded-full font-medium text-sm flex items-center gap-2 shadow-lg transform hover:scale-105 transition-transform">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-4 h-4"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                                    <circle cx="12" cy="13" r="4" />
                                </svg>
                                {loadingCover ? "Uploading..." : "Change Cover"}
                            </span>
                            <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={(e) =>
                                    handleImageUpdate(e, "coverImage")
                                }
                                disabled={loadingCover}
                            />
                        </label>
                        {loadingCover && (
                            <div
                                className={`absolute inset-0 ${t.loadingOverlay} flex items-center justify-center`}
                            >
                                <svg
                                    className="animate-spin h-8 w-8 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    />
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    />
                                </svg>
                            </div>
                        )}
                    </div>

                    {/* Avatar */}
                    <div className="px-6 pb-6 relative">
                        <div className="-mt-12 relative inline-block group">
                            <img
                                src={user.avatar || "/default-avatar.png"}
                                alt="Avatar"
                                className={`w-24 h-24 rounded-full border-4 ${t.avatarBorder} object-cover shadow-lg bg-gray-300 transition-colors duration-300`}
                            />
                            <label
                                className={`absolute inset-0 flex items-center justify-center rounded-full ${t.overlayBg} opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer`}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-6 h-6 text-white"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                </svg>
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={(e) =>
                                        handleImageUpdate(e, "avatar")
                                    }
                                    disabled={loadingAvatar}
                                />
                            </label>
                            {loadingAvatar && (
                                <div
                                    className={`absolute inset-0 flex items-center justify-center rounded-full ${t.loadingOverlay}`}
                                >
                                    <svg
                                        className="animate-spin h-6 w-6 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        />
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        />
                                    </svg>
                                </div>
                            )}
                        </div>
                        <p
                            className={`mt-3 text-sm ${t.textMuted} transition-colors duration-300`}
                        >
                            Click on the avatar or cover to change
                        </p>
                    </div>
                </div>

                {/* 2. PERSONAL DETAILS DROPDOWN */}
                <div
                    className={`rounded-xl shadow border overflow-hidden transition-colors duration-300 ${t.card} ${t.cardShadow}`}
                >
                    <button
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className={`w-full flex justify-between items-center p-5 transition-colors duration-200 ${t.accordionBtn}`}
                    >
                        <div className="text-left flex items-center gap-3">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg transition-colors duration-300">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-5 h-5 text-blue-600 dark:text-blue-400"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>
                            </div>
                            <div>
                                <h2
                                    className={`text-lg font-semibold ${t.text} transition-colors duration-300`}
                                >
                                    Personal Information
                                </h2>
                                <p
                                    className={`text-sm ${t.textMuted} transition-colors duration-300`}
                                >
                                    Update your name and email
                                </p>
                            </div>
                        </div>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className={`w-5 h-5 ${t.chevron} transition-transform duration-300 ${
                                isProfileOpen ? "rotate-180" : ""
                            }`}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <polyline points="6 9 12 15 18 9" />
                        </svg>
                    </button>

                    <div
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${
                            isProfileOpen
                                ? "max-h-96 opacity-100"
                                : "max-h-0 opacity-0"
                        }`}
                    >
                        <div
                            className={`border-t ${t.accordionContent} p-6 transition-colors duration-300`}
                        >
                            <form
                                onSubmit={handleAccountUpdate}
                                className="grid gap-6"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label
                                            className={`block text-sm font-medium ${t.label} mb-2 transition-colors duration-300`}
                                        >
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            value={user.fullName}
                                            onChange={(e) =>
                                                setUser({
                                                    ...user,
                                                    fullName: e.target.value,
                                                })
                                            }
                                            className={`w-full px-4 py-2.5 rounded-lg border outline-none transition-all duration-200 focus:ring-2 ${t.input} ${t.inputFocus}`}
                                        />
                                    </div>
                                    <div>
                                        <label
                                            className={`block text-sm font-medium ${t.label} mb-2 transition-colors duration-300`}
                                        >
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            value={user.email}
                                            onChange={(e) =>
                                                setUser({
                                                    ...user,
                                                    email: e.target.value,
                                                })
                                            }
                                            className={`w-full px-4 py-2.5 rounded-lg border outline-none transition-all duration-200 focus:ring-2 ${t.input} ${t.inputFocus}`}
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={loadingInfo}
                                        className={`px-6 py-2.5 ${t.primaryBtn} text-white font-semibold rounded-lg shadow-md disabled:opacity-50 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:transform-none flex items-center gap-2`}
                                    >
                                        {loadingInfo ? (
                                            <>
                                                <svg
                                                    className="animate-spin h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <circle
                                                        className="opacity-25"
                                                        cx="12"
                                                        cy="12"
                                                        r="10"
                                                        stroke="currentColor"
                                                        strokeWidth="4"
                                                    />
                                                    <path
                                                        className="opacity-75"
                                                        fill="currentColor"
                                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                    />
                                                </svg>
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="w-4 h-4"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                >
                                                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                                                    <polyline points="17 21 17 13 7 13 7 21" />
                                                    <polyline points="7 3 7 8 15 8" />
                                                </svg>
                                                Save Changes
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                {/* 3. CHANGE PASSWORD DROPDOWN */}
                <div
                    className={`rounded-xl shadow border overflow-hidden transition-colors duration-300 ${t.card} ${t.cardShadow}`}
                >
                    <button
                        onClick={() => setIsPasswordOpen(!isPasswordOpen)}
                        className={`w-full flex justify-between items-center p-5 transition-colors duration-200 ${t.accordionBtn}`}
                    >
                        <div className="text-left flex items-center gap-3">
                            <div className="p-2 bg-amber-100 dark:bg-amber-900/50 rounded-lg transition-colors duration-300">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-5 h-5 text-amber-600 dark:text-amber-400"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <rect
                                        x="3"
                                        y="11"
                                        width="18"
                                        height="11"
                                        rx="2"
                                        ry="2"
                                    />
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                </svg>
                            </div>
                            <div>
                                <h2
                                    className={`text-lg font-semibold ${t.text} transition-colors duration-300`}
                                >
                                    Change Password
                                </h2>
                                <p
                                    className={`text-sm ${t.textMuted} transition-colors duration-300`}
                                >
                                    Update your password securely
                                </p>
                            </div>
                        </div>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className={`w-5 h-5 ${t.chevron} transition-transform duration-300 ${
                                isPasswordOpen ? "rotate-180" : ""
                            }`}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <polyline points="6 9 12 15 18 9" />
                        </svg>
                    </button>

                    <div
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${
                            isPasswordOpen
                                ? "max-h-[500px] opacity-100"
                                : "max-h-0 opacity-0"
                        }`}
                    >
                        <div
                            className={`border-t ${t.accordionContent} p-6 transition-colors duration-300`}
                        >
                            <form
                                onSubmit={handlePasswordChange}
                                className="grid gap-6"
                            >
                                <div>
                                    <label
                                        className={`block text-sm font-medium ${t.label} mb-2 transition-colors duration-300`}
                                    >
                                        Current Password
                                    </label>
                                    <input
                                        type="password"
                                        value={passwords.oldPassword}
                                        onChange={(e) =>
                                            setPasswords({
                                                ...passwords,
                                                oldPassword: e.target.value,
                                            })
                                        }
                                        className={`w-full px-4 py-2.5 rounded-lg border outline-none transition-all duration-200 focus:ring-2 ${t.input} ${t.inputFocus}`}
                                        placeholder="Enter current password"
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label
                                            className={`block text-sm font-medium ${t.label} mb-2 transition-colors duration-300`}
                                        >
                                            New Password
                                        </label>
                                        <input
                                            type="password"
                                            value={passwords.newPassword}
                                            onChange={(e) =>
                                                setPasswords({
                                                    ...passwords,
                                                    newPassword: e.target.value,
                                                })
                                            }
                                            className={`w-full px-4 py-2.5 rounded-lg border outline-none transition-all duration-200 focus:ring-2 ${t.input} ${t.inputFocus}`}
                                            placeholder="Enter new password"
                                        />
                                    </div>
                                    <div>
                                        <label
                                            className={`block text-sm font-medium ${t.label} mb-2 transition-colors duration-300`}
                                        >
                                            Confirm New Password
                                        </label>
                                        <input
                                            type="password"
                                            value={passwords.confirmPassword}
                                            onChange={(e) =>
                                                setPasswords({
                                                    ...passwords,
                                                    confirmPassword:
                                                        e.target.value,
                                                })
                                            }
                                            className={`w-full px-4 py-2.5 rounded-lg border outline-none transition-all duration-200 focus:ring-2 ${t.input} ${t.inputFocus}`}
                                            placeholder="Confirm new password"
                                        />
                                    </div>
                                </div>
                                {/* Password Match Indicator */}
                                {passwords.newPassword &&
                                    passwords.confirmPassword && (
                                        <div
                                            className={`flex items-center gap-2 text-sm ${
                                                passwords.newPassword ===
                                                passwords.confirmPassword
                                                    ? "text-green-500"
                                                    : "text-red-500"
                                            }`}
                                        >
                                            {passwords.newPassword ===
                                            passwords.confirmPassword ? (
                                                <>
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
                                                            d="M5 13l4 4L19 7"
                                                        />
                                                    </svg>
                                                    Passwords match
                                                </>
                                            ) : (
                                                <>
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
                                                            d="M6 18L18 6M6 6l12 12"
                                                        />
                                                    </svg>
                                                    Passwords do not match
                                                </>
                                            )}
                                        </div>
                                    )}
                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={
                                            loadingPassword ||
                                            passwords.newPassword !==
                                                passwords.confirmPassword
                                        }
                                        className={`px-6 py-2.5 ${t.secondaryBtn} text-white font-semibold rounded-lg shadow-md disabled:opacity-50 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:transform-none disabled:cursor-not-allowed flex items-center gap-2`}
                                    >
                                        {loadingPassword ? (
                                            <>
                                                <svg
                                                    className="animate-spin h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <circle
                                                        className="opacity-25"
                                                        cx="12"
                                                        cy="12"
                                                        r="10"
                                                        stroke="currentColor"
                                                        strokeWidth="4"
                                                    />
                                                    <path
                                                        className="opacity-75"
                                                        fill="currentColor"
                                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                    />
                                                </svg>
                                                Updating...
                                            </>
                                        ) : (
                                            <>
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="w-4 h-4"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                >
                                                    <rect
                                                        x="3"
                                                        y="11"
                                                        width="18"
                                                        height="11"
                                                        rx="2"
                                                        ry="2"
                                                    />
                                                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                                </svg>
                                                Update Password
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
