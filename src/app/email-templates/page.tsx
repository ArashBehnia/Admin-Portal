import { QueryClient, dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { fetchEmailTemplatesPage } from "@/lib/email-templates-service";
import EmailTemplatesPageClient from "@/components/EmailTemplates/EmailTemplatesPageClient";

export default async function EmailTemplatesPage() {
    console.log("[email-templates/page.tsx] server-side prefetch starting");
    const queryClient = new QueryClient();

    await Promise.allSettled([
        queryClient.prefetchQuery({
            queryKey: ["email-templates"],
            queryFn: () => fetchEmailTemplatesPage(),
        }),
    ]);

    const dehydratedState = dehydrate(queryClient);
    console.log("[email-templates/page.tsx] prefetch complete, dehydrated queries:", dehydratedState.queries.length);

    return (
        <HydrationBoundary state={dehydratedState}>
            <EmailTemplatesPageClient />
        </HydrationBoundary>
    );
}
