import { useState, useMemo } from "react";
import {
    Template,
    CategoryFilter,
    TemplateCategory,
} from "@/actions/emailTemplatesActions";

interface UseEmailTemplatesProps {
    initialTemplates: Template[];
}

const useEmailTemplates = ({ initialTemplates }: UseEmailTemplatesProps) => {
    // ─── Data ─────────────────────────────────────────────────────────
    const templates = initialTemplates;

    // ─── Filter State ─────────────────────────────────────────────────
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] =
        useState<CategoryFilter>("All categories");

    // ─── Derived / Computed ───────────────────────────────────────────
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
                selectedCategory === "All categories" ||
                t.category.toLowerCase() === selectedCategory.toLowerCase();
            return matchesSearch && matchesCategory;
        });
    }, [templates, searchQuery, selectedCategory]);

    // ─── Helpers ──────────────────────────────────────────────────────
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
        // Data
        filteredTemplates,
        stats,

        // Filter State
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,

        // Helpers
        getCategoryStyles,
    };
};

export default useEmailTemplates;
