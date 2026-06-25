import {
    fetchStaffPage,
    fetchStaffSummary,
    fetchRoles,
    fetchPermissions,
    fetchStaffLoginActivity,
} from "@/lib/staff-service";

export interface StaffMember {
    id: string;
    name: string;
    email: string;
    role: string;
    status: "Active" | "Inactive";
    mfa: "Enabled" | "Not set up";
    lastLogin: string;
    added: string;
    mobile?: string;
    activity?: string[];
}

export interface StaffSummary {
    total: number;
    active: number;
    mfaEnabled: number;
    mfaNotSetUp: number;
}

export interface RoleItem {
    id: string;
    name: string;
    slug: string;
    description: string;
    features: string[];
    pillClass: string;
}

export interface PermissionCategory {
    category: string;
    permissions: {
        id: string;
        name: string;
        roles: Record<string, string>;
    }[];
}

function mapStaffFromDto(dto: Record<string, unknown>): StaffMember {
    const firstName = String(dto.firstName ?? "");
    const lastName = String(dto.lastName ?? "");
    const fullName = [firstName, lastName].filter(Boolean).join(" ") || String(dto.name ?? dto.email ?? "Unknown");

    const statusRaw = String(dto.status ?? "active").toLowerCase();
    const status: "Active" | "Inactive" =
        statusRaw === "active" || statusRaw === "enabled" ? "Active" : "Inactive";

    const mfaRaw = String(dto.mfa ?? dto.mfaEnabled ?? "false").toLowerCase();
    const mfa: "Enabled" | "Not set up" =
        mfaRaw === "true" || mfaRaw === "enabled" ? "Enabled" : "Not set up";

    let lastLogin = "Never logged in";
    if (dto.lastLoggedIn) {
        lastLogin = formatRelativeTime(String(dto.lastLoggedIn));
    } else if (dto.lastLogin) {
        lastLogin = formatRelativeTime(String(dto.lastLogin));
    }

    let added = "N/A";
    if (dto.createdAt) {
        added = new Date(String(dto.createdAt)).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    } else if (dto.added) {
        added = String(dto.added);
    }

    return {
        id: String(dto.id ?? ""),
        name: fullName,
        email: String(dto.email ?? ""),
        role: String(dto.role ?? "Admin"),
        status,
        mfa,
        lastLogin,
        added,
        mobile: dto.mobile ? String(dto.mobile) : undefined,
    };
}

function formatRelativeTime(iso?: string): string {
    if (!iso) return "Never";
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins} min ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days === 1) return "Yesterday";
    if (days < 30) return `${days} days ago`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months} month${months > 1 ? "s" : ""} ago`;
    const years = Math.floor(months / 12);
    return `${years} year${years > 1 ? "s" : ""} ago`;
}

function mapRoleFromDto(dto: Record<string, unknown>): RoleItem {
    const name = String(dto.label ?? dto.name ?? dto.key ?? "Unknown");
    const slug = String(dto.key ?? dto.slug ?? name.toLowerCase().replace(/\s+/g, "-"));

    const capabilities = Array.isArray(dto.capabilities)
        ? (dto.capabilities as string[])
        : [];

    const pillClasses: Record<string, string> = {
        superadmin: "bg-purple-50 text-purple-700 border-purple-200",
        admin: "bg-blue-50 text-blue-700 border-blue-200",
        agency: "bg-teal-50 text-teal-700 border-teal-200",
        agent: "bg-amber-50 text-amber-700 border-amber-200",
        user: "bg-slate-100 text-slate-700 border-slate-200",
        support: "bg-teal-50 text-teal-700 border-teal-200",
        reviewer: "bg-amber-50 text-amber-700 border-amber-200",
        "content editor": "bg-indigo-50 text-indigo-700 border-indigo-200",
    };

    return {
        id: String(dto.id ?? slug),
        name,
        slug,
        description: String(dto.description ?? `Access level: ${name}`),
        features: capabilities.length > 0 ? capabilities.map(formatCapabilityName) : [`Full access to ${name} features`],
        pillClass: pillClasses[slug] ?? "bg-slate-100 text-slate-700 border-slate-200",
    };
}

function formatCapabilityName(capability: string): string {
    return capability
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

const KNOWN_ROLE_KEYS = ["superadmin", "admin", "agency", "agent", "support", "user", "reviewer", "content_editor", "content editor"];

function extractRolesFromPermission(perm: Record<string, unknown>, roleSlugs: string[]): Record<string, string> {
    const roles: Record<string, string> = {};
    for (const slug of roleSlugs) {
        const camelKey = slug.replace(/[\s_-]+/g, "");
        const pascalKey = camelKey.charAt(0).toUpperCase() + camelKey.slice(1);
        const val = perm[slug] ?? perm[camelKey] ?? perm[pascalKey];
        roles[slug] = val !== undefined && val !== null ? String(val) : "—";
    }
    if (roleSlugs.length === 0) {
        for (const key of KNOWN_ROLE_KEYS) {
            const camelKey = key.replace(/[\s_]+/g, "");
            const pascalKey = camelKey.charAt(0).toUpperCase() + camelKey.slice(1);
            roles[key] = String(perm[key] ?? perm[camelKey] ?? perm[pascalKey] ?? "—");
        }
    }
    return roles;
}

function mapPermissionsFromDto(raw: unknown, roleSlugs: string[] = []): PermissionCategory[] {
    if (!Array.isArray(raw)) {
        if (raw && typeof raw === "object") {
            const obj = raw as Record<string, unknown>;
            if (Array.isArray(obj.data)) return mapPermissionsFromDto(obj.data, roleSlugs);
            if (Array.isArray(obj.permissionMatrixAvailable)) {
                return mapPermissionsFromDto(obj.permissionMatrixAvailable, roleSlugs);
            }
            if (Array.isArray(obj.roles)) {
                const matrix = obj.permissionMatrixAvailable as Record<string, unknown>[] | undefined;
                if (matrix) {
                    return mapPermissionsFromDto(matrix, roleSlugs);
                }
            }
        }
        return [];
    }

    return (raw as Record<string, unknown>[]).map((cat) => ({
        category: String(cat.category ?? cat.categoryName ?? cat.name ?? "Unknown"),
        permissions: Array.isArray(cat.permissions ?? cat.capabilities ?? cat.items)
            ? ((cat.permissions ?? cat.capabilities ?? cat.items) as Record<string, unknown>[]).map((p) => ({
                id: String(p.id ?? ""),
                name: String(p.name ?? p.label ?? p.permission ?? p.capability ?? "Unknown"),
                roles: extractRolesFromPermission(p, roleSlugs),
            }))
            : [],
    }));
}

export const fetchStaffData = async (): Promise<StaffMember[]> => {
    try {
        const { data } = await fetchStaffPage(0, 100);
        return data.map(mapStaffFromDto);
    } catch {
        return [];
    }
};

export const fetchStaffSummaryData = async (): Promise<StaffSummary> => {
    try {
        return await fetchStaffSummary();
    } catch {
        return { total: 0, active: 0, mfaEnabled: 0, mfaNotSetUp: 0 };
    }
};

export const fetchRolesList = async (): Promise<RoleItem[]> => {
    try {
        const data = await fetchRoles();
        return data.map(mapRoleFromDto);
    } catch {
        return [];
    }
};

export const fetchRolePermissions = async (): Promise<PermissionCategory[]> => {
    try {
        const data = await fetchPermissions();
        return mapPermissionsFromDto(data);
    } catch {
        return [];
    }
};

export const fetchStaffLoginActivityData = async (
    id: string,
): Promise<Record<string, unknown>[]> => {
    try {
        return await fetchStaffLoginActivity(id);
    } catch {
        return [];
    }
};
