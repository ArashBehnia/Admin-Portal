"use client";

interface ConfirmDeleteModalProps {
    isOpen: boolean;
    ip: string;
    onCancel: () => void;
    onConfirm: () => void;
}

const ConfirmDeleteModal = ({
    isOpen,
    ip,
    onCancel,
    onConfirm,
}: ConfirmDeleteModalProps) => {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-[#0F1115]/50 backdrop-blur-[2px] z-[10000] flex items-center justify-center p-4 select-none animate-fade-in"
            onClick={onCancel}
        >
            <div
                className="bg-card w-full max-w-[380px] rounded-lg border border-border shadow-2xl p-6 flex flex-col gap-4 animate-slide-up"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex flex-col gap-1.5">
                    <h3 className="font-bold text-[16px] text-text font-sans leading-snug">
                        Confirm IP Removal
                    </h3>
                    <p className="text-[13px] text-muted font-medium font-sans leading-relaxed">
                        Are you sure you want to remove{" "}
                        <span className="font-mono font-semibold text-text">
                            {ip}
                        </span>
                        {" "}from the blocklist? This will immediately allow this IP to access the platform again.
                    </p>
                </div>
                <div className="flex justify-end gap-3 mt-2">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 border border-border rounded text-muted hover:text-text hover:bg-page transition-colors text-xs font-bold cursor-pointer font-sans"
                    >
                        No
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-bold transition-colors cursor-pointer font-sans shadow-sm"
                    >
                        Yes, Remove
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDeleteModal;
