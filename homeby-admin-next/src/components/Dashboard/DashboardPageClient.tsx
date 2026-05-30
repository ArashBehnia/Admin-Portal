"use client";

import { DashboardData, Timeframe } from "@/actions/dashboardActions";
import useDashboard from "@/hooks/useDashboard";
import KPICards from "./KPICards";
import AttentionAlerts from "./AttentionAlerts";
import OnboardingPipeline from "./OnboardingPipeline";
import UserActivityChart from "./UserActivityChart";
import DemandHotspots from "./DemandHotspots";
import SystemHealth from "./SystemHealth";

interface DashboardPageClientProps {
    initialData: DashboardData;
}

const DashboardPageClient = ({ initialData }: DashboardPageClientProps) => {
    const {
        data,
        timeframe,
        setTimeframe,
        TIMEFRAMES,
        getTrendClass,
        getAttentionLink,
    } = useDashboard({ initialData });

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

            <KPICards kpis={data.kpis} getTrendClass={getTrendClass} />

            <AttentionAlerts
                items={data.attentionRequired}
                getAttentionLink={getAttentionLink}
            />

            {/* Onboarding Pipeline + Activity Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <OnboardingPipeline pipeline={data.onboardingPipeline} />
                <UserActivityChart data={data.userActivity} />
            </div>

            <DemandHotspots hotspots={data.demandHotspots} />

            <SystemHealth health={data.systemHealth} />
        </div>
    );
};

export default DashboardPageClient;
