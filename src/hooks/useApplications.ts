import { useState, useEffect, useCallback, useRef } from "react";
import type {
    Application,
    ApplicationStatus,
    ApplicationStats,
    ApplicationTimeline,
    ApplicationListItemDto,
} from "@/types/applicationTypes";
import api from "@/lib/axios";

function formatStatus(status: string): ApplicationStatus {
    const s = status?.toLowerCase();
    if (s === "pending") return "Pending";
    if (s === "approved") return "Approved";
    if (s === "rejected") return "Rejected";
    return "Pending";
}

function formatTimeAgo(dateStr?: string): string {
    if (!dateStr) return "";
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins} min ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days} day${days > 1 ? "s" : ""} ago`;
    const months = Math.floor(days / 30);
    return `${months} month${months > 1 ? "s" : ""} ago`;
}

function mapListItem(item: ApplicationListItemDto): Application {
    const raw = item as unknown as Record<string, unknown>;
    const nested = (raw.data ?? {}) as Record<string, unknown>;
    const user = (raw.user ?? {}) as Record<string, unknown>;

    const firstName = (nested.agentFirstName ?? user.firstName ?? "") as string;
    const lastName = (nested.agentLastName ?? user.lastName ?? "") as string;
    const name = `${firstName} ${lastName}`.trim();
    const email = (nested.agentEmail ?? user.email ?? "") as string;
    const agency = (nested.agencyLegalName ?? "") as string;
    const crm = (nested.crmSelection ?? nested.crmName ?? "") as string;
    const phone = (nested.agentPhone ?? user.mobile ?? user.phone ?? "") as string;
    const submittedAt = (nested.clientSubmittedAt ?? raw.createdAt ?? "") as string;

    // console.log("[useApplications] mapListItem:", { name, email, agency, crm, phone, submittedAt });

    return {
        id: String(item.id ?? ""),
        name,
        email,
        agency,
        crm,
        submitted: formatTimeAgo(submittedAt),
        status: formatStatus(item.status),
        phone,
        rawData: raw,
    };
}

type DrawerTab = "Application" | "Verification" | "Notes";

interface UseApplicationsProps {
    initialApplications: Application[];
    initialStats: ApplicationStats;
}

const useApplications = ({ initialApplications, initialStats }: UseApplicationsProps) => {
    // ─── Data State ───────────────────────────────────────────────────
    const [applications, setApplications] =
        useState<Application[]>(initialApplications);
    const [stats, setStats] = useState<ApplicationStats>(initialStats);
    const [isLoading, setIsLoading] = useState(false);

    // ─── Search & Filter State ────────────────────────────────────────
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<
        "All" | Application["status"]
    >("All");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const pageSizeRef = useRef(pageSize);
    pageSizeRef.current = pageSize;

    // ─── Drawer State ─────────────────────────────────────────────────
    const [selectedApp, setSelectedApp] = useState<Application | null>(null);
    const [activeDrawerTab, setActiveDrawerTab] =
        useState<DrawerTab>("Application");
    const [notes, setNotes] = useState("");
    const [isSavingNote, setIsSavingNote] = useState(false);
    const [isApproving, setIsApproving] = useState(false);
    const [isRejecting, setIsRejecting] = useState(false);
    const [approveModalApp, setApproveModalApp] = useState<Application | null>(null);
    const [rejectModalApp, setRejectModalApp] = useState<Application | null>(null);
    const [toast, setToast] = useState<{ visible: boolean; title: string; message: string; type: "success" | "error" | "info" }>({
        visible: false,
        title: "",
        message: "",
        type: "success",
    });
    const [timeline, setTimeline] = useState<ApplicationTimeline>([]);
    const [isTimelineLoading, setIsTimelineLoading] = useState(false);

    // ─── Client-side fetch via axios ──────────────────────────────────
    const loadPage = useCallback(
        async (status?: string, page?: number, filter?: string) => {
            setIsLoading(true);
            const p = page ?? 1;
            const offset = (p - 1) * pageSizeRef.current;
            try {
                const params = new URLSearchParams({
                    offset: String(offset),
                    limit: String(pageSizeRef.current),
                });
                if (status && status !== "All") params.set("status", status.toLowerCase());
                if (filter) params.set("filter", filter);

                // console.log("[useApplications] loadPage -> GET /api/applications/summary + /api/applications/page?" + params.toString());

                const [summaryRes, pageRes] = await Promise.all([
                    api.get("/api/applications/summary"),
                    api.get(`/api/applications/page?${params.toString()}`),
                ]);

                // console.log("[useApplications] summaryRes.data:", JSON.stringify(summaryRes.data));
                // console.log("[useApplications] pageRes.data:", JSON.stringify(pageRes.data).slice(0, 500));

                const summary = summaryRes.data?.data ?? summaryRes.data;
                const pageData = pageRes.data;

                const items: ApplicationListItemDto[] = Array.isArray(pageData.data)
                    ? pageData.data
                    : Array.isArray(pageData)
                        ? pageData
                        : [];

                const total = pageData.total ?? items.length;
                // console.log("[useApplications] items from API:", JSON.stringify(items).slice(0, 1000));
                // console.log("[useApplications] items count:", items.length, "total:", total);

                const mapped = items.map(mapListItem);
                // console.log("[useApplications] mapped applications:", JSON.stringify(mapped).slice(0, 1000));

                setApplications(mapped);
                setTotalCount(total);
                setStats({
                    total: summary.total ?? 0,
                    pending: summary.pending ?? 0,
                    approvedThisMonth: summary.approved ?? 0,
                    rejected: summary.rejected ?? 0,
                });
            } catch (err) {
                // console.error("Failed to load applications:", err);
            } finally {
                setIsLoading(false);
            }
        },
        [],
    );

    const isInitialMount = useRef(true);
    const searchQueryRef = useRef(searchQuery);
    searchQueryRef.current = searchQuery;

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }
        setCurrentPage(1);
        const timer = setTimeout(() => {
            loadPage(statusFilter, 1, searchQuery);
        }, searchQuery ? 400 : 0);
        return () => clearTimeout(timer);
    }, [searchQuery, loadPage, statusFilter]);

    useEffect(() => {
        setCurrentPage(1);
        loadPage(statusFilter, 1, searchQueryRef.current);
    }, [pageSize, loadPage, statusFilter]);

    // ─── Status filter change ────────────────────────────────────────
    const handleStatusFilterChange = useCallback((val: "All" | Application["status"]) => {
        setStatusFilter(val);
        setCurrentPage(1);
        loadPage(val, 1, searchQueryRef.current);
    }, [loadPage]);

    // ─── Page change ────────────────────────────────────────────────
    const handlePageChange = useCallback((page: number) => {
        setCurrentPage(page);
        loadPage(statusFilter, page, searchQueryRef.current);
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [loadPage, statusFilter]);

    // ─── Handlers ─────────────────────────────────────────────────────
    const openDrawer = (app: Application) => {
        setSelectedApp(app);
        setActiveDrawerTab("Application");
        setNotes("");
        setTimeline([]);
    };

    const closeDrawer = () => {
        setSelectedApp(null);
    };

    const handleApprove = async (id: string) => {
        const app = applications.find(a => a.id === id);
        if (app) {
            setApproveModalApp(app);
        }
    };

    const confirmApprove = async (id: string) => {
        setIsApproving(true);
        try {
            // console.log("[useApplications] confirmApprove -> POST /api/applications/" + id + "/generate");
            const res = await api.post(`/api/applications/${id}/generate`);
            // console.log("[useApplications] approve response:", JSON.stringify(res.data));
            setApplications((prev) =>
                prev.map((a) =>
                    a.id === id ? { ...a, status: "Approved" as const } : a,
                ),
            );
            setApproveModalApp(null);
            setSelectedApp(null);
            setToast({ visible: true, title: "Approved", message: "Application approved successfully.", type: "success" });
            setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 3000);
            loadPage();
        } catch (err) {
            // console.error("[useApplications] approve error:", err);
            setToast({ visible: true, title: "Error", message: "Failed to approve application.", type: "error" });
            setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 3000);
        } finally {
            setIsApproving(false);
        }
    };

    const closeApproveModal = () => {
        setApproveModalApp(null);
    };

    const handleReject = (id: string) => {
        const app = applications.find(a => a.id === id);
        if (app) {
            setRejectModalApp(app);
        }
    };

    const confirmReject = async (id: string, reason: string) => {
        setIsRejecting(true);
        try {
            // console.log("[useApplications] confirmReject -> POST /api/applications/" + id + "/reject", { reason });
            const res = await api.post(`/api/applications/${id}/reject`, { reason });
            // console.log("[useApplications] reject response:", JSON.stringify(res.data));
            setApplications((prev) =>
                prev.map((a) =>
                    a.id === id ? { ...a, status: "Rejected" as const } : a,
                ),
            );
            setRejectModalApp(null);
            setSelectedApp(null);
            setToast({ visible: true, title: "Rejected", message: "Application rejected.", type: "info" });
            setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 3000);
            loadPage();
        } catch (err) {
            // console.error("[useApplications] reject error:", err);
            setToast({ visible: true, title: "Error", message: "Failed to reject application.", type: "error" });
            setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 3000);
        } finally {
            setIsRejecting(false);
        }
    };

    const closeRejectModal = () => {
        setRejectModalApp(null);
    };

    const handleRequestInfo = (id: string) => {
        setApplications((prev) =>
            prev.map((a) =>
                a.id === id ? { ...a, status: "Awaiting info" as const } : a,
            ),
        );
        if (selectedApp?.id === id) {
            setSelectedApp((prev) =>
                prev ? { ...prev, status: "Awaiting info" as const } : null,
            );
        }
    };

    const handleSaveNote = async (id: string, note: string) => {
        if (!note.trim()) return;
        setIsSavingNote(true);
        try {
            // console.log("[useApplications] handleSaveNote -> POST /api/applications/" + id + "/notes");
            // console.log("[useApplications] request body:", JSON.stringify({ note }));
            const res = await api.post(`/api/applications/${id}/notes`, { note });
            // console.log("[useApplications] saveNote response status:", res.status);
            // console.log("[useApplications] saveNote response data:", JSON.stringify(res.data));
            setNotes("");
            setToast({ visible: true, title: "Note saved", message: "Note saved successfully.", type: "success" });
            setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 3000);
            await loadTimeline(id);
        } catch (err) {
            // console.error("[useApplications] saveNote error:", err);
            setToast({ visible: true, title: "Error", message: "Failed to save note.", type: "error" });
            setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 3000);
        } finally {
            setIsSavingNote(false);
        }
    };

    const loadTimeline = useCallback(async (id: string) => {
        setIsTimelineLoading(true);
        try {
            // console.log("[useApplications] loadTimeline -> GET /api/applications/" + id + "/timeline");
            const res = await api.get(`/api/applications/${id}/timeline`);
            // console.log("[useApplications] timeline response status:", res.status);
            // console.log("[useApplications] timeline response data:", JSON.stringify(res.data));
            const data = res.data?.data ?? res.data;
            const apiTimeline = Array.isArray(data) ? data : [];

            const selected = applications.find(a => a.id === id);
            const adminNotes = ((selected?.rawData?.data as Record<string, unknown>)?.adminNotes ?? []) as Array<Record<string, unknown>>;
            const noteItems = adminNotes.map((n, i) => ({
                id: `note-${i}`,
                action: "note",
                description: (n.note ?? "") as string,
                performedBy: (n.authorId ?? "") as string,
                timestamp: (n.createdAt ?? "") as string,
            }));

            const merged = [...apiTimeline, ...noteItems];
            // console.log("[useApplications] timeline merged count:", merged.length);
            setTimeline(merged);
        } catch (err) {
            // console.error("[useApplications] timeline error:", err);
            setTimeline([]);
        } finally {
            setIsTimelineLoading(false);
        }
    }, [applications]);

    return {
        // Data
        applications,
        totalCount,
        stats,
        isLoading,

        // Search & Filter
        searchQuery,
        setSearchQuery,
        statusFilter,
        handleStatusFilterChange,
        currentPage,
        pageSize,
        setPageSize,
        handlePageChange,

        // Drawer
        selectedApp,
        activeDrawerTab,
        setActiveDrawerTab,
        notes,
        setNotes,
        isSavingNote,
        toast,
        setToast,
        isApproving,
        isRejecting,
        approveModalApp,
        confirmApprove,
        closeApproveModal,
        rejectModalApp,
        confirmReject,
        closeRejectModal,
        timeline,
        isTimelineLoading,

        // Handlers
        openDrawer,
        closeDrawer,
        handleApprove,
        handleReject,
        handleRequestInfo,
        handleSaveNote,
        loadTimeline,
    };
};

export default useApplications;
