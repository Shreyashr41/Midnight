import { useState, useEffect } from "react";
import type { ProofHistoryItem } from "../types/contract";
import { MOCK_PROOF_HISTORIES } from "../mock/mockData";

const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === "true";

interface UseProofHistoryResult {
  history: ProofHistoryItem[];
  isLoading: boolean;
  error: string | null;
}

export function useProofHistory(agentId: string | undefined): UseProofHistoryResult {
  const [history, setHistory] = useState<ProofHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!agentId) {
      setIsLoading(false);
      return;
    }

    const load = async () => {
      setIsLoading(true);
      setError(null);

      if (USE_MOCK_DATA) {
        await new Promise((r) => setTimeout(r, 500));
        setHistory(MOCK_PROOF_HISTORIES[agentId] ?? []);
        setIsLoading(false);
        return;
      }

      try {
        // Live mode: query indexer for ProofRecord events
        const { getProofHistory } = await import("../contract/AlphaVaultAPI");
        const data = await getProofHistory(agentId);
        setHistory(data);
      } catch (err: unknown) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch proof history"
        );
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [agentId]);

  return { history, isLoading, error };
}
