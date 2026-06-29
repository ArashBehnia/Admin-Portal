"use client";

import { useQuery } from "@tanstack/react-query";
import {
    OverviewData,
    AttentionItem,
    OnboardingPipeline,
    UserActivityPoint,
    Hotspot,
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

export default function useDashboard() {
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
        queryKey: ["dashboard", "user-activity"],
        queryFn: () => fetchJson(`/api/dashboard/user-activity?days=30`),
        select: (data) => toArray<UserActivityPoint>(data),
    });

    const hotspots = useQuery({
        queryKey: ["dashboard", "hotspots"],
        queryFn: () =>
            fetchJson(`/api/dashboard/demand-hotspots?days=30&limit=10`),
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
        getTrendClass,
        getAttentionLink,
    };
}
