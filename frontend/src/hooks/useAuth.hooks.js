import { useSelector } from "react-redux";
import {
    selectCurrentUser,
    selectCurrentToken,
} from "../features/auth/authSlice";

const useAuth = () => {
    const user = useSelector(selectCurrentUser);
    const accessToken = useSelector(selectCurrentToken);

    return { user, accessToken };
};

export default useAuth;
