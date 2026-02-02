import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "../features/auth/authSlice";

const RedirectIfAuthenticated = () => {
    const accessToken = useSelector(selectCurrentToken);

    // If we have a token, kick user to dashboard (or home)
    if (accessToken) {
        return <Navigate to="/" replace />;
    }

    // Otherwise, let them see the Login/Register form
    return <Outlet />;
};

export default RedirectIfAuthenticated;
