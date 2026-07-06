import { NextResponse } from "next/server";
import { backendFetch, handleBffError } from "@/lib/api";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const raw = await backendFetch<unknown>(`/admin/agencies/${id}/detail`);
    console.log(raw);
    return NextResponse.json(raw);
  } catch (error) {
        return handleBffError(error, "agencies/[id]/detail");
    }
}
