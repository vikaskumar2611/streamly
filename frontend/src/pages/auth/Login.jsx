import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import axios from "../../api/axios.api";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../features/auth/authSlice";

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    const from = location.state?.from?.pathname || "/dashboard";

    const [input, setInput] = useState(""); // User can type Username OR Email
    const [password, setPassword] = useState("");
    const [errMsg, setErrMsg] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrMsg("");
        setIsLoading(true);

        try {
            // Your backend checks: $or: [{ username }, { email }]
            // We pass the input as 'username' (or 'email') key, the backend search handles the rest.
            // Even though your backend has upload.none(), standard JSON usually works with express.json()

            const payload = {
                username: input, // We send 'input' as username.
                email: input, // OR send it as email. Your backend checks both.
                password,
            };

            // Backend Path: /api/v1/users/login
            const response = await axios.post("/users/login", payload);

            // Structure: response.data.data = { user, accessToken, refreshToken }
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
        <section className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
            <div className="w-full max-w-md bg-gray-800 rounded-2xl shadow-xl p-8">
                <h1 className="text-3xl font-bold text-white text-center mb-8">
                    Sign In
                </h1>
                {errMsg && (
                    <p className="bg-red-500/20 text-red-400 p-3 rounded mb-4 text-center">
                        {errMsg}
                    </p>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Username or Email
                        </label>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            required
                            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition disabled:bg-blue-900"
                    >
                        {isLoading ? "Signing In..." : "Sign In"}
                    </button>
                </form>
                <p className="mt-6 text-center text-gray-400">
                    Need an account?{" "}
                    <Link
                        to="/register"
                        className="text-blue-400 hover:underline"
                    >
                        Register
                    </Link>
                </p>
            </div>
        </section>
    );
};

export default Login;
