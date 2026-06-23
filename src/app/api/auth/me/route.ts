import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
    process.env.ADMIN_API_URL || "https://admin-api.homeby.com.au";

export async function GET(request: NextRequest) {
    const accessToken = request.cookies.get("access-token")?.value;

    if (!accessToken) {
        return NextResponse.json(
            { error: "Not authenticated" },
            { status: 401 },
        );
    }

    try {
        const response = await fetch(`${BACKEND_URL}/admin/user/own`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            return NextResponse.json(
                { error: "Failed to fetch user" },
                { status: response.status },
            );
        }

        const data = await response.json();
        const user = data.data || data.user || data;
        return NextResponse.json(user);
    } catch {
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 },
        );
    }
}
