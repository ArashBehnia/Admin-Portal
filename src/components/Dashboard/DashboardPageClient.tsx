"use client";

import { RefreshCw } from "lucide-react";
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
            <div className="flex flex-col gap-5 w-full max-w-content mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div>
                        <h1 className="text-[20px] font-bold text-text leading-snug">Dashboard</h1>
                        <p className="text-[13px] text-muted mt-0.5">
                            Overview of platform activity and operational health.
                        </p>
                    </div>
                    <button
                        onClick={() => window.location.reload()}
                        className="text-muted hover:text-text p-2 rounded border border-border hover:bg-page transition-colors self-start shrink-0 cursor-pointer"
                        title="Refresh"
                    >
                        <RefreshCw className="w-4 h-4" />
                    </button>
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
        <div className="flex flex-col gap-5 w-full max-w-content mx-auto">
            {/* Header + Timeframe */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                    <h1 className="text-[20px] font-bold text-text leading-snug">Dashboard</h1>
                    <p className="text-[13px] text-muted mt-0.5">
                        Overview of platform activity and operational health.
                    </p>
                </div>
                <div className="flex items-center gap-2 self-start sm:self-auto">
                    <div className="flex items-center bg-card border border-border rounded-lg p-0.5 shadow-sm">
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
                    <button
                        onClick={() => window.location.reload()}
                        className="text-muted hover:text-text p-2 rounded border border-border hover:bg-page transition-colors cursor-pointer"
                        title="Refresh"
                    >
                        <RefreshCw className="w-4 h-4" />
                    </button>
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

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
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
        <div className="space-y-5 animate-pulse">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div
                        key={i}
                        className="bg-card border border-border rounded p-4 h-[100px]"
                    />
                ))}
            </div>
            <div className="flex gap-3">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div
                        key={i}
                        className="bg-card border border-border rounded h-9 w-40"
                    />
                ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div className="bg-card border border-border rounded p-6 h-[220px]" />
                <div className="bg-card border border-border rounded p-6 h-[220px]" />
            </div>
            <div className="bg-card border border-border rounded p-6 h-[300px]" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div
                        key={i}
                        className="bg-card border border-border rounded p-4 h-[85px]"
                    />
                ))}
            </div>
        </div>
    );
}

export default DashboardPageClient;
