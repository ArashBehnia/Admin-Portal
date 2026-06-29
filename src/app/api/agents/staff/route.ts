import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/api";

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const agencyId = body.agencyId;
        if (!agencyId) {
            return NextResponse.json(
                { success: false, error: "agencyId is required" },
                { status: 400 },
            );
        }

        if (!body.contact?.firstName?.trim()) {
            return NextResponse.json(
                { success: false, error: "First name is required" },
                { status: 400 },
            );
        }

        if (!body.contact?.lastName?.trim()) {
            return NextResponse.json(
                { success: false, error: "Last name is required" },
                { status: 400 },
            );
        }

        if (!body.email?.trim()) {
            return NextResponse.json(
                { success: false, error: "Email is required" },
                { status: 400 },
            );
        }

        if (!body.password) {
            return NextResponse.json(
                { success: false, error: "Password is required" },
                { status: 400 },
            );
        }

        const payload: Record<string, unknown> = {
            agencyId,
            contact: {
                firstName: body.contact.firstName.trim(),
                lastName: body.contact.lastName.trim(),
            },
            email: body.email.trim(),
            password: body.password,
            isActive: body.isActive ?? true,
        };

        if (body.contact.salutation) payload.contact = { ...payload.contact as Record<string, unknown>, salutation: body.contact.salutation };
        if (body.mobile) payload.mobile = body.mobile.trim();
        if (body.role) payload.role = body.role;

        try {
            const raw = await backendFetch<unknown>("/admin/agency-staff", {
                method: "POST",
                body: JSON.stringify(payload),
            });
            return NextResponse.json({ success: true, data: raw });
        } catch (backendError) {
            const status =
                backendError instanceof Error && "status" in backendError
                    ? (backendError as { status: number }).status
                    : 500;
            const message =
                backendError instanceof Error
                    ? backendError.message
                    : String(backendError);
            console.error(`[API /agents/staff] POST backend error ${status}:`, message);
            return NextResponse.json(
                { success: false, error: message },
                { status },
            );
        }
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Internal server error";
        console.error("[API /agents/staff] POST error:", message);
        return NextResponse.json(
            { success: false, error: message },
            { status: 500 },
        );
    }
}

export async function PUT(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");
        const agencyId = searchParams.get("agencyId");

        if (!id) {
            return NextResponse.json(
                { success: false, error: "id query parameter is required" },
                { status: 400 },
            );
        }
        if (!agencyId) {
            return NextResponse.json(
                { success: false, error: "agencyId query parameter is required" },
                { status: 400 },
            );
        }

        const body = await request.json();

        const payload: Record<string, unknown> = {};
        if (body.id) payload.id = body.id;
        if (body.email) payload.email = body.email;
        if (body.mobile) payload.mobile = body.mobile;
        if (body.role) payload.role = body.role;
        if (typeof body.isActive === "boolean") payload.isActive = body.isActive;
        if (body.password) payload.password = body.password;
        if (body.contact) {
            payload.contact = {
                firstName: body.contact.firstName ?? "",
                lastName: body.contact.lastName ?? "",
            };
        }

        try {
            const raw = await backendFetch<unknown>(
                `/admin/agency-staff?id=${id}&agencyId=${agencyId}`,
                {
                    method: "PUT",
                    body: JSON.stringify(payload),
                },
            );
            return NextResponse.json({ success: true, data: raw });
        } catch (backendError) {
            const status =
                backendError instanceof Error && "status" in backendError
                    ? (backendError as { status: number }).status
                    : 500;
            const message =
                backendError instanceof Error
                    ? backendError.message
                    : String(backendError);
            console.error(`[API /agents/staff] Backend error ${status}:`, message);
            return NextResponse.json(
                { success: false, error: message },
                { status },
            );
        }
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Internal server error";
        console.error("[API /agents/staff] PUT error:", message);
        return NextResponse.json(
            { success: false, error: message },
            { status: 500 },
        );
    }
}
