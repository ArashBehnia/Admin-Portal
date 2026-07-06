import { NextRequest, NextResponse } from "next/server";
import { buildBackendUrl } from "@/lib/api";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email } = body;

        if (!email) {
            return NextResponse.json(
                { error: "Email is required" },
                { status: 400 },
            );
        }

        const response = await fetch(
            buildBackendUrl("/auth/forgot-password"),
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            },
        );

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

        // Strip the token from the response body to avoid browser exposure
        const { token, ...safeData } = data;
        return NextResponse.json({ success: true, ...safeData });
    } catch {
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 },
        );
    }
}
