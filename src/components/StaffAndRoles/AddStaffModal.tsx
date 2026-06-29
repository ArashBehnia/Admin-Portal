'use client';

import { X, Loader2, AlertTriangle, CheckCircle } from 'lucide-react';
import { RoleItem } from '@/actions/staffAndRolesActions';
import Dropdown from '@/components/Shared/Dropdown';

interface AddStaffModalProps {
    isOpen: boolean;
    onClose: () => void;
    formFirstName: string;
    formLastName: string;
    formEmail: string;
    formMobile: string;
    formRole: string;
    rolesList: RoleItem[];
    sendWelcome: boolean;
    formError: string;
    isSubmitting: boolean;
    otpStep: boolean;
    setOtpStep: (v: boolean) => void;
    otpCode: string;
    setOtpCode: (v: string) => void;
    isOtpLoading: boolean;
    otpError: string;
    onFirstNameChange: (v: string) => void;
    onLastNameChange: (v: string) => void;
    onEmailChange: (v: string) => void;
    onMobileChange: (v: string) => void;
    onRoleChange: (v: string) => void;
    onSendWelcomeChange: (v: boolean) => void;
    onSubmit: (e: React.FormEvent) => void;
    onVerifyOtp: () => void;
}

const AddStaffModal = ({
    isOpen, onClose, formFirstName, formLastName, formEmail, formMobile,
    formRole, rolesList, sendWelcome, formError, isSubmitting,
    otpStep, setOtpStep, otpCode, setOtpCode, isOtpLoading, otpError,
    onFirstNameChange, onLastNameChange, onEmailChange, onMobileChange,
    onRoleChange, onSendWelcomeChange, onSubmit, onVerifyOtp,
}: AddStaffModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="overlay z-modal flex items-center justify-center p-4">
            <div className="bg-card w-full max-w-[480px] rounded-lg border border-border shadow-2xl overflow-hidden animate-slide-up" onClick={(e) => e.stopPropagation()}>
                <div className="px-6 py-5 flex justify-between items-center bg-card">
                    <h3 className="font-bold text-lg text-text font-sans tracking-tight">
                        {otpStep ? 'Verify OTP' : 'Add staff member'}
                    </h3>
                    <button onClick={() => { setOtpStep(false); onClose(); }} className="text-muted hover:text-text p-1 rounded hover:bg-page transition-colors cursor-pointer">
                        <X size={18} />
                    </button>
                </div>

                {!otpStep ? (
                    <form onSubmit={onSubmit} className="px-6 pb-6 flex flex-col gap-4 text-xs">
                        {formError && (
                            <div className="bg-red-50 border border-red-200 text-danger p-3 rounded-md flex items-start gap-2 text-xs font-semibold">
                                <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                                <span>{formError}</span>
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1">
                                <label className="text-[13px] text-muted font-medium font-sans">First name <span className="text-accent">*</span></label>
                                <input type="text" value={formFirstName} onChange={(e) => onFirstNameChange(e.target.value)}
                                    className="w-full px-3 py-2 border border-border bg-card text-text rounded focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent text-sm font-medium transition-colors" required />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-[13px] text-muted font-medium font-sans">Last name <span className="text-accent">*</span></label>
                                <input type="text" value={formLastName} onChange={(e) => onLastNameChange(e.target.value)}
                                    className="w-full px-3 py-2 border border-border bg-card text-text rounded focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent text-sm font-medium transition-colors" required />
                            </div>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-[13px] text-muted font-medium font-sans">Email address <span className="text-accent">*</span></label>
                            <input type="email" value={formEmail} onChange={(e) => onEmailChange(e.target.value)}
                                className="w-full px-3 py-2 border border-border bg-card text-text rounded focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent text-sm font-medium transition-colors" required />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-[13px] text-muted font-medium font-sans">Mobile number</label>
                            <input type="text" placeholder="+61 4XX XXX XXX" value={formMobile} onChange={(e) => onMobileChange(e.target.value)}
                                className="w-full px-3 py-2 border border-border bg-card text-text rounded placeholder-muted/80 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent text-sm font-medium transition-colors" />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-[13px] text-muted font-medium font-sans">Role <span className="text-accent">*</span></label>
                            <Dropdown
                                value={formRole}
                                onChange={onRoleChange}
                                options={rolesList.filter(r => r.slug !== 'superadmin').map((role) => ({ value: role.slug, label: role.name }))}
                                placeholder="Select role"
                            />
                            <p className="text-[12px] text-muted leading-tight mt-1.5 font-sans">
                                Superadmin role can only be assigned by existing superadmin after account creation.
                            </p>
                        </div>

                        <div className="flex items-start gap-3 mt-1.5 select-none">
                            <input id="sendWelcomeEmail" type="checkbox" checked={sendWelcome} onChange={(e) => onSendWelcomeChange(e.target.checked)}
                                className="mt-1 h-4 w-4 rounded border-border text-accent focus:ring-accent cursor-pointer" />
                            <label htmlFor="sendWelcomeEmail" className="flex flex-col gap-0.5 cursor-pointer">
                                <span className="text-sm font-semibold text-text font-sans">Send welcome email</span>
                                <span className="text-[12px] text-muted font-medium font-sans">Send login instructions to new staff member.</span>
                            </label>
                        </div>

                        <div className="flex justify-end gap-3 pt-4 mt-2">
                            <button type="button" disabled={isSubmitting} onClick={onClose}
                                className="px-4 py-2 border border-border text-muted hover:text-text rounded bg-white hover:bg-page font-bold text-sm transition-colors cursor-pointer disabled:opacity-50">
                                Cancel
                            </button>
                            <button type="submit" disabled={isSubmitting}
                                className="px-4 py-2 bg-accent hover:bg-accent/90 text-white rounded font-bold text-sm transition-colors cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-75 min-w-[100px]">
                                {isSubmitting ? (<><Loader2 size={14} className="animate-spin" />Sending OTP...</>) : 'Continue'}
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="px-6 pb-6 flex flex-col gap-4 text-xs">
                        <div className="bg-blue-50 border border-blue-200 text-blue-700 p-3 rounded-md flex items-start gap-2 text-xs font-semibold">
                            <CheckCircle size={14} className="shrink-0 mt-0.5" />
                            <span>A verification code has been sent to {formEmail}. Enter the code below to complete.</span>
                        </div>

                        {otpError && (
                            <div className="bg-red-50 border border-red-200 text-danger p-3 rounded-md flex items-start gap-2 text-xs font-semibold">
                                <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                                <span>{otpError}</span>
                            </div>
                        )}

                        <div className="flex flex-col gap-1">
                            <label className="text-[13px] text-muted font-medium font-sans">Verification code <span className="text-accent">*</span></label>
                            <input
                                type="text"
                                value={otpCode}
                                onChange={(e) => setOtpCode(e.target.value)}
                                placeholder="Enter 6-digit code"
                                className="w-full px-3 py-2.5 border border-border bg-card text-text rounded focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent text-sm font-medium transition-colors"
                                autoFocus
                            />
                        </div>

                        <div className="flex justify-end gap-3 pt-4 mt-2">
                            <button type="button" disabled={isOtpLoading}
                                onClick={() => { setOtpStep(false); setOtpCode(''); }}
                                className="px-4 py-2 border border-border text-muted hover:text-text rounded bg-white hover:bg-page font-bold text-sm transition-colors cursor-pointer disabled:opacity-50">
                                Back
                            </button>
                            <button type="button" disabled={isOtpLoading || !otpCode.trim()}
                                onClick={onVerifyOtp}
                                className="px-4 py-2 bg-accent hover:bg-accent/90 text-white rounded font-bold text-sm transition-colors cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-75 min-w-[120px]">
                                {isOtpLoading ? (<><Loader2 size={14} className="animate-spin" />Creating...</>) : 'Verify & Create'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AddStaffModal;
