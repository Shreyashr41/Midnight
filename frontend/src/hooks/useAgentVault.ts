import { useState, useEffect, useCallback } from "react";
import type { VaultPosition } from "../types/contract";
import { MOCK_LEADERBOARD } from "../mock/mockData";

const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === "true";

interface UseAgentVaultResult {
  position: VaultPosition | null;
  totalVaultBalance: bigint;
  isLoading: boolean;
  error: string | null;
  deposit: (amount: bigint) => Promise<void>;
  withdraw: (amount: bigint) => Promise<void>;
}

export function useAgentVault(
  agentId: string | undefined,
  userAddress: string | null
): UseAgentVaultResult {
  const [position, setPosition] = useState<VaultPosition | null>(null);
  const [totalVaultBalance, setTotalVaultBalance] = useState<bigint>(0n);
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
        await new Promise((r) => setTimeout(r, 400));
        const agent = MOCK_LEADERBOARD.find((e) => e.agentId === agentId);
        if (agent) {
          setTotalVaultBalance(agent.vaultBalance);
          if (userAddress) {
            setPosition({
              agentId,
              deposited: agent.vaultBalance / 4n,
              sharePercent: 25,
            });
          }
        }
        setIsLoading(false);
        return;
      }

      try {
        // Live mode: fetch from contract
        const { getAgentVaultPosition } = await import(
          "../contract/AlphaVaultAPI"
        );
        const data = await getAgentVaultPosition(agentId, userAddress);
        setPosition(data.userPosition);
        setTotalVaultBalance(data.totalBalance);
      } catch (err: unknown) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch vault data"
        );
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [agentId, userAddress]);

  const deposit = useCallback(
    async (amount: bigint) => {
      if (!agentId) return;
      // Optimistic update in mock mode
      if (USE_MOCK_DATA) {
        setTotalVaultBalance((prev) => prev + amount);
        setPosition((prev) =>
          prev
            ? { ...prev, deposited: prev.deposited + amount }
            : { agentId, deposited: amount, sharePercent: 0 }
        );
        return;
      }
      const { deposit: depositFn } = await import("../contract/AlphaVaultAPI");
      await depositFn(agentId, amount);
      setTotalVaultBalance((prev) => prev + amount);
    },
    [agentId]
  );

  const withdraw = useCallback(
    async (amount: bigint) => {
      if (!agentId) return;
      if (USE_MOCK_DATA) {
        setTotalVaultBalance((prev) => (prev > amount ? prev - amount : 0n));
        setPosition((prev) =>
          prev
            ? {
                ...prev,
                deposited: prev.deposited > amount ? prev.deposited - amount : 0n,
              }
            : null
        );
        return;
      }
      const { withdraw: withdrawFn } = await import(
        "../contract/AlphaVaultAPI"
      );
      await withdrawFn(agentId, amount);
      setTotalVaultBalance((prev) => (prev > amount ? prev - amount : 0n));
    },
    [agentId]
  );

  return { position, totalVaultBalance, isLoading, error, deposit, withdraw };
}
