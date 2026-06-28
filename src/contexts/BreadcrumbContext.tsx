"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

type BreadcrumbContextType = {
    dynamicCrumb: string | null;
    setDynamicCrumb: (crumb: string | null) => void;
};

const BreadcrumbContext = createContext<BreadcrumbContextType | undefined>(undefined);

export function BreadcrumbProvider({ children }: { children: ReactNode }) {
    const [dynamicCrumb, setDynamicCrumb] = useState<string | null>(null);

    return (
        <BreadcrumbContext.Provider value={{ dynamicCrumb, setDynamicCrumb }}>
            {children}
        </BreadcrumbContext.Provider>
    );
}

export function useBreadcrumb() {
    const context = useContext(BreadcrumbContext);
    if (!context) {
        throw new Error("useBreadcrumb must be used within BreadcrumbProvider");
    }
    return context;
}
