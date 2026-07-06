import { handleBffError } from "@/lib/api";
import { NextResponse } from "next/server";
import { fetchEmailTemplatesPage } from "@/lib/email-templates-service";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const limit = searchParams.get("limit") ?? undefined;
        const offset = searchParams.get("offset") ?? undefined;
        const filter = searchParams.get("filter") ?? undefined;

        const result = await fetchEmailTemplatesPage({
            ...(limit && { limit: Number(limit) }),
            ...(offset && { offset: Number(offset) }),
            ...(filter && { filter }),
        });

        return NextResponse.json(result);
    } catch (error) {
        return handleBffError(error, "email-templates/page");
    }
}
