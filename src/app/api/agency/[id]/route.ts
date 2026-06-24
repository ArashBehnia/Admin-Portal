import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/api";

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const { id } = await params;
        const body = await request.json();

        const payload: Record<string, unknown> = {};

        if (body.name?.trim()) payload.name = body.name.trim();
        if (body.email?.trim()) payload.email = body.email.trim();
        if (body.phone?.trim()) payload.phone = body.phone.trim();
        if (body.agencyAddress?.trim()) payload.agencyAddress = body.agencyAddress.trim();
        if (body.state) payload.state = body.state;
        if (body.postcode?.trim()) payload.postcode = body.postcode.trim();
        if (body.crmSelection) payload.crmSelection = body.crmSelection;
        if (body.crmName?.trim()) payload.crmName = body.crmName.trim();
        if (body.status) payload.status = body.status;
        if (body.path?.trim()) payload.path = body.path.trim();
        if (body.website?.trim()) payload.website = body.website.trim();
        if (body.licenceNumber?.trim()) payload.licenceNumber = body.licenceNumber.trim();
        if (body.principalRla?.trim()) payload.principalRla = body.principalRla.trim();
        if (body.rentalRla?.trim()) payload.rentalRla = body.rentalRla.trim();
        if (body.description?.trim()) payload.description = body.description.trim();

        if (body.agencyAddress || body.state || body.postcode || body.crmSelection) {
            payload.additionalData = {
                agencyAddress: body.agencyAddress?.trim() ?? "",
                state: body.state ?? "",
                postcode: body.postcode?.trim() ?? "",
                crmSelection: body.crmSelection ?? "",
            };
            if (body.crmSelection === "Other" && body.crmName?.trim()) {
                (payload.additionalData as Record<string, string>).crmName = body.crmName.trim();
            }
        }

        if (Object.keys(payload).length === 0) {
            return NextResponse.json(
                { success: false, error: "No fields to update" },
                { status: 400 },
            );
        }

        console.log("[API /agency/[id]] PUT payload:", JSON.stringify(payload, null, 2));

        try {
            const raw = await backendFetch<unknown>(`/admin/agency?id=${id}`, {
                method: "PUT",
                body: JSON.stringify(payload),
            });
            return NextResponse.json({ success: true, data: raw });
        } catch (backendError) {
            const status =
                backendError instanceof Error && "status" in backendError
                    ? (backendError as { status: number }).status
                    : 500;
            const rawMsg =
                backendError instanceof Error
                    ? backendError.message
                    : String(backendError);

            let detail = rawMsg;
            try {
                const parsed = JSON.parse(rawMsg);
                detail = parsed.message || parsed.error || rawMsg;
            } catch {
                // not JSON
            }

            console.error(`[API /agency/[id]] Backend error ${status}:`, detail);

            const userFriendly =
                status === 400
                    ? "Invalid request. Please check all fields and try again."
                    : status === 401 || status === 403
                      ? "You do not have permission to perform this action."
                      : detail;

            return NextResponse.json(
                { success: false, error: userFriendly, detail },
                { status },
            );
        }
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Internal server error";
        console.error("[API /agency/[id]] PUT error:", message);
        return NextResponse.json(
            { success: false, error: message },
            { status: 500 },
        );
    }
}
