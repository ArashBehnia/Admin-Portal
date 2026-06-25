"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
    FtpRequest,
    FtpRequestsData,
    StatusValue,
    ROWS_PER_PAGE,
} from "@/types/ftpRequestTypes";
import api from "@/lib/axios";

interface UseFtpRequestsProps {
    initialData: FtpRequestsData;
}

type ApiFtpRequestItem = {
    id: string;
    agency: { id: string; name: string };
    agent: { id: string; firstName: string; lastName: string; email: string };
    email: string;
    allowedIp: string;
    ftpUsername: string;
    status: string;
    requestedAt: string;
};

type ApiPage = {
    data: ApiFtpRequestItem[];
    total: number;
};

function mapRequest(item: ApiFtpRequestItem): FtpRequest {
    return {
        id: item.id,
        agencyName: item.agency?.name ?? "",
        agentName: `${item.agent?.firstName ?? ""} ${item.agent?.lastName ?? ""}`.trim(),
        agentEmail: item.agent?.email ?? "",
        email: item.email ?? "",
        allowedIp: item.allowedIp ?? "",
        ftpUsername: item.ftpUsername ?? "",
        status: item.status ?? "",
        requestedAt: item.requestedAt ?? "",
    };
}

function mapPageData(page: ApiPage): FtpRequestsData {
    const items = Array.isArray(page.data) ? page.data : [];
    const requests = items.map(mapRequest);
    return { requests, total: page.total };
}

const useFtpRequests = ({ initialData }: UseFtpRequestsProps) => {
    // ─── Data ─────────────────────────────────────────────────────────
    const [requests, setRequests] = useState<FtpRequest[]>(
        initialData?.requests ?? [],
    );
    const [totalCount, setTotalCount] = useState(initialData?.total ?? 0);
    const [isLoading, setIsLoading] = useState(false);

    // ─── Pagination State ────────────────────────────────────────────
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.max(1, Math.ceil(totalCount / ROWS_PER_PAGE));

    // ─── Filter State ────────────────────────────────────────────────
    const [searchQuery, setSearchQuery] = useState("");
    const [status, setStatus] = useState<StatusValue>("");
    const [showFilters, setShowFilters] = useState(false);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // ─── Client-side fetch via axios ──────────────────────────────────
    const loadPage = useCallback(
        async (
            page: number,
            opts?: {
                filter?: string;
                status?: string;
            },
        ) => {
            setIsLoading(true);
            try {
                const params = new URLSearchParams({
                    page: String(page),
                    limit: String(ROWS_PER_PAGE),
                });
                if (opts?.filter) params.set("filter", opts.filter);
                if (opts?.status) params.set("status", opts.status);

                const res = await api.get(
                    `/api/ftp-requests/page?${params.toString()}`,
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

                setRequests(result.requests);
                setTotalCount(result.total);
            } catch (err) {
                console.error("Failed to load FTP requests:", err);
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
            status: status || undefined,
        }),
        [searchQuery, status],
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
    }, [searchQuery, status, loadPage, currentFilters]);

    // ─── Reset all filters ───────────────────────────────────────────
    const resetFilters = useCallback(() => {
        setSearchQuery("");
        setStatus("");
    }, []);

    const hasActiveFilters = Boolean(searchQuery || status);

    return {
        // Data
        requests,
        totalCount,
        isLoading,

        // Pagination
        currentPage,
        totalPages,
        handlePageChange,

        // Filters
        searchQuery,
        setSearchQuery,
        status,
        setStatus,
        showFilters,
        setShowFilters,
        hasActiveFilters,
        resetFilters,
    };
};

export default useFtpRequests;
