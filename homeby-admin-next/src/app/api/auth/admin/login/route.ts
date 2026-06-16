import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
    process.env.ADMIN_API_URL || "https://admin-api.homeby.com.au";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { username, password, rememberMe, turnstileToken } = body;

        if (!username || !password) {
            return NextResponse.json(
                { error: "Username and password are required" },
                { status: 400 },
            );
        }

        const response = await fetch(`${BACKEND_URL}/auth/admin/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username,
                password,
                rememberMe: rememberMe ?? false,
                turnstileToken: turnstileToken || undefined,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(
                { error: data.message || "Login failed" },
                { status: response.status },
            );
        }

        // Store the OTP token in an httponly cookie
        const cookieMaxAge = 5 * 60; // 5 minutes for OTP token
        const res = NextResponse.json(data);

        res.cookies.set("otp-token", data.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: cookieMaxAge,
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
