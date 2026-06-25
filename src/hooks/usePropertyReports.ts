"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
    PropertyReport,
    PropertyReportsData,
    ReportTypeValue,
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

function getAvatarUrl(avatarUrl: string): string {
    if (!avatarUrl) return "";
    if (avatarUrl.startsWith("http://") || avatarUrl.startsWith("https://"))
        return avatarUrl;
    const base =
        process.env.NEXT_PUBLIC_STORAGE_URL ||
        process.env.NEXT_PUBLIC_API_URL ||
        "";
    return `${base}/${avatarUrl}`;
}

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
        reporterAvatar: getAvatarUrl(item.user?.avatarUrl ?? ""),
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

    // ─── Pagination State ────────────────────────────────────────────
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.max(1, Math.ceil(totalCount / ROWS_PER_PAGE));

    // ─── Filter State ────────────────────────────────────────────────
    const [searchQuery, setSearchQuery] = useState("");
    const [reportType, setReportType] = useState<ReportTypeValue>("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [showFilters, setShowFilters] = useState(false);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // ─── Client-side fetch via axios ──────────────────────────────────
    const loadPage = useCallback(
        async (
            page: number,
            opts?: {
                filter?: string;
                type?: string;
                createdAtGte?: string;
                createdAtLte?: string;
            },
        ) => {
            setIsLoading(true);
            try {
                const offset = (page - 1) * ROWS_PER_PAGE;
                const params = new URLSearchParams({
                    offset: String(offset),
                    limit: String(ROWS_PER_PAGE),
                });
                if (opts?.filter) params.set("filter", opts.filter);
                if (opts?.type) params.set("type", opts.type);
                if (opts?.createdAtGte)
                    params.set("createdAtGte", opts.createdAtGte);
                if (opts?.createdAtLte)
                    params.set("createdAtLte", opts.createdAtLte);

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

    // ─── Build current filter opts ───────────────────────────────────
    const currentFilters = useCallback(
        () => ({
            filter: searchQuery || undefined,
            type: reportType || undefined,
            createdAtGte: startDate || undefined,
            createdAtLte: endDate || undefined,
        }),
        [searchQuery, reportType, startDate, endDate],
    );

    // ─── Page change handler ─────────────────────────────────────────
    const handlePageChange = useCallback(
        (page: number) => {
            setCurrentPage(page);
            loadPage(page, currentFilters());
        },
        [loadPage, currentFilters],
    );

    // ─── Search with debounce ─────────────────────────────────────────
    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            setCurrentPage(1);
            loadPage(1, currentFilters());
        }, 400);
        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, [searchQuery, reportType, startDate, endDate, loadPage, currentFilters]);

    // ─── Reset all filters ───────────────────────────────────────────
    const resetFilters = useCallback(() => {
        setSearchQuery("");
        setReportType("");
        setStartDate("");
        setEndDate("");
    }, []);

    const hasActiveFilters = Boolean(
        searchQuery || reportType || startDate || endDate,
    );

    return {
        // Data
        reports,
        totalCount,
        isLoading,

        // Pagination
        currentPage,
        totalPages,
        handlePageChange,

        // Filters
        searchQuery,
        setSearchQuery,
        reportType,
        setReportType,
        startDate,
        setStartDate,
        endDate,
        setEndDate,
        showFilters,
        setShowFilters,
        hasActiveFilters,
        resetFilters,
    };
};

export default usePropertyReports;
