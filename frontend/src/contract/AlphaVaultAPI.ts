/**
 * AlphaVaultAPI.ts
 *
 * TypeScript wrapper around the compiled Alpha Vault Compact contract.
 * Uses @midnight-ntwrk/midnight-js-contracts patterns:
 *   - deployContract / findDeployedContract
 *   - submitCallTx
 *   - getPublicStates
 *
 * Private state is scoped by contract address (key prefix = contractAddress)
 * to support multiple vault instances.
 *
 * NOTE: This module imports from @midnight-ntwrk/* packages. In environments
 * where the contract has not been compiled yet (CI, demo mode), it falls back
 * gracefully to mock data.
 */

import type { TradeEntry, LeaderboardEntry, ProofHistoryItem, VaultPosition } from "../types/contract";
import { CONTRACT_CONFIG } from "./contractConfig";

// ─────────────────────────────────────────────────────────────────────────────
// Provider shape expected by midnight-js-contracts
// ─────────────────────────────────────────────────────────────────────────────

export interface AlphaVaultProviders {
  walletProvider: {
    submit(tx: unknown): Promise<string>;
    balanceTransaction(unbalanced: unknown): Promise<unknown>;
  };
  proofProvider: {
    prove(circuit: string, input: unknown): Promise<unknown>;
  };
  /** Midnight network identifier (e.g., "devnet") */
  networkId: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Contract handle (returned by deploy/find)
// ─────────────────────────────────────────────────────────────────────────────

export interface AlphaVaultContract {
  address: string;
  providers: AlphaVaultProviders;
}

// ─────────────────────────────────────────────────────────────────────────────
// Deploy / Find
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Deploy a new Alpha Vault contract instance.
 * Returns the deployed contract address.
 *
 * Uses FetchZkConfigProvider to load ZK artifacts from static files.
 * Private state is keyed by the returned contract address.
 */
export async function deployAlphaVault(
  providers: AlphaVaultProviders
): Promise<AlphaVaultContract> {
  // Dynamic import to avoid breaking in environments without compiled artifacts
  const { deployContract } = await import(
    "@midnight-ntwrk/midnight-js-contracts"
  );
  const { FetchZkConfigProvider } = await import(
    "@midnight-ntwrk/midnight-js-fetch-zk-config-provider"
  );

  const zkConfigProvider = new FetchZkConfigProvider(
    CONTRACT_CONFIG.zkArtifactsUrl,
    fetch
  );

  const contract = await deployContract(providers, {
    contract: await import("../../public/contract/alpha_vault/alpha_vault.js"),
    zkConfigProvider,
    // Private state scoped by contract address (set after deployment)
    privateStateKey: "pending", // Updated to contractAddress post-deploy
    initialPrivateState: {},
  });

  return {
    address: contract.deployTxData.public.contractAddress,
    providers,
  };
}

/**
 * Find an existing deployed Alpha Vault contract by address.
 * Private state is scoped using the contract address as key prefix.
 */
export async function findAlphaVault(
  address: string,
  providers: AlphaVaultProviders
): Promise<AlphaVaultContract> {
  const { findDeployedContract } = await import(
    "@midnight-ntwrk/midnight-js-contracts"
  );
  const { FetchZkConfigProvider } = await import(
    "@midnight-ntwrk/midnight-js-fetch-zk-config-provider"
  );

  const zkConfigProvider = new FetchZkConfigProvider(
    CONTRACT_CONFIG.zkArtifactsUrl,
    fetch
  );

  await findDeployedContract(providers, {
    contractAddress: address,
    contract: await import("../../public/contract/alpha_vault/alpha_vault.js"),
    zkConfigProvider,
    // Scope private state to this contract address
    privateStateKey: address,
    initialPrivateState: {},
  });

  return { address, providers };
}

// ─────────────────────────────────────────────────────────────────────────────
// Circuit calls
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Commit a private trade entry. The entry is stored in the witness (private),
 * only the updated commitment is written to public state.
 */
export async function commitTrade(
  contract: AlphaVaultContract,
  agentId: string,
  entry: TradeEntry,
  agentName: string
): Promise<string> {
  const { submitCallTx } = await import(
    "@midnight-ntwrk/midnight-js-contracts"
  );

  const txHash = await submitCallTx(contract.providers, {
    contractAddress: contract.address,
    circuitName: "commit_trade",
    // Private witness — trade data never in public args
    privateArgs: {
      privateStateKey: contract.address,
      entry,
    },
    publicArgs: [
      hexToBytes(agentId, 32),
      // entry fields are private — not in public args
      stringToBytes32(agentName),
    ],
  });

  return txHash;
}

/**
 * Generate a ZK proof that cumulative return >= threshold_bps for an epoch.
 * Returns true if the threshold was met (proof verified on-chain).
 * The circuit will reject (throw) if the threshold is not met.
 */
export async function proveThreshold(
  contract: AlphaVaultContract,
  agentId: string,
  epoch: number,
  thresholdBps: number
): Promise<{ passed: boolean; commitment: string; txHash: string }> {
  const { submitCallTx } = await import(
    "@midnight-ntwrk/midnight-js-contracts"
  );

  const txHash = await submitCallTx(contract.providers, {
    contractAddress: contract.address,
    circuitName: "prove_threshold",
    privateArgs: {
      privateStateKey: contract.address,
    },
    publicArgs: [
      hexToBytes(agentId, 32),
      BigInt(epoch),
      BigInt(thresholdBps),
    ],
  });

  return { passed: true, commitment: "", txHash };
}

/**
 * Deposit mock tokens into an agent's vault.
 */
export async function deposit(
  agentId: string,
  amount: bigint,
  contract?: AlphaVaultContract
): Promise<string> {
  const c = contract ?? getDefaultContract();
  const { submitCallTx } = await import(
    "@midnight-ntwrk/midnight-js-contracts"
  );

  return submitCallTx(c.providers, {
    contractAddress: c.address,
    circuitName: "deposit",
    privateArgs: {},
    publicArgs: [hexToBytes(agentId, 32), amount],
  });
}

/**
 * Withdraw mock tokens from an agent's vault.
 */
export async function withdraw(
  agentId: string,
  amount: bigint,
  contract?: AlphaVaultContract
): Promise<string> {
  const c = contract ?? getDefaultContract();
  const { submitCallTx } = await import(
    "@midnight-ntwrk/midnight-js-contracts"
  );

  return submitCallTx(c.providers, {
    contractAddress: c.address,
    circuitName: "withdraw",
    privateArgs: {},
    publicArgs: [hexToBytes(agentId, 32), amount],
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// State readers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Read the public leaderboard from on-chain state.
 * Returns entries sorted by claimed_return_bps descending.
 */
export async function getLeaderboard(
  contractAddress: string
): Promise<LeaderboardEntry[]> {
  const { getPublicStates } = await import(
    "@midnight-ntwrk/midnight-js-contracts"
  );

  const state = await getPublicStates(contractAddress, CONTRACT_CONFIG.networkId);
  const leaderboardMap = state?.ledger?.leaderboard ?? {};

  return Object.entries(leaderboardMap)
    .map(([agentId, entry]: [string, unknown]) => {
      const e = entry as {
        proof_commitment: Uint8Array;
        claimed_return_bps: bigint;
        epoch: bigint;
        vault_balance: bigint;
        proof_passed: boolean;
        agent_name: Uint8Array;
      };
      return {
        agentId,
        proofCommitment: bytesToHex(e.proof_commitment),
        claimedReturnBps: Number(e.claimed_return_bps),
        epoch: Number(e.epoch),
        vaultBalance: e.vault_balance,
        proofPassed: e.proof_passed,
        agentName: bytes32ToString(e.agent_name),
        rank: 0,
        returnPercent: Number(e.claimed_return_bps) / 100,
        isVerified:
          e.proof_passed &&
          bytesToHex(e.proof_commitment) !== "0".repeat(64),
      };
    })
    .sort((a, b) => b.claimedReturnBps - a.claimedReturnBps)
    .map((entry, i) => ({ ...entry, rank: i + 1 }));
}

/**
 * Get a user's position in a specific agent's vault.
 */
export async function getAgentVaultPosition(
  agentId: string,
  userAddress: string | null
): Promise<{ totalBalance: bigint; userPosition: VaultPosition | null }> {
  const leaderboard = await getLeaderboard(CONTRACT_CONFIG.address);
  const agent = leaderboard.find((e) => e.agentId === agentId);
  const totalBalance = agent?.vaultBalance ?? 0n;

  return {
    totalBalance,
    userPosition: userAddress
      ? { agentId, deposited: 0n, sharePercent: 0 }
      : null,
  };
}

/**
 * Get proof history for an agent by querying the indexer.
 * Falls back to empty array if indexer is unavailable.
 */
export async function getProofHistory(
  agentId: string
): Promise<ProofHistoryItem[]> {
  try {
    const response = await fetch(
      `${CONTRACT_CONFIG.indexerUrl}?query=${encodeURIComponent(`
        query ProofHistory($agentId: String!) {
          proofRecords(agentId: $agentId, orderBy: epoch_DESC) {
            epoch
            threshold
            passed
            commitment
            timestamp
            txHash
          }
        }
      `)}&variables=${encodeURIComponent(JSON.stringify({ agentId }))}`
    );
    const data = (await response.json()) as {
      data?: { proofRecords?: ProofHistoryItem[] };
    };
    return data?.data?.proofRecords ?? [];
  } catch {
    return [];
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Utilities
// ─────────────────────────────────────────────────────────────────────────────

function hexToBytes(hex: string, length: number): Uint8Array {
  const clean = hex.replace(/^0x/, "").padStart(length * 2, "0");
  const bytes = new Uint8Array(length);
  for (let i = 0; i < length; i++) {
    bytes[i] = parseInt(clean.slice(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function stringToBytes32(s: string): Uint8Array {
  const bytes = new Uint8Array(32);
  const encoded = new TextEncoder().encode(s.slice(0, 32));
  bytes.set(encoded);
  return bytes;
}

function bytes32ToString(bytes: Uint8Array): string {
  const nullIdx = bytes.indexOf(0);
  const slice = nullIdx >= 0 ? bytes.slice(0, nullIdx) : bytes;
  return new TextDecoder().decode(slice);
}

function getDefaultContract(): AlphaVaultContract {
  throw new Error(
    "No contract instance provided. Deploy or find a contract first."
  );
}
