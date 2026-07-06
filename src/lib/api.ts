import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

export function buildBackendUrl(path: string): string {
    const base = (process.env.ADMIN_API_URL || "https://admin-api.homeby.com.au").trim();
    
    // Remove trailing slashes from base
    let normalizedBase = base.replace(/\/+$/, "");

    // If normalizedBase does not end with '/api', append it
    if (!normalizedBase.endsWith("/api")) {
        normalizedBase = `${normalizedBase}/api`;
    }

    // Ensure path starts with a single slash
    const cleanPath = path.startsWith("/") ? path : `/${path}`;

    return `${normalizedBase}${cleanPath}`;
}

import { NextResponse } from "next/server";

export class BackendError extends Error {
    status: number;
    constructor(message: string, status: number) {
        super(message);
        this.name = "BackendError";
        this.status = status;
    }
}

export function handleBffError(error: unknown, contextPath: string): NextResponse {
    const message = error instanceof Error ? error.message : "Internal server error";
    const status = error instanceof BackendError ? error.status : 500;

    console.error(`[BFF ${contextPath}] error:`, error);

    let userFacingMessage = message;
    if (
        message.includes("Cannot POST") ||
        message.includes("Cannot GET") ||
        message.includes("Cannot PUT") ||
        message.includes("Cannot DELETE") ||
        message.includes("Cannot PATCH") ||
        message.includes("<!DOCTYPE html>") ||
        message.includes("html>") ||
        status === 502 ||
        status === 503 ||
        status === 504
    ) {
        userFacingMessage = "The backend service is temporarily unavailable. Please try again later.";
    }

    return NextResponse.json({ error: userFacingMessage }, { status });
}

export async function backendFetch<T>(
    path: string,
    options?: RequestInit,
): Promise<T> {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access-token")?.value;

    if (!accessToken) {
        throw new BackendError("Not authenticated", 401);
    }

    let forwardedHeaders: Record<string, string> = {};
    try {
        const reqHeaders = await headers();
        const xForwardedFor = reqHeaders.get("x-forwarded-for");
        if (xForwardedFor) {
            forwardedHeaders["x-forwarded-for"] = xForwardedFor;
        }
        const xRealIp = reqHeaders.get("x-real-ip");
        if (xRealIp) {
            forwardedHeaders["x-real-ip"] = xRealIp;
        }
    } catch {
        // Safe fallback if headers() is called outside request context
    }

    const url = buildBackendUrl(path);

    const response = await fetch(url, {
        ...options,
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
            ...forwardedHeaders,
            ...options?.headers,
        },
        cache: "no-store",
    });

    if (!response.ok) {
        const body = await response.text();
        let msg = body;
        let isIpBlocked = false;
        try {
            const parsed = JSON.parse(body);
            msg = parsed.message || parsed.error || body;
            if (response.status === 403 && (parsed.error === "IP is blocked" || parsed.message === "IP is blocked")) {
                isIpBlocked = true;
            }
        } catch {
            // use raw body
        }
        if (isIpBlocked) {
            redirect("/login?error=blocked");
        }
        throw new BackendError(msg || `Backend returned ${response.status}`, response.status);
    }

    const text = await response.text();
    if (!text) return {} as T;
    const json = JSON.parse(text);
    return (json.data ?? json) as T;
}
