import { NextResponse } from "next/server";
import { backendFetch, handleBffError } from "@/lib/api";

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json(
                { success: false, error: "Agency id is required" },
                { status: 400 },
            );
        }

        try {
            await backendFetch(`/admin/agency?id=${id}`, {
                method: "DELETE",
            });
            return NextResponse.json({ success: true });
        } catch (backendError) {
        return handleBffError(backendError, "agency");
    }
    } catch (error) {
        return handleBffError(error, "agency");
    }
}

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

        if (body.crmName?.trim()) {
            additionalData.crmName = body.crmName.trim();
        }

        const path = body.name
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-");

        const payload: Record<string, unknown> = {
            name: body.name.trim(),
            email: body.email.trim(),
            phone: body.phone.trim(),
            agencyAddress: body.agencyAddress.trim(),
            state: body.state,
            postcode: body.postcode.trim(),
            crmSelection: body.crmSelection,
            status: "active",
            path,
            additionalData,
        };

        if (body.crmName?.trim()) payload.crmName = body.crmName.trim();
        if (body.website?.trim()) payload.website = body.website.trim();
        if (body.licenceNumber?.trim()) payload.licenceNumber = body.licenceNumber.trim();
        if (body.principalRla?.trim()) payload.principalRla = body.principalRla.trim();
        if (body.rentalRla?.trim()) payload.rentalRla = body.rentalRla.trim();
        if (body.description?.trim()) payload.description = body.description.trim();

        try {
            const raw = await backendFetch<unknown>("/admin/agency", {
                method: "POST",
                body: JSON.stringify(payload),
            });
            return NextResponse.json({ success: true, data: raw });
        } catch (backendError) {
        return handleBffError(backendError, "agency");
    }
    } catch (error) {
        return handleBffError(error, "agency");
    }
}
