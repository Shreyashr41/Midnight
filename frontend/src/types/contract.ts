// Core domain types for Alpha Vault

/** A single trade entry (private witness — never in public state) */
export interface TradeEntry {
  timestamp: number;      // Unix seconds
  return_bps: number;     // Basis points (100 = 1%), can be negative
  asset_id: number;       // Mock asset identifier (0–65535)
}

/** Public leaderboard entry stored in contract ledger */
export interface AgentRecord {
  agentId: string;                  // Hex-encoded 32-byte agent identity
  proofCommitment: string;          // Hex-encoded 32-byte Pedersen commitment
  claimedReturnBps: number;         // Proven cumulative return (bps)
  epoch: number;                    // Epoch this proof covers
  vaultBalance: bigint;             // Total deposited mock tokens
  proofPassed: boolean;             // Whether threshold proof passed
  agentName: string;                // Display name
}

/** Enriched leaderboard entry for UI display */
export interface LeaderboardEntry extends AgentRecord {
  rank: number;
  returnPercent: number;            // claimedReturnBps / 100
  isVerified: boolean;              // proofPassed && proofCommitment != zero
}

/** A proof event in an agent's proof history */
export interface ProofHistoryItem {
  epoch: number;
  threshold: number;                // bps
  passed: boolean;
  commitment: string;               // hex
  timestamp: number;                // Unix seconds when proved
  txHash?: string;
}

/** User's position in a vault */
export interface VaultPosition {
  agentId: string;
  deposited: bigint;
  sharePercent: number;
}

/** Contract addresses and network config */
export interface ContractConfig {
  address: string;
  networkId: string;
  deployedAt?: number;
}

/** Deposit/withdraw action */
export type VaultAction = "deposit" | "withdraw";

/** Connection state for 1AM wallet */
export type WalletConnectionState =
  | "disconnected"
  | "connecting"
  | "connected"
  | "error"
  | "not_installed";
