import { cookies } from "next/headers";

const BACKEND_URL =
    process.env.ADMIN_API_URL || "https://admin-api.homeby.com.au";

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

    const response = await fetch(`${BACKEND_URL}${path}`, {
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

    const json = await response.json();
    return (json.data ?? json) as T;
}
