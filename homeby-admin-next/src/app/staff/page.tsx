import { fetchStaffData, fetchRolesList, fetchRolePermissions } from '@/actions/staffAndRolesActions';
import StaffPageClient from '@/components/StaffAndRoles/StaffPageClient';

const StaffPage = async () => {
    const [initialStaff, initialRoles, initialPermissions] = await Promise.all([
        fetchStaffData(),
        fetchRolesList(),
        fetchRolePermissions(),
    ]);

    return (
        <StaffPageClient
            initialStaff={initialStaff}
            initialRoles={initialRoles}
            initialPermissions={initialPermissions}
        />
    );
};

export default StaffPage;