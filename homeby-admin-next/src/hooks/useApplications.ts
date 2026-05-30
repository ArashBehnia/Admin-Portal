import { useState } from "react";
import { Application, DrawerTab } from "@/actions/applicationsActions";

interface UseApplicationsProps {
    initialApplications: Application[];
}

const useApplications = ({ initialApplications }: UseApplicationsProps) => {
    // ─── Data State ───────────────────────────────────────────────────
    const [applications, setApplications] =
        useState<Application[]>(initialApplications);

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

    // ─── Derived / Computed ───────────────────────────────────────────
    const stats = {
        total: applications.length,
        pending: applications.filter((a) => a.status === "Pending").length,
        approvedThisMonth: applications.filter((a) => a.status === "Approved")
            .length,
        rejected: applications.filter((a) => a.status === "Rejected").length,
    };

    const filteredApplications = applications.filter((app) => {
        const matchesQuery =
            app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            app.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            app.agency.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus =
            statusFilter === "All" || app.status === statusFilter;
        return matchesQuery && matchesStatus;
    });

    // ─── Handlers ─────────────────────────────────────────────────────
    const openDrawer = (app: Application) => {
        setSelectedApp(app);
        setActiveDrawerTab("Application");
        setNotes("");
    };

    const closeDrawer = () => {
        setSelectedApp(null);
    };

    const handleApprove = (id: number) => {
        setApplications((prev) =>
            prev.map((a) => (a.id === id ? { ...a, status: "Approved" } : a)),
        );
        if (selectedApp?.id === id) {
            setSelectedApp((prev) =>
                prev ? { ...prev, status: "Approved" } : null,
            );
        }
    };

    const handleReject = (id: number) => {
        setApplications((prev) =>
            prev.map((a) => (a.id === id ? { ...a, status: "Rejected" } : a)),
        );
        if (selectedApp?.id === id) {
            setSelectedApp((prev) =>
                prev ? { ...prev, status: "Rejected" } : null,
            );
        }
    };

    const handleRequestInfo = (id: number) => {
        setApplications((prev) =>
            prev.map((a) =>
                a.id === id ? { ...a, status: "Awaiting info" } : a,
            ),
        );
        if (selectedApp?.id === id) {
            setSelectedApp((prev) =>
                prev ? { ...prev, status: "Awaiting info" } : null,
            );
        }
    };

    return {
        // Data
        filteredApplications,
        stats,

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

        // Handlers
        openDrawer,
        closeDrawer,
        handleApprove,
        handleReject,
        handleRequestInfo,
    };
};

export default useApplications;
