// src/features/theme/themeSlice.js
import { createSlice } from "@reduxjs/toolkit";

// Get initial theme from localStorage or default to 'dark'
const getInitialTheme = () => {
    if (typeof window !== "undefined") {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme) {
            return savedTheme;
        }
        // Check system preference
        if (window.matchMedia("(prefers-color-scheme: light)").matches) {
            return "light";
        }
    }
    return "dark";
};

const themeSlice = createSlice({
    name: "theme",
    initialState: {
        mode: getInitialTheme(), // 'light' or 'dark'
    },
    reducers: {
        toggleTheme: (state) => {
            state.mode = state.mode === "dark" ? "light" : "dark";
            localStorage.setItem("theme", state.mode);
        },
        setTheme: (state, action) => {
            state.mode = action.payload;
            localStorage.setItem("theme", state.mode);
        },
    },
});

export const { toggleTheme, setTheme } = themeSlice.actions;

export default themeSlice.reducer;

export const selectTheme = (state) => state.theme.mode;
