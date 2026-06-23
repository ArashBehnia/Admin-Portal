"use client";

import { useState } from "react";
import { AgencyTab, AgencyDetailData } from "@/actions/agenciesActions";

interface UseAgencyDetailProps {
    detailData: AgencyDetailData;
}

const useAgencyDetail = ({ detailData }: UseAgencyDetailProps) => {
    // ─── Tab State ────────────────────────────────────────────────────
    const [activeTab, setActiveTab] = useState<AgencyTab>("Overview");

    // ─── Notes State ──────────────────────────────────────────────────
    const [notes, setNotes] = useState(detailData?.internalNotes ?? "");

    // ─── Helpers ──────────────────────────────────────────────────────
    const getInitials = (name: string) =>
        name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .substring(0, 2)
            .toUpperCase();

    return {
        activeTab,
        setActiveTab,
        notes,
        setNotes,
        getInitials,
    };
};

export default useAgencyDetail;
