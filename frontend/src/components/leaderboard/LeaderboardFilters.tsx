import React, { useState } from "react";
import { Search, Filter, ArrowUpDown } from "lucide-react";
import { cn } from "../ui/GlassCard";

export type SortField = "rank" | "return" | "vaultBalance" | "epoch";
export type SortDir = "asc" | "desc";

interface LeaderboardFiltersProps {
  onSearch: (query: string) => void;
  onFilterVerified: (onlyVerified: boolean) => void;
  onSort: (field: SortField, dir: SortDir) => void;
  sortField: SortField;
  sortDir: SortDir;
  onlyVerified: boolean;
}

export function LeaderboardFilters({
  onSearch,
  onFilterVerified,
  onSort,
  sortField,
  sortDir,
  onlyVerified,
}: LeaderboardFiltersProps) {
  const [searchValue, setSearchValue] = useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    onSearch(e.target.value);
  };

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      onSort(field, sortDir === "asc" ? "desc" : "asc");
    } else {
      onSort(field, "desc");
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Search */}
      <div className="relative flex-1 min-w-48">
        <Search
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
        />
        <input
          type="text"
          placeholder="Search agents..."
          value={searchValue}
          onChange={handleSearch}
          className={cn(
            "w-full rounded-lg border border-white/10 bg-white/5 pl-9 pr-4 py-2",
            "text-sm text-text-primary placeholder:text-text-muted",
            "focus:outline-none focus:border-accent-cyan/50 focus:bg-white/8",
            "transition-all duration-200"
          )}
        />
      </div>

      {/* Verified filter */}
      <button
        onClick={() => onFilterVerified(!onlyVerified)}
        className={cn(
          "flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-all",
          onlyVerified
            ? "border-success/50 bg-success/10 text-success"
            : "border-white/10 bg-white/5 text-text-secondary hover:border-white/20"
        )}
      >
        <Filter size={13} />
        ZK Proven Only
      </button>

      {/* Sort controls */}
      <div className="flex items-center gap-1">
        {(
          [
            { field: "return" as SortField, label: "Return" },
            { field: "vaultBalance" as SortField, label: "TVL" },
            { field: "epoch" as SortField, label: "Epoch" },
          ] as const
        ).map(({ field, label }) => (
          <button
            key={field}
            onClick={() => toggleSort(field)}
            className={cn(
              "flex items-center gap-1 rounded-lg border px-3 py-2 text-xs font-medium transition-all",
              sortField === field
                ? "border-accent-cyan/50 bg-accent-cyan/10 text-accent-cyan"
                : "border-white/10 bg-white/5 text-text-secondary hover:border-white/20"
            )}
          >
            {label}
            {sortField === field && (
              <ArrowUpDown
                size={10}
                className={sortDir === "asc" ? "rotate-180" : ""}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
