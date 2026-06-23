import { cookies } from "next/headers";

const BACKEND_URL =
    process.env.ADMIN_API_URL || "https://admin-api.homeby.com.au";

export interface User {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    role?: string;
    status?: string;
    [key: string]: unknown;
}

export async function getUser(): Promise<User | null> {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access-token")?.value;

    if (!accessToken) {
        return null;
    }

    try {
        const response = await fetch(`${BACKEND_URL}/admin/user/own`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            cache: "no-store",
        });

        if (!response.ok) {
            return null;
        }

        const json = await response.json();
        return json.data || json.user || json;
    } catch {
        return null;
    }
}
