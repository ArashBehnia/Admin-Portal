import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                page: "#F7F8FA",
                card: "#FFFFFF",
                text: "#0F1115",
                muted: "#5A6068",
                border: "#E4E6EA",
                accent: "#2563EB",
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

export default config;
