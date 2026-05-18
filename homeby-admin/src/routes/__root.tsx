import { createRootRoute } from "@tanstack/react-router";
import { AuthProvider } from "../contexts/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppLayout } from "../components/layout/AppLayout";

const queryClient = new QueryClient();

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
});
