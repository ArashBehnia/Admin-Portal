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

function decodeJwtPayload(token: string): Record<string, unknown> | null {
    try {
        const base64 = token.split(".")[1];
        const padded = base64.replace(/-/g, "+").replace(/_/g, "/");
        const decoded = atob(padded);
        return JSON.parse(decoded);
    } catch {
        return null;
    }
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

        // If backend returns a single user object
        if (json.id || json.email) {
            return json.data || json.user || json;
        }

        // If backend returns a paginated list, extract logged-in user from JWT
        if (json.content && Array.isArray(json.content)) {
            const payload = decodeJwtPayload(accessToken);
            const userId =
                (payload?.sub as string) ||
                (payload?.userId as string) ||
                (payload?.id as string);

            if (userId) {
                const found = json.content.find(
                    (u: User) => String(u.id) === String(userId),
                );
                if (found) return found;
            }

            // Fallback: return first user if JWT decode fails
            return json.content[0] || null;
        }

        return json;
    } catch {
        return null;
    }
}
