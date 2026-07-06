import { NextRequest, NextResponse } from "next/server";

function hasXss(value: string): boolean {
    try {
        const decodedValue = decodeURIComponent(value);
        const xssPatterns = [
            /<script[\s\S]*?>[\s\S]*?<\/script>/i,
            /<script/i,
            /javascript:/i,
            /onload\s*[=:]/i,
            /onerror\s*[=:]/i,
            /onclick\s*[=:]/i,
            /onmouseover\s*[=:]/i,
        ];
        return xssPatterns.some(pattern => pattern.test(decodedValue));
    } catch {
        // Fallback to raw value in case of malformed URL encoding
        const xssPatterns = [
            /<script[\s\S]*?>[\s\S]*?<\/script>/i,
            /<script/i,
            /javascript:/i,
            /onload\s*[=:]/i,
            /onerror\s*[=:]/i,
            /onclick\s*[=:]/i,
            /onmouseover\s*[=:]/i,
        ];
        return xssPatterns.some(pattern => pattern.test(value));
    }
}

function isSafeOrigin(request: NextRequest): boolean {
    const origin = request.headers.get("origin");
    const referer = request.headers.get("referer");
    const host = request.headers.get("host") || request.nextUrl.host;

    const normalizeHost = (h: string) => h.replace(/^https?:\/\//, "").trim();
    const expectedHost = normalizeHost(host);

    if (origin) {
        return normalizeHost(origin) === expectedHost;
    }

    if (referer) {
        try {
            const refererUrl = new URL(referer);
            return refererUrl.host === expectedHost;
        } catch {
            return false;
        }
    }

    return false;
}

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // 1. Shared BFF XSS Filtering (Query, Path, and Body)
    if (hasXss(pathname)) {
        return new NextResponse(
            JSON.stringify({ error: "Potential XSS payload detected" }),
            { status: 400, headers: { "content-type": "application/json" } }
        );
    }

    for (const [key, value] of request.nextUrl.searchParams.entries()) {
        if (hasXss(key) || hasXss(value)) {
            return new NextResponse(
                JSON.stringify({ error: "Potential XSS payload detected" }),
                { status: 400, headers: { "content-type": "application/json" } }
            );
        }
    }

    if (
        pathname.startsWith("/api/") &&
        (request.method === "POST" ||
            request.method === "PUT" ||
            request.method === "PATCH")
    ) {
        try {
            const contentType = request.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                const clonedRequest = request.clone();
                const bodyText = await clonedRequest.text();
                if (hasXss(bodyText)) {
                    return new NextResponse(
                        JSON.stringify({ error: "Potential XSS payload detected" }),
                        { status: 400, headers: { "content-type": "application/json" } }
                    );
                }
            }
        } catch {
            // Ignore parse errors
        }
    }

    // 2. Shared BFF CSRF Protection for state-modifying API requests
    if (
        pathname.startsWith("/api/") &&
        (request.method === "POST" ||
            request.method === "PUT" ||
            request.method === "PATCH" ||
            request.method === "DELETE")
    ) {
        if (!isSafeOrigin(request)) {
            return new NextResponse(
                JSON.stringify({ error: "Invalid origin (potential CSRF request)" }),
                { status: 403, headers: { "content-type": "application/json" } }
            );
        }
    }

    const accessToken = request.cookies.get("access-token")?.value;

    // Allow API auth routes regardless of auth state
    if (pathname.startsWith("/api/auth")) {
        return NextResponse.next();
    }

    // Redirect authenticated users away from /login to /dashboard
    if (pathname === "/login") {
        const errorParam = request.nextUrl.searchParams.get("error");
        const isBlocked = errorParam === "blocked" || request.nextUrl.searchParams.get("blocked") === "true";
        if (isBlocked) {
            const response = NextResponse.next();
            response.cookies.delete("access-token");
            response.cookies.delete("refresh-token");
            return response;
        }
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
