import { useState } from "react";
import { Timeframe, DashboardData } from "@/actions/dashboardActions";

interface UseDashboardProps {
    initialData: DashboardData;
}

const TIMEFRAMES: Timeframe[] = ["7d", "30d", "90d", "YTD", "Custom"];

const useDashboard = ({ initialData }: UseDashboardProps) => {
    // ─── Data ─────────────────────────────────────────────────────────
    const data = initialData;

    // ─── UI State ─────────────────────────────────────────────────────
    const [timeframe, setTimeframe] = useState<Timeframe>("30d");

    // ─── Helpers ──────────────────────────────────────────────────────
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
        data,
        timeframe,
        setTimeframe,
        TIMEFRAMES,
        getTrendClass,
        getAttentionLink,
    };
};

export default useDashboard;
