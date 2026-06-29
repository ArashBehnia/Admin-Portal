import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const accessToken = request.cookies.get("access-token")?.value;

    // Allow API auth routes regardless of auth state
    if (pathname.startsWith("/api/auth")) {
        return NextResponse.next();
    }

    // Redirect authenticated users away from /login to /dashboard
    if (pathname === "/login") {
        if (accessToken) {
            return NextResponse.redirect(new URL("/dashboard", request.url));
        }
        return NextResponse.next();
    }

    // Protect all other routes: redirect to /login if not authenticated
    if (!accessToken) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
