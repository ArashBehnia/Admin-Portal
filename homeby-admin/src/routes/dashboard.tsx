/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import {
    AlertTriangle,
    Clock,
    MessageSquare,
    User,
    ArrowRight,
    Loader2,
} from "lucide-react";

// TypeScript Types for the fetched Dashboard JSON data
type KPIMetric = {
    value: string;
    trend: string;
    trendType: "success" | "warning" | "danger";
};

type AttentionItem = {
    id: string;
    label: string;
    type: "success" | "warning" | "danger";
};

type OnboardingPipeline = {
    stages: { stage: string; count: number }[];
    blockedMessage: string;
};

type UserActivityPoint = {
    day: number;
    active: number;
};

type Hotspot = {
    suburb: string;
    state: string;
    activeUsers: string;
    searches: string;
    enquiries: number;
};

type SystemHealth = {
    apiStatus: { status: string; type: "success" | "warning" | "danger" };
    queueDepth: number;
    failedJobs: number;
    staleFeeds: number;
    feedsHealthy: { healthy: number; total: number };
};

type DashboardData = {
    kpis: {
        activeAgencies: KPIMetric;
        pendingApplications: KPIMetric;
        feedFailures: KPIMetric;
        mrr: KPIMetric;
    };
    attentionRequired: AttentionItem[];
    onboardingPipeline: OnboardingPipeline;
    userActivity: UserActivityPoint[];
    demandHotspots: Hotspot[];
    systemHealth: SystemHealth;
};

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-card border border-border rounded-lg p-3 shadow-xl font-sans">
                <p className="text-[11px] font-bold text-muted uppercase tracking-wider">
                    Day {payload[0].payload.day}
                </p>
                <p className="text-sm font-black text-text mt-0.5">
                    {payload[0].value.toLocaleString()} active
                </p>
            </div>
        );
    }
    return null;
};

const RouteComponent = () => {
    const [timeframe, setTimeframe] = useState<
        "7d" | "30d" | "90d" | "YTD" | "Custom"
    >("30d");

    // Fetch data using Axios + TanStack Query
    const { data, isLoading, isError } = useQuery<DashboardData>({
        queryKey: ["dashboardData"],
        queryFn: async () => {
            const response = await axios.get("/data/dashboard.json");
            return response.data;
        },
    });

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
                <Loader2 className="animate-spin text-accent" size={32} />
                <span className="text-sm text-muted font-medium">
                    Loading dashboard data...
                </span>
            </div>
        );
    }

    if (isError || !data) {
        return (
            <div className="bg-danger/10 border border-danger/20 rounded-lg p-6 text-center max-w-md mx-auto mt-12">
                <h2 className="text-lg font-bold text-danger">
                    Failed to load Dashboard
                </h2>
                <p className="text-sm text-danger/80 mt-1 leading-relaxed">
                    There was an issue fetching the dashboard stats. Please try
                    refreshing or checking the system logs.
                </p>
            </div>
        );
    }

    // Trend color helper
    const getTrendClass = (type: "success" | "warning" | "danger") => {
        if (type === "success") return "text-success";
        if (type === "warning") return "text-warning";
        return "text-danger";
    };

    // Attention alert icon helper
    const renderAttentionIcon = (id: string) => {
        switch (id) {
            case "feeds":
                return <AlertTriangle size={15} />;
            case "blocked":
                return <Clock size={15} />;
            case "reviews":
                return <MessageSquare size={15} />;
            case "applications":
            default:
                return <User size={15} />;
        }
    };

    // Attention alert link helper
    const getAttentionLink = (id: string) => {
        switch (id) {
            case "feeds":
                return "/integrations";
            case "blocked":
                return "/agencies";
            case "reviews":
                return "/moderation/reviews";
            case "applications":
                return "/applications";
            default:
                return "/dashboard";
        }
    };

    const timeframes: ("7d" | "30d" | "90d" | "YTD" | "Custom")[] = [
        "7d",
        "30d",
        "90d",
        "YTD",
        "Custom",
    ];

    return (
        <div className="w-full max-w-content mx-auto pb-12 flex flex-col gap-6 font-sans">
            {/* Header section with Timeframe Toggles */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-text">Dashboard</h1>
                    <p className="text-sm text-muted mt-0.5">
                        Overview of platform activity and operational health.
                    </p>
                </div>
                {/* Timeframe Buttons */}
                <div className="flex items-center bg-card border border-border rounded-lg p-0.5 self-start sm:self-auto shadow-sm">
                    {timeframes.map((tf) => (
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

            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Active agencies */}
                <div className="bg-card border border-border rounded-lg p-5 shadow-sm flex flex-col justify-between min-h-[110px]">
                    <div>
                        <span className="text-[13px] text-muted font-bold">
                            Active agencies
                        </span>
                        <p className="text-3xl font-black text-text mt-1">
                            {data.kpis.activeAgencies.value}
                        </p>
                    </div>
                    <p
                        className={`text-[12px] font-bold mt-2 ${getTrendClass(data.kpis.activeAgencies.trendType)}`}
                    >
                        {data.kpis.activeAgencies.trend}
                    </p>
                </div>

                {/* Pending applications */}
                <div className="bg-card border border-border rounded-lg p-5 shadow-sm flex flex-col justify-between min-h-[110px]">
                    <div>
                        <span className="text-[13px] text-muted font-bold">
                            Pending applications
                        </span>
                        <p className="text-3xl font-black text-text mt-1">
                            {data.kpis.pendingApplications.value}
                        </p>
                    </div>
                    <p
                        className={`text-[12px] font-bold mt-2 ${getTrendClass(data.kpis.pendingApplications.trendType)}`}
                    >
                        {data.kpis.pendingApplications.trend}
                    </p>
                </div>

                {/* Feed failures */}
                <div className="bg-card border border-border border-l-2 border-l-warning rounded-lg p-5 shadow-sm flex flex-col justify-between min-h-[110px]">
                    <div>
                        <span className="text-[13px] text-muted font-bold">
                            Feed failures (24h)
                        </span>
                        <p className="text-3xl font-black text-text mt-1">
                            {data.kpis.feedFailures.value}
                        </p>
                    </div>
                    <p
                        className={`text-[12px] font-bold mt-2 ${getTrendClass(data.kpis.feedFailures.trendType)}`}
                    >
                        {data.kpis.feedFailures.trend}
                    </p>
                </div>

                {/* MRR */}
                <div className="bg-card border border-border rounded-lg p-5 shadow-sm flex flex-col justify-between min-h-[110px]">
                    <div>
                        <span className="text-[13px] text-muted font-bold">
                            MRR
                        </span>
                        <p className="text-3xl font-black text-text mt-1">
                            {data.kpis.mrr.value}
                        </p>
                    </div>
                    <p
                        className={`text-[12px] font-bold mt-2 ${getTrendClass(data.kpis.mrr.trendType)}`}
                    >
                        {data.kpis.mrr.trend}
                    </p>
                </div>
            </div>

            {/* Attention Required alerts */}
            <div className="flex flex-col gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted/90">
                    Attention required
                </span>
                <div className="flex flex-wrap items-center gap-3">
                    {data.attentionRequired.map((item) => (
                        <Link
                            key={item.id}
                            to={getAttentionLink(item.id) as any}
                            className="bg-warning/10 hover:bg-warning/15 border border-warning/20 text-warning rounded-md px-3.5 py-2 flex items-center gap-2 text-xs font-semibold transition-all cursor-pointer"
                        >
                            {renderAttentionIcon(item.id)}
                            <span>{item.label}</span>
                            <ArrowRight size={13} className="stroke-[2.5]" />
                        </Link>
                    ))}
                </div>
            </div>

            {/* Split row (Onboarding stage + Activity chart) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Onboarding stage pipeline */}
                <div className="bg-card border border-border rounded-lg p-6 shadow-sm flex flex-col justify-between">
                    <div>
                        <h2 className="text-[15px] font-bold text-text">
                            Agency onboarding pipeline
                        </h2>
                        <p className="text-xs text-muted mt-0.5">
                            Counts by stage
                        </p>

                        <div className="flex items-center justify-between mt-8 select-none">
                            {data.onboardingPipeline.stages.map(
                                (stage, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-center gap-3"
                                    >
                                        {idx > 0 && (
                                            <span className="text-muted/50 text-sm font-semibold">
                                                →
                                            </span>
                                        )}
                                        <div className="flex flex-col">
                                            <span className="text-xs text-muted font-medium">
                                                {stage.stage}
                                            </span>
                                            <span className="text-2xl font-bold text-text mt-1">
                                                {stage.count}
                                            </span>
                                        </div>
                                    </div>
                                ),
                            )}
                        </div>
                    </div>
                    <div className="mt-8 pt-4 border-t border-border/50">
                        <a
                            href="/agencies"
                            className="text-xs text-warning hover:underline font-bold inline-flex items-center gap-1"
                        >
                            <span>
                                {data.onboardingPipeline.blockedMessage}
                            </span>
                            <span>→</span>
                        </a>
                    </div>
                </div>

                {/* User Activity Chart */}
                <div className="bg-card border border-border rounded-lg p-6 shadow-sm flex flex-col">
                    <h2 className="text-[15px] font-bold text-text">
                        User activity (30d)
                    </h2>
                    <div className="h-60 w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                                data={data.userActivity}
                                margin={{
                                    top: 10,
                                    right: 10,
                                    left: -20,
                                    bottom: 0,
                                }}
                            >
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    vertical={false}
                                    stroke="#E4E6EA"
                                />
                                <XAxis
                                    dataKey="day"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{
                                        fill: "#5A6068",
                                        fontSize: 10,
                                        fontWeight: 500,
                                    }}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{
                                        fill: "#5A6068",
                                        fontSize: 10,
                                        fontWeight: 500,
                                    }}
                                    domain={[0, 12000]}
                                    ticks={[0, 3000, 6000, 9000, 12000]}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Line
                                    type="monotone"
                                    dataKey="active"
                                    stroke="#2563EB"
                                    strokeWidth={2}
                                    dot={false}
                                    activeDot={{
                                        r: 5,
                                        stroke: "#ffffff",
                                        strokeWidth: 2,
                                    }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Demand hotspots Suburbs table */}
            <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
                <div className="mb-4">
                    <h2 className="text-[15px] font-bold text-text">
                        Demand hotspots
                    </h2>
                    <p className="text-xs text-muted mt-0.5">
                        Top suburbs by activity, last 7 days
                    </p>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-sm">
                        <thead>
                            <tr className="border-b border-border bg-card text-[12px] text-muted font-bold uppercase tracking-wider">
                                <th className="pb-3 pt-1 font-bold">Suburb</th>
                                <th className="pb-3 pt-1 font-bold">State</th>
                                <th className="pb-3 pt-1 font-bold text-right">
                                    Active users
                                </th>
                                <th className="pb-3 pt-1 font-bold text-right">
                                    Searches this week
                                </th>
                                <th className="pb-3 pt-1 font-bold text-right">
                                    Enquiries this week
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/60">
                            {data.demandHotspots.map((row, idx) => (
                                <tr
                                    key={idx}
                                    className="hover:bg-page/20 transition-colors"
                                >
                                    <td className="py-3.5 text-text font-bold">
                                        {row.suburb}
                                    </td>
                                    <td className="py-3.5 text-muted font-semibold">
                                        {row.state}
                                    </td>
                                    <td className="py-3.5 text-text text-right font-medium">
                                        {row.activeUsers}
                                    </td>
                                    <td className="py-3.5 text-text text-right font-medium">
                                        {row.searches}
                                    </td>
                                    <td className="py-3.5 text-text text-right font-medium">
                                        {row.enquiries}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* System Health Section */}
            <div className="flex flex-col gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted/90">
                    System health
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                    {/* API status */}
                    <div className="bg-card border border-border rounded-lg p-4 shadow-sm flex flex-col justify-between min-h-[85px]">
                        <span className="text-[12px] text-muted font-bold">
                            API status
                        </span>
                        <div className="flex items-center gap-2 mt-2">
                            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                            <span className="text-sm font-bold text-text">
                                {data.systemHealth.apiStatus.status}
                            </span>
                        </div>
                    </div>

                    {/* Queue depth */}
                    <div className="bg-card border border-border rounded-lg p-4 shadow-sm flex flex-col justify-between min-h-[85px]">
                        <span className="text-[12px] text-muted font-bold">
                            Queue depth (REAXML)
                        </span>
                        <span className="text-lg font-black text-text mt-2">
                            {data.systemHealth.queueDepth}
                        </span>
                    </div>

                    {/* Failed jobs */}
                    <div className="bg-card border border-border rounded-lg p-4 shadow-sm flex flex-col justify-between min-h-[85px]">
                        <span className="text-[12px] text-muted font-bold">
                            Failed jobs (24h)
                        </span>
                        <span className="text-lg font-black text-text mt-2">
                            {data.systemHealth.failedJobs}
                        </span>
                    </div>

                    {/* Stale feeds */}
                    <div className="bg-card border border-border border-l-2 border-l-warning rounded-lg p-4 shadow-sm flex flex-col justify-between min-h-[85px]">
                        <span className="text-[12px] text-muted font-bold">
                            Stale feeds &gt;24h
                        </span>
                        <div className="flex items-center gap-2 mt-2">
                            <span className="w-2 h-2 rounded-full bg-warning" />
                            <span className="text-lg font-black text-text">
                                {data.systemHealth.staleFeeds}
                            </span>
                        </div>
                    </div>

                    {/* Feeds healthy */}
                    <div className="bg-card border border-border rounded-lg p-4 shadow-sm flex flex-col justify-between min-h-[85px]">
                        <span className="text-[12px] text-muted font-bold">
                            Feeds healthy
                        </span>
                        <div className="flex items-center gap-2 mt-2">
                            <span className="w-2 h-2 rounded-full bg-success" />
                            <span className="text-lg font-black text-text">
                                {data.systemHealth.feedsHealthy.healthy} /{" "}
                                {data.systemHealth.feedsHealthy.total}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const Route = createFileRoute("/dashboard")({
    component: RouteComponent,
});
