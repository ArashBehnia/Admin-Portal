import { NextRequest, NextResponse } from "next/server";
import { buildBackendUrl, handleBffError } from "@/lib/api";

export async function POST(request: NextRequest) {
    const refreshToken = request.cookies.get("refresh-token")?.value;

    if (!refreshToken) {
        return NextResponse.json(
            { error: "No refresh token" },
            { status: 401 },
        );
    }

    try {
        const response = await fetch(
            buildBackendUrl(`/auth/refresh-token?token=${encodeURIComponent(refreshToken)}`),
            {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            }
        );

        let data: any = {};
        try {
            data = await response.json();
        } catch {
            // Fallback for non-JSON responses
        }

        if (!response.ok) {
            const res = NextResponse.json(
                { error: data.message || data.error || "Token refresh failed" },
                { status: response.status },
            );
            res.cookies.set("access-token", "", { maxAge: 0, path: "/" });
            res.cookies.set("refresh-token", "", { maxAge: 0, path: "/" });
            return res;
        }

        const res = NextResponse.json({ success: true });

        const accessTokenMaxAge = 60 * 60;
        const refreshTokenMaxAge = 7 * 24 * 60 * 60;

        const newAccessToken = data.accessToken || data["access-token"];
        const newRefreshToken = data.refreshToken || data["refresh-token"];

        const isDevHost = request.url.includes("localhost") || request.url.includes("127.0.0.1") || request.url.includes("[::1]");
        const isSecure = process.env.NODE_ENV === "production" && !isDevHost;

        res.cookies.set("access-token", newAccessToken, {
            httpOnly: true,
            secure: isSecure,
            sameSite: "lax",
            maxAge: accessTokenMaxAge,
            path: "/",
        });

        res.cookies.set("refresh-token", newRefreshToken, {
            httpOnly: true,
            secure: isSecure,
            sameSite: "lax",
            maxAge: refreshTokenMaxAge,
            path: "/",
        });

        return res;
    } catch (error) {
        return handleBffError(error, "auth/refresh");
    }
}
