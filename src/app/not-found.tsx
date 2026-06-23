/* src/app/not-found.tsx */
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Home } from "lucide-react";
// No need for AppLayout; layout already provides topbar/sidebar

export default function NotFound() {
    const router = useRouter();

    const goBack = () => router.back();

    return (
        <div className="flex flex-col items-center justify-center w-full min-h-[70dvh] text-center gap-4">
            <h1 className="text-7xl md:text-9xl font-bold text-accent mb-2">
                404
            </h1>
            <h1 className="text-2xl font-bold text-text mb-2">
                Page Not Found
            </h1>
            <div className="flex gap-4 justify-center">
                <Link
                    href="/"
                    className="px-4 py-2 bg-accent text-white rounded hover:bg-accent/90 transition"
                >
                    Dashboard
                </Link>
                <button
                    onClick={goBack}
                    className="px-4 py-2 bg-white border border-border rounded hover:bg-border transition"
                >
                    Go Back
                </button>
            </div>
        </div>
    );
}
