import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss()],
    server: {
        proxy: {
            "/api/v1": {
                target: "http://localhost:8000",
                changeOrigin: true,
            },
        },
    },
    theme: {
        extend: {
            animation: {
                "scale-in": "scaleIn 0.2s ease-out",
                "fade-in": "fadeIn 0.2s ease-out",
            },
            keyframes: {
                scaleIn: {
                    "0%": { transform: "scale(0.95)", opacity: "0" },
                    "100%": { transform: "scale(1)", opacity: "1" },
                },
                fadeIn: {
                    "0%": { opacity: "0" },
                    "100%": { opacity: "1" },
                },
            },
        },
    },
});
