import { fetchApplicationsPage, fetchApplicationsSummary } from "@/lib/application-service";
import type { ApplicationListItemDto, ApplicationSummaryDto } from "@/types/applicationTypes";

export type { Application, DrawerTab, ApplicationStatus, ApplicationStats, ApplicationNote, ApplicationTimeline } from "@/types/applicationTypes";

export type ApplicationsPageData = {
    applications: ApplicationListItemDto[];
    summary: ApplicationSummaryDto;
    total: number;
};

export const fetchApplications = async (): Promise<ApplicationsPageData> => {
    console.log("[applicationsActions] fetchApplications -> fetchApplicationsPage + fetchApplicationsSummary");
    const [pageResult, summary] = await Promise.all([
        fetchApplicationsPage(0, 100),
        fetchApplicationsSummary(),
    ]);

    console.log("[applicationsActions] pageResult:", JSON.stringify(pageResult).slice(0, 500));
    console.log("[applicationsActions] summary:", JSON.stringify(summary));

    return {
        applications: pageResult.data,
        summary,
        total: pageResult.total,
    };
};
