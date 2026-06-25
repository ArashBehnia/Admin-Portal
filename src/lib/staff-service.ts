import { backendFetch } from "@/lib/api";

function toArray<T>(value: unknown): T[] {
    if (Array.isArray(value)) return value;
    if (value && typeof value === "object") {
        const obj = value as Record<string, unknown>;
        if (Array.isArray(obj.data)) return obj.data as T[];
        if (Array.isArray(obj.items)) return obj.items as T[];
        if (Array.isArray(obj.results)) return obj.results as T[];
        for (const v of Object.values(obj)) {
            if (Array.isArray(v)) return v as T[];
        }
    }
    return [];
}

function toNumber(value: unknown, fallback = 0): number {
    if (typeof value === "number") return value;
    if (typeof value === "string")
        return Number(value.replace(/[^0-9.\-]/g, "")) || fallback;
    return fallback;
}

function findTotal(obj: unknown): number {
    if (obj && typeof obj === "object" && !Array.isArray(obj)) {
        const o = obj as Record<string, unknown>;
        if (typeof o.total === "number") return o.total;
        if (typeof o.totalCount === "number") return o.totalCount;
        if (typeof o.count === "number") return o.count;
        if (o.meta && typeof o.meta === "object") {
            const m = o.meta as Record<string, unknown>;
            if (typeof m.total === "number") return m.total;
        }
    }
    return 0;
}

// ─── Staff Members ───────────────────────────────────────────────────

export async function fetchStaffPage(
    offset = 0,
    limit = 20,
    keywords?: string,
    role?: string,
): Promise<{ data: Record<string, unknown>[]; total: number }> {
    const params = new URLSearchParams({
        offset: String(offset),
        limit: String(limit),
    });
    if (keywords) params.set("keywords", keywords);
    if (role && role !== "All") params.set("role", role);
    params.set("type", "staff");

    const raw = await backendFetch<unknown>(
        `/admin/user/page?${params.toString()}`,
    );

    const items = toArray<Record<string, unknown>>(raw);
    const total = findTotal(raw) || items.length;

    return { data: items, total };
}

export async function fetchStaffSummary(): Promise<{
    total: number;
    active: number;
    mfaEnabled: number;
    mfaNotSetUp: number;
}> {
    const raw = await backendFetch<unknown>("/admin/staff/summary");
    const obj =
        raw && typeof raw === "object" && !Array.isArray(raw)
            ? (raw as Record<string, unknown>)
            : {};
    return {
        total: toNumber(obj.total),
        active: toNumber(obj.active),
        mfaEnabled: toNumber(obj.mfaEnabled),
        mfaNotSetUp: toNumber(obj.mfaNotSetUp),
    };
}

export async function fetchStaffMember(
    id: string,
): Promise<Record<string, unknown>> {
    const raw = await backendFetch<unknown>(
        `/admin/user/${encodeURIComponent(id)}`,
    );
    return (
        raw && typeof raw === "object" && !Array.isArray(raw) ? raw : {}
    ) as Record<string, unknown>;
}

export async function fetchStaffAll(): Promise<Record<string, unknown>[]> {
    const raw = await backendFetch<unknown>("/admin/user/all");
    return toArray<Record<string, unknown>>(raw);
}

export async function createStaffMember(
    data: Record<string, unknown>,
): Promise<Record<string, unknown>> {
    const raw = await backendFetch<Record<string, unknown>>("/admin/user", {
        method: "POST",
        body: JSON.stringify(data),
    });
    return (
        raw && typeof raw === "object" && !Array.isArray(raw) ? raw : {}
    ) as Record<string, unknown>;
}

export async function updateStaffMember(
    id: string,
    data: Record<string, unknown>,
): Promise<Record<string, unknown>> {
    const raw = await backendFetch<Record<string, unknown>>(
        `/admin/user/${encodeURIComponent(id)}`,
        {
            method: "PUT",
            body: JSON.stringify(data),
        },
    );
    return (
        raw && typeof raw === "object" && !Array.isArray(raw) ? raw : {}
    ) as Record<string, unknown>;
}

export async function deleteStaffMember(id: string): Promise<void> {
    await backendFetch(`/admin/user/${encodeURIComponent(id)}`, {
        method: "DELETE",
    });
}

export async function changeStaffField(
    data: Record<string, unknown>,
): Promise<Record<string, unknown>> {
    const raw = await backendFetch<Record<string, unknown>>(
        "/admin/user/change",
        {
            method: "PUT",
            body: JSON.stringify(data),
        },
    );
    return (
        raw && typeof raw === "object" && !Array.isArray(raw) ? raw : {}
    ) as Record<string, unknown>;
}

export async function createOtpForStaff(
    data: Record<string, unknown>,
): Promise<Record<string, unknown>> {
    const raw = await backendFetch<Record<string, unknown>>(
        "/admin/user/admin-create-otp",
        {
            method: "POST",
            body: JSON.stringify(data),
        },
    );
    return (
        raw && typeof raw === "object" && !Array.isArray(raw) ? raw : {}
    ) as Record<string, unknown>;
}

// ─── Staff Activity ──────────────────────────────────────────────────

export async function fetchStaffLoginActivity(
    id: string,
): Promise<Record<string, unknown>[]> {
    const raw = await backendFetch<unknown>(
        `/admin/staff/${encodeURIComponent(id)}/login-activity`,
    );
    return toArray<Record<string, unknown>>(raw);
}

// ─── Roles ───────────────────────────────────────────────────────────

export async function fetchRoles(): Promise<Record<string, unknown>[]> {
    const raw = await backendFetch<unknown>("/admin/roles");
    return toArray<Record<string, unknown>>(raw);
}

// ─── Permissions ─────────────────────────────────────────────────────

export async function fetchPermissions(): Promise<Record<string, unknown> | Record<string, unknown>[]> {
    const raw = await backendFetch<unknown>("/admin/permissions");
    if (raw && typeof raw === "object" && !Array.isArray(raw)) {
        const obj = raw as Record<string, unknown>;
        if (Array.isArray(obj.permissionMatrixAvailable)) return obj;
        if (Array.isArray(obj.data)) return obj.data as Record<string, unknown>[];
    }
    return toArray<Record<string, unknown>>(raw);
}

// ─── Groups ──────────────────────────────────────────────────────────

export async function fetchGroupsPage(
    offset = 0,
    limit = 20,
    keywords?: string,
): Promise<{ data: Record<string, unknown>[]; total: number }> {
    const params = new URLSearchParams({
        offset: String(offset),
        limit: String(limit),
    });
    if (keywords) params.set("keywords", keywords);

    const raw = await backendFetch<unknown>(
        `/admin/groups/page?${params.toString()}`,
    );

    const items = toArray<Record<string, unknown>>(raw);
    const total = findTotal(raw) || items.length;

    return { data: items, total };
}

export async function fetchGroupsAll(): Promise<Record<string, unknown>[]> {
    const raw = await backendFetch<unknown>("/admin/groups/all");
    return toArray<Record<string, unknown>>(raw);
}

export async function createGroup(
    data: Record<string, unknown>,
): Promise<Record<string, unknown>> {
    const raw = await backendFetch<Record<string, unknown>>("/admin/groups", {
        method: "POST",
        body: JSON.stringify(data),
    });
    return (
        raw && typeof raw === "object" && !Array.isArray(raw) ? raw : {}
    ) as Record<string, unknown>;
}

export async function updateGroup(
    id: string,
    data: Record<string, unknown>,
): Promise<Record<string, unknown>> {
    const raw = await backendFetch<Record<string, unknown>>(
        `/admin/groups/${encodeURIComponent(id)}`,
        {
            method: "PUT",
            body: JSON.stringify(data),
        },
    );
    return (
        raw && typeof raw === "object" && !Array.isArray(raw) ? raw : {}
    ) as Record<string, unknown>;
}

export async function deleteGroup(id: string): Promise<void> {
    await backendFetch(`/admin/groups/${encodeURIComponent(id)}`, {
        method: "DELETE",
    });
}
