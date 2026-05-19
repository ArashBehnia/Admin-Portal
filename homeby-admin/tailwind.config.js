/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                page: "#F7F8FA", // bg
                card: "#FFFFFF",
                text: "#0F1115", // primary text
                muted: "#5A6068", // secondary text
                border: "#E4E6EA",
                accent: "#2563EB", // buttons, links, focus rings
                success: "#16A34A",
                warning: "#D97706",
                danger: "#DC2626",
            },
            fontFamily: {
                sans: ["Inter", "sans-serif"],
            },
            fontSize: {
                base: "14px",
                table: "13px",
                meta: "12px",
            },
            spacing: {
                row: "44px",
                form: "56px",
                sidebar: "300px",
            },
            maxWidth: {
                content: "1620px",
            },
            transitionDuration: {
                DEFAULT: "150ms",
            },
        },
    },
    plugins: [],
};
