import { useState } from "react";
import axios from "../../api/axios.api";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullName: "", // Matches backend 'fullName'
        username: "",
        email: "",
        password: "",
    });

    const [avatar, setAvatar] = useState(null);
    const [coverImage, setCoverImage] = useState(null);
    const [errMsg, setErrMsg] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        if (e.target.name === "avatar") setAvatar(e.target.files[0]);
        if (e.target.name === "coverImage") setCoverImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrMsg("");

        // Your backend requires Multer (FormData)
        const data = new FormData();
        data.append("fullName", formData.fullName);
        data.append("username", formData.username);
        data.append("email", formData.email);
        data.append("password", formData.password);

        // Backend keys are specific: 'avatar' and 'coverImage'
        if (avatar) data.append("avatar", avatar);
        if (coverImage) data.append("coverImage", coverImage);

        try {
            // Backend Path: /api/v1/users/register
            // Axios automatically sets 'multipart/form-data' when sending FormData
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
        <section className="min-h-screen flex items-center justify-center bg-gray-900 px-4 py-8">
            <div className="w-full max-w-md bg-gray-800 rounded-2xl shadow-xl p-8">
                <h1 className="text-3xl font-bold text-white text-center mb-8">
                    Register
                </h1>
                {errMsg && (
                    <p className="bg-red-500/20 text-red-400 p-3 rounded mb-4 text-center">
                        {errMsg}
                    </p>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Inputs... Same styling as Login */}
                    <input
                        name="fullName"
                        placeholder="Full Name"
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-gray-700 rounded-lg text-white"
                    />
                    <input
                        name="username"
                        placeholder="Username"
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-gray-700 rounded-lg text-white"
                    />
                    <input
                        name="email"
                        type="email"
                        placeholder="Email"
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-gray-700 rounded-lg text-white"
                    />
                    <input
                        name="password"
                        type="password"
                        placeholder="Password"
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-gray-700 rounded-lg text-white"
                    />

                    <div>
                        <label className="block text-sm text-gray-300 mb-1">
                            Avatar (Required)
                        </label>
                        <input
                            type="file"
                            name="avatar"
                            accept="image/*"
                            onChange={handleFileChange}
                            required
                            className="text-gray-300"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-300 mb-1">
                            Cover Image (Optional)
                        </label>
                        <input
                            type="file"
                            name="coverImage"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="text-gray-300"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg disabled:bg-blue-900"
                    >
                        {isLoading ? "Creating Account..." : "Sign Up"}
                    </button>
                </form>
                <p className="mt-6 text-center text-gray-400">
                    Already have an account?{" "}
                    <Link to="/login" className="text-blue-400 hover:underline">
                        Login
                    </Link>
                </p>
            </div>
        </section>
    );
};

export default Register;
