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
    };
}

function logApiData(method: string, endpoint: string, payload?: unknown, response?: unknown) {
    console.log("API Data:", {
        method,
        endpoint,
        ...(payload !== undefined && { payload }),
        ...(response !== undefined && { response }),
    });
}

export async function fetchEmailTemplatesPage(): Promise<Template[]> {
    const endpoint = "/admin/template/page";
    logApiData("GET", endpoint);
    const raw = await backendFetch(endpoint);
    console.log("[email-templates-service] fetchEmailTemplatesPage raw response:", JSON.stringify(raw, null, 2));
    const arr = toArray<Record<string, unknown>>(raw);
    console.log("[email-templates-service] fetchEmailTemplatesPage extracted array length:", arr.length);
    if (arr.length > 0) {
        console.log("[email-templates-service] fetchEmailTemplatesPage first raw item:", JSON.stringify(arr[0], null, 2));
    }
    const normalized = arr.map(normalizeTemplate);
    console.log("[email-templates-service] fetchEmailTemplatesPage normalized:", JSON.stringify(normalized, null, 2));
    return normalized;
}

export async function fetchEmailTemplateByName(name: string): Promise<Template | null> {
    const endpoint = `/admin/template/query?name=${encodeURIComponent(name)}`;
    logApiData("GET", endpoint);
    const raw = await backendFetch(endpoint);
    console.log("[email-templates-service] fetchEmailTemplateByName raw response:", JSON.stringify(raw, null, 2));
    const arr = toArray<Record<string, unknown>>(raw);
    const templates = arr.map(normalizeTemplate);
    const found = templates.find((t) => t.name === name) ?? null;
    console.log("[email-templates-service] fetchEmailTemplateByName result:", found ? JSON.stringify(found, null, 2) : "null");
    return found;
}

export async function fetchEmailTemplateById(id: string): Promise<Template | null> {
    const endpoint = `/admin/template/${encodeURIComponent(id)}`;
    logApiData("GET", endpoint);
    const raw = await backendFetch(endpoint);
    console.log("[email-templates-service] fetchEmailTemplateById raw response:", JSON.stringify(raw, null, 2));
    const obj = toObject(raw);
    const result = Object.keys(obj).length > 0 ? normalizeTemplate(obj) : null;
    console.log("[email-templates-service] fetchEmailTemplateById result:", result ? JSON.stringify(result, null, 2) : "null");
    return result;
}

export async function createTemplate(template: Partial<Template>): Promise<Template> {
    const endpoint = "/admin/template";
    logApiData("POST", endpoint, template);
    const raw = await backendFetch<Record<string, unknown>>(endpoint, {
        method: "POST",
        body: JSON.stringify(template),
    });
    console.log("[email-templates-service] createTemplate raw response:", JSON.stringify(raw, null, 2));
    const result = normalizeTemplate(toObject(raw));
    console.log("[email-templates-service] createTemplate normalized:", JSON.stringify(result, null, 2));
    return result;
}

export async function updateTemplate(id: string, data: Partial<Template>): Promise<Template> {
    const endpoint = `/admin/template/${encodeURIComponent(id)}`;
    logApiData("PATCH", endpoint, data);
    const raw = await backendFetch<Record<string, unknown>>(endpoint, {
        method: "PUT",
        body: JSON.stringify(data),
    });
    console.log("[email-templates-service] updateTemplate raw response:", JSON.stringify(raw, null, 2));
    const result = normalizeTemplate(toObject(raw));
    console.log("[email-templates-service] updateTemplate normalized:", JSON.stringify(result, null, 2));
    return result;
}

export async function deleteTemplate(id: string): Promise<void> {
    const endpoint = `/admin/template/${encodeURIComponent(id)}`;
    logApiData("DELETE", endpoint);
    await backendFetch(endpoint, { method: "DELETE" });
    console.log("[email-templates-service] deleteTemplate completed for id:", id);
}
