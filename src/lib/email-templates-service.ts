/* eslint-disable @typescript-eslint/no-unused-vars */
import { backendFetch } from "@/lib/api";
import type { Template, TemplateChannel } from "@/actions/emailTemplatesActions";

function toStr(v: unknown, fallback = ""): string {
    if (v == null) return fallback;
    return String(v);
}

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

function toObject(value: unknown): Record<string, unknown> {
    if (value && typeof value === "object" && !Array.isArray(value)) {
        const obj = value as Record<string, unknown>;
        if (obj.data && typeof obj.data === "object" && !Array.isArray(obj.data)) {
            return obj.data as Record<string, unknown>;
        }
        return obj;
    }
    return {};
}

function normalizeTemplate(raw: Record<string, unknown>): Template {
    const channelsRaw = raw.channels ?? raw.channel ?? raw.types;
    let channels: Template["channels"] = ["Email"];
    if (Array.isArray(channelsRaw)) {
        channels = channelsRaw.map((c) => toStr(c)) as Template["channels"];
    } else if (typeof channelsRaw === "string" && channelsRaw) {
        channels = [channelsRaw as TemplateChannel];
    }

    return {
        id: toStr(raw.id ?? raw._id ?? raw.templateId ?? ""),
        name: toStr(raw.name ?? raw.slug ?? raw.templateName ?? ""),
        category: toStr(raw.category ?? raw.type ?? "System") as Template["category"],
        channels,
        lastModified: toStr(raw.lastModified ?? raw.last_modified ?? raw.updatedAt ?? raw.updated_at ?? ""),
        modifiedBy: toStr(raw.modifiedBy ?? raw.modified_by ?? raw.updatedBy ?? ""),
        status: toStr(raw.status ?? "Active") as Template["status"],
        fromName: toStr(raw.fromName ?? raw.from_name ?? raw.senderName ?? raw.sender_name ?? "HomeBy Team"),
        fromEmail: toStr(raw.fromEmail ?? raw.from_email ?? raw.senderEmail ?? raw.sender_email ?? "info@homeby.com.au"),
        subject: toStr(raw.subject ?? raw.title ?? ""),
        body: toStr(raw.body ?? raw.content ?? raw.html ?? raw.text ?? ""),
        country: toStr(raw.country ?? "Australia"),
        countryName: toStr(raw.countryName ?? raw.country_name ?? ""),
        language: toStr(raw.language ?? "English"),
        smsProvider: toStr(raw.smsProvider ?? raw.sms_provider ?? "Twilio") as "Twilio" | "GAMA",
    };
}

function serializeTemplate(data: Record<string, unknown>): Record<string, unknown> {
    const out: Record<string, unknown> = {};
    if (data.id != null) out.id = data.id;
    if (data.name != null) out.name = data.name;
    if (data.category != null) out.category = data.category;
    if (data.channels != null) out.channels = data.channels;
    if (data.status != null) out.status = data.status;
    if (data.fromName != null) out.from_name = data.fromName;
    if (data.fromEmail != null) out.from_email = data.fromEmail;
    if (data.subject != null) out.subject = data.subject;
    if (data.body != null) out.body = data.body;
    if (data.country != null) out.country = data.country;
    if (data.language != null) out.language = data.language;
    if (data.smsProvider != null) out.sms_provider = data.smsProvider;
    return out;
}

function logApiData(method: string, endpoint: string, payload?: unknown, response?: unknown) {
    // console.log("API Data:", {
    //     method,
    //     endpoint,
    //     ...(payload !== undefined && { payload }),
    //     ...(response !== undefined && { response }),
    // });
}

// ─── GET: Summary cards ────────────────────────────────────────
export async function fetchEmailTemplatesSummary() {
    const endpoint = "/admin/email-templates/summary";
    logApiData("GET", endpoint);
    const raw = await backendFetch(endpoint);
    // console.log("summery ",raw)
    // console.log("[email-templates-service] fetchEmailTemplatesSummary:", JSON.stringify(raw, null, 2));
    return raw;
}

// ─── GET: Paginated template list ──────────────────────────────
export async function fetchEmailTemplatesPage(
    params: { limit?: number; offset?: number; filter?: string } = {},
): Promise<{ data: Template[]; total: number }> {
    const qs = new URLSearchParams();
    if (params.limit) qs.set("limit", String(params.limit));
    if (params.offset) qs.set("offset", String(params.offset));
    if (params.filter) qs.set("filter", params.filter);
    const query = qs.toString();
    const endpoint = `/admin/template/page${query ? `?${query}` : ""}`;
    logApiData("GET", endpoint);
    const raw = await backendFetch(endpoint);
    // console.log("[email-templates-service] fetchEmailTemplatesPage raw:", JSON.stringify(raw, null, 2));

    const arr = toArray<Record<string, unknown>>(raw);
    // console.log("[email-templates-service] fetchEmailTemplatesPage array length:", arr.length);
    const normalized = arr.map(normalizeTemplate);
    // console.log("[email-templates-service] fetchEmailTemplatesPage normalized:", JSON.stringify(normalized));

    // Try to extract total from response — backend may return { data: [...], total } or just [...]
    let total = arr.length;
    if (raw && typeof raw === "object" && !Array.isArray(raw)) {
        const obj = raw as Record<string, unknown>;
        if (typeof obj.total === "number") total = obj.total;
    }

    return { data: normalized, total };
}

// ─── GET: Single template by name (uses page query) ────────────
export async function fetchEmailTemplateByName(name: string): Promise<Template | null> {
    try {
        const endpoint = `/admin/template/page?keywords=${encodeURIComponent(name)}`;
        logApiData("GET", endpoint);
        const raw = await backendFetch(endpoint);
        const arr = toArray<Record<string, unknown>>(raw);
        const templates = arr.map(normalizeTemplate);
        return templates.find((t) => t.name === name) ?? null;
    } catch {
        return null;
    }
}

// ─── GET: Single template by ID ────────────────────────────────
export async function fetchEmailTemplateById(id: string): Promise<Template | null> {
    try {
        const endpoint = `/admin/template/${encodeURIComponent(id)}`;
        logApiData("GET", endpoint);
        const raw = await backendFetch(endpoint);
        const obj = toObject(raw);
        return Object.keys(obj).length > 0 ? normalizeTemplate(obj) : null;
    } catch {
        return null;
    }
}

// ─── POST: Create template ─────────────────────────────────────
export async function createTemplate(template: Partial<Template>): Promise<Template> {
    const endpoint = "/admin/template";
    const serialized = serializeTemplate(template as Record<string, unknown>);
    logApiData("POST", endpoint, serialized);
    const raw = await backendFetch<Record<string, unknown>>(endpoint, {
        method: "POST",
        body: JSON.stringify(serialized),
    });
    // console.log("[email-templates-service] createTemplate raw:", JSON.stringify(raw, null, 2));
    const result = normalizeTemplate(toObject(raw));
    // console.log("[email-templates-service] createTemplate normalized:", JSON.stringify(result, null, 2));
    return result;
}

// ─── PUT: Update template ─────────────────────────────────────
export async function updateTemplate(id: string, data: Record<string, unknown>): Promise<Template> {
    const endpoint = `/admin/template/${encodeURIComponent(id)}`;
    logApiData("PUT", endpoint, data);
    const raw = await backendFetch<Record<string, unknown>>(endpoint, {
        method: "PUT",
        body: JSON.stringify(data),
    });
    const result = normalizeTemplate(toObject(raw));
    return result;
}

// ─── DELETE: Remove template ────────────────────────────────────
export async function deleteTemplate(id: string): Promise<void> {
    const endpoint = `/admin/template?id=${encodeURIComponent(id)}`;
    logApiData("DELETE", endpoint);
    await backendFetch(endpoint, { method: "DELETE" });
}
