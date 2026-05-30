import axios from "axios";

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
        superadmin: string;
        admin: string;
        support: string;
    }[];
}

export const fetchStaffData = async (): Promise<StaffMember[]> => {
    try {
        const res = await axios.get(
            `${process.env.NEXT_PUBLIC_BASE_URL}/data/staff.json`,
        );
        return res.data;
    } catch {
        return [];
    }
};

export const fetchRolesList = async (): Promise<RoleItem[]> => {
    try {
        const res = await axios.get(
            `${process.env.NEXT_PUBLIC_BASE_URL}/data/roles.json`,
        );
        return res.data;
    } catch {
        return [];
    }
};

export const fetchRolePermissions = async (): Promise<PermissionCategory[]> => {
    try {
        const res = await axios.get(
            `${process.env.NEXT_PUBLIC_BASE_URL}/data/role_permissions.json`,
        );
        return res.data;
    } catch {
        return [];
    }
};
