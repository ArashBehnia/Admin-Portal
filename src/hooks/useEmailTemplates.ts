"use client";

import { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
    Template,
    CategoryFilter,
    TemplateCategory,
} from "@/actions/emailTemplatesActions";

async function fetchJson<T>(url: string): Promise<T> {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
    return res.json();
}

function toArray<T>(value: unknown): T[] {
    if (Array.isArray(value)) return value;
    if (value && typeof value === "object") {
        const obj = value as Record<string, unknown>;
        if (Array.isArray(obj.data)) return obj.data as T[];
        if (Array.isArray(obj.items)) return obj.items as T[];
        if (Array.isArray(obj.results)) return obj.results as T[];
        for (const v of Object.values(obj)) {
            if (Array.isArray(v)) return v as T[];
        }
    }
    return [];
}

const useEmailTemplates = () => {
    const templatesQuery = useQuery({
        queryKey: ["email-templates"],
        queryFn: () => fetchJson<Template[] | unknown>("/api/email-templates"),
        select: (data) => toArray<Template>(data),
    });

    const templates = useMemo(() => toArray<Template>(templatesQuery.data), [templatesQuery.data]);

    useEffect(() => {
        if (templatesQuery.data) {
            console.log("[useEmailTemplates] raw query data:", JSON.stringify(templatesQuery.data, null, 2));
            console.log("[useEmailTemplates] normalized templates:", JSON.stringify(templates, null, 2));
            console.log("[useEmailTemplates] stats:", {
                total: templates.length,
                active: templates.filter((t) => t.status === "Active").length,
                draft: templates.filter((t) => t.status === "Draft").length,
            });
        }
    }, [templatesQuery.data, templates]);

    useEffect(() => {
        if (templatesQuery.isError) {
            console.error("[useEmailTemplates] query error:", templatesQuery.error);
        }
    }, [templatesQuery.isError, templatesQuery.error]);

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] =
        useState<CategoryFilter>("All types");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const stats = {
        total: templates.length,
        active: templates.filter((t) => t.status === "Active").length,
        draft: templates.filter((t) => t.status === "Draft").length,
    };

    const filteredTemplates = useMemo(() => {
        return templates.filter((t) => {
            const matchesSearch = t.name
                .toLowerCase()
                .includes(searchQuery.toLowerCase());
            const matchesCategory =
                selectedCategory === "All types" ||
                t.category.toLowerCase() === selectedCategory.toLowerCase();
            return matchesSearch && matchesCategory;
        });
    }, [templates, searchQuery, selectedCategory]);

    const totalCount = filteredTemplates.length;
    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
    const paginatedTemplates = filteredTemplates.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize,
    );

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, selectedCategory]);

    const getCategoryStyles = (category: TemplateCategory) => {
        switch (category) {
            case "email":
                return "bg-blue-50 text-blue-700 border border-blue-100";
            case "sms":
                return "bg-green-50 text-green-700 border border-green-100";
            case "push":
                return "bg-purple-50 text-purple-700 border border-purple-100";
            default:
                return "bg-page text-muted border border-border";
        }
    };

    return {
        filteredTemplates: paginatedTemplates,
        allFilteredCount: totalCount,
        currentPage,
        totalPages,
        pageSize,
        setPageSize,
        setCurrentPage,
        stats,
        isLoading: templatesQuery.isLoading,
        isError: templatesQuery.isError,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        getCategoryStyles,
    };
};

export default useEmailTemplates;
