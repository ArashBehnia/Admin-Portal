import { QueryClient, dehydrate, HydrationBoundary } from "@tanstack/react-query";
import {
    fetchOverview,
    fetchAttentionAlerts,
    fetchOnboardingPipeline,
    fetchUserActivity,
    fetchDemandHotspots,
} from "@/lib/dashboard-service";
import DashboardPageClient from "@/components/Dashboard/DashboardPageClient";

export default async function DashboardPage() {
    const queryClient = new QueryClient();

    await Promise.allSettled([
        queryClient.prefetchQuery({
            queryKey: ["dashboard", "overview"],
            queryFn: fetchOverview,
        }),
        queryClient.prefetchQuery({
            queryKey: ["dashboard", "attention"],
            queryFn: fetchAttentionAlerts,
        }),
        queryClient.prefetchQuery({
            queryKey: ["dashboard", "pipeline"],
            queryFn: fetchOnboardingPipeline,
        }),
        queryClient.prefetchQuery({
            queryKey: ["dashboard", "user-activity", 30],
            queryFn: () => fetchUserActivity(30),
        }),
        queryClient.prefetchQuery({
            queryKey: ["dashboard", "hotspots", 7],
            queryFn: () => fetchDemandHotspots(7, 10),
        }),
    ]);

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <DashboardPageClient />
        </HydrationBoundary>
    );
}
