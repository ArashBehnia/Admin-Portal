import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { buildBackendUrl } from "@/lib/api";

export async function POST(request: Request) {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refresh-token")?.value;
    const accessToken = cookieStore.get("access-token")?.value;

    if (refreshToken && accessToken) {
        try {
            await fetch(buildBackendUrl("/auth/logout"), {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ "refresh-token": refreshToken }),
            });
        } catch {
            // Backend call failed, still clear cookies locally
        }
    }

    const res = NextResponse.json({ success: true });

    const isDevHost = request.url.includes("localhost") || request.url.includes("127.0.0.1") || request.url.includes("[::1]");
    const isSecure = process.env.NODE_ENV === "production" && !isDevHost;

    res.cookies.set("access-token", "", {
        httpOnly: true,
        secure: isSecure,
        sameSite: "lax",
        maxAge: 0,
        path: "/",
    });

    res.cookies.set("refresh-token", "", {
        httpOnly: true,
        secure: isSecure,
        sameSite: "lax",
        maxAge: 0,
        path: "/",
    });

    return res;
}
