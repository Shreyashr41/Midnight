import { useState, useEffect, useCallback } from "react";
import type { LeaderboardEntry } from "../types/contract";
import { MOCK_LEADERBOARD } from "../mock/mockData";

const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === "true";
const POLL_INTERVAL_MS = 15_000;

interface UseLeaderboardResult {
  entries: LeaderboardEntry[];
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
  lastUpdated: Date | null;
}

export function useLeaderboard(contractAddress?: string): UseLeaderboardResult {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchLeaderboard = useCallback(async () => {
    setError(null);

    if (USE_MOCK_DATA || !contractAddress) {
      // Simulate network delay in mock mode
      await new Promise((r) => setTimeout(r, 600));
      setEntries(MOCK_LEADERBOARD);
      setLastUpdated(new Date());
      setIsLoading(false);
      return;
    }

    try {
      // In live mode: import and use AlphaVaultAPI to read public state
      const { getLeaderboard } = await import("../contract/AlphaVaultAPI");
      const data = await getLeaderboard(contractAddress);
      setEntries(data);
      setLastUpdated(new Date());
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch leaderboard"
      );
    } finally {
      setIsLoading(false);
    }
  }, [contractAddress]);

  useEffect(() => {
    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [fetchLeaderboard]);

  return { entries, isLoading, error, refresh: fetchLeaderboard, lastUpdated };
}
