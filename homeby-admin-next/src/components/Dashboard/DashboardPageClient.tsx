"use client";

import { Timeframe } from "@/actions/dashboardActions";
import useDashboard from "@/hooks/useDashboard";
import KPICards from "./KPICards";
import AttentionAlerts from "./AttentionAlerts";
import OnboardingPipeline from "./OnboardingPipeline";
import UserActivityChart from "./UserActivityChart";
import DemandHotspots from "./DemandHotspots";
import SystemHealth from "./SystemHealth";

const DashboardPageClient = () => {
    const {
        overview,
        attention,
        pipeline,
        userActivity,
        hotspots,
        isLoading,
        isError,
        timeframe,
        setTimeframe,
        TIMEFRAMES,
        getTrendClass,
        getAttentionLink,
    } = useDashboard();

    if (isError) {
        return (
            <div className="w-full max-w-content mx-auto pb-12 flex flex-col gap-6 font-sans">
                <div>
                    <h1 className="text-2xl font-bold text-text">Dashboard</h1>
                    <p className="text-sm text-muted mt-0.5">
                        Overview of platform activity and operational health.
                    </p>
                </div>
                <div className="bg-card border border-border rounded-lg p-12 text-center">
                    <p className="text-danger font-medium">
                        Failed to load dashboard data. Please try again later.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-content mx-auto pb-12 flex flex-col gap-6 font-sans">
            {/* Header + Timeframe */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-text">Dashboard</h1>
                    <p className="text-sm text-muted mt-0.5">
                        Overview of platform activity and operational health.
                    </p>
                </div>
                <div className="flex items-center bg-card border border-border rounded-lg p-0.5 self-start sm:self-auto shadow-sm">
                    {TIMEFRAMES.map((tf: Timeframe) => (
                        <button
                            key={tf}
                            onClick={() => setTimeframe(tf)}
                            className={`px-3 py-1 text-xs font-bold rounded transition-all cursor-pointer ${
                                timeframe === tf
                                    ? "bg-text text-card shadow-sm"
                                    : "text-muted hover:text-text"
                            }`}
                        >
                            {tf}
                        </button>
                    ))}
                </div>
            </div>

            {isLoading ? (
                <DashboardSkeleton />
            ) : (
                <>
                    {overview?.kpis && (
                        <KPICards
                            kpis={overview.kpis}
                            getTrendClass={getTrendClass}
                        />
                    )}

                    {attention && (
                        <AttentionAlerts
                            items={attention}
                            getAttentionLink={getAttentionLink}
                        />
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {pipeline && <OnboardingPipeline pipeline={pipeline} />}
                        {userActivity && <UserActivityChart data={userActivity} />}
                    </div>

                    {hotspots && <DemandHotspots hotspots={hotspots} />}

                    {overview?.systemHealth && (
                        <SystemHealth health={overview.systemHealth} />
                    )}
                </>
            )}
        </div>
    );
};

function DashboardSkeleton() {
    return (
        <div className="space-y-6 animate-pulse">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div
                        key={i}
                        className="bg-card border border-border rounded-lg p-5 h-[110px]"
                    />
                ))}
            </div>
            <div className="flex gap-3">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div
                        key={i}
                        className="bg-card border border-border rounded-md h-9 w-40"
                    />
                ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-card border border-border rounded-lg p-6 h-[220px]" />
                <div className="bg-card border border-border rounded-lg p-6 h-[220px]" />
            </div>
            <div className="bg-card border border-border rounded-lg p-6 h-[300px]" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div
                        key={i}
                        className="bg-card border border-border rounded-lg p-4 h-[85px]"
                    />
                ))}
            </div>
        </div>
    );
}

export default DashboardPageClient;
