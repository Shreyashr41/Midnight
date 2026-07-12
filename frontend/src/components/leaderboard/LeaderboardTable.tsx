import React, { useState, useMemo } from "react";
import type { LeaderboardEntry } from "../../types/contract";
import { LeaderboardRow } from "./LeaderboardRow";
import { LeaderboardFilters, type SortField, type SortDir } from "./LeaderboardFilters";
import { LoadingSpinner, SkeletonCard } from "../ui/LoadingSpinner";
import { GlassCard } from "../ui/GlassCard";

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

export function LeaderboardTable({
  entries,
  isLoading,
  error,
  lastUpdated,
}: LeaderboardTableProps) {
  const [search, setSearch] = useState("");
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [sortField, setSortField] = useState<SortField>("rank");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const handleSort = (field: SortField, dir: SortDir) => {
    setSortField(field);
    setSortDir(dir);
  };

  const filtered = useMemo(() => {
    let result = [...entries];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (e) =>
          e.agentName.toLowerCase().includes(q) ||
          e.agentId.toLowerCase().includes(q)
      );
    }

    if (onlyVerified) {
      result = result.filter((e) => e.isVerified);
    }

    result.sort((a, b) => {
      let diff = 0;
      if (sortField === "rank") diff = a.rank - b.rank;
      else if (sortField === "return") diff = a.claimedReturnBps - b.claimedReturnBps;
      else if (sortField === "vaultBalance")
        diff = Number(a.vaultBalance - b.vaultBalance);
      else if (sortField === "epoch") diff = a.epoch - b.epoch;
      return sortDir === "asc" ? diff : -diff;
    });

    return result;
  }, [entries, search, onlyVerified, sortField, sortDir]);

  if (error) {
    return (
      <GlassCard className="p-8 text-center">
        <p className="text-danger font-semibold">Failed to load leaderboard</p>
        <p className="mt-1 text-sm text-text-secondary">{error}</p>
      </GlassCard>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <LeaderboardFilters
          onSearch={setSearch}
          onFilterVerified={setOnlyVerified}
          onSort={handleSort}
          sortField={sortField}
          sortDir={sortDir}
          onlyVerified={onlyVerified}
        />
        {lastUpdated && (
          <p className="text-xs text-text-muted">
            Updated {lastUpdated.toLocaleTimeString()}
          </p>
        )}
      </div>

      <GlassCard className="overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center p-16">
            <LoadingSpinner size="lg" label="Loading leaderboard..." />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10 text-left">
                  {[
                    "Rank",
                    "Agent",
                    "Proven Return",
                    "Proof Status",
                    "Vault TVL",
                    "Epoch",
                    "",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-xs font-semibold uppercase tracking-widest text-text-muted"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-12 text-center text-text-secondary"
                    >
                      No agents found
                    </td>
                  </tr>
                ) : (
                  filtered.map((entry, i) => (
                    <LeaderboardRow key={entry.agentId} entry={entry} index={i} />
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>

      {/* Skeleton rows while loading */}
      {isLoading && (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonCard key={i} className="h-16" />
          ))}
        </div>
      )}
    </div>
  );
}
