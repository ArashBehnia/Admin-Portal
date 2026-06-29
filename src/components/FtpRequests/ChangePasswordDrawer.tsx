"use client";

import { useState, useCallback } from "react";
import { X, Key, Eye, EyeOff, Check } from "lucide-react";
import { FtpRequest } from "@/types/ftpRequestTypes";
import api from "@/lib/axios";

interface ChangePasswordDrawerProps {
    request: FtpRequest;
    onClose: () => void;
    onSuccess: () => void;
}

interface PasswordRule {
    label: string;
    test: (pw: string) => boolean;
}

const passwordRules: PasswordRule[] = [
    { label: "At least 8 characters", test: (pw) => pw.length >= 8 },
    { label: "One uppercase letter", test: (pw) => /[A-Z]/.test(pw) },
    { label: "One lowercase letter", test: (pw) => /[a-z]/.test(pw) },
    { label: "One number", test: (pw) => /\d/.test(pw) },
    {
        label: "One special character (!@#$%^&*)",
        test: (pw) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pw),
    },
];

const ChangePasswordDrawer = ({
    request,
    onClose,
    onSuccess,
}: ChangePasswordDrawerProps) => {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<{
        newPassword?: string;
        confirmPassword?: string;
    }>({});

    const validatePassword = useCallback((pw: string): string | null => {
        if (!pw) return "Please enter a new password";
        for (const rule of passwordRules) {
            if (!rule.test(pw)) return rule.label;
        }
        return null;
    }, []);

    const handleNewPasswordChange = (value: string) => {
        setNewPassword(value);
        setFieldErrors((prev) => ({ ...prev, newPassword: undefined }));
    };

    const handleConfirmPasswordChange = (value: string) => {
        setConfirmPassword(value);
        setFieldErrors((prev) => ({ ...prev, confirmPassword: undefined }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setFieldErrors({});

        const pwError = validatePassword(newPassword);
        if (pwError) {
            setFieldErrors({ newPassword: pwError });
            return;
        }

        if (newPassword !== confirmPassword) {
            setFieldErrors({ confirmPassword: "Passwords do not match" });
            return;
        }

        setLoading(true);
        try {
            await api.post(
                `/api/ftp-requests/${request.id}/change-password`,
                { password: newPassword },
            );
            onSuccess();
            onClose();
        } catch (err: unknown) {
            const message =
                (err as { response?: { data?: { error?: string } } })?.response?.data?.error ||
                (err instanceof Error ? err.message : "Failed to change password. Please try again.");
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className="overlay z-drawer transition-opacity"
                onClick={onClose}
            />

            {/* Drawer */}
            <div className="fixed top-0 right-0 h-full w-full max-w-[450px] bg-card shadow-2xl z-[101] flex flex-col border-l border-border overflow-hidden animate-slide-left">
                {/* Header */}
                <div className="px-6 py-5 border-b border-border relative">
                    <button
                        onClick={onClose}
                        className="absolute top-5 right-5 text-muted hover:text-text transition-colors cursor-pointer"
                    >
                        <X className="w-4 h-4" />
                    </button>
                    <h2 className="text-[18px] font-bold text-text mb-1">
                        Change FTP Password
                    </h2>
                    <p className="text-[13px] text-muted">
                        {request.agentName} ({request.agentEmail})
                    </p>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-md text-[13px] text-red-700">
                                {error}
                            </div>
                        )}

                        {/* New Password */}
                        <div>
                            <label className="block text-[13px] font-medium text-text mb-1.5">
                                New Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showNewPassword ? "text" : "password"}
                                    value={newPassword}
                                    onChange={(e) =>
                                        handleNewPasswordChange(e.target.value)
                                    }
                                    className={`w-full px-3 py-2 pr-10 border rounded-md text-[13px] text-text focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent ${
                                        fieldErrors.newPassword
                                            ? "border-red-300"
                                            : "border-border"
                                    }`}
                                    placeholder="Enter new password"
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowNewPassword(!showNewPassword)
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-text cursor-pointer"
                                >
                                    {showNewPassword ? (
                                        <EyeOff className="w-4 h-4" />
                                    ) : (
                                        <Eye className="w-4 h-4" />
                                    )}
                                </button>
                            </div>
                            {fieldErrors.newPassword && (
                                <p className="text-[12px] text-red-600 mt-1">
                                    {fieldErrors.newPassword}
                                </p>
                            )}
                        </div>

                        {/* Password Rules */}
                        <div className="space-y-1.5">
                            <p className="text-[11px] font-medium text-muted uppercase tracking-wide">
                                Password must contain:
                            </p>
                            <div className="grid grid-cols-1 gap-1">
                                {passwordRules.map((rule) => {
                                    const passes = rule.test(newPassword);
                                    return (
                                        <div
                                            key={rule.label}
                                            className={`flex items-center gap-2 text-[12px] ${
                                                passes
                                                    ? "text-green-600"
                                                    : "text-muted"
                                            }`}
                                        >
                                            <div
                                                className={`w-4 h-4 rounded-full flex items-center justify-center border ${
                                                    passes
                                                        ? "bg-green-100 border-green-300"
                                                        : "bg-page border-border"
                                                }`}
                                            >
                                                {passes && (
                                                    <Check
                                                        className="w-2.5 h-2.5"
                                                        strokeWidth={3}
                                                    />
                                                )}
                                            </div>
                                            {rule.label}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-[13px] font-medium text-text mb-1.5">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <input
                                    type={
                                        showConfirmPassword ? "text" : "password"
                                    }
                                    value={confirmPassword}
                                    onChange={(e) =>
                                        handleConfirmPasswordChange(
                                            e.target.value,
                                        )
                                    }
                                    className={`w-full px-3 py-2 pr-10 border rounded-md text-[13px] text-text focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent ${
                                        fieldErrors.confirmPassword
                                            ? "border-red-300"
                                            : "border-border"
                                    }`}
                                    placeholder="Confirm new password"
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowConfirmPassword(
                                            !showConfirmPassword,
                                        )
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-text cursor-pointer"
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className="w-4 h-4" />
                                    ) : (
                                        <Eye className="w-4 h-4" />
                                    )}
                                </button>
                            </div>
                            {fieldErrors.confirmPassword && (
                                <p className="text-[12px] text-red-600 mt-1">
                                    {fieldErrors.confirmPassword}
                                </p>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-4 py-2 border border-border rounded-md text-[13px] font-medium text-muted hover:bg-page hover:text-text transition-colors cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 px-4 py-2 bg-accent text-white rounded-md text-[13px] font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 cursor-pointer"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Changing Password...
                                    </span>
                                ) : (
                                    "Change Password"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default ChangePasswordDrawer;
