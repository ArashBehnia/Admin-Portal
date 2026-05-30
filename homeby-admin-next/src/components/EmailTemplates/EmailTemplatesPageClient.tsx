"use client";

import { Template } from "@/actions/emailTemplatesActions";
import useEmailTemplates from "@/hooks/useEmailTemplates";
import EmailTemplatesStats from "./EmailTemplatesStats";
import EmailTemplatesTable from "./EmailTemplatesTable";

interface EmailTemplatesPageClientProps {
    initialTemplates: Template[];
}

const EmailTemplatesPageClient = ({
    initialTemplates,
}: EmailTemplatesPageClientProps) => {
    const {
        filteredTemplates,
        stats,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        getCategoryStyles,
    } = useEmailTemplates({ initialTemplates });

    return (
        <div className="w-full max-w-content mx-auto">
            <div className="my-6">
                <h1 className="text-2xl font-bold text-text">
                    Email Templates
                </h1>
                <p className="text-sm text-muted mt-1">
                    Manage all transactional email, SMS and push notification
                    templates. Changes take effect immediately without a deploy.
                </p>
            </div>

            <div className="flex flex-col gap-6">
                <EmailTemplatesStats stats={stats} />

                <EmailTemplatesTable
                    filteredTemplates={filteredTemplates}
                    searchQuery={searchQuery}
                    selectedCategory={selectedCategory}
                    onSearchChange={setSearchQuery}
                    onCategoryChange={setSelectedCategory}
                    getCategoryStyles={getCategoryStyles}
                />
            </div>
        </div>
    );
};

export default EmailTemplatesPageClient;
