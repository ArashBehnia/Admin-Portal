"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface StaffPaginationProps {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    rowsPerPage: number;
    onPageChange: (page: number) => void;
    onRowsPerPageChange: (rows: number) => void;
}

const StaffPagination = ({
    currentPage,
    totalPages,
    totalCount,
    rowsPerPage,
    onPageChange,
    onRowsPerPageChange,
}: StaffPaginationProps) => {
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1)
        .filter(
            (p) =>
                p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1,
        )
        .reduce<(number | "…")[]>((acc, p, i, arr) => {
            if (i > 0 && (p as number) - (arr[i - 1] as number) > 1)
                acc.push("…");
            acc.push(p);
            return acc;
        }, []);

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-2">
            <div className="flex flex-wrap items-center gap-4 justify-center sm:justify-start w-full sm:w-auto">
                <div className="flex items-center gap-2">
                    <span className="text-[12px] text-muted">Show</span>
                    <select
                        value={rowsPerPage}
                        onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
                        className="bg-transparent border border-border rounded px-2 py-1 text-[12px] text-text focus:outline-none focus:border-accent cursor-pointer"
                    >
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                    </select>
                    <span className="text-[12px] text-muted">entries</span>
                </div>
                <p className="text-[12px] text-muted">
                    Showing{" "}
                    <span className="font-medium text-text">
                        {totalCount === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1}–
                        {Math.min(currentPage * rowsPerPage, totalCount)}
                    </span>{" "}
                    of <span className="font-medium text-text">{totalCount}</span>{" "}
                    staff members
                </p>
            </div>
            <div className="flex items-center gap-1">
                <button
                    onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1 px-2.5 py-1.5 text-[12px] font-medium text-muted border border-border rounded hover:bg-page disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                    <ChevronLeft className="w-3.5 h-3.5" /> Prev
                </button>

                {pageNumbers.map((item, idx) =>
                    item === "…" ? (
                        <span
                            key={`e${idx}`}
                            className="px-1.5 text-muted text-[12px]"
                        >
                            …
                        </span>
                    ) : (
                        <button
                            key={item}
                            onClick={() => onPageChange(item as number)}
                            className={`w-7 h-7 rounded text-[12px] font-medium border transition-colors cursor-pointer ${
                                currentPage === item
                                    ? "bg-accent text-white border-accent"
                                    : "text-muted border-border hover:bg-page"
                            }`}
                        >
                            {item}
                        </button>
                    ),
                )}

                <button
                    onClick={() =>
                        onPageChange(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1 px-2.5 py-1.5 text-[12px] font-medium text-muted border border-border rounded hover:bg-page disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                    Next <ChevronRight className="w-3.5 h-3.5" />
                </button>
            </div>
        </div>
    );
};

export default StaffPagination;
