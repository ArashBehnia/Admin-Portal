"use client";

import { X } from "lucide-react";

interface TestEmailModalProps {
    isOpen: boolean;
    testEmailAddress: string;
    isSendingTest: boolean;
    onClose: () => void;
    onEmailChange: (val: string) => void;
    onSend: (email: string) => void;
}

const TestEmailModal = ({
    isOpen,
    testEmailAddress,
    isSendingTest,
    onClose,
    onEmailChange,
    onSend,
}: TestEmailModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="overlay z-modal flex items-center justify-center p-4 select-none">
            <div
                onClick={onClose}
                className="absolute inset-0"
            />
            <div className="relative bg-card border border-border rounded-xl shadow-2xl w-full max-w-[420px] p-6 overflow-hidden font-sans">
                <div className="flex justify-between items-center pb-4 border-b border-border">
                    <h3 className="text-base font-bold text-text">
                        Send test email
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-muted hover:text-text p-1 rounded hover:bg-page transition-colors cursor-pointer"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="mt-5 flex flex-col gap-3">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-text">
                            Send to email address
                        </label>
                        <input
                            type="email"
                            value={testEmailAddress}
                            onChange={(e) => onEmailChange(e.target.value)}
                            placeholder="your email address"
                            className="w-full px-3 py-2.5 border border-border bg-card text-text rounded-md text-sm focus:outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/40 transition-colors font-sans"
                        />
                    </div>
                    <p className="text-xs text-muted">
                        Variables will be filled with sample data.
                    </p>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 border border-border hover:bg-page text-muted hover:text-text rounded-md text-sm font-semibold transition-all cursor-pointer font-sans"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={() => onSend(testEmailAddress)}
                        disabled={isSendingTest || !testEmailAddress.trim()}
                        className="px-5 py-2 bg-accent hover:bg-accent/90 disabled:bg-accent/50 text-white rounded-md text-sm font-semibold transition-all shadow-sm cursor-pointer font-sans"
                    >
                        Send test
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TestEmailModal;
