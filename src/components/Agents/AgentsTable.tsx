"use client";

import { Search, Loader2 } from "lucide-react";
import { Agent } from "@/types/agentTypes";
import AgentsPagination from "./AgentsPagination";

interface AgentsTableProps {
  filteredAgents: Agent[];
  searchQuery: string;
  selectedAgentId?: string | null;
  currentPage: number;
  totalPages: number;
  totalCount: number;
  rowsPerPage: number;
  onSearchChange: (val: string) => void;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rows: number) => void;
  onViewClick: (agentId: string) => void;
  getStatusClasses: (status: Agent["status"]) => string;
  isLoading?: boolean;
  isSearching?: boolean;
}

const AgentsTable = ({
  filteredAgents,
  searchQuery,
  selectedAgentId,
  currentPage,
  totalPages,
  totalCount,
  rowsPerPage,
  onSearchChange,
  onPageChange,
  onRowsPerPageChange,
  onViewClick,
  getStatusClasses,
  isLoading = false,
  isSearching = false,
}: AgentsTableProps) => {
  return (
    <div className="flex flex-col gap-6">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted" />
        <input
          type="text"
          placeholder="Search by name, email or agency..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 pr-4 py-2 w-full bg-card border border-border rounded-md text-[12px] text-text placeholder-muted focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-colors"
        />
        {isSearching && (
          <Loader2 className="absolute right-3 top-2.5 h-4 w-4 text-muted animate-spin" />
        )}
      </div>
      Search agency name, address, contact email...
      {/* Table */}
      <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[12px] min-w-[var(--min-table-width)]">
            <thead>
              <tr className="border-b border-border/80 bg-page/55 text-muted text-[11px] uppercase font-bold tracking-wider">
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Agency</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Last login</th>
                <th className="px-6 py-4">Status</th>
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
                        <div className="h-4 bg-border/60 rounded animate-pulse w-24" />
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-5 bg-border/60 rounded animate-pulse w-16" />
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-border/60 rounded animate-pulse w-20" />
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-5 bg-border/60 rounded animate-pulse w-14" />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="h-4 bg-border/60 rounded animate-pulse w-12 ml-auto" />
                      </td>
                    </tr>
                  ))}
                </>
              ) : filteredAgents.length > 0 ? (
                filteredAgents.map((agent) => (
                  <tr
                    key={agent.id}
                    className={`hover:bg-page/40 transition-colors text-sm text-text ${
                      selectedAgentId === agent.id ? "bg-page/40" : ""
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="font-semibold text-text">
                        {agent.name}
                      </div>
                      <div className="text-xs text-muted">{agent.email}</div>
                    </td>
                    <td className="px-6 py-4 text-muted font-medium">
                      {agent.agency}
                    </td>
                    <td className="px-6 py-4 max-w-[140px]">
                      <span
                        className="block px-2.5 py-0.5 bg-page border border-border rounded text-xs font-semibold text-muted truncate"
                        title={agent.role}
                      >
                        {agent.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted">{agent.lastLogin}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 text-xs font-semibold rounded ${getStatusClasses(agent.status)}`}
                      >
                        {agent.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => onViewClick(agent.id)}
                        className="text-accent hover:underline text-sm font-semibold transition-colors cursor-pointer"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-10 text-center text-sm text-muted"
                  >
                    {searchQuery
                      ? "No agents match your search criteria."
                      : "No agents found."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* Pagination */}
      {!isLoading && filteredAgents.length > 0 && (
        <AgentsPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalCount={totalCount}
          rowsPerPage={rowsPerPage}
          onPageChange={onPageChange}
          onRowsPerPageChange={onRowsPerPageChange}
        />
      )}
    </div>
  );
};

export default AgentsTable;
