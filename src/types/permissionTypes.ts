export type PermissionRow = {
    key: string;
    label: string;
    admin: boolean;
    agency: boolean;
    agent: boolean;
    user: boolean;
};

export const PERMISSION_MATRIX: PermissionRow[] = [
    { key: "admin_portal_access", label: "Admin Portal Access", admin: true, agency: false, agent: false, user: false },
    { key: "agencies_manage", label: "Agencies Manage", admin: true, agency: false, agent: false, user: false },
    { key: "agents_manage", label: "Agents Manage", admin: true, agency: false, agent: false, user: false },
    { key: "applications_review", label: "Applications Review", admin: true, agency: false, agent: false, user: false },
    { key: "reviews_moderate", label: "Reviews Moderate", admin: true, agency: false, agent: false, user: false },
    { key: "settings_manage", label: "Settings Manage", admin: true, agency: false, agent: false, user: false },
    { key: "agency_portal_access", label: "Agency Portal Access", admin: false, agency: true, agent: true, user: false },
    { key: "own_agents_manage", label: "Own Agents Manage", admin: false, agency: true, agent: false, user: false },
    { key: "listings_manage", label: "Listings Manage", admin: false, agency: true, agent: true, user: false },
    { key: "own_agency_read", label: "Own Agency Read", admin: false, agency: true, agent: true, user: false },
    { key: "contacts_manage", label: "Contacts Manage", admin: false, agency: true, agent: false, user: false },
    { key: "own_profile_read", label: "Own Profile Read", admin: false, agency: false, agent: true, user: false },
    { key: "web_portal_access", label: "Web Portal Access", admin: false, agency: false, agent: false, user: true },
    { key: "saved_properties_manage", label: "Saved Properties Manage", admin: false, agency: false, agent: false, user: true },
    { key: "property_search", label: "Property Search", admin: false, agency: false, agent: false, user: true },
    { key: "enquiries_create", label: "Enquiries Create", admin: false, agency: false, agent: false, user: true },
];

export const PERMISSION_ROLES = ["admin", "agency", "agent", "user"] as const;
export type PermissionRole = (typeof PERMISSION_ROLES)[number];

export function buildPermissionCategories(matrix: PermissionRow[], roleSlugs: string[]) {
    const roles = roleSlugs.length > 0 ? roleSlugs : [...PERMISSION_ROLES];

    return matrix.map((row) => ({
        id: row.key,
        name: row.label,
        roles: Object.fromEntries(
            roles.map((slug) => {
                const lower = slug.toLowerCase();
                const val = row[lower as PermissionRole];
                return [slug, val === true ? "✓" : "✗"];
            }),
        ),
    }));
}
