import axios from "axios";

// Points to the main API version prefix
const BASE_URL = "https://streamly-u4n3.onrender.com/api/v1";

export default axios.create({
    baseURL: BASE_URL,
    withCredentials: true, // Crucial: Sends cookies (refreshToken) to backend
});

// Private instance for protected routes (uses Interceptors)
export const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
});
