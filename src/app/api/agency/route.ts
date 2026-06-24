import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/api";

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const required = ["name", "email", "phone", "agencyAddress", "state", "postcode", "crmSelection"];
        for (const field of required) {
            if (!body[field]?.toString().trim()) {
                return NextResponse.json(
                    { success: false, error: `${field} is required` },
                    { status: 400 },
                );
            }
        }

        const validStates = ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "ACT", "NT"];
        if (!validStates.includes(body.state)) {
            return NextResponse.json(
                { success: false, error: `state must be one of: ${validStates.join(", ")}` },
                { status: 400 },
            );
        }

        if (!/^\d{4}$/.test(body.postcode)) {
            return NextResponse.json(
                { success: false, error: "postcode must be exactly 4 digits" },
                { status: 400 },
            );
        }

        const validCrm = ["Homeby Direct Listing", "Agentbox", "ValueRE", "Eagle Software", "Box+Dice", "Other"];
        if (!validCrm.includes(body.crmSelection)) {
            return NextResponse.json(
                { success: false, error: `crmSelection must be one of: ${validCrm.join(", ")}` },
                { status: 400 },
            );
        }

        if (body.crmSelection === "Other" && !body.crmName?.trim()) {
            return NextResponse.json(
                { success: false, error: "crmName is required when crmSelection is Other" },
                { status: 400 },
            );
        }

        const additionalData: Record<string, string> = {
            agencyAddress: body.agencyAddress.trim(),
            state: body.state,
            postcode: body.postcode.trim(),
            crmSelection: body.crmSelection,
        };

        if (body.crmSelection === "Other" && body.crmName?.trim()) {
            additionalData.crmName = body.crmName.trim();
        }

        const payload: Record<string, unknown> = {
            name: body.name.trim(),
            email: body.email.trim(),
            phone: body.phone.trim(),
            agencyAddress: body.agencyAddress.trim(),
            state: body.state,
            postcode: body.postcode.trim(),
            crmSelection: body.crmSelection,
            additionalData,
        };

        if (body.crmSelection === "Other" && body.crmName?.trim()) {
            payload.crmName = body.crmName.trim();
        }
        if (body.status) payload.status = body.status;
        if (body.path?.trim()) payload.path = body.path.trim();
        if (body.website?.trim()) payload.website = body.website.trim();
        if (body.licenceNumber?.trim()) payload.licenceNumber = body.licenceNumber.trim();
        if (body.principalRla?.trim()) payload.principalRla = body.principalRla.trim();
        if (body.rentalRla?.trim()) payload.rentalRla = body.rentalRla.trim();
        if (body.description?.trim()) payload.description = body.description.trim();

        console.log("[API /agency] POST payload:", JSON.stringify(payload, null, 2));

        try {
            const raw = await backendFetch<unknown>("/admin/agency", {
                method: "POST",
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
                // not JSON, use as-is
            }

            console.error(`[API /agency] Backend error ${status}:`, detail);
            console.error(`[API /agency] Full backend response:`, rawMsg);

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
        console.error("[API /agency] POST error:", message);
        return NextResponse.json(
            { success: false, error: message },
            { status: 500 },
        );
    }
}
