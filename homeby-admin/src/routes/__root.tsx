import { createRootRoute, Link } from "@tanstack/react-router";
import { AuthProvider } from "../contexts/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppLayout } from "../components/layout/AppLayout";
import { ArrowLeft, LayoutDashboard, Compass } from "lucide-react";

const queryClient = new QueryClient();

const NotFoundComponent = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center font-sans">
            {/* Visual element */}
            <div className="relative mb-6">
                <div className="absolute inset-0 bg-accent/5 blur-3xl rounded-full scale-150 animate-pulse"></div>
                <div className="relative bg-card border border-border shadow-md rounded-2xl p-6 flex items-center justify-center w-24 h-24 text-accent mx-auto">
                    <Compass size={44} className="stroke-[1.5] animate-spin" style={{ animationDuration: '10s' }} />
                </div>
            </div>

            {/* Error Code & Heading */}
            <h1 className="text-8xl font-black tracking-widest text-text/10 select-none bg-gradient-to-b from-text/15 to-transparent bg-clip-text text-transparent">
                404
            </h1>
            <h2 className="text-2xl font-extrabold text-text mt-2">
                Page not found
            </h2>
            <p className="text-sm text-muted mt-2 max-w-sm leading-relaxed font-medium">
                The page you are looking for doesn't exist, has been moved, or is temporarily unavailable.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 mt-8 w-full max-w-xs sm:max-w-none justify-center">
                <button
                    onClick={() => window.history.back()}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 bg-card hover:bg-page border border-border text-text font-bold text-sm rounded-lg transition-all cursor-pointer w-full sm:w-auto shadow-sm"
                >
                    <ArrowLeft size={16} strokeWidth={2.5} />
                    <span>Go Back</span>
                </button>
                <Link
                    to="/dashboard"
                    className="flex items-center justify-center gap-2 px-5 py-2.5 bg-accent hover:bg-accent/90 text-white font-bold text-sm rounded-lg transition-all cursor-pointer w-full sm:w-auto shadow-sm shadow-accent/10"
                >
                    <LayoutDashboard size={16} strokeWidth={2.5} />
                    <span>Go to Dashboard</span>
                </Link>
            </div>
        </div>
    );
};

const RootComponent = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <AppLayout />
            </AuthProvider>
        </QueryClientProvider>
    );
}

export const Route = createRootRoute({
    component: RootComponent,
    notFoundComponent: NotFoundComponent,
});
