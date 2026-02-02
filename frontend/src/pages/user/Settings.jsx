import React, { useState, useEffect } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate.hooks"; 

const Settings = () => {
    // --- STATE MANAGEMENT ---
    const axiosPrivate = useAxiosPrivate();

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

    // Accordion Toggles (Dropdown state)
    const [isProfileOpen, setIsProfileOpen] = useState(true); // Default open
    const [isPasswordOpen, setIsPasswordOpen] = useState(false); // Default closed

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
        <div className="min-h-screen bg-gray-50 dark:bg-black p-4 md:p-8">
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Page Title */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Settings
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400">
                        Manage your channel profile and security
                    </p>
                </div>

                {/* Alert Message */}
                {message.text && (
                    <div
                        className={`p-4 rounded-lg flex items-center gap-2 ${
                            message.type === "success"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                        }`}
                    >
                        <span>{message.text}</span>
                    </div>
                )}

                {/* 1. BRANDING (Always Visible) */}
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow border border-gray-200 dark:border-gray-800 overflow-hidden">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-800">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Profile Visuals
                        </h2>
                    </div>

                    {/* Cover Image */}
                    <div className="relative h-40 bg-gray-200 w-full group">
                        {user.coverImage ? (
                            <img
                                src={user.coverImage}
                                alt="Cover"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-400">
                                No Cover Image
                            </div>
                        )}
                        <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                            <span className="bg-white text-black px-4 py-2 rounded-full font-medium text-sm flex items-center gap-2">
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
                    </div>

                    {/* Avatar */}
                    <div className="px-6 pb-6 relative">
                        <div className="-mt-12 relative inline-block group">
                            <img
                                src={user.avatar}
                                alt="Avatar"
                                className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-900 object-cover shadow-lg bg-gray-300"
                            />
                            <label className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
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
                                <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 text-white text-xs">
                                    ...
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* 2. PERSONAL DETAILS DROPDOWN */}
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow border border-gray-200 dark:border-gray-800 overflow-hidden">
                    <button
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className="w-full flex justify-between items-center p-5 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                        <div className="text-left">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Personal Information
                            </h2>
                            <p className="text-sm text-gray-500">
                                Update your name and email
                            </p>
                        </div>
                        {/* Chevron Icon */}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${isProfileOpen ? "transform rotate-180" : ""}`}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                    </button>

                    {isProfileOpen && (
                        <div className="border-t border-gray-200 dark:border-gray-800 p-6 animate-fade-in-down">
                            <form
                                onSubmit={handleAccountUpdate}
                                className="grid gap-6"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none transition-shadow"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none transition-shadow"
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={loadingInfo}
                                        className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg shadow disabled:opacity-50 transition-colors"
                                    >
                                        {loadingInfo
                                            ? "Saving..."
                                            : "Save Changes"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>

                {/* 3. CHANGE PASSWORD DROPDOWN */}
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow border border-gray-200 dark:border-gray-800 overflow-hidden">
                    <button
                        onClick={() => setIsPasswordOpen(!isPasswordOpen)}
                        className="w-full flex justify-between items-center p-5 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                        <div className="text-left">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Change Password
                            </h2>
                            <p className="text-sm text-gray-500">
                                Update your password securely
                            </p>
                        </div>
                        {/* Chevron Icon */}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${isPasswordOpen ? "transform rotate-180" : ""}`}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                    </button>

                    {isPasswordOpen && (
                        <div className="border-t border-gray-200 dark:border-gray-800 p-6">
                            <form
                                onSubmit={handlePasswordChange}
                                className="grid gap-6"
                            >
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Old Password
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
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none transition-shadow"
                                        placeholder="Enter current password"
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none transition-shadow"
                                            placeholder="Enter new password"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none transition-shadow"
                                            placeholder="Confirm new password"
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={loadingPassword}
                                        className="px-6 py-2 bg-gray-800 dark:bg-gray-700 hover:bg-gray-900 dark:hover:bg-gray-600 text-white font-semibold rounded-lg shadow disabled:opacity-50 transition-colors"
                                    >
                                        {loadingPassword
                                            ? "Updating..."
                                            : "Update Password"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Settings;
