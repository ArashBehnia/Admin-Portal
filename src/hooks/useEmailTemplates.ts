"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
    Template,
    CategoryFilter,
    TemplateCategory,
} from "@/actions/emailTemplatesActions";

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
    const [templates, setTemplates] = useState<Template[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isSearching, setIsSearching] = useState(false);
    const [isError, setIsError] = useState(false);

    const [searchQuery, setSearchQuery] = useState("");
    const searchQueryRef = useRef(searchQuery);

    const [selectedCategory] = useState<CategoryFilter>("All types");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const pageSizeRef = useRef(pageSize);

    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

    const loadPage = useCallback(
        async (page: number, filter?: string, isSearch = false) => {
            if (isSearch) setIsSearching(true);
            else setIsLoading(true);
            setIsError(false);
            try {
                const offset = isSearch ? 0 : (page - 1) * pageSizeRef.current;
                const limit = isSearch ? 200 : pageSizeRef.current;
                const params = new URLSearchParams({
                    offset: String(offset),
                    limit: String(limit),
                });
                if (filter) params.set("filter", filter);

                const res = await fetch(
                    `/api/email-templates?${params.toString()}`,
                );
                if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
                const json = await res.json();

                const items: Template[] = Array.isArray(json)
                    ? json
                    : Array.isArray(json.data)
                      ? json.data
                      : [];
                const total =
                    typeof json.total === "number"
                        ? json.total
                        : items.length;

                setTemplates(items);
                setTotalCount(total);
            } catch {
                setIsError(true);
            } finally {
                if (isSearch) setIsSearching(false);
                else setIsLoading(false);
            }
        },
        [],
    );

    // Initial load
    useEffect(() => {
        const timer = setTimeout(() => {
            loadPage(1);
        }, 0);
        return () => clearTimeout(timer);
    }, [loadPage]);

    // Sync refs
    useEffect(() => {
        searchQueryRef.current = searchQuery;
    }, [searchQuery]);

    useEffect(() => {
        pageSizeRef.current = pageSize;
    }, [pageSize]);

    // Search with debounce
    useEffect(() => {
        setCurrentPage(1);
        if (!searchQuery.trim()) {
            loadPage(1);
            return;
        }
        const timer = setTimeout(() => {
            loadPage(1, searchQuery.trim(), true);
        }, 250);
        return () => clearTimeout(timer);
    }, [searchQuery, loadPage]);

    // Page size change
    useEffect(() => {
        const timer = setTimeout(() => {
            setCurrentPage(1);
            loadPage(1, searchQueryRef.current || undefined);
        }, 0);
        return () => clearTimeout(timer);
    }, [pageSize, loadPage]);

    // Page change
    const handlePageChange = useCallback(
        (page: number) => {
            setCurrentPage(page);
            loadPage(page, searchQueryRef.current || undefined);
            window.scrollTo({ top: 0, behavior: "smooth" });
        },
        [loadPage],
    );

    // Client-side filtering fallback
    const searchLower = searchQuery.trim().toLowerCase();
    const filteredTemplates = searchLower
        ? templates.filter(
              (t) =>
                  t.name.toLowerCase().includes(searchLower) ||
                  t.category.toLowerCase().includes(searchLower) ||
                  (t.subject && t.subject.toLowerCase().includes(searchLower)),
          )
        : templates;

    const stats = {
        total: totalCount,
        active: totalCount,
        draft: 0,
    };

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
        filteredTemplates,
        allFilteredCount: totalCount,
        currentPage,
        totalPages,
        pageSize,
        setPageSize,
        setCurrentPage: handlePageChange,
        stats,
        isLoading,
        isSearching,
        isError,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory: () => {},
        getCategoryStyles,
    };
};

export default useEmailTemplates;
