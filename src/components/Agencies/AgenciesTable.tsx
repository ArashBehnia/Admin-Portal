"use client";

import Link from "next/link";
import { useState } from "react";
import { Search, MoreHorizontal, Loader2 } from "lucide-react";
import { Agency, AGENCY_FILTERS, AgencyFilter } from "@/types/agencyTypes";
import {
  SubscriptionBadge,
  OnboardingBadge,
  FeedStatusBadge,
} from "./AgencyBadges";
import EditAgencySidebar from "../AgencyDetail/EditAgencySidebar";
import SuspendAgencyModal from "../AgencyDetail/SuspendAgencyModal";
import DeleteAgencyModal from "../AgencyDetail/DeleteAgencyModal";

interface AgenciesTableProps {
  filteredAgencies: Agency[];
  isLoading?: boolean;
  isSearching?: boolean;
  searchQuery: string;
  activeFilter: AgencyFilter;
  openMenuId: string | null;
  onSearchChange: (val: string) => void;
  onFilterChange: (filter: AgencyFilter) => void;
  onToggleMenu: (id: string) => void;
  onCloseMenu: () => void;
  onRefresh: () => void;
}

const AgenciesTable = ({
  filteredAgencies,
  isLoading,
  isSearching,
  searchQuery,
  activeFilter,
  openMenuId,
  onSearchChange,
  onFilterChange,
  onToggleMenu,
  onCloseMenu,
  onRefresh,
}: AgenciesTableProps) => {
  const [editAgencyId, setEditAgencyId] = useState<string | null>(null);
  const [suspendAgencyId, setSuspendAgencyId] = useState<string | null>(null);
  const [suspendAgencyName, setSuspendAgencyName] = useState("");
  const [deleteAgencyId, setDeleteAgencyId] = useState<string | null>(null);
  const [deleteAgencyName, setDeleteAgencyName] = useState("");
  return (
    <div className="flex flex-col gap-5">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative w-full sm:w-[320px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder="Search agency name, address, contact email..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 border border-border rounded text-[12px] focus:outline-none focus:ring-1 focus:ring-accent placeholder:text-muted bg-card text-text shadow-sm"
          />
          {isSearching && (
            <Loader2 className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted animate-spin" />
          )}
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 [&::-webkit-scrollbar]:hidden">
          {AGENCY_FILTERS.map((filter) => (
            <button
              key={filter}
              onClick={() => onFilterChange(filter)}
              className={`px-3 py-1.5 rounded text-[12px] font-medium whitespace-nowrap transition-colors border cursor-pointer ${
                activeFilter === filter
                  ? "bg-text text-card border-text"
                  : "bg-card text-muted border-border hover:bg-page hover:text-text"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[12px] min-w-[var(--min-table-width)]">
            <thead>
              <tr className="border-b border-border/80 bg-page/55 text-muted text-[11px] uppercase font-bold tracking-wider">
                <th className="px-6 py-4">Agency</th>
                <th className="px-6 py-4">Subscription</th>
                <th className="px-6 py-4">Onboarding</th>
                <th className="px-6 py-4 text-right">Listings</th>
                <th className="px-6 py-4 text-right">Agents</th>
                <th className="px-6 py-4">Feed</th>
                <th className="px-6 py-4 text-right">MRR</th>
                <th className="px-6 py-4">Last activity</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {isLoading ? (
                <>
                  {Array.from({ length: 8 }).map((_, i) => (
                    <tr
                      key={i}
                      className="border-b border-border/60 last:border-0"
                    >
                      <td className="px-6 py-4">
                        <div className="h-4 bg-border/60 rounded animate-pulse w-32" />
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-5 bg-border/60 rounded animate-pulse w-16" />
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-5 bg-border/60 rounded animate-pulse w-20" />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="h-4 bg-border/60 rounded animate-pulse w-8 ml-auto" />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="h-4 bg-border/60 rounded animate-pulse w-8 ml-auto" />
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-5 bg-border/60 rounded animate-pulse w-20" />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="h-4 bg-border/60 rounded animate-pulse w-14 ml-auto" />
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-border/60 rounded animate-pulse w-16" />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="h-4 bg-border/60 rounded animate-pulse w-12 ml-auto" />
                      </td>
                    </tr>
                  ))}
                </>
              ) : filteredAgencies.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-muted">
                    No agencies found.
                  </td>
                </tr>
              ) : (
                filteredAgencies.map((agency) => (
                  <tr
                    key={agency?.id}
                    className={`border-b border-border/60 last:border-0 hover:bg-page/40 transition-colors group ${
                      agency?.highlight === "orange"
                        ? "border-l-[3px] border-l-orange-400"
                        : agency?.highlight === "red"
                          ? "border-l-[3px] border-l-red-500"
                          : ""
                    }`}
                  >
                    <td className="py-2.5 px-6">
                      <div className="flex flex-col">
                        <span className="font-bold text-text leading-tight">
                          {agency?.name}
                        </span>
                        <span className="text-[11px] text-muted">
                          {agency?.location}
                        </span>
                      </div>
                    </td>
                    <td className="py-2.5 px-6">
                      <SubscriptionBadge type={agency?.subscription ?? ""} />
                    </td>
                    <td className="py-2.5 px-6">
                      <OnboardingBadge status={agency?.onboarding ?? ""} />
                    </td>
                    <td className="py-2.5 px-6 text-right text-text font-medium">
                      {agency?.listings}
                    </td>
                    <td className="py-2.5 px-6 text-right text-text font-medium">
                      {agency?.agents}
                    </td>
                    <td className="py-2.5 px-6">
                      <FeedStatusBadge status={agency?.feed ?? ""} />
                    </td>
                    <td className="py-2.5 px-6 text-right text-text font-medium">
                      {agency?.mrr}
                    </td>
                    <td className="py-2.5 px-6 text-left text-muted font-medium">
                      {agency?.lastActivity}
                    </td>
                    <td className="py-2.5 px-6 text-right">
                      <div className="flex items-center justify-end gap-3 relative">
                        <Link
                          href={`/agencies/${agency?.id}`}
                          className="text-accent hover:underline font-medium"
                        >
                          View
                        </Link>

                        <div className="relative">
                          <button
                            onClick={() => onToggleMenu(agency?.id ?? "")}
                            className="text-muted hover:text-text p-1 rounded transition-colors focus:outline-none cursor-pointer"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </button>

                          {openMenuId === agency?.id && (
                            <div
                              className="absolute right-0 top-full mt-1 w-40 bg-card border border-border rounded-lg shadow-lg z-10 py-1.5 overflow-hidden text-left"
                              onMouseLeave={onCloseMenu}
                            >
                              <Link
                                href={`/agencies/${agency?.id}`}
                                className="block px-4 py-2 text-[13px] text-text hover:bg-page"
                                onClick={onCloseMenu}
                              >
                                View details
                              </Link>
                              <button
                                onClick={() => {
                                  onCloseMenu();
                                  setEditAgencyId(agency?.id ?? null);
                                }}
                                className="w-full text-left px-4 py-2 text-[13px] text-text hover:bg-page cursor-pointer"
                              >
                                Edit
                              </button>
                              <div className="border-t border-border my-1" />
                              <button
                                onClick={() => {
                                  onCloseMenu();
                                  setSuspendAgencyId(agency?.id ?? null);
                                  setSuspendAgencyName(agency?.name ?? "");
                                }}
                                className="w-full text-left px-4 py-2 text-[13px] text-orange-600 hover:bg-orange-50 cursor-pointer"
                              >
                                Suspend
                              </button>
                              <button
                                onClick={() => {
                                  onCloseMenu();
                                  setDeleteAgencyId(agency?.id ?? null);
                                  setDeleteAgencyName(agency?.name ?? "");
                                }}
                                className="w-full text-left px-4 py-2 text-[13px] text-red-600 hover:bg-red-50 cursor-pointer"
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {editAgencyId && (
        <EditAgencySidebar
          isOpen={true}
          agencyId={editAgencyId}
          initialData={{}}
          onClose={() => setEditAgencyId(null)}
          onSuccess={() => {
            setEditAgencyId(null);
            onRefresh();
          }}
        />
      )}

      {suspendAgencyId && (
        <SuspendAgencyModal
          isOpen={true}
          agencyId={suspendAgencyId}
          agencyName={suspendAgencyName}
          onClose={() => setSuspendAgencyId(null)}
          onSuccess={() => {
            setSuspendAgencyId(null);
            onRefresh();
          }}
        />
      )}

      {deleteAgencyId && (
        <DeleteAgencyModal
          isOpen={true}
          agencyId={deleteAgencyId}
          agencyName={deleteAgencyName}
          onClose={() => setDeleteAgencyId(null)}
          onSuccess={() => {
            setDeleteAgencyId(null);
            onRefresh();
          }}
        />
      )}
    </div>
  );
};

export default AgenciesTable;
