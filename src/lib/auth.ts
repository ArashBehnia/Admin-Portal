import { cookies, headers } from "next/headers";
import { buildBackendUrl } from "./api";
import { redirect } from "next/navigation";

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

    try {
        const response = await fetch(buildBackendUrl("/admin/me"), {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
                ...forwardedHeaders,
            },
            cache: "no-store",
        });

        console.log("response", response);

        if (!response.ok) {
            if (response.status === 403) {
                try {
                    const clone = response.clone();
                    const errBody = await clone.json();
                    if (errBody?.error === "IP is blocked" || errBody?.message === "IP is blocked") {
                        redirect("/login?error=blocked");
                    }
                } catch {
                    // Ignore JSON parsing errors
                }
            }
            return null;
        }

        const json = await response.json();

        // console.log("login user data", json);

        // If backend returns a single user object
        // if (json.id || json.email) {
        //     return json.data || json.user || json;
        // }

        // // If backend returns a paginated list, extract logged-in user from JWT
        // if (json.content && Array.isArray(json.content)) {
        //     const payload = decodeJwtPayload(accessToken);
        //     const userId =
        //         (payload?.sub as string) ||
        //         (payload?.userId as string) ||
        //         (payload?.id as string);

        //     if (userId) {
        //         const found = json.content.find(
        //             (u: User) => String(u.id) === String(userId),
        //         );
        //         if (found) return found;
        //     }

        //     // Fallback: return first user if JWT decode fails
        //     return json.content[0] || null;
        // }

        if (json?.user) return json.user;
        if (json?.data?.user) return json.data.user;
        if (json?.data?.id || json?.data?.email) return json.data;
        if (json?.id || json?.email) return json;
        return null;
    } catch {
        return null;
    }
}
