import { useState, useEffect } from "react";
import {
    StaffMember,
    PermissionCategory,
    RoleItem,
} from "@/actions/staffAndRolesActions";

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
    initialPermissions: PermissionCategory[];
}

const useStaffAndRoles = ({
    initialStaff,
    initialRoles,
    initialPermissions,
}: UseStaffAndRolesProps) => {
    // ─── Data State ───────────────────────────────────────────────────
    const [localStaff, setLocalStaff] = useState<StaffMember[]>(initialStaff);
    const [localPermissions, setLocalPermissions] =
        useState<PermissionCategory[]>(initialPermissions);
    const rolesList: RoleItem[] = initialRoles;

    // ─── UI / Navigation State ────────────────────────────────────────
    const [searchQuery, setSearchQuery] = useState("");
    const [roleFilter, setRoleFilter] = useState("All");
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
    const [formRole, setFormRole] = useState("Admin");
    const [formStatus, setFormStatus] = useState<"Active" | "Inactive">(
        "Active",
    );
    const [formMfa, setFormMfa] = useState<"Enabled" | "Not set up">(
        "Not set up",
    );
    const [formError, setFormError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [sendWelcome, setSendWelcome] = useState(false);

    // ─── Toast State ──────────────────────────────────────────────────
    const [toast, setToast] = useState<ToastState>({
        title: "",
        message: "",
        type: "success",
        visible: false,
    });

    // ─── Effects ──────────────────────────────────────────────────────
    useEffect(() => {
        if (initialPermissions.length > 0 && localPermissions.length === 0) {
            setLocalPermissions(JSON.parse(JSON.stringify(initialPermissions)));
        }
    }, [initialPermissions]);

    useEffect(() => {
        if (!toast.visible) return;
        const timer = setTimeout(
            () => setToast((prev) => ({ ...prev, visible: false })),
            4000,
        );
        return () => clearTimeout(timer);
    }, [toast.visible]);

    // ─── Derived / Computed ───────────────────────────────────────────
    const stats = {
        total: localStaff.length,
        active: localStaff.filter((s) => s.status === "Active").length,
        mfaEnabled: localStaff.filter((s) => s.mfa === "Enabled").length,
        mfaNotSetUp: localStaff.filter((s) => s.mfa === "Not set up").length,
    };

    const filteredStaff = localStaff.filter((member) => {
        const matchesQuery =
            member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            member.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRole =
            roleFilter === "All" ||
            member.role.toLowerCase() === roleFilter.toLowerCase();
        return matchesQuery && matchesRole;
    });

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
        setFormRole("Admin");
        setFormStatus("Active");
        setFormMfa("Not set up");
        setFormError("");
        setSelectedStaff(null);
        setIsSubmitting(false);
    };

    // ─── Handlers ─────────────────────────────────────────────────────
    const handleAddStaff = (e: React.FormEvent) => {
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

        // Simulate network delay
        setTimeout(() => {
            const fullName = `${formFirstName.trim()} ${formLastName.trim()}`;
            const newStaff: StaffMember = {
                id: String(Date.now()),
                name: fullName,
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
            };
            setLocalStaff((prev) => [newStaff, ...prev]);
            setIsAddModalOpen(false);
            resetForm();
            showToast(
                "Staff Member Added",
                `${fullName} has been added as ${formRole}.`,
            );
        }, 1000);
    };

    const openEditModal = (staff: StaffMember) => {
        setSelectedStaff(staff);
        const nameParts = (staff.name || "").trim().split(/\s+/);
        setFormFirstName(nameParts[0] || "");
        setFormLastName(nameParts.slice(1).join(" ") || "");
        setFormEmail(staff.email || "");
        setFormMobile(staff.mobile || "");
        setFormRole(staff.role || "Admin");
        setFormStatus(staff.status || "Active");
        setFormMfa(staff.mfa || "Not set up");
        setFormError("");
        setActiveDrawerTab("Profile");
        setIsEditModalOpen(true);
    };

    const handleEditStaff = (e: React.FormEvent) => {
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
        showToast("Profile Updated", `${fullName}'s profile has been updated.`);
    };

    const handleMfaReset = () => {
        if (!selectedStaff) return;
        setFormMfa("Not set up");
        setLocalStaff((prev) =>
            prev.map((s) =>
                s.id === selectedStaff.id ? { ...s, mfa: "Not set up" } : s,
            ),
        );
        setShowMfaConfirm(false);
        showToast("MFA Reset", `MFA for ${selectedStaff.name} has been reset.`);
    };

    const handleRevokeConfirm = () => {
        if (!selectedStaff) return;
        setShowRevokeConfirm(false);
        showToast(
            "Sessions Revoked",
            `All sessions for ${selectedStaff.name} have been revoked.`,
        );
    };

    const handleOpenAddModal = () => {
        resetForm();
        setIsAddModalOpen(true);
    };

    const handleOpenPermsModal = (roleName: string) => {
        setSelectedRoleForPerms(roleName);
        setIsPermsModalOpen(true);
    };

    return {
        // Data
        localStaff,
        rolesList,
        localPermissions,
        filteredStaff,
        stats,

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

        // Toast
        toast,
        setToast,

        // Handlers
        handleAddStaff,
        handleEditStaff,
        handleMfaReset,
        handleRevokeConfirm,
        openEditModal,
        handleOpenAddModal,
        handleOpenPermsModal,
    };
};

export default useStaffAndRoles;
