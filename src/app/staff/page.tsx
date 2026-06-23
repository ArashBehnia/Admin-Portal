import { fetchStaffData, fetchRolesList, fetchRolePermissions, fetchStaffSummaryData } from '@/actions/staffAndRolesActions';
import StaffPageClient from '@/components/StaffAndRoles/StaffPageClient';

const StaffPage = async () => {
    const [initialStaff, initialRoles, initialPermissions, initialSummary] = await Promise.all([
        fetchStaffData(),
        fetchRolesList(),
        fetchRolePermissions(),
        fetchStaffSummaryData(),
    ]);

    return (
        <StaffPageClient
            initialStaff={initialStaff}
            initialRoles={initialRoles}
            initialPermissions={initialPermissions}
            initialSummary={initialSummary}
        />
    );
};

export default StaffPage;
