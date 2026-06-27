"use client";

import { useState } from "react";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { Search, Trash2 } from "lucide-react";
import {
    Template,
    CategoryFilter,
    CATEGORIES,
} from "@/actions/emailTemplatesActions";
import Toast from "@/components/Shared/Toast";
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

interface EmailTemplatesTableProps {
    filteredTemplates: Template[];
    searchQuery: string;
    selectedCategory: CategoryFilter;
    onSearchChange: (val: string) => void;
    onCategoryChange: (val: CategoryFilter) => void;
}

const EmailTemplatesTable = ({
    filteredTemplates,
    searchQuery,
    selectedCategory,
    onSearchChange,
    onCategoryChange,
}: EmailTemplatesTableProps) => {
    const queryClient = useQueryClient();
    const [deletingId, setDeletingId] = useState<string | null>(null);
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

    const handleDelete = async (template: Template) => {
        if (!confirm(`Delete template "${template.name}"? This cannot be undone.`)) {
            return;
        }

        setDeletingId(template.id);
        try {
            const res = await fetch(`/api/email-templates/${encodeURIComponent(template.id)}`, {
                method: "DELETE",
            });

            if (!res.ok) {
                const errorBody = await res.json().catch(() => ({}));
                throw new Error(errorBody.error || `Delete failed: ${res.status}`);
            }

            showToast("Template Deleted", `"${template.name}" has been deleted.`);
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
            <div className="flex items-center justify-between gap-4">
                <div className="relative w-full max-w-xs">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted" />
                    <input
                        type="text"
                        placeholder="Search template name..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="pl-9 pr-4 py-2 w-full bg-card border border-border rounded-md text-sm text-text placeholder-muted focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-colors"
                    />
                </div>
                <select
                    value={selectedCategory}
                    onChange={(e) =>
                        onCategoryChange(e.target.value as CategoryFilter)
                    }
                    className="w-auto bg-card border border-border rounded-md px-3 py-2 text-sm text-text focus:outline-none focus:border-accent/50 transition-colors cursor-pointer"
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
                    <table className="w-full text-left border-collapse text-[12px]">
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
                                        className="hover:bg-page/40 transition-colors text-sm text-text"
                                    >
                                        <td className="px-6 py-4 text-muted font-medium">
                                            {index + 1}
                                        </td>
                                        <td className="px-6 py-4 font-semibold text-text">
                                            {template.name}
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
                                                    className="text-accent hover:underline text-sm font-semibold transition-colors"
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDelete(template)}
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

            <Toast
                visible={toast.visible}
                title={toast.title}
                message={toast.message}
                type={toast.type}
                onClose={() => setToast((prev) => ({ ...prev, visible: false }))}
            />
        </div>
    );
};

export default EmailTemplatesTable;
