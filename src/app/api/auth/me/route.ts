import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";

export async function GET() {
    try {
        const user = await getUser();

        if (!user) {
            const res = NextResponse.json(
                { error: "Not authenticated" },
                { status: 401 },
            );
            res.cookies.set("access-token", "", { maxAge: 0, path: "/" });
            res.cookies.set("refresh-token", "", { maxAge: 0, path: "/" });
            return res;
        }

        return NextResponse.json({ user });
    } catch {
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 },
        );
    }
}
