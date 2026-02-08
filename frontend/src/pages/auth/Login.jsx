import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "../../api/axios.api";
import { setCredentials } from "../../features/auth/authSlice";
import { selectTheme } from "../../features/theme/themeSlice";

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const theme = useSelector(selectTheme);
    const isDark = theme === "dark";

    const from = location.state?.from?.pathname || "/dashboard";

    const [input, setInput] = useState("");
    const [password, setPassword] = useState("");
    const [errMsg, setErrMsg] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const themeStyles = {
        dark: {
            page: "bg-gray-900",
            card: "bg-gray-800",
            cardShadow: "shadow-xl",
            title: "text-white",
            label: "text-gray-300",
            input: "bg-gray-700 border-gray-600 text-white placeholder-gray-400",
            inputFocus: "focus:ring-blue-500 focus:border-blue-500",
            button: "bg-blue-600 hover:bg-blue-700 text-white",
            buttonDisabled: "disabled:bg-blue-900 disabled:cursor-not-allowed",
            error: "bg-red-500/20 text-red-400",
            text: "text-gray-400",
            link: "text-blue-400 hover:text-blue-300 hover:underline",
        },
        light: {
            page: "bg-gray-100",
            card: "bg-white",
            cardShadow: "shadow-xl shadow-gray-200",
            title: "text-gray-900",
            label: "text-gray-700",
            input: "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500",
            inputFocus: "focus:ring-blue-500 focus:border-blue-500",
            button: "bg-blue-600 hover:bg-blue-700 text-white",
            buttonDisabled: "disabled:bg-blue-300 disabled:cursor-not-allowed",
            error: "bg-red-100 text-red-600 border border-red-200",
            text: "text-gray-600",
            link: "text-blue-600 hover:text-blue-700 hover:underline",
        },
    };

    const t = isDark ? themeStyles.dark : themeStyles.light;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrMsg("");
        setIsLoading(true);

        try {
            const payload = {
                username: input,
                email: input,
                password,
            };

            const response = await axios.post("/users/login", payload);
            const { accessToken, user } = response.data.data;

            dispatch(setCredentials({ user, accessToken }));
            setInput("");
            setPassword("");
            navigate(from, { replace: true });
        } catch (err) {
            if (!err?.response) {
                setErrMsg("No Server Response");
            } else if (err.response?.status === 400) {
                setErrMsg("Missing Username/Email or Password");
            } else if (err.response?.status === 401) {
                setErrMsg("Invalid Credentials");
            } else {
                setErrMsg("Login Failed");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section
            className={`min-h-screen flex items-center justify-center ${t.page} px-4 transition-colors duration-300`}
        >
            <div
                className={`w-full max-w-md ${t.card} rounded-2xl ${t.cardShadow} p-8 transition-colors duration-300`}
            >
                {/* Logo */}
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
                    Welcome Back
                </h1>
                <p className={`${t.text} text-center mb-8`}>
                    Sign in to continue to Streamly
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
                    {/* Username/Email Input */}
                    <div>
                        <label
                            className={`block text-sm font-medium ${t.label} mb-2`}
                        >
                            Username or Email
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg
                                    className={`w-5 h-5 ${isDark ? "text-gray-400" : "text-gray-500"}`}
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
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Enter your username or email"
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
                                    className={`w-5 h-5 ${isDark ? "text-gray-400" : "text-gray-500"}`}
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
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                required
                                className={`w-full pl-10 pr-4 py-3 ${t.input} border rounded-lg focus:outline-none focus:ring-2 ${t.inputFocus} transition-all duration-200`}
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full py-3 ${t.button} font-semibold rounded-lg transition-all duration-200 ${t.buttonDisabled} flex items-center justify-center gap-2`}
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
                                Signing In...
                            </>
                        ) : (
                            <>
                                Sign In
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

                {/* Register Link */}
                <p className={`mt-8 text-center ${t.text}`}>
                    Don't have an account?{" "}
                    <Link
                        to="/register"
                        className={`font-semibold ${t.link} transition-colors`}
                    >
                        Create one
                    </Link>
                </p>
            </div>
        </section>
    );
};

export default Login;
