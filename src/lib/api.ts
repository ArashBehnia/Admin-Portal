import { cookies } from "next/headers";

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

export class BackendError extends Error {
    status: number;
    constructor(message: string, status: number) {
        super(message);
        this.name = "BackendError";
        this.status = status;
    }
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

    const url = buildBackendUrl(path);

    const response = await fetch(url, {
        ...options,
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
            ...options?.headers,
        },
        cache: "no-store",
    });

    if (!response.ok) {
        const body = await response.text();
        let msg = body;
        try {
            const parsed = JSON.parse(body);
            msg = parsed.message || parsed.error || body;
        } catch {
            // use raw body
        }
        throw new BackendError(msg || `Backend returned ${response.status}`, response.status);
    }

    const text = await response.text();
    if (!text) return {} as T;
    const json = JSON.parse(text);
    return (json.data ?? json) as T;
}
