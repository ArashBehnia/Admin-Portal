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
    console.log("[useApplications] mapListItem raw keys:", Object.keys(raw), "values:", JSON.stringify(raw).slice(0, 300));
    const name = (raw.name ?? raw.applicantName ?? raw.fullName ?? raw.userName ?? raw.contactName ?? "") as string;
    const email = (raw.email ?? raw.emailAddress ?? "") as string;
    const agency = (raw.agency ?? raw.agencyName ?? raw.companyName ?? raw.organisation ?? "") as string;
    const crm = (raw.crm ?? raw.crmPlatform ?? raw.crmType ?? raw.integrationType ?? "") as string;
    const submittedAt = (raw.submittedAt ?? raw.createdAt ?? raw.createdDate ?? raw.applicationDate ?? raw.submittedDate ?? "") as string;
    const phone = (raw.phone ?? raw.phoneNumber ?? raw.mobile ?? "") as string | undefined;

    return {
        id: String(item.id ?? ""),
        name,
        email,
        agency,
        crm,
        submitted: formatTimeAgo(submittedAt),
        status: formatStatus(item.status),
        phone,
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

    // ─── Drawer State ─────────────────────────────────────────────────
    const [selectedApp, setSelectedApp] = useState<Application | null>(null);
    const [activeDrawerTab, setActiveDrawerTab] =
        useState<DrawerTab>("Application");
    const [notes, setNotes] = useState("");
    const [noteMessage, setNoteMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const [isSavingNote, setIsSavingNote] = useState(false);
    const [timeline, setTimeline] = useState<ApplicationTimeline>([]);
    const [isTimelineLoading, setIsTimelineLoading] = useState(false);

    // ─── Client-side fetch via axios ──────────────────────────────────
    const loadPage = useCallback(
        async (status?: string) => {
            setIsLoading(true);
            try {
                const params = new URLSearchParams({
                    offset: "0",
                    limit: "100",
                });
                if (status && status !== "all") params.set("status", status);

                console.log("[useApplications] loadPage -> GET /api/applications/summary + /api/applications/page?" + params.toString());

                const [summaryRes, pageRes] = await Promise.all([
                    api.get("/api/applications/summary"),
                    api.get(`/api/applications/page?${params.toString()}`),
                ]);

                console.log("[useApplications] summaryRes.data:", JSON.stringify(summaryRes.data));
                console.log("[useApplications] pageRes.data:", JSON.stringify(pageRes.data).slice(0, 500));

                const summary = summaryRes.data?.data ?? summaryRes.data;
                const pageData = pageRes.data;

                const items: ApplicationListItemDto[] = Array.isArray(pageData.data)
                    ? pageData.data
                    : Array.isArray(pageData)
                        ? pageData
                        : [];

                console.log("[useApplications] items from API:", JSON.stringify(items).slice(0, 1000));
                console.log("[useApplications] items count:", items.length);

                const mapped = items.map(mapListItem);
                console.log("[useApplications] mapped applications:", JSON.stringify(mapped).slice(0, 1000));

                setApplications(mapped);
                setStats({
                    total: summary.total ?? 0,
                    pending: summary.pending ?? 0,
                    approvedThisMonth: summary.approved ?? 0,
                    rejected: summary.rejected ?? 0,
                });
            } catch (err) {
                console.error("Failed to load applications:", err);
            } finally {
                setIsLoading(false);
            }
        },
        [],
    );

    // ─── Search with debounce ─────────────────────────────────────────
    const isInitialMount = useRef(true);
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }
        const timer = setTimeout(() => {
            loadPage();
        }, searchQuery ? 400 : 0);
        return () => clearTimeout(timer);
    }, [searchQuery, loadPage]);

    // ─── Derived / Computed ───────────────────────────────────────────
    const filteredApplications = applications.filter((app) => {
        const q = searchQuery.toLowerCase();
        const matchesQuery =
            (app.name ?? "").toLowerCase().includes(q) ||
            (app.email ?? "").toLowerCase().includes(q) ||
            (app.agency ?? "").toLowerCase().includes(q);
        const matchesStatus =
            statusFilter === "All" || app.status === statusFilter;
        return matchesQuery && matchesStatus;
    });

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
        try {
            console.log("[useApplications] handleApprove -> POST /api/applications/" + id + "/generate");
            const res = await api.post(`/api/applications/${id}/generate`);
            console.log("[useApplications] approve response:", JSON.stringify(res.data));
            setApplications((prev) =>
                prev.map((a) =>
                    a.id === id ? { ...a, status: "Approved" as const } : a,
                ),
            );
            if (selectedApp?.id === id) {
                setSelectedApp((prev) =>
                    prev ? { ...prev, status: "Approved" as const } : null,
                );
            }
            loadPage();
        } catch (err) {
            console.error("Failed to approve application:", err);
        }
    };

    const handleReject = async (id: string, reason?: string) => {
        try {
            console.log("[useApplications] handleReject -> POST /api/applications/" + id + "/reject", { reason });
            const res = await api.post(`/api/applications/${id}/reject`, {
                reason: reason ?? "Application does not meet requirements.",
            });
            console.log("[useApplications] reject response:", JSON.stringify(res.data));
            setApplications((prev) =>
                prev.map((a) =>
                    a.id === id ? { ...a, status: "Rejected" as const } : a,
                ),
            );
            if (selectedApp?.id === id) {
                setSelectedApp((prev) =>
                    prev ? { ...prev, status: "Rejected" as const } : null,
                );
            }
            loadPage();
        } catch (err) {
            console.error("Failed to reject application:", err);
        }
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
            console.log("[useApplications] handleSaveNote -> POST /api/applications/" + id + "/notes");
            console.log("[useApplications] request body:", JSON.stringify({ note }));
            const res = await api.post(`/api/applications/${id}/notes`, { note });
            console.log("[useApplications] saveNote response status:", res.status);
            console.log("[useApplications] saveNote response data:", JSON.stringify(res.data));
            setNotes("");
            setNoteMessage({ type: "success", text: "Note saved successfully." });
            setTimeout(() => setNoteMessage(null), 3000);
            await loadTimeline(id);
        } catch (err) {
            console.error("[useApplications] saveNote error:", err);
            setNoteMessage({ type: "error", text: "Failed to save note. Please try again." });
            setTimeout(() => setNoteMessage(null), 3000);
        } finally {
            setIsSavingNote(false);
        }
    };

    const loadTimeline = useCallback(async (id: string) => {
        setIsTimelineLoading(true);
        try {
            console.log("[useApplications] loadTimeline -> GET /api/applications/" + id + "/timeline");
            const res = await api.get(`/api/applications/${id}/timeline`);
            console.log("[useApplications] timeline response status:", res.status);
            console.log("[useApplications] timeline response data:", JSON.stringify(res.data));
            const data = res.data?.data ?? res.data;
            const rawArr = Array.isArray(data) ? data : [];
            console.log("[useApplications] timeline raw items:", rawArr.length);
            if (rawArr.length > 0) {
                console.log("[useApplications] timeline first item keys:", Object.keys(rawArr[0]));
                console.log("[useApplications] timeline first item:", JSON.stringify(rawArr[0]));
            }
            setTimeline(rawArr);
        } catch (err) {
            console.error("[useApplications] timeline error:", err);
            setTimeline([]);
        } finally {
            setIsTimelineLoading(false);
        }
    }, []);

    return {
        // Data
        filteredApplications,
        stats,
        isLoading,

        // Search & Filter
        searchQuery,
        setSearchQuery,
        statusFilter,
        setStatusFilter,

        // Drawer
        selectedApp,
        activeDrawerTab,
        setActiveDrawerTab,
        notes,
        setNotes,
        noteMessage,
        isSavingNote,
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
