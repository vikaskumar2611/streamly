import axios from "../api/axios.api";
import { useDispatch } from "react-redux";
import { setCredentials } from "../features/auth/authSlice";

const useRefreshToken = () => {
    const dispatch = useDispatch();

    const refresh = async () => {
        try {
            // Backend Path: /api/v1/users/refresh-token
            // We don't need to send body data; the cookie contains the token
            const response = await axios.post("/users/refresh-token");

            // Backend: new ApiResponse(200, { accessToken, refreshToken }, ...)
            // Axios: response.data = ApiResponse object
            // Payload: response.data.data.accessToken
            const { accessToken, user } = response.data.data;

            dispatch(setCredentials({ accessToken, user }));

            return accessToken;
        } catch (error) {
            // If refresh fails (token expired), the interceptor will handle the logout/redirect
            throw error;
        }
    };
    return refresh;
};

export default useRefreshToken;
