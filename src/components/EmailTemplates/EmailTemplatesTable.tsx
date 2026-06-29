"use client";

import { useState } from "react";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { Search, Trash2, Loader2 } from "lucide-react";
import {
    Template,
    CategoryFilter,
    CATEGORIES,
} from "@/actions/emailTemplatesActions";
import Toast from "@/components/Shared/Toast";
import ConfirmModal from "./TemplateName/ConfirmModal";
import EmailTemplatesPagination from "./EmailTemplatesPagination";
import type { ToastState } from "@/hooks/useTemplateEditor";

function formatRelativeTime(value: string): string {
    if (!value) return "–";

    const date = new Date(value);
    if (isNaN(date.getTime())) return value;

    const now = Date.now();
    const diffMs = now - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHr / 24);
    const diffWeek = Math.floor(diffDay / 7);
    const diffMonth = Math.floor(diffDay / 30);
    const diffYear = Math.floor(diffDay / 365);

    if (diffSec < 60) return "just now";
    if (diffMin < 60) return `${diffMin} minute${diffMin === 1 ? "" : "s"} ago`;
    if (diffHr < 24) return `${diffHr} hour${diffHr === 1 ? "" : "s"} ago`;
    if (diffDay < 7) return `${diffDay} day${diffDay === 1 ? "" : "s"} ago`;
    if (diffWeek < 4) return `${diffWeek} week${diffWeek === 1 ? "" : "s"} ago`;
    if (diffMonth < 12) return `${diffMonth} month${diffMonth === 1 ? "" : "s"} ago`;
    return `${diffYear} year${diffYear === 1 ? "" : "s"} ago`;
}

const TEMPLATE_NAME_MAP: Record<string, string> = {
    otp: "OTP",
    signup: "Sign Up",
    verify: "Verify",
    welcome: "Welcome",
    agent_portal_welcome: "Agent Portal Welcome",
    forgot_password: "Forgot Password",
    two_fa: "Two-Factor Authentication",
};

function formatTemplateName(name: string): string {
    return TEMPLATE_NAME_MAP[name] || name;
}

interface EmailTemplatesTableProps {
    filteredTemplates: Template[];
    totalCount: number;
    currentPage: number;
    totalPages: number;
    rowsPerPage: number;
    searchQuery: string;
    selectedCategory: CategoryFilter;
    onSearchChange: (val: string) => void;
    onCategoryChange: (val: CategoryFilter) => void;
    onPageChange: (page: number) => void;
    onRowsPerPageChange: (rows: number) => void;
    isSearching?: boolean;
}

const EmailTemplatesTable = ({
    filteredTemplates,
    totalCount,
    currentPage,
    totalPages,
    rowsPerPage,
    searchQuery,
    selectedCategory,
    onSearchChange,
    onCategoryChange,
    onPageChange,
    onRowsPerPageChange,
    isSearching = false,
}: EmailTemplatesTableProps) => {
    const queryClient = useQueryClient();
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<Template | null>(null);
    const [toast, setToast] = useState<ToastState>({
        title: "",
        message: "",
        type: "success",
        visible: false,
    });

    const showToast = (
        title: string,
        message: string,
        type: ToastState["type"] = "success",
    ) => {
        setToast({ title, message, type, visible: true });
    };

    const handleDeleteClick = (template: Template) => {
        setDeleteTarget(template);
    };

    const handleConfirmDelete = async () => {
        if (!deleteTarget) return;

        const displayName = formatTemplateName(deleteTarget.name);
        setDeletingId(deleteTarget.id);
        setDeleteTarget(null);

        try {
            const res = await fetch(`/api/email-templates/${encodeURIComponent(deleteTarget.id)}`, {
                method: "DELETE",
            });

            if (!res.ok) {
                const errorBody = await res.json().catch(() => ({}));
                throw new Error(errorBody.error || `Delete failed: ${res.status}`);
            }

            showToast("Template Deleted", `"${displayName}" has been deleted.`);
            await queryClient.invalidateQueries({ queryKey: ["email-templates"] });
        } catch (error) {
            const message =
                error instanceof Error ? error.message : "Failed to delete template";
            showToast("Delete Failed", message, "error");
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="flex flex-col gap-6">
            {/* Search + Category Filter */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="relative w-full max-w-xs">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted" />
                    <input
                        type="text"
                        placeholder="Search template name..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="pl-9 pr-4 py-2 w-full bg-card border border-border rounded-md text-sm text-text placeholder-muted focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-colors"
                    />
                    {isSearching && (
                        <Loader2 className="absolute right-3 top-2.5 h-4 w-4 text-muted animate-spin" />
                    )}
                </div>
                <select
                    value={selectedCategory}
                    disabled
                    className="w-auto bg-card border border-border rounded-md px-3 py-2 text-sm text-muted/50 cursor-not-allowed opacity-50"
                >
                    {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                            {cat}
                        </option>
                    ))}
                </select>
            </div>

            {/* Table */}
            <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-[12px] min-w-[var(--min-table-width)]">
                        <thead>
                            <tr className="border-b border-border/80 bg-page/55 text-muted text-[11px] font-bold tracking-wider uppercase">
                                <th className="px-6 py-4 w-12">#</th>
                                <th className="px-6 py-4">Template name</th>
                                <th className="px-6 py-4">Type</th>
                                <th className="px-6 py-4">Provider</th>
                                <th className="px-6 py-4">Language</th>
                                <th className="px-6 py-4">Country</th>
                                <th className="px-6 py-4">Last modified</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/60">
                            {filteredTemplates.length > 0 ? (
                                filteredTemplates.map((template, index) => (
                                    <tr
                                        key={template.id}
                                        className="hover:bg-page/40 transition-colors text-text"
                                    >
                                        <td className="px-6 py-4 text-muted font-medium">
                                            {index + 1}
                                        </td>
                                        <td className="px-6 py-4 font-semibold text-text">
                                            {formatTemplateName(template.name)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`px-2 py-0.5 rounded text-xs font-semibold ${
                                                    template.category.toLowerCase() === "email"
                                                        ? "bg-accent/10 text-accent"
                                                        : template.category.toLowerCase() === "sms"
                                                          ? "bg-success/15 text-success"
                                                          : "bg-purple-50 text-purple-600"
                                                }`}
                                            >
                                                {template.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-muted">
                                            {template.smsProvider || "–"}
                                        </td>
                                        <td className="px-6 py-4 text-muted">
                                            {template.language || "–"}
                                        </td>
                                        <td className="px-6 py-4 text-muted">
                                            {template.countryName || template.country || "–"}
                                        </td>
                                        <td className="px-6 py-4 text-muted">
                                            {formatRelativeTime(template.lastModified)}
                                        </td>
                                        <td className="px-6 py-4 text-right select-none">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/email-templates/${template.name}`}
                                                    className="text-accent hover:underline text-[13px] font-semibold transition-colors"
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDeleteClick(template)}
                                                    disabled={deletingId === template.id}
                                                    className="p-1 text-danger/60 hover:text-danger transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                                    title="Delete template"
                                                >
                                                    <Trash2 size={14} strokeWidth={2} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={8}
                                        className="px-6 py-12 text-center text-sm text-muted"
                                    >
                                        No templates match your search criteria.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            {filteredTemplates.length > 0 && (
                <EmailTemplatesPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalCount={totalCount}
                    rowsPerPage={rowsPerPage}
                    onPageChange={onPageChange}
                    onRowsPerPageChange={onRowsPerPageChange}
                />
            )}

            <Toast
                visible={toast.visible}
                title={toast.title}
                message={toast.message}
                type={toast.type}
                onClose={() => setToast((prev) => ({ ...prev, visible: false }))}
            />

            <ConfirmModal
                isOpen={deleteTarget !== null}
                title="Delete Template"
                message={`Are you sure you want to delete "${deleteTarget ? formatTemplateName(deleteTarget.name) : ""}"? This cannot be undone.`}
                confirmLabel="Yes, delete"
                cancelLabel="No, keep it"
                onConfirm={handleConfirmDelete}
                onCancel={() => setDeleteTarget(null)}
            />
        </div>
    );
};

export default EmailTemplatesTable;
