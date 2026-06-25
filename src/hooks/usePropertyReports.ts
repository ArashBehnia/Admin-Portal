"use client";

import { useState, useEffect, useCallback } from "react";
import {
    PropertyReport,
    PropertyReportsData,
    ReportTypeFilter,
    ROWS_PER_PAGE,
} from "@/types/propertyReportTypes";
import api from "@/lib/axios";

interface UsePropertyReportsProps {
    initialData: PropertyReportsData;
}

type ApiReportItem = {
    id: string;
    type: string;
    message: string;
    createdAt: string;
    user: {
        firstName: string;
        lastName: string;
        email: string;
        avatarUrl: string;
        role: string;
    };
    property: {
        name: string;
        address: string;
        type: string;
        bedrooms: number;
        bathrooms: number;
        carSpaces: number;
    };
};

type ApiPage = {
    data: ApiReportItem[];
    total: number;
};

function mapReport(item: ApiReportItem): PropertyReport {
    return {
        id: item.id,
        type: item.type,
        message: item.message,
        createdAt: item.createdAt,
        propertyName: item.property?.name ?? "",
        propertyAddress: item.property?.address ?? "",
        propertyType: item.property?.type ?? "",
        bedrooms: item.property?.bedrooms ?? 0,
        bathrooms: item.property?.bathrooms ?? 0,
        carSpaces: item.property?.carSpaces ?? 0,
        reporterName: `${item.user?.firstName ?? ""} ${item.user?.lastName ?? ""}`.trim(),
        reporterEmail: item.user?.email ?? "",
        reporterAvatar: item.user?.avatarUrl ?? "",
        reporterRole: item.user?.role ?? "",
    };
}

function mapPageData(page: ApiPage): PropertyReportsData {
    const items = Array.isArray(page.data) ? page.data : [];
    const reports = items.map(mapReport);
    return { reports, total: page.total };
}

const usePropertyReports = ({ initialData }: UsePropertyReportsProps) => {
    // ─── Data ─────────────────────────────────────────────────────────
    const [reports, setReports] = useState<PropertyReport[]>(
        initialData?.reports ?? [],
    );
    const [totalCount, setTotalCount] = useState(initialData?.total ?? 0);
    const [isLoading, setIsLoading] = useState(false);
    const [isSearching, setIsSearching] = useState(false);

    // ─── Pagination State ────────────────────────────────────────────
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.max(1, Math.ceil(totalCount / ROWS_PER_PAGE));

    // ─── UI State ─────────────────────────────────────────────────────
    const [searchQuery, setSearchQuery] = useState("");
    const [activeFilter, setActiveFilter] = useState<ReportTypeFilter>("All");

    // ─── Client-side fetch via axios ──────────────────────────────────
    const loadPage = useCallback(
        async (page: number, keywords?: string) => {
            setIsLoading(true);
            try {
                const offset = (page - 1) * ROWS_PER_PAGE;
                const params = new URLSearchParams({
                    offset: String(offset),
                    limit: String(ROWS_PER_PAGE),
                });
                if (keywords) params.set("keywords", keywords);

                const res = await api.get(
                    `/api/property-reports/page?${params.toString()}`,
                );

                const rawPage = res.data?.data ?? res.data;
                const pageData: ApiPage = {
                    data: Array.isArray(rawPage?.data)
                        ? rawPage.data
                        : Array.isArray(rawPage)
                          ? rawPage
                          : [],
                    total: rawPage?.total ?? 0,
                };
                const result = mapPageData(pageData);

                setReports(result.reports);
                setTotalCount(result.total);
            } catch (err) {
                console.error("Failed to load property reports:", err);
            } finally {
                setIsLoading(false);
            }
        },
        [],
    );

    // ─── Page change handler ─────────────────────────────────────────
    const handlePageChange = useCallback(
        (page: number) => {
            setCurrentPage(page);
            loadPage(page, searchQuery || undefined);
        },
        [loadPage, searchQuery],
    );

    // ─── Search with debounce ─────────────────────────────────────────
    useEffect(() => {
        setCurrentPage(1);
        if (!searchQuery) {
            loadPage(1);
            return;
        }
        setIsSearching(true);
        const timer = setTimeout(() => {
            loadPage(1, searchQuery).finally(() => setIsSearching(false));
        }, 400);
        return () => clearTimeout(timer);
    }, [searchQuery, loadPage]);

    // ─── Derived / Computed (client-side type filter) ─────────────────
    const filteredReports = reports.filter((report) => {
        if (activeFilter === "All") return true;
        const reportType = report.type.toLowerCase();
        if (activeFilter === "Pest") return reportType === "pest";
        if (activeFilter === "Building") return reportType === "building";
        if (activeFilter === "Both") return reportType === "both";
        return true;
    });

    return {
        // Data
        filteredReports,
        totalCount,
        isLoading: isLoading || isSearching,

        // Pagination
        currentPage,
        totalPages,
        handlePageChange,

        // UI State
        searchQuery,
        setSearchQuery,
        activeFilter,
        setActiveFilter,
    };
};

export default usePropertyReports;
