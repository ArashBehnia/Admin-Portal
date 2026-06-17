import { QueryClient, dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { fetchEmailTemplatesPage } from "@/lib/email-templates-service";
import TemplateEditorClient from "@/components/EmailTemplates/TemplateName/TemplateEditorClient";

interface PageProps {
    params: Promise<{ templateName: string }>;
}

export default async function TemplateEditorPage({ params }: PageProps) {
    const { templateName } = await params;
    console.log("[email-templates/[templateName]/page.tsx] server-side prefetch for:", templateName);

    const queryClient = new QueryClient();

    await Promise.allSettled([
        queryClient.prefetchQuery({
            queryKey: ["email-templates"],
            queryFn: fetchEmailTemplatesPage,
        }),
        queryClient.prefetchQuery({
            queryKey: ["email-template", templateName],
            queryFn: async () => {
                const templates = await fetchEmailTemplatesPage();
                const found = templates.find((t) => t.name === templateName);
                console.log("[email-templates/[templateName]/page.tsx] template lookup result:", found ? JSON.stringify(found, null, 2) : "not found, using fallback");
                return (
                    found ?? {
                        id: "",
                        name: templateName,
                        category: "System" as const,
                        channels: ["Email" as const],
                        lastModified: "",
                        modifiedBy: "",
                        status: "Active" as const,
                    }
                );
            },
        }),
    ]);

    const dehydratedState = dehydrate(queryClient);
    console.log("[email-templates/[templateName]/page.tsx] prefetch complete, dehydrated queries:", dehydratedState.queries.length);

    return (
        <HydrationBoundary state={dehydratedState}>
            <TemplateEditorClient templateName={templateName} />
        </HydrationBoundary>
    );
}
