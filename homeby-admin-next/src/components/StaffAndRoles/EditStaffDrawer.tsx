"use client";

import { Fragment } from "react";
import { X, AlertTriangle, Loader2, Check } from "lucide-react";
import { StaffMember, RoleItem, PermissionCategory } from "@/actions/staffAndRolesActions";

interface EditStaffDrawerProps {
    isOpen: boolean;
    selectedStaff: StaffMember | null;
    activeDrawerTab: "Profile" | "Permissions" | "Activity";
    onTabChange: (tab: "Profile" | "Permissions" | "Activity") => void;
    onClose: () => void;
    formFirstName: string;
    formLastName: string;
    formEmail: string;
    formMobile: string;
    formRole: string;
    rolesList: RoleItem[];
    formStatus: "Active" | "Inactive";
    formMfa: "Enabled" | "Not set up";
    formError: string;
    isSubmitting: boolean;
    permissions: PermissionCategory[];
    staffActivity: Record<string, unknown>[];
    isActivityLoading: boolean;
    onFirstNameChange: (v: string) => void;
    onLastNameChange: (v: string) => void;
    onMobileChange: (v: string) => void;
    onRoleChange: (v: string) => void;
    onStatusChange: (v: "Active" | "Inactive") => void;
    onMfaReset: () => void;
    onRevokeSession: () => void;
    onSubmit: (e: React.FormEvent) => void;
}

const EditStaffDrawer = ({
    isOpen,
    selectedStaff,
    activeDrawerTab,
    onTabChange,
    onClose,
    formFirstName,
    formLastName,
    formEmail,
    formMobile,
    formRole,
    rolesList,
    formStatus,
    formMfa,
    formError,
    isSubmitting,
    permissions,
    staffActivity,
    isActivityLoading,
    onFirstNameChange,
    onLastNameChange,
    onMobileChange,
    onRoleChange,
    onStatusChange,
    onMfaReset,
    onRevokeSession,
    onSubmit,
}: EditStaffDrawerProps) => {
    if (!isOpen || !selectedStaff) return null;

    const initials = (selectedStaff.name || "")
        .trim()
        .split(/\s+/)
        .map((n) => n[0])
        .join("")
        .toUpperCase();

    return (
        <div
            className="fixed inset-0 bg-[#0F1115]/40 backdrop-blur-[2px] z-[999] flex justify-end"
            onClick={onClose}
        >
            <div
                className="bg-card w-full max-w-[480px] h-full border-l border-border shadow-2xl overflow-hidden flex flex-col animate-slide-left"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-6 border-b border-border flex justify-between items-start">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-lg bg-purple-50 text-purple-700 font-bold text-lg flex items-center justify-center select-none shrink-0 border border-purple-200">
                            {initials}
                        </div>
                        <div className="flex flex-col gap-0.5">
                            <h3 className="font-bold text-lg text-text tracking-tight font-sans">
                                {selectedStaff.name}
                            </h3>
                            <span className="text-[13px] text-muted font-medium font-sans">
                                {selectedStaff.email}
                            </span>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="inline-block px-2.5 py-0.5 border text-xs font-semibold rounded bg-purple-50 text-purple-700 border-purple-200">
                                    {selectedStaff.role}
                                </span>
                                <span
                                    className={`inline-block px-2.5 py-0.5 border text-xs font-semibold rounded ${
                                        selectedStaff.status === "Active"
                                            ? "bg-green-50 text-green-700 border-green-200"
                                            : "bg-red-50 text-red-700 border-red-200"
                                    }`}
                                >
                                    {selectedStaff.status}
                                </span>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-muted hover:text-text p-1.5 rounded hover:bg-page transition-colors cursor-pointer"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex gap-6 border-b border-border px-6 mt-1 bg-page/10">
                    {(["Profile", "Permissions", "Activity"] as const).map(
                        (tab) => (
                            <button
                                key={tab}
                                onClick={() => onTabChange(tab)}
                                className={`pb-3 pt-2 text-sm font-semibold border-b-2 transition-all ${
                                    activeDrawerTab === tab
                                        ? "border-accent text-accent"
                                        : "border-transparent text-muted hover:text-text"
                                }`}
                            >
                                {tab}
                            </button>
                        ),
                    )}
                </div>

                {/* Profile Tab */}
                {activeDrawerTab === "Profile" && (
                    <form
                        onSubmit={onSubmit}
                        className="flex-1 flex flex-col justify-between overflow-hidden"
                    >
                        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
                            {formError && (
                                <div className="bg-red-50 border border-red-200 text-danger p-3 rounded flex items-start gap-2 text-xs font-semibold">
                                    <AlertTriangle
                                        size={14}
                                        className="shrink-0 mt-0.5"
                                    />
                                    <span>{formError}</span>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1">
                                    <label className="text-[13px] text-muted font-medium font-sans">
                                        First name
                                    </label>
                                    <input
                                        type="text"
                                        value={formFirstName}
                                        onChange={(e) =>
                                            onFirstNameChange(e.target.value)
                                        }
                                        className="w-full px-3 py-2 border border-border bg-card text-text rounded focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent text-sm font-medium transition-colors"
                                        required
                                    />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-[13px] text-muted font-medium font-sans">
                                        Last name
                                    </label>
                                    <input
                                        type="text"
                                        value={formLastName}
                                        onChange={(e) =>
                                            onLastNameChange(e.target.value)
                                        }
                                        className="w-full px-3 py-2 border border-border bg-card text-text rounded focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent text-sm font-medium transition-colors"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-[13px] text-muted font-medium font-sans">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={formEmail}
                                    disabled
                                    className="w-full px-3 py-2 border border-slate-200 bg-slate-50 text-slate-500 rounded text-sm font-medium cursor-not-allowed font-sans"
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-[13px] text-muted font-medium font-sans">
                                    Mobile number
                                </label>
                                <input
                                    type="text"
                                    placeholder="+61 4XX XXX XXX"
                                    value={formMobile}
                                    onChange={(e) =>
                                        onMobileChange(e.target.value)
                                    }
                                    className="w-full px-3 py-2 border border-border bg-card text-text rounded focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent text-sm font-medium transition-colors"
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-[13px] text-muted font-medium font-sans">
                                    Role
                                </label>
                                <select
                                    value={formRole}
                                    onChange={(e) =>
                                        onRoleChange(e.target.value)
                                    }
                                    className="w-full px-3 py-2.5 border border-border bg-card text-text rounded focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent text-sm font-medium transition-colors"
                                >
                                    {rolesList.map((role) => (
                                        <option key={role.id} value={role.name}>
                                            {role.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex flex-col gap-1.5 mt-1 select-none">
                                <span className="text-[13px] text-muted font-medium font-sans">
                                    Status
                                </span>
                                <div className="flex items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            onStatusChange(
                                                formStatus === "Active"
                                                    ? "Inactive"
                                                    : "Active",
                                            )
                                        }
                                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${formStatus === "Active" ? "bg-green-600" : "bg-slate-300"}`}
                                    >
                                        <span
                                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ${formStatus === "Active" ? "translate-x-5" : "translate-x-0"}`}
                                        />
                                    </button>
                                    <span
                                        className={`inline-block px-2.5 py-0.5 border text-xs font-semibold rounded ${
                                            formStatus === "Active"
                                                ? "bg-green-50 text-green-700 border-green-200"
                                                : "bg-red-50 text-red-700 border-red-200"
                                        }`}
                                    >
                                        {formStatus}
                                    </span>
                                </div>
                            </div>

                            <div className="h-[1px] bg-border/50 my-2" />

                            <div className="flex flex-col gap-2">
                                <h4 className="font-bold text-[14px] text-text font-sans">
                                    Multi-factor authentication
                                </h4>
                                <div className="flex items-center gap-2 text-[13px] text-muted">
                                    <span>Status:</span>
                                    <span
                                        className={`inline-block px-2 py-0.5 border text-xs font-semibold rounded ${
                                            formMfa === "Enabled"
                                                ? "bg-green-50 text-green-700 border-green-200"
                                                : "bg-orange-50 text-orange-600 border-orange-200 font-bold"
                                        }`}
                                    >
                                        {formMfa}
                                    </span>
                                </div>
                                <div className="flex gap-2.5 mt-1 select-none">
                                    <button
                                        type="button"
                                        onClick={onMfaReset}
                                        className="px-3 py-1.5 border border-border bg-white text-muted hover:text-text rounded text-xs font-bold hover:bg-page transition-colors cursor-pointer font-sans"
                                    >
                                        Reset MFA
                                    </button>
                                    <button
                                        type="button"
                                        onClick={onRevokeSession}
                                        className="px-3 py-1.5 border border-border bg-white text-muted hover:text-text rounded text-xs font-bold hover:bg-page transition-colors cursor-pointer font-sans"
                                    >
                                        Revoke all sessions
                                    </button>
                                </div>
                            </div>

                            <div className="h-[1px] bg-border/50 my-1" />
                            <p className="text-[12px] text-muted leading-tight mt-1 font-sans">
                                Changes to superadmin accounts require
                                re-authentication.
                            </p>
                        </div>
                        <div className="px-6 py-4 border-t border-border flex justify-end bg-page/20">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-6 py-2 bg-accent hover:bg-accent/90 text-white rounded font-bold text-sm transition-colors cursor-pointer font-sans shadow-sm flex items-center justify-center gap-1.5 disabled:opacity-75 disabled:cursor-not-allowed min-w-[80px]"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 size={14} className="animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    "Save"
                                )}
                            </button>
                        </div>
                    </form>
                )}

                {/* Permissions Tab */}
                {activeDrawerTab === "Permissions" && (
                    <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-4">
                        <div>
                            <h4 className="font-bold text-[15px] text-text font-sans">
                                Access permissions
                            </h4>
                            <p className="text-[12px] text-muted font-medium font-sans leading-relaxed mt-0.5">
                                Permissions are defined by role and cannot be
                                customised per user in this version.
                            </p>
                        </div>
                        {permissions.length > 0 ? (
                            <div className="border border-border rounded overflow-hidden shadow-sm">
                                <table className="w-full text-left text-xs border-collapse">
                                    <thead>
                                        <tr className="bg-page border-b border-border text-muted font-bold text-[10px] uppercase tracking-wider select-none">
                                            <th className="px-3 py-2.5">
                                                Permission
                                            </th>
                                            <th className="px-2 py-2.5 text-center">
                                                Superadmin
                                            </th>
                                            <th className="px-2 py-2.5 text-center">
                                                Admin
                                            </th>
                                            <th className="px-2 py-2.5 text-center">
                                                Support
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border/60">
                                        {permissions.map((category) => (
                                            <Fragment key={category.category}>
                                                <tr className="bg-page/40 text-[11px] text-accent font-bold select-none">
                                                    <td
                                                        colSpan={4}
                                                        className="px-3 py-1.5 uppercase tracking-wide"
                                                    >
                                                        {category.category}
                                                    </td>
                                                </tr>
                                                {category.permissions.map(
                                                    (perm) => (
                                                        <tr
                                                            key={perm.id}
                                                            className="hover:bg-page/20"
                                                        >
                                                            <td className="px-3 py-2 text-muted font-medium">
                                                                {perm.name}
                                                            </td>
                                                            {[
                                                                perm.superadmin,
                                                                perm.admin,
                                                                perm.support,
                                                            ].map((v, i) => (
                                                                <td
                                                                    key={i}
                                                                    className="px-2 py-2 text-center"
                                                                >
                                                                    {v ===
                                                                    "✓" ? (
                                                                        <Check
                                                                            size={
                                                                                14
                                                                            }
                                                                            className="text-green-600 inline-block"
                                                                            strokeWidth={
                                                                                3
                                                                            }
                                                                        />
                                                                    ) : v ===
                                                                      "read" ? (
                                                                        <span className="text-text font-bold text-[11px]">
                                                                            read
                                                                        </span>
                                                                    ) : (
                                                                        <span className="text-muted">
                                                                            —
                                                                        </span>
                                                                    )}
                                                                </td>
                                                            ))}
                                                        </tr>
                                                    ),
                                                )}
                                            </Fragment>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-8 gap-2">
                                <Loader2 className="h-5 w-5 text-accent animate-spin" />
                                <span className="text-xs text-muted">
                                    Loading permissions...
                                </span>
                            </div>
                        )}
                        <p className="text-[12px] text-muted leading-tight font-medium font-sans bg-page/35 border border-border/80 rounded p-2 select-none">
                            Role permissions are managed in code. Contact your
                            developer to modify role definitions.
                        </p>
                    </div>
                )}

                {/* Activity Tab */}
                {activeDrawerTab === "Activity" && (
                    <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-4">
                        <h4 className="font-bold text-[16px] text-text font-sans">
                            Recent activity
                        </h4>
                        {isActivityLoading ? (
                            <div className="flex flex-col items-center justify-center py-8 gap-2">
                                <Loader2 className="h-5 w-5 text-accent animate-spin" />
                                <span className="text-xs text-muted">
                                    Loading activity...
                                </span>
                            </div>
                        ) : staffActivity.length > 0 ? (
                            <div className="flex flex-col gap-4 relative border-l border-border/80 pl-4 ml-1.5 mt-2">
                                {staffActivity.map((item, index) => {
                                    const action = String(
                                        item.action ??
                                            item.description ??
                                            item.type ??
                                            "Activity",
                                    );
                                    const detail = String(
                                        item.detail ??
                                            item.entity ??
                                            item.message ??
                                            "",
                                    );
                                    const timestamp = String(
                                        item.timestamp ??
                                            item.createdAt ??
                                            item.date ??
                                            item.time ??
                                            "",
                                    );
                                    const timeLabel = timestamp
                                        ? formatActivityTime(timestamp)
                                        : "";
                                    return (
                                        <div
                                            key={index}
                                            className="flex flex-col gap-0.5 relative text-[13px]"
                                        >
                                            <span className="absolute -left-[21px] top-1.5 h-2 w-2 bg-accent border border-card rounded-full shadow-sm" />
                                            <div className="font-sans text-text">
                                                <span className="font-bold">
                                                    {action}
                                                </span>
                                                {detail && (
                                                    <>
                                                        <span className="text-muted/70 mx-1.5">
                                                            —
                                                        </span>
                                                        <span className="font-semibold text-muted">
                                                            {detail}
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                            {timeLabel && (
                                                <span className="text-[11px] text-muted/65 font-bold tracking-tight">
                                                    {timeLabel}
                                                </span>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-8 gap-2">
                                <span className="text-xs text-muted">
                                    No recent activity found.
                                </span>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

function formatActivityTime(timestamp: string): string {
    try {
        const date = new Date(timestamp);
        if (isNaN(date.getTime())) return timestamp;
        const diff = Date.now() - date.getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 1) return "Just now";
        if (mins < 60) return `${mins} min ago`;
        const hours = Math.floor(mins / 60);
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        if (days === 1) return "Yesterday";
        if (days < 30) return `${days} days ago`;
        return date.toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    } catch {
        return timestamp;
    }
}

export default EditStaffDrawer;
