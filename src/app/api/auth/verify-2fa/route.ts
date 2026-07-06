import { NextRequest, NextResponse } from "next/server";
import { buildBackendUrl } from "@/lib/api";

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

        const response = await fetch(buildBackendUrl("/auth/verify-2fa"), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                token: otpToken,
                code,
            }),
        });

        let data: any = {};
        try {
            data = await response.json();
        } catch {
            // Fallback for non-JSON responses
        }

        if (!response.ok) {
            return NextResponse.json(
                { error: data.message || data.error || `Backend returned status ${response.status}` },
                { status: response.status },
            );
        }

        // Store access and refresh tokens in httponly cookies
        const { accessToken, refreshToken, ...safeData } = data;
        const res = NextResponse.json({ success: true, ...safeData });

        const accessTokenMaxAge = 60 * 60; // 1 hour
        const refreshTokenMaxAge = 7 * 24 * 60 * 60; // 7 days

        res.cookies.set("access-token", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: accessTokenMaxAge,
            path: "/",
        });

        res.cookies.set("refresh-token", refreshToken, {
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
