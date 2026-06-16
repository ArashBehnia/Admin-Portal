import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
    process.env.ADMIN_API_URL || "https://admin-api.homeby.com.au";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { code } = body;

        if (!code) {
            return NextResponse.json(
                { error: "OTP code is required" },
                { status: 400 },
            );
        }

        // Get the OTP token from httponly cookie
        const otpToken = request.cookies.get("otp-token")?.value;

        if (!otpToken) {
            return NextResponse.json(
                { error: "OTP session expired. Please login again." },
                { status: 401 },
            );
        }

        const response = await fetch(`${BACKEND_URL}/auth/verify-2fa`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                token: otpToken,
                code,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(
                { error: data.message || "OTP verification failed" },
                { status: response.status },
            );
        }

        // Store access and refresh tokens in httponly cookies
        const res = NextResponse.json(data);

        const accessTokenMaxAge = 60 * 60; // 1 hour
        const refreshTokenMaxAge = 7 * 24 * 60 * 60; // 7 days

        res.cookies.set("access-token", data.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: accessTokenMaxAge,
            path: "/",
        });

        res.cookies.set("refresh-token", data.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: refreshTokenMaxAge,
            path: "/",
        });

        // Clear the OTP token cookie
        res.cookies.set("otp-token", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 0,
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
