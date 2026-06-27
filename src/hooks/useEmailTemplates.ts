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

    const getCategoryStyles = (category: TemplateCategory) => {
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

    return {
        filteredTemplates,
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
