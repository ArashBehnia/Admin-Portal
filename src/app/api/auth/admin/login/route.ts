import { NextRequest, NextResponse } from "next/server";
import { buildBackendUrl, handleBffError } from "@/lib/api";

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
        
        const response = await fetch(buildBackendUrl("/auth/admin/login"), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username,
                password,
                rememberMe: rememberMe ?? false,
                turnstileToken: turnstileToken || undefined,
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

        // Store the OTP token in an httponly cookie
        const cookieMaxAge = data.expires || 10 * 60; // Align with backend expiry (e.g. 10 minutes)
        const { token, ...safeData } = data;
        const res = NextResponse.json({ success: true, ...safeData });

        const isDevHost = request.url.includes("localhost") || request.url.includes("127.0.0.1") || request.url.includes("[::1]");
        const isSecure = process.env.NODE_ENV === "production" && !isDevHost;

        res.cookies.set("otp-token", token, {
            httpOnly: true,
            secure: isSecure,
            sameSite: "lax",
            maxAge: cookieMaxAge,
            path: "/",
        });

        return res;
    } catch (error) {
        return handleBffError(error, "auth/admin/login");
    }
}
