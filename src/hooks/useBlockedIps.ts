/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
    BlockedIp,
    BlockedIpsData,
    StrategyValue,
    ReasonValue,
    ROWS_PER_PAGE,
} from "@/types/blockedIpTypes";
import api from "@/lib/axios";

interface UseBlockedIpsProps {
    initialData: BlockedIpsData;
}

type ApiBlockedIpItem = {
    key: string;
    ip?: string;
    identity?: string;
    strategy: string;
    reason: string;
    blockedAt: string;
    ttlSeconds?: number | null;
    meta: any;
};

type ApiPage = {
    data: ApiBlockedIpItem[];
    total: number;
};

function mapEntry(item: ApiBlockedIpItem): BlockedIp {
    return {
        id: item.key || "",
        ipOrUser: item.ip || item.identity || "",
        strategy: item.strategy ?? "",
        reason: item.reason ?? "",
        blockedAt: item.blockedAt ?? "",
        ttl: item.ttlSeconds ? String(item.ttlSeconds) : "",
        meta: item.meta ?? "",
    };
}

function mapPageData(page: ApiPage): BlockedIpsData {
    const items = Array.isArray(page.data) ? page.data : [];
    const entries = items.map(mapEntry);
    return { entries, total: page.total };
}

const useBlockedIps = ({ initialData }: UseBlockedIpsProps) => {
    // ─── Data ─────────────────────────────────────────────────────────
    const [entries, setEntries] = useState<BlockedIp[]>(
        initialData?.entries ?? [],
    );
    const [totalCount, setTotalCount] = useState(initialData?.total ?? 0);
    const [isLoading, setIsLoading] = useState(false);

    // ─── Pagination State ────────────────────────────────────────────
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.max(1, Math.ceil(totalCount / ROWS_PER_PAGE));

    // ─── Filter State ────────────────────────────────────────────────
    const [searchQuery, setSearchQuery] = useState("");
    const [strategy, setStrategy] = useState<StrategyValue>("");
    const [reason, setReason] = useState<ReasonValue>("");
    const [showFilters, setShowFilters] = useState(false);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // ─── Client-side fetch via axios ──────────────────────────────────
    const loadPage = useCallback(
        async (
            page: number,
            opts?: {
                filter?: string;
                strategy?: string;
                reason?: string;
            },
        ) => {
            setIsLoading(true);
            try {
                const params = new URLSearchParams({
                    limit: String(ROWS_PER_PAGE),
                    page: String(page),
                });
                if (opts?.filter) params.set("filter", opts.filter);
                if (opts?.strategy) params.set("strategy", opts.strategy);
                if (opts?.reason) params.set("reason", opts.reason);

                const res = await api.get(
                    `/api/blocked-ips/page?${params.toString()}`,
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

                setEntries(result.entries);
                setTotalCount(result.total);
            } catch (err) {
                console.error("Failed to load blocked IPs:", err);
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
            strategy: strategy || undefined,
            reason: reason || undefined,
        }),
        [searchQuery, strategy, reason],
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
    }, [searchQuery, strategy, reason, loadPage, currentFilters]);

    // ─── Reset all filters ───────────────────────────────────────────
    const resetFilters = useCallback(() => {
        setSearchQuery("");
        setStrategy("");
        setReason("");
    }, []);

    const hasActiveFilters = Boolean(searchQuery || strategy || reason);

    return {
        // Data
        entries,
        totalCount,
        isLoading,

        // Pagination
        currentPage,
        totalPages,
        handlePageChange,

        // Filters
        searchQuery,
        setSearchQuery,
        strategy,
        setStrategy,
        reason,
        setReason,
        showFilters,
        setShowFilters,
        hasActiveFilters,
        resetFilters,
    };
};

export default useBlockedIps;
