"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RefreshCw, Plus } from "lucide-react";
import useEmailTemplates from "@/hooks/useEmailTemplates";
import EmailTemplatesStats from "./EmailTemplatesStats";
import EmailTemplatesTable from "./EmailTemplatesTable";

const EmailTemplatesPageClient = () => {
    const {
        filteredTemplates,
        stats,
        isLoading,
        isError,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
    } = useEmailTemplates();

    useEffect(() => {
        console.log("[EmailTemplatesPageClient] render state:", {
            isLoading,
            isError,
            totalTemplates: filteredTemplates.length,
            stats,
        });
    }, [isLoading, isError, filteredTemplates.length, stats]);

    useEffect(() => {
        console.log("[EmailTemplatesPageClient] filteredTemplates:", JSON.stringify(filteredTemplates, null, 2));
    }, [filteredTemplates]);

    if (isError) {
        return (
            <div className="flex flex-col gap-5 w-full max-w-content mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div>
                        <h1 className="text-[18px] sm:text-[20px] font-bold text-text leading-snug">
                            Email Templates
                        </h1>
                        <p className="text-[12px] sm:text-[13px] text-muted mt-0.5">
                            Manage all transactional email, SMS and push notification
                            templates. Changes take effect immediately without a deploy.
                        </p>
                    </div>
                    <div className="flex items-center gap-2 self-start shrink-0">
                        <Link
                            href="/email-templates/new"
                            className="flex items-center gap-1.5 px-4 py-2 bg-accent hover:bg-accent/90 text-white rounded-md text-sm font-semibold transition-all shadow-sm"
                        >
                            <Plus className="w-4 h-4" />
                            Create
                        </Link>
                        <button
                            onClick={() => window.location.reload()}
                            className="text-muted hover:text-text p-2 rounded border border-border hover:bg-page transition-colors cursor-pointer"
                            title="Refresh"
                        >
                            <RefreshCw className="w-4 h-4" />
                        </button>
                    </div>
                </div>
                <div className="bg-card border border-border rounded-lg p-12 text-center">
                    <p className="text-danger font-medium">
                        Failed to load email templates. Please try again later.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-5 w-full max-w-content mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                    <h1 className="text-[18px] sm:text-[20px] font-bold text-text leading-snug">
                        Email Templates
                    </h1>
                    <p className="text-[12px] sm:text-[13px] text-muted mt-0.5">
                        Manage all transactional email, SMS and push notification
                        templates. Changes take effect immediately without a deploy.
                    </p>
                </div>
                <div className="flex items-center gap-2 self-start shrink-0">
                    <Link
                        href="/email-templates/new"
                        className="flex items-center gap-1.5 px-4 py-2 bg-accent hover:bg-accent/90 text-white rounded-md text-sm font-semibold transition-all shadow-sm"
                    >
                        <Plus className="w-4 h-4" />
                        Create
                    </Link>
                    <button
                        onClick={() => window.location.reload()}
                        className="text-muted hover:text-text p-2 rounded border border-border hover:bg-page transition-colors cursor-pointer"
                        title="Refresh"
                    >
                        <RefreshCw className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="flex flex-col gap-5">
                {isLoading ? (
                    <EmailTemplatesSkeleton />
                ) : (
                    <>
                        <EmailTemplatesStats stats={stats} />

                        <EmailTemplatesTable
                            filteredTemplates={filteredTemplates}
                            searchQuery={searchQuery}
                            selectedCategory={selectedCategory}
                            onSearchChange={setSearchQuery}
                            onCategoryChange={setSelectedCategory}
                        />
                    </>
                )}
            </div>
        </div>
    );
};

function EmailTemplatesSkeleton() {
    return (
        <div className="space-y-5 animate-pulse">
            {/* Stats cards skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div
                        key={i}
                        className="bg-card border border-border rounded p-4 flex flex-col gap-1.5"
                    >
                        <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-border" />
                            <div className="h-3 w-24 bg-border rounded" />
                        </div>
                        <div className="h-6 w-12 bg-border rounded" />
                    </div>
                ))}
            </div>

            {/* Search + filter skeleton */}
            <div className="flex items-center justify-between gap-4">
                <div className="relative w-full max-w-xs">
                    <div className="h-9 w-full bg-card border border-border rounded-md" />
                </div>
                <div className="h-9 w-40 bg-card border border-border rounded-md" />
            </div>

            {/* Table skeleton */}
            <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-[12px]">
                            <thead>
                                <tr className="border-b border-border/80 bg-page/55 text-muted text-[11px] font-bold tracking-wider uppercase">
                                <th className="px-6 py-4">Template name</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4">Channel</th>
                                <th className="px-6 py-4">Last modified</th>
                                <th className="px-6 py-4">Modified by</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/60">
                            {Array.from({ length: 8 }).map((_, i) => (
                                <tr key={i} className="text-sm">
                                    <td className="px-6 py-4">
                                        <div className="h-4 w-32 bg-border rounded" />
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="h-5 w-16 bg-border rounded" />
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="h-5 w-14 bg-border rounded" />
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="h-4 w-20 bg-border rounded" />
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="h-4 w-24 bg-border rounded" />
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="h-5 w-14 bg-border rounded" />
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="h-4 w-10 bg-border rounded ml-auto" />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default EmailTemplatesPageClient;
