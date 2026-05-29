"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Topbar from "@/components/Shared/Topbar";
import Sidebar from "@/components/Shared/Sidebar";

interface AppLayoutProps {
    children: React.ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
    const pathname = usePathname();
    const isLogin = pathname === "/login";
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        setIsSidebarOpen(false);
    }, [pathname]);

    if (isLogin) {
        return (
            <div className="min-h-screen bg-page flex w-full">
                <main className="flex-1 w-full">{children}</main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-page flex w-full">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-text/50 z-40 lg:hidden transition-opacity"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar Container */}
            <div
                className={`
                fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out lg:translate-x-0
                ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
            `}
            >
                <Sidebar onClose={() => setIsSidebarOpen(false)} />
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 lg:ml-[200px] xl:ml-[300px] transition-all duration-300">
                <Topbar onOpenSidebar={() => setIsSidebarOpen(true)} />
                <main className="flex-1 p-6 w-full">{children}</main>
            </div>
        </div>
    );
};

export default AppLayout;
