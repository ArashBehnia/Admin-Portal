'use client';

import { RefreshCw } from 'lucide-react';
import Toast from '@/components/Shared/Toast';
import { StaffMember, StaffSummary, RoleItem } from '@/actions/staffAndRolesActions';
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
    initialSummary: StaffSummary;
}

const StaffPageClient = ({ initialStaff, initialRoles, initialSummary }: StaffPageClientProps) => {
    const {
        filteredStaff, rolesList, stats,
        staffActivity, isActivityLoading,
        isLoading,
        currentPage, totalPages, totalItems, pageSize, setPageSize, setPage,
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
    } = useStaffAndRoles({ initialStaff, initialRoles, initialSummary });

    return (
        <div className="flex flex-col gap-5 w-full max-w-content mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                    <h1 className="text-[18px] sm:text-[20px] font-bold text-text leading-snug">Staff & Roles</h1>
                    <p className="text-[12px] sm:text-[13px] text-muted mt-0.5">Manage HomeBy internal staff accounts and access levels.</p>
                </div>
                <button
                    onClick={() => window.location.reload()}
                    className="text-muted hover:text-text p-2 rounded border border-border hover:bg-page transition-colors self-start shrink-0 cursor-pointer"
                    title="Refresh"
                >
                    <RefreshCw className="w-4 h-4" />
                </button>
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
                    rowsPerPage={pageSize}
                    rolesList={rolesList}
                    onSearchChange={setSearchQuery}
                    onRoleFilterChange={setRoleFilter}
                    onAddClick={handleOpenAddModal}
                    onEditClick={openEditModal}
                    onPageChange={setPage}
                    onRowsPerPageChange={setPageSize}
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
