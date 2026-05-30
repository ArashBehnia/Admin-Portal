"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import {
    Template,
    TemplateCategory,
    CategoryFilter,
    CATEGORIES,
} from "@/actions/emailTemplatesActions";

interface EmailTemplatesTableProps {
    filteredTemplates: Template[];
    searchQuery: string;
    selectedCategory: CategoryFilter;
    onSearchChange: (val: string) => void;
    onCategoryChange: (val: CategoryFilter) => void;
    getCategoryStyles: (category: TemplateCategory) => string;
}

const EmailTemplatesTable = ({
    filteredTemplates,
    searchQuery,
    selectedCategory,
    onSearchChange,
    onCategoryChange,
    getCategoryStyles,
}: EmailTemplatesTableProps) => {
    return (
        <div className="flex flex-col gap-6">
            {/* Search + Category Filter */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="relative w-full sm:max-w-xs">
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
                    className="w-full sm:w-auto bg-card border border-border rounded-md px-3 py-2 text-sm text-text focus:outline-none focus:border-accent/50 transition-colors"
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
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-border/80 bg-page/50 text-[11px] text-muted font-bold tracking-wider uppercase">
                                <th className="px-6 py-4">Template name</th>
                                <th className="px-6 py-4 hidden sm:table-cell">
                                    Category
                                </th>
                                <th className="px-6 py-4 hidden md:table-cell">
                                    Channel
                                </th>
                                <th className="px-6 py-4 hidden lg:table-cell">
                                    Last modified
                                </th>
                                <th className="px-6 py-4 hidden lg:table-cell">
                                    Modified by
                                </th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/60">
                            {filteredTemplates.length > 0 ? (
                                filteredTemplates.map((template) => (
                                    <tr
                                        key={template.id}
                                        className="hover:bg-page/40 transition-colors text-sm text-text"
                                    >
                                        <td className="px-6 py-4 font-semibold text-text">
                                            {template.name}
                                        </td>
                                        <td className="px-6 py-4 hidden sm:table-cell">
                                            <span
                                                className={`px-2 py-0.5 rounded text-xs font-semibold ${getCategoryStyles(template.category)}`}
                                            >
                                                {template.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 hidden md:table-cell">
                                            <div className="flex items-center gap-1.5">
                                                {template.channels.map(
                                                    (chan) => (
                                                        <span
                                                            key={chan}
                                                            className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                                                                chan === "Email"
                                                                    ? "bg-accent/10 text-accent"
                                                                    : "bg-success/15 text-success"
                                                            }`}
                                                        >
                                                            {chan}
                                                        </span>
                                                    ),
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 hidden lg:table-cell text-muted">
                                            {template.lastModified}
                                        </td>
                                        <td className="px-6 py-4 hidden lg:table-cell text-muted font-medium">
                                            {template.modifiedBy}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`inline-block px-2.5 py-0.5 text-xs font-semibold rounded ${
                                                    template.status === "Active"
                                                        ? "bg-success/10 text-success"
                                                        : "bg-warning/10 text-warning"
                                                }`}
                                            >
                                                {template.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right select-none">
                                            <Link
                                                href={`/email-templates/${template.name}`}
                                                className="text-accent hover:underline text-sm font-semibold transition-colors"
                                            >
                                                Edit
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={7}
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
        </div>
    );
};

export default EmailTemplatesTable;
