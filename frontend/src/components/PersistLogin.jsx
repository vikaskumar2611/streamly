import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import useRefreshToken from "../hooks/useRefreshToken.hooks";
import useAuth from "../hooks/useAuth.hooks";
import Loading from "./Loading";

const PersistLogin = () => {
    const [isLoading, setIsLoading] = useState(true);
    const refresh = useRefreshToken();
    const { accessToken } = useAuth();

    useEffect(() => {
        let isMounted = true;

        const verifyRefreshToken = async () => {
            try {
                await refresh();
            } catch (err) {
                console.log("No persistent login found or token expired");
            } finally {
                isMounted && setIsLoading(false);
            }
        };

        // Only run verification if we lack an access token
        !accessToken ? verifyRefreshToken() : setIsLoading(false);

        return () => (isMounted = false);
    }, []);

    return isLoading ? <Loading fullScreen={true} /> : <Outlet />;
};

export default PersistLogin;
