import { fetchStaffData, fetchRolesList, fetchStaffSummaryData } from '@/actions/staffAndRolesActions';
import StaffPageClient from '@/components/StaffAndRoles/StaffPageClient';

const StaffPage = async () => {
    const [initialStaff, initialRoles, initialSummary] = await Promise.all([
        fetchStaffData(),
        fetchRolesList(),
        fetchStaffSummaryData(),
    ]);

    return (
        <StaffPageClient
            initialStaff={initialStaff}
            initialRoles={initialRoles}
            initialSummary={initialSummary}
        />
    );
};

export default StaffPage;
