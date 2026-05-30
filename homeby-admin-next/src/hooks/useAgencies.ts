"use client";

import { useState } from "react";
import { Agency, AgenciesData, AgencyFilter } from "@/actions/agenciesActions";

interface UseAgenciesProps {
    initialData: AgenciesData;
}

const useAgencies = ({ initialData }: UseAgenciesProps) => {
    // ─── Data ─────────────────────────────────────────────────────────
    const stats = initialData?.stats ?? {
        total: "0",
        active: "0",
        onboarding: "0",
        suspended: "0",
    };
    const agencies: Agency[] = initialData?.agencies ?? [];

    // ─── UI State ─────────────────────────────────────────────────────
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeFilter, setActiveFilter] = useState<AgencyFilter>("All");
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);

    // ─── Derived / Computed ───────────────────────────────────────────
    const filteredAgencies = agencies.filter((agency) => {
        const matchesSearch =
            agency?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            agency?.location?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesFilter = (() => {
            if (activeFilter === "All") return true;
            if (activeFilter === "Active") return agency?.onboarding === "Live";
            if (activeFilter === "Onboarding")
                return (
                    agency?.onboarding !== "Live" &&
                    agency?.subscription !== "Trial"
                );
            if (activeFilter === "Trial")
                return agency?.subscription === "Trial";
            if (activeFilter === "Suspended")
                return agency?.highlight === "red";
            return true;
        })();

        return matchesSearch && matchesFilter;
    });

    // ─── Handlers ─────────────────────────────────────────────────────
    const toggleMenu = (id: string) => {
        setOpenMenuId((prev) => (prev === id ? null : id));
    };

    const closeMenu = () => setOpenMenuId(null);

    return {
        // Data
        stats,
        filteredAgencies,

        // UI State
        isModalOpen,
        setIsModalOpen,
        searchQuery,
        setSearchQuery,
        activeFilter,
        setActiveFilter,
        openMenuId,

        // Handlers
        toggleMenu,
        closeMenu,
    };
};

export default useAgencies;
