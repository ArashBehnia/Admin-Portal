import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useRouterState } from '@tanstack/react-router';
import { useAuth } from '../../contexts/AuthContext';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

export const AppLayout = () => {
    const { accessToken } = useAuth();
    const router = useRouterState();
    const navigate = useNavigate();
    const isLogin = router.location.pathname === "/login";
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        // If not authenticated and trying to access an authenticated route
        if (!accessToken && !isLogin) {
            navigate({ to: "/login", replace: true });
        }
        // If authenticated and trying to access login page
        else if (accessToken && isLogin) {
            navigate({ to: "/dashboard", replace: true });
        }
    }, [accessToken, isLogin, navigate]);

    useEffect(() => {
        // Close sidebar on route change on mobile
        setIsSidebarOpen(false);
    }, [router.location.pathname]);

    // Render loading indicator during auth redirect to prevent flash
    if (!accessToken && !isLogin) {
        return (
            <div className="min-h-screen bg-page flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

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

                <main className="flex-1 p-6 max-w-content mx-auto w-full overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

