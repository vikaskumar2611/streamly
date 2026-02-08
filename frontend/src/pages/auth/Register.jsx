import { useState } from "react";
import { useSelector } from "react-redux";
import axios from "../../api/axios.api";
import { useNavigate, Link } from "react-router-dom";
import { selectTheme } from "../../features/theme/themeSlice";

const Register = () => {
    const navigate = useNavigate();
    const theme = useSelector(selectTheme);
    const isDark = theme === "dark";

    const [formData, setFormData] = useState({
        fullName: "",
        username: "",
        email: "",
        password: "",
    });

    const [avatar, setAvatar] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [coverImage, setCoverImage] = useState(null);
    const [coverPreview, setCoverPreview] = useState(null);
    const [errMsg, setErrMsg] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Theme configuration object
    const themeStyles = {
        dark: {
            page: "bg-gray-900",
            card: "bg-gray-800",
            cardShadow: "shadow-xl",
            title: "text-white",
            subtitle: "text-gray-400",
            label: "text-gray-300",
            input: "bg-gray-700 border-gray-600 text-white placeholder-gray-400",
            inputFocus: "focus:ring-blue-500 focus:border-blue-500",
            button: "bg-blue-600 hover:bg-blue-700 text-white",
            buttonDisabled: "disabled:bg-blue-900 disabled:cursor-not-allowed",
            error: "bg-red-500/20 text-red-400 border border-red-500/30",
            text: "text-gray-400",
            textMuted: "text-gray-500",
            link: "text-blue-400 hover:text-blue-300 hover:underline",
            divider: "border-gray-700",
            fileUpload: "bg-gray-700 border-gray-600 hover:border-blue-500",
            fileUploadText: "text-gray-400",
            fileUploadIcon: "text-gray-500",
            previewBorder: "border-gray-600",
            iconColor: "text-gray-400",
        },
        light: {
            page: "bg-gray-100",
            card: "bg-white",
            cardShadow: "shadow-xl shadow-gray-200",
            title: "text-gray-900",
            subtitle: "text-gray-500",
            label: "text-gray-700",
            input: "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500",
            inputFocus: "focus:ring-blue-500 focus:border-blue-500",
            button: "bg-blue-600 hover:bg-blue-700 text-white",
            buttonDisabled: "disabled:bg-blue-300 disabled:cursor-not-allowed",
            error: "bg-red-100 text-red-600 border border-red-200",
            text: "text-gray-600",
            textMuted: "text-gray-400",
            link: "text-blue-600 hover:text-blue-700 hover:underline",
            divider: "border-gray-200",
            fileUpload: "bg-gray-50 border-gray-300 hover:border-blue-500",
            fileUploadText: "text-gray-500",
            fileUploadIcon: "text-gray-400",
            previewBorder: "border-gray-300",
            iconColor: "text-gray-500",
        },
    };

    const t = isDark ? themeStyles.dark : themeStyles.light;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (e.target.name === "avatar") {
            setAvatar(file);
            if (file) {
                const reader = new FileReader();
                reader.onloadend = () => setAvatarPreview(reader.result);
                reader.readAsDataURL(file);
            } else {
                setAvatarPreview(null);
            }
        }
        if (e.target.name === "coverImage") {
            setCoverImage(file);
            if (file) {
                const reader = new FileReader();
                reader.onloadend = () => setCoverPreview(reader.result);
                reader.readAsDataURL(file);
            } else {
                setCoverPreview(null);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrMsg("");

        const data = new FormData();
        data.append("fullName", formData.fullName);
        data.append("username", formData.username);
        data.append("email", formData.email);
        data.append("password", formData.password);

        if (avatar) data.append("avatar", avatar);
        if (coverImage) data.append("coverImage", coverImage);

        try {
            await axios.post("/users/register", data);
            navigate("/login");
        } catch (err) {
            const status = err.response?.status;
            if (status === 409) {
                setErrMsg("Username or Email already exists.");
            } else if (status === 400) {
                setErrMsg("All fields (and Avatar) are required.");
            } else {
                setErrMsg("Registration Failed. Try again.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section
            className={`min-h-screen flex items-center justify-center ${t.page} px-4 py-8 transition-colors duration-300`}
        >
            <div
                className={`w-full max-w-lg ${t.card} rounded-2xl ${t.cardShadow} p-8 transition-colors duration-300`}
            >
                {/* Logo/Brand */}
                <div className="flex justify-center mb-6">
                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                        <svg
                            className="w-7 h-7 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                            />
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </div>
                </div>

                <h1
                    className={`text-3xl font-bold ${t.title} text-center mb-2 transition-colors`}
                >
                    Create Account
                </h1>
                <p className={`${t.subtitle} text-center mb-8`}>
                    Join Streamly and start sharing videos
                </p>

                {/* Error Message */}
                {errMsg && (
                    <div
                        className={`${t.error} p-3 rounded-lg mb-6 text-center text-sm font-medium`}
                    >
                        <div className="flex items-center justify-center gap-2">
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
                                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            {errMsg}
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Full Name Input */}
                    <div>
                        <label
                            className={`block text-sm font-medium ${t.label} mb-2`}
                        >
                            Full Name
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg
                                    className={`w-5 h-5 ${t.iconColor}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                    />
                                </svg>
                            </div>
                            <input
                                name="fullName"
                                placeholder="Enter your full name"
                                onChange={handleChange}
                                required
                                className={`w-full pl-10 pr-4 py-3 ${t.input} border rounded-lg focus:outline-none focus:ring-2 ${t.inputFocus} transition-all duration-200`}
                            />
                        </div>
                    </div>

                    {/* Username Input */}
                    <div>
                        <label
                            className={`block text-sm font-medium ${t.label} mb-2`}
                        >
                            Username
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg
                                    className={`w-5 h-5 ${t.iconColor}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                                    />
                                </svg>
                            </div>
                            <input
                                name="username"
                                placeholder="Choose a username"
                                onChange={handleChange}
                                required
                                className={`w-full pl-10 pr-4 py-3 ${t.input} border rounded-lg focus:outline-none focus:ring-2 ${t.inputFocus} transition-all duration-200`}
                            />
                        </div>
                    </div>

                    {/* Email Input */}
                    <div>
                        <label
                            className={`block text-sm font-medium ${t.label} mb-2`}
                        >
                            Email
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg
                                    className={`w-5 h-5 ${t.iconColor}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                    />
                                </svg>
                            </div>
                            <input
                                name="email"
                                type="email"
                                placeholder="Enter your email"
                                onChange={handleChange}
                                required
                                className={`w-full pl-10 pr-4 py-3 ${t.input} border rounded-lg focus:outline-none focus:ring-2 ${t.inputFocus} transition-all duration-200`}
                            />
                        </div>
                    </div>

                    {/* Password Input */}
                    <div>
                        <label
                            className={`block text-sm font-medium ${t.label} mb-2`}
                        >
                            Password
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg
                                    className={`w-5 h-5 ${t.iconColor}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                    />
                                </svg>
                            </div>
                            <input
                                name="password"
                                type="password"
                                placeholder="Create a password"
                                onChange={handleChange}
                                required
                                className={`w-full pl-10 pr-4 py-3 ${t.input} border rounded-lg focus:outline-none focus:ring-2 ${t.inputFocus} transition-all duration-200`}
                            />
                        </div>
                    </div>

                    {/* Avatar Upload */}
                    <div>
                        <label
                            className={`block text-sm font-medium ${t.label} mb-2`}
                        >
                            Avatar <span className="text-red-500">*</span>
                        </label>
                        <div className="flex items-center gap-4">
                            {/* Avatar Preview */}
                            <div
                                className={`w-16 h-16 rounded-full border-2 ${t.previewBorder} overflow-hidden flex-shrink-0 ${!avatarPreview ? t.fileUpload : ""}`}
                            >
                                {avatarPreview ? (
                                    <img
                                        src={avatarPreview}
                                        alt="Avatar Preview"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <svg
                                            className={`w-8 h-8 ${t.fileUploadIcon}`}
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                            />
                                        </svg>
                                    </div>
                                )}
                            </div>
                            {/* File Input */}
                            <div className="flex-1">
                                <label
                                    className={`flex items-center justify-center gap-2 px-4 py-2 ${t.fileUpload} border-2 border-dashed rounded-lg cursor-pointer transition-colors`}
                                >
                                    <svg
                                        className={`w-5 h-5 ${t.fileUploadIcon}`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                        />
                                    </svg>
                                    <span
                                        className={`text-sm ${t.fileUploadText}`}
                                    >
                                        {avatar
                                            ? avatar.name
                                            : "Choose avatar image"}
                                    </span>
                                    <input
                                        type="file"
                                        name="avatar"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        required
                                        className="hidden"
                                    />
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Cover Image Upload */}
                    <div>
                        <label
                            className={`block text-sm font-medium ${t.label} mb-2`}
                        >
                            Cover Image{" "}
                            <span className={t.textMuted}>(Optional)</span>
                        </label>
                        <div className="space-y-3">
                            {/* Cover Preview */}
                            {coverPreview && (
                                <div
                                    className={`w-full h-24 rounded-lg border-2 ${t.previewBorder} overflow-hidden`}
                                >
                                    <img
                                        src={coverPreview}
                                        alt="Cover Preview"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}
                            {/* File Input */}
                            <label
                                className={`flex items-center justify-center gap-2 px-4 py-3 ${t.fileUpload} border-2 border-dashed rounded-lg cursor-pointer transition-colors`}
                            >
                                <svg
                                    className={`w-5 h-5 ${t.fileUploadIcon}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                    />
                                </svg>
                                <span className={`text-sm ${t.fileUploadText}`}>
                                    {coverImage
                                        ? coverImage.name
                                        : "Choose cover image"}
                                </span>
                                <input
                                    type="file"
                                    name="coverImage"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                            </label>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full py-3 ${t.button} font-semibold rounded-lg transition-all duration-200 ${t.buttonDisabled} flex items-center justify-center gap-2 mt-6`}
                    >
                        {isLoading ? (
                            <>
                                <svg
                                    className="animate-spin w-5 h-5"
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
                                Creating Account...
                            </>
                        ) : (
                            <>
                                Create Account
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                                    />
                                </svg>
                            </>
                        )}
                    </button>
                </form>

                {/* Divider */}
                <div className="flex items-center my-6">
                    <div className={`flex-1 border-t ${t.divider}`}></div>
                    <span className={`px-4 text-sm ${t.text}`}>or</span>
                    <div className={`flex-1 border-t ${t.divider}`}></div>
                </div>

                {/* Social Signup Button (Optional) */}
                <button
                    type="button"
                    className={`w-full py-3 ${isDark ? "bg-gray-700 hover:bg-gray-600 text-white border-gray-600" : "bg-white hover:bg-gray-50 text-gray-700 border-gray-300"} border rounded-lg font-medium transition-colors flex items-center justify-center gap-3`}
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path
                            fill="currentColor"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                            fill="currentColor"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                            fill="currentColor"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                            fill="currentColor"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                    </svg>
                    Sign up with Google
                </button>

                {/* Login Link */}
                <p className={`mt-6 text-center ${t.text}`}>
                    Already have an account?{" "}
                    <Link
                        to="/login"
                        className={`font-semibold ${t.link} transition-colors`}
                    >
                        Sign in
                    </Link>
                </p>

                {/* Terms */}
                <p className={`mt-4 text-center text-xs ${t.textMuted}`}>
                    By creating an account, you agree to our{" "}
                    <Link to="/terms" className={t.link}>
                        Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link to="/privacy" className={t.link}>
                        Privacy Policy
                    </Link>
                </p>
            </div>
        </section>
    );
};

export default Register;
