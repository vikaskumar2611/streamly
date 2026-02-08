import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import themeReducer from "../features/theme/themeSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        theme: themeReducer,
    },
    //devTools: import.meta.env.MODE !== "production", // Enable Redux DevTools only in dev
});
