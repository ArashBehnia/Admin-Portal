import { useState, useEffect } from 'react';
import { Outlet, useRouterState } from '@tanstack/react-router';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

// AUTH IS DISABLED FOR DESIGN MODE — reconnect when the real API is ready.
export const AppLayout = () => {
    const router = useRouterState();
    const isLogin = router.location.pathname === "/login";
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        // Close sidebar on route change on mobile
        setIsSidebarOpen(false);
    }, [router.location.pathname]);

    if (isLogin) {
        return (
            <div className="min-h-screen bg-page flex w-full">
                <main className="flex-1 w-full">
                    <Outlet />
                </main>
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
            <div className={`
                fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out lg:translate-x-0
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <Sidebar onClose={() => setIsSidebarOpen(false)} />
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 lg:ml-[200px] xl:ml-[300px] h-screen transition-all duration-300">
                <Topbar onOpenSidebar={() => setIsSidebarOpen(true)} />

                <main className="flex-1 p-6 w-full">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

