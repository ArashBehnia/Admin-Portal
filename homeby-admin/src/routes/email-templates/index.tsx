import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Search, Loader2 } from "lucide-react";

type Template = {
    id: string;
    name: string;
    category: "Auth" | "Account" | "Agency" | "Reviews" | "Billing" | "System";
    channels: ("Email" | "SMS")[];
    lastModified: string;
    modifiedBy: string;
    status: "Active" | "Draft";
};

const RouteComponent = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] =
        useState<string>("All categories");

    // Fetch Email Templates data using Axios & TanStack Query
    const {
        data: templates = [],
        isLoading,
        isError,
    } = useQuery<Template[]>({
        queryKey: ["emailTemplatesData"],
        queryFn: async () => {
            const response = await axios.get("/data/email_templates.json");
            return response.data;
        },
    });

    // Compute dynamic KPI stats
    const totalCount = templates.length;
    const activeCount = templates.filter((t) => t.status === "Active").length;
    const draftCount = templates.filter((t) => t.status === "Draft").length;

    // Filter templates based on Search Query and Category
    const filteredTemplates = useMemo(() => {
        return templates.filter((t) => {
            const matchesSearch = t.name
                .toLowerCase()
                .includes(searchQuery.toLowerCase());
            const matchesCategory =
                selectedCategory === "All categories" ||
                t.category.toLowerCase() === selectedCategory.toLowerCase();
            return matchesSearch && matchesCategory;
        });
    }, [templates, searchQuery, selectedCategory]);

    // Distinct categories for dropdown list
    const categories = [
        "All categories",
        "Auth",
        "Account",
        "Agency",
        "Reviews",
        "Billing",
        "System",
    ];

    // Render style helper for Category pill
    const getCategoryStyles = (category: string) => {
        switch (category) {
            case "Auth":
                return "bg-blue-50 text-blue-700 border border-blue-100";
            case "Account":
                return "bg-emerald-50 text-emerald-700 border border-emerald-100";
            case "Agency":
                return "bg-purple-50 text-purple-700 border border-purple-100";
            case "Reviews":
                return "bg-orange-50 text-orange-700 border border-orange-100";
            case "Billing":
                return "bg-amber-50 text-amber-700 border border-amber-100";
            case "System":
                return "bg-slate-50 text-slate-700 border border-slate-200";
            default:
                return "bg-page text-muted border border-border";
        }
    };

    return (
        <div className="max-w-content mx-auto">
            {/* Header */}
            <div className="my-6">
                <h1 className="text-2xl font-bold text-text">
                    Email Templates
                </h1>
                <p className="text-sm text-muted mt-1">
                    Manage all transactional email, SMS and push notification
                    templates. Changes take effect immediately without a deploy.
                </p>
            </div>

            {/* KPI Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {/* Total Templates Card */}
                <div className="bg-card border border-border rounded-lg p-5 shadow-sm space-y-1">
                    <p className="text-xs text-muted font-medium">
                        Total templates
                    </p>
                    <p className="text-3xl font-bold text-text">
                        {isLoading ? "..." : totalCount}
                    </p>
                </div>

                {/* Active Templates Card */}
                <div className="bg-card border border-border rounded-lg p-5 shadow-sm space-y-1">
                    <p className="text-xs text-muted font-medium flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-success inline-block" />
                        Active
                    </p>
                    <p className="text-3xl font-bold text-text">
                        {isLoading ? "..." : activeCount}
                    </p>
                </div>

                {/* Draft Templates Card */}
                <div className="bg-card border border-border rounded-lg p-5 shadow-sm space-y-1">
                    <p className="text-xs text-muted font-medium flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-warning inline-block" />
                        Draft (not yet active)
                    </p>
                    <p className="text-3xl font-bold text-text">
                        {isLoading ? "..." : draftCount}
                    </p>
                </div>
            </div>

            {/* Search and Filters Card */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 my-6">
                {/* Search Bar */}
                <div className="relative w-full sm:max-w-xs">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted" />
                    <input
                        type="text"
                        placeholder="Search template name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 pr-4 py-2 w-full bg-card border border-border rounded-md text-sm text-text placeholder-muted focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-colors"
                    />
                </div>

                {/* Category Selection Dropdown */}
                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full sm:w-auto bg-card border border-border rounded-md px-3 py-2 text-sm text-text focus:outline-none focus:border-accent/50 transition-colors select-none"
                >
                    {categories.map((cat) => (
                        <option key={cat} value={cat}>
                            {cat}
                        </option>
                    ))}
                </select>
            </div>

            {/* Error Message */}
            {isError && (
                <div className="bg-red-50 border border-red-200 text-danger rounded-lg p-4 text-sm text-center mb-6">
                    Failed to fetch email templates. Please refresh and try
                    again.
                </div>
            )}

            {/* Templates Table Card */}
            <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden mb-8">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-16 gap-3">
                        <Loader2 className="h-8 w-8 text-accent animate-spin" />
                        <span className="text-sm text-muted">
                            Loading templates...
                        </span>
                    </div>
                ) : (
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
                                            {/* Template Name */}
                                            <td className="px-6 py-4 font-semibold text-text">
                                                {template.name}
                                            </td>

                                            {/* Category Tag */}
                                            <td className="px-6 py-4 hidden sm:table-cell">
                                                <span
                                                    className={`px-2 py-0.5 rounded text-xs font-semibold ${getCategoryStyles(template.category)}`}
                                                >
                                                    {template.category}
                                                </span>
                                            </td>

                                            {/* Channel Tag(s) */}
                                            <td className="px-6 py-4 hidden md:table-cell">
                                                <div className="flex items-center gap-1.5">
                                                    {template.channels.map(
                                                        (chan) => (
                                                            <span
                                                                key={chan}
                                                                className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                                                                    chan ===
                                                                    "Email"
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

                                            {/* Last Modified Date */}
                                            <td className="px-6 py-4 hidden lg:table-cell text-muted">
                                                {template.lastModified}
                                            </td>

                                            {/* Modified By Author */}
                                            <td className="px-6 py-4 hidden lg:table-cell text-muted font-medium">
                                                {template.modifiedBy}
                                            </td>

                                            {/* Status Badge */}
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`inline-block px-2.5 py-0.5 text-xs font-semibold rounded ${
                                                        template.status ===
                                                        "Active"
                                                            ? "bg-success/10 text-success"
                                                            : "bg-warning/10 text-warning"
                                                    }`}
                                                >
                                                    {template.status}
                                                </span>
                                            </td>

                                            <td className="px-6 py-4 text-right select-none">
                                                <Link
                                                    to="/email-templates/$templateName"
                                                    params={{
                                                        templateName:
                                                            template.name,
                                                    }}
                                                    className="text-accent hover:underline text-sm font-semibold transition-colors font-sans"
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
                                            No templates match your search
                                            criteria.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export const Route = createFileRoute("/email-templates/")({
    component: RouteComponent,
});
