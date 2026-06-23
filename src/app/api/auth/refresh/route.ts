import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
    process.env.ADMIN_API_URL || "https://admin-api.homeby.com.au";

export async function POST(request: NextRequest) {
    const refreshToken = request.cookies.get("refresh-token")?.value;

    if (!refreshToken) {
        return NextResponse.json(
            { error: "No refresh token" },
            { status: 401 },
        );
    }

    try {
        const response = await fetch(`${BACKEND_URL}/auth/token/refresh`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ "refresh-token": refreshToken }),
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(
                { error: data.message || "Token refresh failed" },
                { status: response.status },
            );
        }

        const res = NextResponse.json({ success: true });

        const accessTokenMaxAge = 60 * 60;
        const refreshTokenMaxAge = 7 * 24 * 60 * 60;

        res.cookies.set("access-token", data["access-token"], {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: accessTokenMaxAge,
            path: "/",
        });

        res.cookies.set("refresh-token", data["refresh-token"], {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: refreshTokenMaxAge,
            path: "/",
        });

        return res;
    } catch {
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 },
        );
    }
}
