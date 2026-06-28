import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
    process.env.ADMIN_API_URL || "https://admin-api.homeby.com.au";

function decodeJwtPayload(token: string): Record<string, unknown> | null {
    try {
        const base64 = token.split(".")[1];
        const padded = base64.replace(/-/g, "+").replace(/_/g, "/");
        const decoded = atob(padded);
        return JSON.parse(decoded);
    } catch {
        return null;
    }
}

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

        // If backend returns a single user object
        if (data.id || data.email) {
            const user = data.data || data.user || data;
            return NextResponse.json(user);
        }

        // If backend returns a paginated list, extract logged-in user from JWT
        if (data.content && Array.isArray(data.content)) {
            const payload = decodeJwtPayload(accessToken);
            const userId =
                (payload?.sub as string) ||
                (payload?.userId as string) ||
                (payload?.id as string);

            if (userId) {
                const found = data.content.find(
                    (u: Record<string, unknown>) => u.id === userId,
                );
                if (found) return NextResponse.json(found);
            }

            // Fallback: return first user if JWT decode fails
            return NextResponse.json(data.content[0] || null);
        }

        return NextResponse.json(data);
    } catch {
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 },
        );
    }
}
