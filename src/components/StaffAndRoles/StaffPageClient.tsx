'use client';

import Toast from '@/components/Shared/Toast';
import { StaffMember, StaffSummary, RoleItem, PermissionCategory } from '@/actions/staffAndRolesActions';
import useStaffAndRoles from '@/hooks/useStaffAndRoles';
import StaffStats from './StaffStats';
import StaffTabs from './StaffTabs';
import StaffTable from './StaffTable';
import RolesList from './RolesList';
import AddStaffModal from './AddStaffModal';
import EditStaffDrawer from './EditStaffDrawer';
import ConfirmModal from './ConfirmModal';
import PermissionsModal from './PermissionsModal';

interface StaffPageClientProps {
    initialStaff: StaffMember[];
    initialRoles: RoleItem[];
    initialPermissions: PermissionCategory[];
    initialSummary: StaffSummary;
}

const StaffPageClient = ({ initialStaff, initialRoles, initialPermissions, initialSummary }: StaffPageClientProps) => {
    const {
        filteredStaff, rolesList, localPermissions, stats,
        staffActivity, isActivityLoading,
        isLoading,
        currentPage, totalPages, totalItems, setPage,
        searchQuery, setSearchQuery,
        roleFilter, setRoleFilter,
        activeTab, setActiveTab,
        activeDrawerTab, setActiveDrawerTab,
        isAddModalOpen, setIsAddModalOpen,
        isEditModalOpen, setIsEditModalOpen,
        showMfaConfirm, setShowMfaConfirm,
        showRevokeConfirm, setShowRevokeConfirm,
        isPermsModalOpen, setIsPermsModalOpen,
        selectedStaff, selectedRoleForPerms,
        formFirstName, setFormFirstName,
        formLastName, setFormLastName,
        formMobile, setFormMobile,
        formEmail, setFormEmail,
        formRole, setFormRole,
        formStatus, setFormStatus,
        formMfa,
        formError, isSubmitting,
        sendWelcome, setSendWelcome,
        otpStep, setOtpStep,
        otpCode, setOtpCode,
        isOtpLoading, otpError,
        toast, setToast,
        handleAddStaff, handleVerifyOtpAndCreate, handleEditStaff,
        handleMfaReset, handleRevokeConfirm,
        openEditModal, handleOpenAddModal, handleOpenPermsModal,
    } = useStaffAndRoles({ initialStaff, initialRoles, initialPermissions, initialSummary });

    return (
        <div className="flex flex-col gap-6 w-full max-w-content mx-auto pb-16 px-1 lg:px-4">
            <div className="flex flex-col gap-1.5">
                <h1 className="text-[26px] font-bold text-text tracking-tight font-sans">Staff & Roles</h1>
                <p className="text-sm text-muted">Manage HomeBy internal staff accounts and access levels.</p>
            </div>

            <StaffStats stats={stats} isLoading={isLoading} />

            <StaffTabs activeTab={activeTab} onChange={setActiveTab} />

            {activeTab === 'Staff' && (
                <StaffTable
                    filteredStaff={filteredStaff}
                    isLoading={isLoading}
                    isError={false}
                    searchQuery={searchQuery}
                    roleFilter={roleFilter}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={totalItems}
                    rolesList={rolesList}
                    onSearchChange={setSearchQuery}
                    onRoleFilterChange={setRoleFilter}
                    onAddClick={handleOpenAddModal}
                    onEditClick={openEditModal}
                    onPageChange={setPage}
                />
            )}

            {activeTab === 'Roles' && (
                <RolesList
                    rolesList={rolesList}
                    localStaff={filteredStaff}
                    onViewPerms={handleOpenPermsModal}
                />
            )}

            <AddStaffModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                formFirstName={formFirstName}
                formLastName={formLastName}
                formEmail={formEmail}
                formMobile={formMobile}
                formRole={formRole}
                rolesList={rolesList}
                sendWelcome={sendWelcome}
                formError={formError}
                isSubmitting={isSubmitting}
                otpStep={otpStep}
                setOtpStep={setOtpStep}
                otpCode={otpCode}
                setOtpCode={setOtpCode}
                isOtpLoading={isOtpLoading}
                otpError={otpError}
                onFirstNameChange={setFormFirstName}
                onLastNameChange={setFormLastName}
                onEmailChange={setFormEmail}
                onMobileChange={setFormMobile}
                onRoleChange={setFormRole}
                onSendWelcomeChange={setSendWelcome}
                onSubmit={handleAddStaff}
                onVerifyOtp={handleVerifyOtpAndCreate}
            />

            <EditStaffDrawer
                isOpen={isEditModalOpen}
                selectedStaff={selectedStaff}
                activeDrawerTab={activeDrawerTab}
                onTabChange={setActiveDrawerTab}
                onClose={() => setIsEditModalOpen(false)}
                formFirstName={formFirstName}
                formLastName={formLastName}
                formEmail={formEmail}
                formMobile={formMobile}
                formRole={formRole}
                rolesList={rolesList}
                formStatus={formStatus}
                formMfa={formMfa}
                formError={formError}
                isSubmitting={isSubmitting}
                permissions={localPermissions}
                staffActivity={staffActivity}
                isActivityLoading={isActivityLoading}
                onFirstNameChange={setFormFirstName}
                onLastNameChange={setFormLastName}
                onMobileChange={setFormMobile}
                onRoleChange={setFormRole}
                onStatusChange={setFormStatus}
                onMfaReset={() => setShowMfaConfirm(true)}
                onRevokeSession={() => setShowRevokeConfirm(true)}
                onSubmit={handleEditStaff}
            />

            <ConfirmModal
                isOpen={showMfaConfirm}
                title={`Reset MFA for ${selectedStaff?.name}?`}
                description="They will need to re-enroll on next login."
                onCancel={() => setShowMfaConfirm(false)}
                onConfirm={handleMfaReset}
            />

            <ConfirmModal
                isOpen={showRevokeConfirm}
                title={`Sign out all sessions for ${selectedStaff?.name}?`}
                description="All devices will be signed out immediately."
                onCancel={() => setShowRevokeConfirm(false)}
                onConfirm={handleRevokeConfirm}
            />

            <PermissionsModal
                isOpen={isPermsModalOpen}
                selectedRole={selectedRoleForPerms}
                localPermissions={localPermissions}
                rolesList={rolesList}
                onClose={() => setIsPermsModalOpen(false)}
            />

            <Toast
                visible={toast.visible}
                title={toast.title}
                message={toast.message}
                type={toast.type}
                onClose={() => setToast(prev => ({ ...prev, visible: false }))}
            />
        </div>
    );
};

export default StaffPageClient;
