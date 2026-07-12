/**
 * agent.ts
 * Alpha Vault trading bot.
 *
 * Generates mock trade entries using a sine-wave + noise price feed,
 * commits them to the Alpha Vault contract via commitTrade, and periodically
 * runs proveThreshold to produce ZK performance proofs.
 *
 * Configuration via env vars (see .env.example):
 *   CONTRACT_ADDRESS       — deployed contract address
 *   AGENT_PRIVATE_KEY      — bot's signing key (hex)
 *   AGENT_ID               — 32-byte hex agent identity
 *   AGENT_NAME             — display name on leaderboard
 *   PROOF_SERVER_URL       — local proof server endpoint
 *   INTERVAL_MS            — trade interval in milliseconds (default 30000)
 *   PROVE_EVERY_N_TRADES   — run proveThreshold every N trades (default 10)
 *   THRESHOLD_BPS          — minimum return to prove (default 1000 = 10%)
 *   NETWORK_ID             — devnet | testnet | mainnet (default devnet)
 */

import "dotenv/config";
import { MockPriceFeed } from "./mockPriceFeed";
import {
  submitCommitTrade,
  submitProveThreshold,
  type BotContractConfig,
} from "./contractClient";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface TradeEntry {
  timestamp: number;
  return_bps: number;
  asset_id: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// Config
// ─────────────────────────────────────────────────────────────────────────────

const CONFIG = {
  contractAddress:
    process.env.CONTRACT_ADDRESS ??
    (() => {
      console.warn("[agent] CONTRACT_ADDRESS not set — using placeholder");
      return "0x" + "00".repeat(32);
    })(),
  agentId:
    process.env.AGENT_ID ??
    "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2",
  agentName: process.env.AGENT_NAME ?? "AlphaBot",
  proofServerUrl: process.env.PROOF_SERVER_URL ?? "http://localhost:6300",
  intervalMs: parseInt(process.env.INTERVAL_MS ?? "30000", 10),
  proveEveryNTrades: parseInt(process.env.PROVE_EVERY_N_TRADES ?? "10", 10),
  thresholdBps: parseInt(process.env.THRESHOLD_BPS ?? "1000", 10),
  networkId: process.env.NETWORK_ID ?? "devnet",
  zkArtifactsPath:
    process.env.ZK_ARTIFACTS_PATH ?? "../contract/dist/alpha_vault",
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// State
// ─────────────────────────────────────────────────────────────────────────────

const priceFeed = new MockPriceFeed({
  period: 100,
  amplitude: 500,
  noiseSigma: 200,
  drift: 15,
});

const tradeLog: TradeEntry[] = [];
let tradeCount = 0;
let currentEpoch = 1;

// ─────────────────────────────────────────────────────────────────────────────
// Main loop
// ─────────────────────────────────────────────────────────────────────────────

async function runTradeCycle(): Promise<void> {
  const contractConfig: BotContractConfig = {
    contractAddress: CONFIG.contractAddress,
    networkId: CONFIG.networkId,
    proofServerUrl: CONFIG.proofServerUrl,
    zkArtifactsPath: CONFIG.zkArtifactsPath,
  };

  // Generate a mock trade
  const entry: TradeEntry = {
    timestamp: Math.floor(Date.now() / 1000),
    return_bps: priceFeed.next(),
    asset_id: Math.floor(Math.random() * 8), // 8 mock assets
  };

  console.log(
    `[agent] Trade #${tradeCount + 1} | epoch=${currentEpoch} return=${entry.return_bps}bps asset=${entry.asset_id}`
  );

  try {
    // Commit trade privately to the contract
    const commitResult = await submitCommitTrade(
      contractConfig,
      CONFIG.agentId,
      CONFIG.agentName,
      entry
    );
    tradeLog.push(entry);
    tradeCount++;

    console.log(`[agent] Trade committed | txHash=${commitResult.txHash.slice(0, 18)}…`);

    // Every N trades, generate a threshold proof
    if (tradeCount % CONFIG.proveEveryNTrades === 0) {
      await runProofCycle(contractConfig);
    }
  } catch (err) {
    console.error(`[agent] Trade commit failed:`, err);
  }
}

async function runProofCycle(contractConfig: BotContractConfig): Promise<void> {
  console.log(
    `[agent] ── Running proveThreshold | epoch=${currentEpoch} threshold=${CONFIG.thresholdBps}bps ──`
  );

  try {
    const result = await submitProveThreshold(
      contractConfig,
      CONFIG.agentId,
      currentEpoch,
      CONFIG.thresholdBps,
      [...tradeLog] // snapshot for this epoch
    );

    console.log(
      `[agent] Proof ${result.passed ? "PASSED ✓" : "FAILED ✗"} | epoch=${result.epoch} txHash=${result.txHash.slice(0, 18)}…`
    );

    // Advance epoch and reset log for the new epoch
    currentEpoch++;
    tradeLog.length = 0;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.warn(`[agent] proveThreshold rejected: ${msg}`);
    // Still advance epoch to avoid getting stuck
    currentEpoch++;
    tradeLog.length = 0;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Entry point
// ─────────────────────────────────────────────────────────────────────────────

console.log("╔═══════════════════════════════════════════╗");
console.log("║   Alpha Vault Trading Bot                  ║");
console.log("╚═══════════════════════════════════════════╝");
console.log(`Agent ID   : ${CONFIG.agentId.slice(0, 16)}…`);
console.log(`Agent Name : ${CONFIG.agentName}`);
console.log(`Contract   : ${CONFIG.contractAddress.slice(0, 16)}…`);
console.log(`Network    : ${CONFIG.networkId}`);
console.log(`Interval   : ${CONFIG.intervalMs}ms`);
console.log(`Prove every: ${CONFIG.proveEveryNTrades} trades`);
console.log(`Threshold  : ${CONFIG.thresholdBps}bps (${CONFIG.thresholdBps / 100}%)`);
console.log("");

// Run immediately, then on interval
runTradeCycle();
setInterval(runTradeCycle, CONFIG.intervalMs);

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("\n[agent] Shutting down. Goodbye.");
  process.exit(0);
});
