"use client";

import { X, Loader2 } from "lucide-react";

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
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 select-none">
            <div
                onClick={onClose}
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
            />
            <div className="relative bg-card border border-border rounded-xl shadow-2xl w-full max-w-[400px] p-6 overflow-hidden animate-fade-in font-sans">
                <div className="flex justify-between items-center pb-3 border-b border-border">
                    <h3 className="text-sm font-bold text-text uppercase tracking-wider">
                        Send test email
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-muted hover:text-text p-1 rounded hover:bg-page transition-colors cursor-pointer"
                    >
                        <X size={16} />
                    </button>
                </div>

                <div className="mt-4 flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-bold text-muted uppercase tracking-wider">
                            Send to email address
                        </label>
                        <input
                            type="email"
                            value={testEmailAddress}
                            onChange={(e) => onEmailChange(e.target.value)}
                            placeholder="Enter your email address"
                            className="px-3 py-2.5 border border-border bg-card text-text rounded text-xs font-semibold focus:outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/40 transition-colors font-sans w-full"
                        />
                    </div>
                    <p className="text-[11px] text-muted leading-relaxed font-medium">
                        Variables will be filled with sample data.
                    </p>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 border border-border hover:bg-page text-muted hover:text-text rounded text-xs font-bold transition-all cursor-pointer font-sans"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={() => onSend(testEmailAddress)}
                        disabled={isSendingTest || !testEmailAddress.trim()}
                        className="px-5 py-2 bg-accent hover:bg-accent/90 disabled:bg-accent/50 text-white rounded text-xs font-bold transition-all shadow-sm cursor-pointer flex items-center gap-1.5 font-sans min-w-[100px] justify-center"
                    >
                        {isSendingTest ? (
                            <Loader2 size={13} className="animate-spin" />
                        ) : (
                            "Send test"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TestEmailModal;
