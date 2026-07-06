import { handleBffError } from "@/lib/api";
import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";

export async function GET(request: Request) {
    try {
        const user = await getUser();

        if (!user) {
            const res = NextResponse.json(
                { error: "Not authenticated" },
                { status: 401 },
            );
            const isDevHost = request.url.includes("localhost") || request.url.includes("127.0.0.1") || request.url.includes("[::1]");
            const isSecure = process.env.NODE_ENV === "production" && !isDevHost;

            res.cookies.set("access-token", "", { httpOnly: true, secure: isSecure, sameSite: "lax", maxAge: 0, path: "/" });
            res.cookies.set("refresh-token", "", { httpOnly: true, secure: isSecure, sameSite: "lax", maxAge: 0, path: "/" });
            return res;
        }

        return NextResponse.json({ user });
    } catch (error) {
        return handleBffError(error, "auth/me");
    }
}
