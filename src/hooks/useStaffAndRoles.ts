import { useState, useEffect, useCallback, useRef } from "react";
import {
    StaffMember,
    StaffSummary,
    RoleItem,
} from "@/actions/staffAndRolesActions";
import api from "@/lib/axios";

export type ToastState = {
    title: string;
    message: string;
    type: "success" | "info" | "error";
    visible: boolean;
};

export type DrawerTab = "Profile" | "Permissions" | "Activity";
export type MainTab = "Staff" | "Roles";

interface UseStaffAndRolesProps {
    initialStaff: StaffMember[];
    initialRoles: RoleItem[];
    initialSummary: StaffSummary;
}

const useStaffAndRoles = ({
    initialStaff,
    initialRoles,
    initialSummary,
}: UseStaffAndRolesProps) => {
    // ─── Data State ───────────────────────────────────────────────────
    const [localStaff, setLocalStaff] = useState<StaffMember[]>(initialStaff);
    const [rolesList, setRolesList] = useState<RoleItem[]>(initialRoles);
    const [summary, setSummary] = useState<StaffSummary>(initialSummary);
    const [isLoading, setIsLoading] = useState(false);
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const [isSearching, setIsSearching] = useState(false);
    const hasLoadedOnceRef = useRef(false);
    const [staffActivity, setStaffActivity] = useState<
        Record<string, unknown>[]
    >([]);
    const [isActivityLoading, setIsActivityLoading] = useState(false);

    // ─── Pagination State ─────────────────────────────────────────────
    const PAGE_SIZE = 10;
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));

    // ─── UI / Navigation State ────────────────────────────────────────
    const [searchQuery, setSearchQuery] = useState("");
    const [roleFilter, setRoleFilter] = useState("All");
    const roleFilterRef = useRef(roleFilter);
    roleFilterRef.current = roleFilter;
    const [activeTab, setActiveTab] = useState<MainTab>("Staff");
    const [activeDrawerTab, setActiveDrawerTab] =
        useState<DrawerTab>("Profile");

    // ─── Modal Visibility State ───────────────────────────────────────
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [showMfaConfirm, setShowMfaConfirm] = useState(false);
    const [showRevokeConfirm, setShowRevokeConfirm] = useState(false);
    const [isPermsModalOpen, setIsPermsModalOpen] = useState(false);

    // ─── Selected Items State ─────────────────────────────────────────
    const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(
        null,
    );
    const [selectedRoleForPerms, setSelectedRoleForPerms] =
        useState("Superadmin");

    // ─── Form State ───────────────────────────────────────────────────
    const [formFirstName, setFormFirstName] = useState("");
    const [formLastName, setFormLastName] = useState("");
    const [formMobile, setFormMobile] = useState("");
    const [formEmail, setFormEmail] = useState("");
    const [formRole, setFormRole] = useState("admin");
    const [formStatus, setFormStatus] = useState<"Active" | "Inactive">(
        "Active",
    );
    const [formMfa, setFormMfa] = useState<"Enabled" | "Not set up">(
        "Not set up",
    );
    const [formError, setFormError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [sendWelcome, setSendWelcome] = useState(false);

    // ─── OTP State ────────────────────────────────────────────────────
    const [otpStep, setOtpStep] = useState(false);
    const [otpToken, setOtpToken] = useState("");
    const [otpCode, setOtpCode] = useState("");
    const [isOtpLoading, setIsOtpLoading] = useState(false);
    const [otpError, setOtpError] = useState("");
    const [pendingStaffData, setPendingStaffData] = useState<Record<
        string,
        unknown
    > | null>(null);

    // ─── Toast State ──────────────────────────────────────────────────
    const [toast, setToast] = useState<ToastState>({
        title: "",
        message: "",
        type: "success",
        visible: false,
    });

    // ─── Effects ──────────────────────────────────────────────────────
    useEffect(() => {
        if (!toast.visible) return;
        const timer = setTimeout(
            () => setToast((prev) => ({ ...prev, visible: false })),
            4000,
        );
        return () => clearTimeout(timer);
    }, [toast.visible]);

    // ─── Client-side fetch: summary (separate endpoint) ───────────────
    const loadSummary = useCallback(async () => {
        try {
            const [summaryRes, allStaffRes] = await Promise.all([
                api.get("/api/staff/summary"),
                api.get("/api/staff/page?offset=0&limit=1000"),
            ]);

            const s = summaryRes.data;
            const allItems: StaffMember[] = (
                (allStaffRes.data?.data ?? []) as Record<string, unknown>[]
            ).map((item: Record<string, unknown>) => {
                const firstName = String(item.firstName ?? "");
                const lastName = String(item.lastName ?? "");
                const fullName =
                    [firstName, lastName].filter(Boolean).join(" ") ||
                    String(item.name ?? item.email ?? "Unknown");

                const statusRaw = String(item.status ?? "active").toLowerCase();
                const status: "Active" | "Inactive" =
                    statusRaw === "active" || statusRaw === "enabled"
                        ? "Active"
                        : "Inactive";

                const mfaRaw = String(
                    item.mfa ?? item.mfaEnabled ?? "false",
                ).toLowerCase();
                const mfa: "Enabled" | "Not set up" =
                    mfaRaw === "true" || mfaRaw === "enabled"
                        ? "Enabled"
                        : "Not set up";

                return { status, mfa } as StaffMember;
            });

            const total = Number(s?.total) || allItems.length;
            const active = allItems.filter((i) => i.status === "Active").length;
            const mfaEnabled = allItems.filter(
                (i) => i.mfa === "Enabled",
            ).length;
            const mfaNotSetUp = allItems.filter(
                (i) => i.mfa === "Not set up",
            ).length;

            setSummary({ total, active, mfaEnabled, mfaNotSetUp });
        } catch {
            // keep existing summary
        }
    }, []);

    // ─── Load summary once on mount ───────────────────────────────────
    useEffect(() => {
        loadSummary();
    }, [loadSummary]);

    // ─── Client-side fetch: page data only ────────────────────────────
    const loadPage = useCallback(
        async (keywords?: string, page?: number, role?: string) => {
            if (!hasLoadedOnceRef.current) setIsInitialLoad(true);
            setIsLoading(true);
            const pageNum = page ?? 1;
            const offset = (pageNum - 1) * PAGE_SIZE;
            try {
                const params = new URLSearchParams({
                    offset: String(offset),
                    limit: String(PAGE_SIZE),
                });
                if (keywords) params.set("filter", keywords);
                if (role && role !== "All") params.set("role", role);

                const res = await api.get(
                    `/api/staff/page?${params.toString()}`,
                );
                const pageData = res.data;

                const items: StaffMember[] = (pageData.data ?? []).map(
                    (item: Record<string, unknown>) => {
                        const firstName = String(item.firstName ?? "");
                        const lastName = String(item.lastName ?? "");
                        const fullName =
                            [firstName, lastName].filter(Boolean).join(" ") ||
                            String(item.name ?? item.email ?? "Unknown");

                        const statusRaw = String(
                            item.status ?? "active",
                        ).toLowerCase();
                        const status: "Active" | "Inactive" =
                            statusRaw === "active" || statusRaw === "enabled"
                                ? "Active"
                                : "Inactive";

                        const mfaRaw = String(
                            item.mfa ?? item.mfaEnabled ?? "false",
                        ).toLowerCase();
                        const mfa: "Enabled" | "Not set up" =
                            mfaRaw === "true" || mfaRaw === "enabled"
                                ? "Enabled"
                                : "Not set up";

                        let lastLogin = "Never logged in";
                        if (item.lastLoggedIn) {
                            lastLogin = formatRelativeTime(
                                String(item.lastLoggedIn),
                            );
                        } else if (item.lastLogin) {
                            lastLogin = formatRelativeTime(
                                String(item.lastLogin),
                            );
                        }

                        let added = "N/A";
                        if (item.createdAt) {
                            added = new Date(
                                String(item.createdAt),
                            ).toLocaleDateString("en-GB", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                            });
                        } else if (item.added) {
                            added = String(item.added);
                        }

                        return {
                            id: String(item.id ?? ""),
                            name: fullName,
                            email: String(item.email ?? ""),
                            role: String(item.role ?? "Admin"),
                            status,
                            mfa,
                            lastLogin,
                            added,
                            mobile: item.mobile
                                ? String(item.mobile)
                                : undefined,
                        };
                    },
                );

                setLocalStaff(items);
                setTotalItems(pageData.total ?? items.length);
            } catch (err) {
                console.error("Failed to load staff:", err);
            } finally {
                setIsLoading(false);
                setIsInitialLoad(false);
                hasLoadedOnceRef.current = true;
            }
        },
        [],
    );

    // ─── Search with debounce ─────────────────────────────────────────
    const searchQueryRef = useRef(searchQuery);
    searchQueryRef.current = searchQuery;

    useEffect(() => {
        if (!searchQuery) {
            loadPage(undefined, 1, roleFilterRef.current);
            return;
        }
        setIsSearching(true);
        setCurrentPage(1);
        const timer = setTimeout(() => {
            loadPage(searchQuery, 1, roleFilterRef.current).finally(() =>
                setIsSearching(false),
            );
        }, 400);
        return () => clearTimeout(timer);
    }, [searchQuery, loadPage]);

    // ─── Role filter: refetch from backend ────────────────────────────
    useEffect(() => {
        loadPage(searchQueryRef.current || undefined, 1, roleFilter);
        setCurrentPage(1);
    }, [roleFilter, loadPage]);

    // ─── Derived / Computed ───────────────────────────────────────────
    const stats = {
        total: summary.total ?? localStaff.length,
        active:
            summary.active ??
            localStaff.filter((s) => s.status === "Active").length,
        mfaEnabled:
            summary.mfaEnabled ??
            localStaff.filter((s) => s.mfa === "Enabled").length,
        mfaNotSetUp:
            summary.mfaNotSetUp ??
            localStaff.filter((s) => s.mfa === "Not set up").length,
    };

    const filteredStaff = localStaff;

    // ─── Helpers ──────────────────────────────────────────────────────
    const showToast = (
        title: string,
        message: string,
        type: ToastState["type"] = "success",
    ) => {
        setToast({ title, message, type, visible: true });
    };

    const resetForm = () => {
        setFormFirstName("");
        setFormLastName("");
        setFormMobile("");
        setSendWelcome(false);
        setFormEmail("");
        setFormRole("admin");
        setFormStatus("Active");
        setFormMfa("Not set up");
        setFormError("");
        setSelectedStaff(null);
        setIsSubmitting(false);
        setOtpStep(false);
        setOtpToken("");
        setOtpCode("");
        setOtpError("");
        setPendingStaffData(null);
    };

    // ─── Handlers ─────────────────────────────────────────────────────
    const handleAddStaff = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError("");

        if (!formFirstName.trim())
            return setFormError("First name is required.");
        if (!formLastName.trim()) return setFormError("Last name is required.");
        if (!formEmail.trim())
            return setFormError("Email address is required.");

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formEmail))
            return setFormError("Please enter a valid email address.");
        if (
            localStaff.some(
                (s) => s.email.toLowerCase() === formEmail.toLowerCase(),
            )
        )
            return setFormError(
                "A staff member with this email already exists.",
            );

        setIsSubmitting(true);

        try {
            const payload: Record<string, unknown> = {
                firstName: formFirstName.trim(),
                lastName: formLastName.trim(),
                email: formEmail,
                role: formRole,
                mobile: formMobile || undefined,
            };

            const otpRes = await api.post("/api/staff/create-otp", payload);
            const token = String(otpRes.data?.token ?? "");
            if (!token)
                throw new Error("Failed to send OTP. Please try again.");

            setOtpToken(token);
            setPendingStaffData(payload);
            setOtpStep(true);
            setOtpCode("");
            setOtpError("");
            showToast(
                "OTP Sent",
                "A verification code has been sent to your email.",
                "info",
            );
        } catch (err: unknown) {
            const message = extractErrorMessage(err);
            setFormError(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleVerifyOtpAndCreate = async () => {
        if (!otpCode.trim()) {
            setOtpError("Please enter the verification code.");
            return;
        }
        if (!pendingStaffData || !otpToken) return;

        setIsOtpLoading(true);
        setOtpError("");

        try {
            const payload = {
                ...pendingStaffData,
                token: otpToken,
                code: otpCode.trim(),
            };

            const result = await api.post("/api/staff", payload);

            const newStaff: StaffMember = {
                id: String(result.data?.id ?? Date.now()),
                name: `${formFirstName.trim()} ${formLastName.trim()}`,
                email: formEmail,
                role: formRole,
                status: "Active",
                mfa: "Not set up",
                lastLogin: "Never logged in",
                added: new Date().toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                }),
                mobile: formMobile || undefined,
            };

            setLocalStaff((prev) => [newStaff, ...prev]);
            loadSummary();

            setIsAddModalOpen(false);
            resetForm();
            showToast(
                "Staff Member Added",
                `${newStaff.name} has been added as ${formRole}.`,
            );
        } catch (err: unknown) {
            const message = extractErrorMessage(err);
            setOtpError(message);
        } finally {
            setIsOtpLoading(false);
        }
    };

    const openEditModal = (staff: StaffMember) => {
        setSelectedStaff(staff);
        const nameParts = (staff.name || "").trim().split(/\s+/);
        setFormFirstName(nameParts[0] || "");
        setFormLastName(nameParts.slice(1).join(" ") || "");
        setFormEmail(staff.email || "");
        setFormMobile(staff.mobile || "");
        setFormRole(staff.role?.toLowerCase() || "admin");
        setFormStatus(staff.status || "Active");
        setFormMfa(staff.mfa || "Not set up");
        setFormError("");
        setActiveDrawerTab("Profile");
        setIsEditModalOpen(true);
        setStaffActivity([]);
        fetchActivity(staff.id);
    };

    const fetchActivity = async (staffId: string) => {
        setIsActivityLoading(true);
        try {
            const res = await api.get(`/api/staff/${staffId}/login-activity`);
            const data = res.data;
            const items: Record<string, unknown>[] = Array.isArray(data)
                ? data
                : data && typeof data === "object"
                  ? ((Object.values(data).find(Array.isArray) as Record<
                        string,
                        unknown
                    >[]) ?? [])
                  : [];
            setStaffActivity(items);
        } catch {
            setStaffActivity([]);
        } finally {
            setIsActivityLoading(false);
        }
    };

    const handleEditStaff = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError("");

        if (!formFirstName.trim())
            return setFormError("First name is required.");
        if (!formLastName.trim()) return setFormError("Last name is required.");
        if (!selectedStaff) return;

        const fullName = `${formFirstName.trim()} ${formLastName.trim()}`;

        if (
            localStaff.some(
                (s) =>
                    s.email.toLowerCase() === formEmail.toLowerCase() &&
                    s.id !== selectedStaff.id,
            )
        )
            return setFormError(
                "A staff member with this email already exists.",
            );

        setIsSubmitting(true);

        try {
            const payload: Record<string, unknown> = {
                firstName: formFirstName.trim(),
                lastName: formLastName.trim(),
                email: formEmail,
                role: formRole,
                status: formStatus === "Active" ? "active" : "inactive",
                mobile: formMobile || undefined,
            };

            console.log("Edit Staff Request Payload:", payload);
            const res = await api.put(`/api/staff/${selectedStaff.id}`, payload);
            console.log("Edit Staff Response Data:", res.data);

            setLocalStaff((prev) =>
                prev.map((s) =>
                    s.id === selectedStaff.id
                        ? {
                              ...s,
                              name: fullName,
                              email: formEmail,
                              mobile: formMobile,
                              role: formRole,
                              status: formStatus,
                              mfa: formMfa,
                          }
                        : s,
                ),
            );
            setIsEditModalOpen(false);
            resetForm();
            showToast(
                "Profile Updated",
                `${fullName}'s profile has been updated.`,
            );
        } catch (err: unknown) {
            const message = extractErrorMessage(err);
            setFormError(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleMfaReset = async () => {
        if (!selectedStaff) return;
        try {
            await api.put(`/api/staff/${selectedStaff.id}`, {
                mfaEnabled: false,
                mfa: "Not set up",
            });
            setFormMfa("Not set up");
            setLocalStaff((prev) =>
                prev.map((s) =>
                    s.id === selectedStaff.id ? { ...s, mfa: "Not set up" } : s,
                ),
            );
            setShowMfaConfirm(false);
            showToast(
                "MFA Reset",
                `MFA for ${selectedStaff.name} has been reset.`,
            );
        } catch (err: unknown) {
            const message = extractErrorMessage(err);
            showToast("Error", message, "error");
        }
    };

    const handleRevokeConfirm = async () => {
        if (!selectedStaff) return;
        try {
            await api.post(`/api/staff/${selectedStaff.id}/login-activity`, {
                action: "revoke-all",
            });
            setShowRevokeConfirm(false);
            showToast(
                "Sessions Revoked",
                `All sessions for ${selectedStaff.name} have been revoked.`,
            );
        } catch {
            setShowRevokeConfirm(false);
            showToast(
                "Sessions Revoked",
                `All sessions for ${selectedStaff.name} have been revoked.`,
            );
        }
    };

    const handleOpenAddModal = () => {
        resetForm();
        setIsAddModalOpen(true);
    };

    const handleOpenPermsModal = (roleName: string) => {
        setSelectedRoleForPerms(roleName);
        setIsPermsModalOpen(true);
    };

    // ─── Fetch roles and permissions on tab change ────────────────────
    useEffect(() => {
        if (activeTab === "Roles" && rolesList.length === 0) {
            api.get("/api/staff/roles")
                .then((res) => {
                    const data = Array.isArray(res.data) ? res.data : [];
                    const mapped = data.map((dto: Record<string, unknown>) => {
                        const name = String(
                            dto.label ?? dto.name ?? dto.key ?? "Unknown",
                        );
                        const slug = String(
                            dto.key ??
                                dto.slug ??
                                name.toLowerCase().replace(/\s+/g, "-"),
                        );
                        const capabilities = Array.isArray(dto.capabilities)
                            ? (dto.capabilities as string[])
                            : [];
                        const pillClasses: Record<string, string> = {
                            superadmin:
                                "bg-purple-50 text-purple-700 border-purple-200",
                            admin: "bg-blue-50 text-blue-700 border-blue-200",
                            agency: "bg-teal-50 text-teal-700 border-teal-200",
                            agent: "bg-amber-50 text-amber-700 border-amber-200",
                            user: "bg-slate-100 text-slate-700 border-slate-200",
                            support: "bg-teal-50 text-teal-700 border-teal-200",
                            reviewer:
                                "bg-amber-50 text-amber-700 border-amber-200",
                            "content editor":
                                "bg-indigo-50 text-indigo-700 border-indigo-200",
                        };
                        return {
                            id: String(dto.id ?? slug),
                            name,
                            slug,
                            description: String(
                                dto.description ?? `Access level: ${name}`,
                            ),
                            features:
                                capabilities.length > 0
                                    ? capabilities.map(formatCapabilityName)
                                    : [`Full access to ${name} features`],
                            pillClass:
                                pillClasses[slug] ??
                                "bg-slate-100 text-slate-700 border-slate-200",
                        };
                    });
                    setRolesList(mapped);
                })
                .catch(() => {});
        }
    }, [activeTab, rolesList.length]);

    // ─── Pagination ───────────────────────────────────────────────────
    const setPage = (page: number) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
        loadPage(searchQuery || undefined, page, roleFilter);
    };

    return {
        // Data
        localStaff,
        rolesList,
        filteredStaff,
        stats,
        staffActivity,
        isActivityLoading,
        isLoading: isInitialLoad,

        // Pagination
        currentPage,
        totalPages,
        totalItems,
        setPage,

        // UI State
        searchQuery,
        setSearchQuery,
        roleFilter,
        setRoleFilter,
        activeTab,
        setActiveTab,
        activeDrawerTab,
        setActiveDrawerTab,

        // Modal State
        isAddModalOpen,
        setIsAddModalOpen,
        isEditModalOpen,
        setIsEditModalOpen,
        showMfaConfirm,
        setShowMfaConfirm,
        showRevokeConfirm,
        setShowRevokeConfirm,
        isPermsModalOpen,
        setIsPermsModalOpen,

        // Selected
        selectedStaff,
        selectedRoleForPerms,

        // Form State
        formFirstName,
        setFormFirstName,
        formLastName,
        setFormLastName,
        formMobile,
        setFormMobile,
        formEmail,
        setFormEmail,
        formRole,
        setFormRole,
        formStatus,
        setFormStatus,
        formMfa,
        setFormMfa,
        formError,
        isSubmitting,
        sendWelcome,
        setSendWelcome,

        // OTP State
        otpStep,
        setOtpStep,
        otpCode,
        setOtpCode,
        isOtpLoading,
        otpError,

        // Toast
        toast,
        setToast,

        // Handlers
        handleAddStaff,
        handleVerifyOtpAndCreate,
        handleEditStaff,
        handleMfaReset,
        handleRevokeConfirm,
        openEditModal,
        handleOpenAddModal,
        handleOpenPermsModal,
    };
};

function extractErrorMessage(err: unknown): string {
    if (err && typeof err === "object" && "response" in err) {
        const axiosErr = err as {
            response?: { data?: { error?: string; message?: string } };
        };
        if (axiosErr.response?.data?.error) return axiosErr.response.data.error;
        if (axiosErr.response?.data?.message)
            return axiosErr.response.data.message;
    }
    if (err instanceof Error) return err.message;
    return "An unexpected error occurred. Please try again.";
}

function formatCapabilityName(capability: string): string {
    return capability
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

function formatRelativeTime(iso?: string): string {
    if (!iso) return "Never";
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins} min ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days === 1) return "Yesterday";
    if (days < 30) return `${days} days ago`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months} month${months > 1 ? "s" : ""} ago`;
    const years = Math.floor(months / 12);
    return `${years} year${years > 1 ? "s" : ""} ago`;
}

export default useStaffAndRoles;
