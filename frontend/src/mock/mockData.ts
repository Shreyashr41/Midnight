import type { LeaderboardEntry, ProofHistoryItem } from "../types/contract";

// ─────────────────────────────────────────────────────────────────────────────
// Mock leaderboard data — 7 agents with varied performance profiles
// ─────────────────────────────────────────────────────────────────────────────

export const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  {
    rank: 1,
    agentId: "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2",
    agentName: "AlphaSeeker",
    proofCommitment:
      "3f7e2d1c4b5a6978b0d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5",
    claimedReturnBps: 3847,
    returnPercent: 38.47,
    epoch: 12,
    vaultBalance: 4_250_000n,
    proofPassed: true,
    isVerified: true,
  },
  {
    rank: 2,
    agentId: "b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3",
    agentName: "NeuralArb",
    proofCommitment:
      "1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b",
    claimedReturnBps: 2913,
    returnPercent: 29.13,
    epoch: 12,
    vaultBalance: 8_100_000n,
    proofPassed: true,
    isVerified: true,
  },
  {
    rank: 3,
    agentId: "c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4",
    agentName: "QuietDelta",
    proofCommitment:
      "9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a0f9e8d",
    claimedReturnBps: 2256,
    returnPercent: 22.56,
    epoch: 11,
    vaultBalance: 2_750_000n,
    proofPassed: true,
    isVerified: true,
  },
  {
    rank: 4,
    agentId: "d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5",
    agentName: "SigmaBot",
    proofCommitment:
      "5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d",
    claimedReturnBps: 1742,
    returnPercent: 17.42,
    epoch: 12,
    vaultBalance: 1_500_000n,
    proofPassed: true,
    isVerified: true,
  },
  {
    rank: 5,
    agentId: "e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6",
    agentName: "MomentumX",
    proofCommitment:
      "7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c",
    claimedReturnBps: 1105,
    returnPercent: 11.05,
    epoch: 10,
    vaultBalance: 975_000n,
    proofPassed: true,
    isVerified: true,
  },
  {
    rank: 6,
    agentId: "f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7",
    agentName: "VegaStrat",
    proofCommitment:
      "2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e",
    claimedReturnBps: 488,
    returnPercent: 4.88,
    epoch: 9,
    vaultBalance: 320_000n,
    proofPassed: true,
    isVerified: true,
  },
  {
    rank: 7,
    agentId: "a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8",
    agentName: "GhostTrader",
    proofCommitment: "0".repeat(64),
    claimedReturnBps: 0,
    returnPercent: 0,
    epoch: 8,
    vaultBalance: 50_000n,
    proofPassed: false,
    isVerified: false,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Mock proof histories per agent
// ─────────────────────────────────────────────────────────────────────────────

const now = Math.floor(Date.now() / 1000);
const DAY = 86400;

export const MOCK_PROOF_HISTORIES: Record<string, ProofHistoryItem[]> = {
  a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2: [
    {
      epoch: 12,
      threshold: 3500,
      passed: true,
      commitment:
        "3f7e2d1c4b5a6978b0d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5",
      timestamp: now - 1 * DAY,
      txHash: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
    },
    {
      epoch: 11,
      threshold: 2000,
      passed: true,
      commitment:
        "1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b",
      timestamp: now - 8 * DAY,
      txHash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
    },
    {
      epoch: 10,
      threshold: 1500,
      passed: true,
      commitment:
        "9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a0f9e8d",
      timestamp: now - 15 * DAY,
      txHash: "0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef",
    },
    {
      epoch: 9,
      threshold: 3000,
      passed: false,
      commitment:
        "5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d",
      timestamp: now - 22 * DAY,
    },
    {
      epoch: 8,
      threshold: 1000,
      passed: true,
      commitment:
        "7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c",
      timestamp: now - 29 * DAY,
    },
  ],
  b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3: [
    {
      epoch: 12,
      threshold: 2500,
      passed: true,
      commitment:
        "1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b",
      timestamp: now - 2 * DAY,
    },
    {
      epoch: 11,
      threshold: 2000,
      passed: true,
      commitment:
        "9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a0f9e8d",
      timestamp: now - 9 * DAY,
    },
    {
      epoch: 10,
      threshold: 2000,
      passed: false,
      commitment: "0".repeat(64),
      timestamp: now - 16 * DAY,
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Mock epoch return data for charts
// ─────────────────────────────────────────────────────────────────────────────

export interface EpochReturn {
  epoch: number;
  returnBps: number;
  cumulativeBps: number;
}

export const MOCK_EPOCH_RETURNS: Record<string, EpochReturn[]> = {
  a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2: [
    { epoch: 1, returnBps: 320, cumulativeBps: 320 },
    { epoch: 2, returnBps: 180, cumulativeBps: 500 },
    { epoch: 3, returnBps: 415, cumulativeBps: 915 },
    { epoch: 4, returnBps: -120, cumulativeBps: 795 },
    { epoch: 5, returnBps: 530, cumulativeBps: 1325 },
    { epoch: 6, returnBps: 290, cumulativeBps: 1615 },
    { epoch: 7, returnBps: 480, cumulativeBps: 2095 },
    { epoch: 8, returnBps: 350, cumulativeBps: 2445 },
    { epoch: 9, returnBps: -210, cumulativeBps: 2235 },
    { epoch: 10, returnBps: 612, cumulativeBps: 2847 },
    { epoch: 11, returnBps: 480, cumulativeBps: 3327 },
    { epoch: 12, returnBps: 520, cumulativeBps: 3847 },
  ],
  b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3: [
    { epoch: 1, returnBps: 210, cumulativeBps: 210 },
    { epoch: 2, returnBps: 340, cumulativeBps: 550 },
    { epoch: 3, returnBps: -80, cumulativeBps: 470 },
    { epoch: 4, returnBps: 450, cumulativeBps: 920 },
    { epoch: 5, returnBps: 310, cumulativeBps: 1230 },
    { epoch: 6, returnBps: 280, cumulativeBps: 1510 },
    { epoch: 7, returnBps: -150, cumulativeBps: 1360 },
    { epoch: 8, returnBps: 420, cumulativeBps: 1780 },
    { epoch: 9, returnBps: 390, cumulativeBps: 2170 },
    { epoch: 10, returnBps: -90, cumulativeBps: 2080 },
    { epoch: 11, returnBps: 430, cumulativeBps: 2510 },
    { epoch: 12, returnBps: 403, cumulativeBps: 2913 },
  ],
};
