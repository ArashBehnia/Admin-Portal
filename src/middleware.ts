import { NextRequest, NextResponse } from "next/server";

const publicPaths = ["/login", "/api/auth"];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Allow public paths and API auth routes
    if (
        publicPaths.some(
            (path) => pathname === path || pathname.startsWith(path + "/"),
        )
    ) {
        return NextResponse.next();
    }

    // Check for access token cookie
    const accessToken = request.cookies.get("access-token")?.value;

    if (!accessToken) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
