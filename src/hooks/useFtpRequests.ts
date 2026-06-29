"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
    FtpRequest,
    FtpRequestsData,
    StatusValue,
} from "@/types/ftpRequestTypes";
import api from "@/lib/axios";

interface UseFtpRequestsProps {
    initialData: FtpRequestsData;
}

type ApiFtpRequestItem = {
    id: string;
    agencyName: string;
    agentName: string;
    agentEmail: string;
    requestedIp: string;
    status: string;
    ftpUsername: string | null;
    createdAt: string;
    adminMessage: string | null;
    approvedAt: string | null;
    rejectedAt: string | null;
};

function mapRequest(item: ApiFtpRequestItem): FtpRequest {
    return {
        id: item.id,
        agencyName: item.agencyName ?? "",
        agentName: item.agentName ?? "",
        agentEmail: item.agentEmail ?? "",
        allowedIp: item.requestedIp ?? "",
        ftpUsername: item.ftpUsername ?? "",
        status: item.status ?? "",
        requestedAt: item.createdAt ?? "",
        adminMessage: item.adminMessage ?? null,
        approvedAt: item.approvedAt ?? null,
        rejectedAt: item.rejectedAt ?? null,
    };
}

const useFtpRequests = ({ initialData }: UseFtpRequestsProps) => {
    const [requests, setRequests] = useState<FtpRequest[]>(
        initialData?.requests ?? [],
    );
    const [totalCount, setTotalCount] = useState(initialData?.total ?? 0);
    const [isLoading, setIsLoading] = useState(false);
    const [pageSize, setPageSize] = useState(10);
    const pageSizeRef = useRef(pageSize);
    pageSizeRef.current = pageSize;
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

    const [searchQuery, setSearchQuery] = useState("");
    const [status, setStatus] = useState<StatusValue>("");
    const [showFilters, setShowFilters] = useState(false);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const isInitialMount = useRef(true);

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
                const offset = (page - 1) * pageSizeRef.current;
                const params = new URLSearchParams({
                    limit: String(pageSizeRef.current),
                    offset: String(offset),
                    sortOrder: "1",
                });
                if (opts?.filter) params.set("filter", opts.filter);
                if (opts?.status) params.set("status", opts.status);

                const res = await api.get(
                    `/api/ftp-requests/page?${params.toString()}`,
                );

                const pageData = res.data;
                const items: ApiFtpRequestItem[] = Array.isArray(pageData?.data)
                    ? pageData.data
                    : Array.isArray(pageData)
                      ? pageData
                      : [];

                setRequests(items.map(mapRequest));
                setTotalCount(pageData?.total ?? items.length);
            } catch (err) {
                console.error("Failed to load FTP requests:", err);
            } finally {
                setIsLoading(false);
            }
        },
        [],
    );

    const currentFilters = useCallback(
        () => ({
            filter: searchQuery || undefined,
            status: status || undefined,
        }),
        [searchQuery, status],
    );

    const handlePageChange = useCallback(
        (page: number) => {
            setCurrentPage(page);
            loadPage(page, currentFilters());
        },
        [loadPage, currentFilters],
    );

    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);

        debounceRef.current = setTimeout(() => {
            if (isInitialMount.current) {
                isInitialMount.current = false;
                const hasFilters = searchQuery || status;
                if (!hasFilters) return;
            }
            setCurrentPage(1);
            loadPage(1, currentFilters());
        }, 400);

        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, [searchQuery, status, loadPage, currentFilters]);

    useEffect(() => {
        setCurrentPage(1);
        loadPage(1, currentFilters());
    }, [pageSize, loadPage, currentFilters]);

    const resetFilters = useCallback(() => {
        setSearchQuery("");
        setStatus("");
    }, []);

    const hasActiveFilters = Boolean(searchQuery || status);

    const approveRequest = useCallback(
        async (id: string) => {
            setIsLoading(true);
            try {
                const res = await api.post(`/api/ftp-requests/${id}/approve`);
                const updated = res.data;
                setRequests((prev) =>
                    prev.map((r) =>
                        r.id === id
                            ? {
                                  ...r,
                                  status: updated.status ?? "approved",
                                  approvedAt: updated.approvedAt ?? null,
                                  rejectedAt: updated.rejectedAt ?? null,
                                  adminMessage: updated.adminMessage ?? r.adminMessage,
                              }
                            : r,
                    ),
                );
            } catch (err) {
                console.error("Failed to approve FTP request:", err);
                throw err;
            } finally {
                setIsLoading(false);
            }
        },
        [],
    );

    const rejectRequest = useCallback(
        async (id: string, reason: string) => {
            setIsLoading(true);
            try {
                const res = await api.post(`/api/ftp-requests/${id}/reject`, { reason });
                const updated = res.data;
                setRequests((prev) =>
                    prev.map((r) =>
                        r.id === id
                            ? {
                                  ...r,
                                  status: updated.status ?? "rejected",
                                  adminMessage: updated.adminMessage ?? reason,
                                  rejectedAt: updated.rejectedAt ?? null,
                                  approvedAt: updated.approvedAt ?? null,
                              }
                            : r,
                    ),
                );
            } catch (err) {
                console.error("Failed to reject FTP request:", err);
                throw err;
            } finally {
                setIsLoading(false);
            }
        },
        [],
    );

    return {
        requests,
        totalCount,
        isLoading,
        currentPage,
        totalPages,
        pageSize,
        setPageSize,
        handlePageChange,
        searchQuery,
        setSearchQuery,
        status,
        setStatus,
        showFilters,
        setShowFilters,
        hasActiveFilters,
        resetFilters,
        approveRequest,
        rejectRequest,
    };
};

export default useFtpRequests;
