import { cookies } from "next/headers";

const BACKEND_URL =
    process.env.ADMIN_API_URL || "https://admin-api.homeby.com.au";

export async function backendFetch<T>(
    path: string,
    options?: RequestInit,
): Promise<T> {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access-token")?.value;

    if (!accessToken) {
        throw new Error("Not authenticated");
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
        throw new Error(`Backend error ${response.status}: ${body}`);
    }

    const json = await response.json();
    return (json.data ?? json) as T;
}
