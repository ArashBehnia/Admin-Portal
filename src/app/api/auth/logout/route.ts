import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { buildBackendUrl } from "@/lib/api";

export async function POST() {
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

    res.cookies.set("access-token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 0,
        path: "/",
    });

    res.cookies.set("refresh-token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 0,
        path: "/",
    });

    return res;
}
