/**
 * contractClient.ts
 * Bot's interface to the Alpha Vault contract.
 * Uses @midnight-ntwrk/midnight-js-contracts patterns with a server-side
 * signing key (acceptable here — this is a bot/CLI tool, not user-facing code).
 *
 * For user-facing frontend code, ALWAYS use the 1AM wallet.
 */

import type { TradeEntry } from "./agent";

export interface BotContractConfig {
  contractAddress: string;
  networkId: string;
  proofServerUrl: string;
  zkArtifactsPath: string;
}

export interface CommitTradeResult {
  txHash: string;
  commitment: string;
}

export interface ProveThresholdResult {
  txHash: string;
  passed: boolean;
  epoch: number;
  threshold: number;
  commitment: string;
}

/**
 * Submit a commitTrade transaction to the contract.
 * In a real deployment, this would use NodeZkConfigProvider + a server key.
 * For hackathon demo, it logs the trade and simulates success.
 */
export async function submitCommitTrade(
  config: BotContractConfig,
  agentId: string,
  agentName: string,
  entry: TradeEntry
): Promise<CommitTradeResult> {
  console.log(
    `[contractClient] commitTrade | agent=${agentId.slice(0, 8)} epoch=${entry.timestamp} return=${entry.return_bps}bps`
  );

  // In production: call deployContract / submitCallTx from midnight-js-contracts
  // with NodeZkConfigProvider pointing to zkArtifactsPath.
  // Simulated here to keep the bot runnable without a live devnet.
  await simulateNetworkDelay(200, 800);

  const commitment = pseudoHash(agentId + entry.timestamp + entry.return_bps);
  return {
    txHash: `0x${pseudoHash(commitment + Date.now())}`,
    commitment,
  };
}

/**
 * Submit a proveThreshold transaction to the contract.
 */
export async function submitProveThreshold(
  config: BotContractConfig,
  agentId: string,
  epoch: number,
  thresholdBps: number,
  tradeLog: TradeEntry[]
): Promise<ProveThresholdResult> {
  const cumulativeReturn = tradeLog.reduce((sum, t) => sum + t.return_bps, 0);
  const passed = cumulativeReturn >= thresholdBps;

  console.log(
    `[contractClient] proveThreshold | epoch=${epoch} threshold=${thresholdBps}bps cumulative=${cumulativeReturn}bps => ${passed ? "PASS ✓" : "FAIL ✗"}`
  );

  if (!passed) {
    throw new Error(
      `Circuit assertion failed: cumulative return ${cumulativeReturn} < threshold ${thresholdBps}`
    );
  }

  await simulateNetworkDelay(500, 2000);

  const commitment = pseudoHash(agentId + epoch + cumulativeReturn);
  return {
    txHash: `0x${pseudoHash(commitment + Date.now())}`,
    passed,
    epoch,
    threshold: thresholdBps,
    commitment,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Utilities
// ─────────────────────────────────────────────────────────────────────────────

function simulateNetworkDelay(min: number, max: number): Promise<void> {
  const delay = min + Math.random() * (max - min);
  return new Promise((r) => setTimeout(r, delay));
}

/** Deterministic pseudo-hash for simulation (not cryptographic) */
function pseudoHash(input: string | number): string {
  const str = String(input);
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    const chr = str.charCodeAt(i);
    h = (h << 5) - h + chr;
    h |= 0;
  }
  // Expand to 64 hex chars
  const base = Math.abs(h).toString(16).padStart(8, "0");
  return base.repeat(8);
}
