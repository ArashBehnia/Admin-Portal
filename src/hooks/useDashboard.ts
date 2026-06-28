"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
    OverviewData,
    AttentionItem,
    OnboardingPipeline,
    UserActivityPoint,
    Hotspot,
    Timeframe,
    TIMEFRAME_DAYS,
} from "@/actions/dashboardActions";

function toArray<T>(value: unknown): T[] {
    if (Array.isArray(value)) return value;
    if (value && typeof value === "object") {
        const obj = value as Record<string, unknown>;
        if (Array.isArray(obj.data)) return obj.data as T[];
        if (Array.isArray(obj.items)) return obj.items as T[];
        if (Array.isArray(obj.results)) return obj.results as T[];
        for (const v of Object.values(obj)) {
            if (Array.isArray(v)) return v as T[];
        }
    }
    return [];
}

const TIMEFRAMES: Timeframe[] = ["7d", "30d", "90d", "YTD"];

async function fetchJson<T>(url: string): Promise<T> {
    const res = await fetch(url);
    if (res.status === 401) {
        try {
            const refreshRes = await fetch("/api/auth/refresh", {
                method: "POST",
            });
            if (refreshRes.ok) {
                const retryRes = await fetch(url);
                if (!retryRes.ok)
                    throw new Error(`Fetch failed: ${retryRes.status}`);
                return retryRes.json();
            }
        } catch {
            // refresh failed
        }
        window.location.href = "/login";
        throw new Error("Session expired");
    }
    if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
    return res.json();
}

function daysForTimeframe(tf: Timeframe): number {
    if (tf === "YTD") {
        const now = new Date();
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        return Math.ceil((now.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24));
    }
    return TIMEFRAME_DAYS[tf];
}

export default function useDashboard() {
    const [timeframe, setTimeframe] = useState<Timeframe>("30d");
    const days = daysForTimeframe(timeframe);

    const overview = useQuery<OverviewData>({
        queryKey: ["dashboard", "overview"],
        queryFn: () => fetchJson("/api/dashboard/overview"),
    });

    const attention = useQuery({
        queryKey: ["dashboard", "attention"],
        queryFn: () => fetchJson("/api/dashboard/attention-alerts"),
        select: (data) => toArray<AttentionItem>(data),
    });

    const pipeline = useQuery<OnboardingPipeline>({
        queryKey: ["dashboard", "pipeline"],
        queryFn: () => fetchJson("/api/dashboard/onboarding-pipeline"),
    });

    const userActivity = useQuery({
        queryKey: ["dashboard", "user-activity", days],
        queryFn: () => fetchJson(`/api/dashboard/user-activity?days=${days}`),
        select: (data) => toArray<UserActivityPoint>(data),
    });

    const hotspots = useQuery({
        queryKey: ["dashboard", "hotspots", days],
        queryFn: () =>
            fetchJson(`/api/dashboard/demand-hotspots?days=${days}&limit=10`),
        select: (data) => toArray<Hotspot>(data),
    });

    const isLoading =
        overview.isLoading ||
        attention.isLoading ||
        pipeline.isLoading ||
        userActivity.isLoading ||
        hotspots.isLoading;

    const isError =
        overview.isError ||
        attention.isError ||
        pipeline.isError ||
        userActivity.isError ||
        hotspots.isError;

    const getTrendClass = (type: "success" | "warning" | "danger") => {
        switch (type) {
            case "success":
                return "text-success";
            case "warning":
                return "text-warning";
            case "danger":
                return "text-danger";
        }
    };

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

    return {
        overview: overview.data,
        attention: attention.data,
        pipeline: pipeline.data,
        userActivity: userActivity.data,
        hotspots: hotspots.data,
        isLoading,
        isError,
        timeframe,
        setTimeframe,
        TIMEFRAMES,
        getTrendClass,
        getAttentionLink,
    };
}
