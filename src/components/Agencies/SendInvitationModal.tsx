"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface SendInvitationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const SendInvitationModal = ({ isOpen, onClose }: SendInvitationModalProps) => {
    const [contactName, setContactName] = useState("");
    const [agencyName, setAgencyName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    if (!isOpen) return null;

    const handleClose = () => {
        setContactName("");
        setAgencyName("");
        setEmail("");
        setMessage("");
        onClose();
    };

    return (
        <div className="overlay z-modal flex items-center justify-center p-4">
            <div className="bg-card rounded shadow-xl w-full max-w-[500px] flex flex-col overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                    <h2 className="text-[16px] font-bold text-text">
                        Send agency invitation
                    </h2>
                    <button
                        onClick={handleClose}
                        className="text-muted hover:text-text transition-colors cursor-pointer"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-5 space-y-4">
                    <div className="space-y-1.5">
                        <label className="block text-[13px] font-semibold text-text">
                            Contact name
                        </label>
                        <input
                            type="text"
                            placeholder="Jane Smith"
                            value={contactName}
                            onChange={(e) => setContactName(e.target.value)}
                            className="w-full border border-border rounded px-3 py-2 text-[13px] focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent bg-card text-text"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="block text-[13px] font-semibold text-text">
                            Agency name
                        </label>
                        <input
                            type="text"
                            placeholder="Ray White Bondi"
                            value={agencyName}
                            onChange={(e) => setAgencyName(e.target.value)}
                            className="w-full border border-border rounded px-3 py-2 text-[13px] focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent bg-card text-text"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="block text-[13px] font-semibold text-text">
                            Email address
                        </label>
                        <input
                            type="email"
                            placeholder="jane@agency.com.au"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border border-border rounded px-3 py-2 text-[13px] focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent bg-card text-text"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="block text-[13px] font-semibold text-text">
                            Personal message{" "}
                            <span className="text-muted font-normal">
                                (optional)
                            </span>
                        </label>
                        <textarea
                            rows={3}
                            placeholder="Add a personal message to the invitation email..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="w-full border border-border rounded px-3 py-2 text-[13px] focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent resize-none bg-card text-text"
                        />
                    </div>
                </div>

                <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-border bg-page/30">
                    <button
                        onClick={handleClose}
                        className="px-4 py-2 text-[13px] font-semibold text-muted hover:text-text transition-colors cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button className="px-4 py-2 bg-accent hover:bg-accent/90 text-white rounded text-[13px] font-medium transition-colors cursor-pointer">
                        Send invitation
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SendInvitationModal;
