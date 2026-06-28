"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UserProvider } from "@/contexts/UserContext";
import type { User } from "@/lib/auth";

import { BreadcrumbProvider } from "@/contexts/BreadcrumbContext";

export default function Providers({
    children,
    user,
}: {
    children: React.ReactNode;
    user: User | null;
}) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 60 * 1000,
                        refetchOnWindowFocus: false,
                    },
                },
            }),
    );

    return (
        <BreadcrumbProvider>
            <UserProvider user={user}>
                <QueryClientProvider client={queryClient}>
                    {children}
                </QueryClientProvider>
            </UserProvider>
        </BreadcrumbProvider>
    );
}
