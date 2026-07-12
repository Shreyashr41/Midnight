# Alpha Vault 🔐

> **Privacy-Preserving AI Trading Agent Leaderboard on Midnight**
>
> AI trading agents prove their performance with zero-knowledge proofs — without revealing a single trade.

[![Built on Midnight](https://img.shields.io/badge/built%20on-Midnight-00d4ff?style=flat-square)](https://midnight.network)
[![Wallet: 1AM](https://img.shields.io/badge/wallet-1AM-8b5cf6?style=flat-square)](https://1am.xyz)
[![License: MIT](https://img.shields.io/badge/license-MIT-green?style=flat-square)](LICENSE)

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        ALPHA VAULT MVP                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ┌──────────────┐        ┌─────────────────────────────────┐   │
│   │  Trading Bot │        │       React Frontend             │   │
│   │  (bot/)      │        │       (frontend/)                │   │
│   │              │        │                                  │   │
│   │  MockPrice   │        │  WalletConnect ──► 1AM Wallet    │   │
│   │  Feed        │        │  Leaderboard   ◄── IndexerAPI    │   │
│   │  (sine+noise)│        │  AgentDetail   ◄── ContractAPI   │   │
│   └──────┬───────┘        └──────────┬──────────────────────┘   │
│          │ commitTrade()             │ FetchZkConfigProvider     │
│          │ proveThreshold()          │ (loads .prover/.verifier  │
│          ▼                          │  from /public/contract/)   │
│   ┌──────────────────────────────────────────────────────────┐  │
│   │              Midnight Blockchain                          │  │
│   │                                                          │  │
│   │   ┌─────────────────────────────────────────────────┐   │  │
│   │   │      alpha_vault.compact  (Compact Contract)    │   │  │
│   │   │                                                 │   │  │
│   │   │  PRIVATE (witness, never on-chain):             │   │  │
│   │   │    agent_trade_log: Vector<TradeEntry, 256>     │   │  │
│   │   │    trade_commitment: Bytes<32>                  │   │  │
│   │   │                                                 │   │  │
│   │   │  PUBLIC CIRCUITS:                               │   │  │
│   │   │    commit_trade(agentId, entry, name)           │   │  │
│   │   │      -> updates commitment only                 │   │  │
│   │   │    prove_threshold(agentId, epoch, threshold)   │   │  │
│   │   │      -> asserts cumulative return >= threshold  │   │  │
│   │   │      -> writes {epoch, threshold, passed, cmmt} │   │  │
│   │   │      -> NEVER writes raw trades                 │   │  │
│   │   │    deposit(agentId, amount)                     │   │  │
│   │   │    withdraw(agentId, amount)                    │   │  │
│   │   │                                                 │   │  │
│   │   │  PUBLIC LEDGER STATE:                           │   │  │
│   │   │    leaderboard: Map<Bytes<32>, LeaderboardEntry>│   │  │
│   │   │    agent_count: Uint<32>                        │   │  │
│   │   └─────────────────────────────────────────────────┘   │  │
│   │                                                          │  │
│   │   ┌──────────────┐    ┌──────────────┐                  │  │
│   │   │ Proof Server │    │   Devnet     │                  │  │
│   │   │ :6300        │    │   :9944      │                  │  │
│   │   │ (Docker)     │    │   (Docker)   │                  │  │
│   │   └──────────────┘    └──────────────┘                  │  │
│   └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## How ZK Proofs Work Here

### The Problem
A trading agent wants to prove it achieved a 25% return this month. But if it reveals its trade history to prove this, it gives away its strategy — which competitors would immediately copy.

### The Midnight Solution

**Step 1: Private Trade Commitment**
```
Agent calls commit_trade(agentId, entry)
  entry = { timestamp, return_bps, asset_id }  <- NEVER appears on-chain

The circuit:
  new_commitment = sha256(old_commitment || entry_bytes)
  ledger.leaderboard[agentId].proof_commitment = new_commitment

On-chain: Only the updated hash is stored. Raw trade data stays in the witness.
```

**Step 2: ZK Threshold Proof**
```
Agent calls prove_threshold(agentId, epoch, threshold_bps=2500)

The circuit (executed as a ZK proof):
  private witness: trade_log = [all trades this epoch]

  cumulative = sum(t.return_bps for t in trade_log)
  assert(cumulative >= threshold_bps)  <- circuit fails if false

  if assertion passes, writes to public state:
    { epoch: 5, threshold: 2500, passed: true, commitment: "0x3f7e..." }

Verifiers can check: "The proof is valid" -- but cannot learn the trades.
```

**Step 3: Leaderboard Entry**
```
Public state contains ONLY:
  { proof_commitment, claimed_return_bps, epoch, vault_balance, proof_passed }

Rankings are sorted by claimed_return_bps WHERE proof_passed = true.
Self-reported numbers with proof_passed = false are ignored.
```

This is what Midnight is uniquely suited for: **verifiable claims about private data.**

---

## Demo Mode (No Chain Required)

The frontend supports `VITE_USE_MOCK_DATA=true` which shows the full UI with realistic mock data.

```bash
cd frontend
VITE_USE_MOCK_DATA=true pnpm dev
```

A **DEMO MODE** banner appears in the UI when active.

---

## Quick Start

### Prerequisites

| Tool | Version | Install |
|------|---------|---------|
| Node.js | >= 20 | https://nodejs.org |
| pnpm | >= 9 | `npm i -g pnpm` |
| Docker | latest | https://docker.com |
| 1AM Wallet | latest | https://1am.xyz |
| Compact CLI | latest | https://docs.midnight.network/getting-started/installation |

### Automated Setup

```bash
git clone https://github.com/Shreyashr41/Midnight
cd Midnight
bash scripts/setup.sh
```

### Manual Steps

```bash
# 1. Install dependencies
pnpm install

# 2. Start local devnet + proof server
docker compose up -d

# 3. Compile the Compact contract
pnpm compile-contract

# 4. Copy ZK artifacts to frontend public folder
pnpm copy-artifacts

# 5. Start frontend
cd frontend
pnpm dev
# Open http://localhost:3000
```

### Demo Mode (no chain)

```bash
cd frontend
VITE_USE_MOCK_DATA=true pnpm dev
```

---

## Build Order Checklist

Follow this order to avoid debugging headaches:

- [ ] **Toolchain verify**: `compact --version` works
- [ ] **Docker up**: `docker compose up -d` -- proof-server :6300, devnet :9944
- [ ] **Contract compile**: `pnpm compile-contract` -- no errors
- [ ] **Artifacts copy**: `pnpm copy-artifacts` -- files appear in `frontend/public/contract/alpha_vault/`
- [ ] **1AM install**: Browser extension installed at https://1am.xyz
- [ ] **Frontend up**: `pnpm dev` (or with `VITE_USE_MOCK_DATA=true`)
- [ ] **Wallet connect**: Click "Connect 1AM Wallet" -> approve in extension
- [ ] **Leaderboard loads**: Verify rankings appear
- [ ] **Agent detail**: Click an agent -> proof history + chart
- [ ] **Deposit/Withdraw**: Try vault operations (requires wallet)
- [ ] **Bot run**: `cd bot && pnpm dev` -- watch commitTrade + proveThreshold in logs

---

## Project Structure

```
alpha-vault/
├── contract/
│   ├── src/
│   │   └── alpha_vault.compact     <- ZK smart contract
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   └── contract/alpha_vault/   <- compiled ZK artifacts (after copy-artifacts)
│   └── src/
│       ├── types/                  <- TypeScript types + Window.midnight augmentation
│       ├── providers/              <- MidnightProviders (1AM), ZkConfigProvider
│       ├── hooks/                  <- useLeaderboard, useAgentVault, useProofHistory
│       ├── contract/               <- AlphaVaultAPI.ts wrapper
│       ├── pages/                  <- WalletConnect, Leaderboard, AgentDetail
│       ├── components/
│       │   ├── ui/                 <- GlassCard, ProofBadge, StatCard, etc.
│       │   ├── leaderboard/        <- Table, Row, Filters
│       │   ├── agent/              <- Timeline, Chart, VaultPanel, Header
│       │   └── layout/             <- Navbar, Layout, Footer
│       └── mock/                   <- mockData.ts (VITE_USE_MOCK_DATA=true)
│
├── bot/
│   └── src/
│       ├── agent.ts                <- main trading bot loop
│       ├── mockPriceFeed.ts        <- sine-wave + noise price generator
│       └── contractClient.ts       <- contract interaction (server-side)
│
├── scripts/
│   ├── setup.sh                    <- full dev environment setup
│   └── copy-artifacts.sh           <- contract -> frontend/public
│
├── docker-compose.yml              <- proof-server + devnet
└── package.json                    <- pnpm workspaces root
```

---

## Environment Variables

### Frontend (`frontend/.env.local`)

```env
VITE_USE_MOCK_DATA=true
VITE_CONTRACT_ADDRESS=0x...
VITE_NETWORK_ID=devnet
VITE_INDEXER_URL=http://localhost:8080/api/v1/graphql
VITE_PROOF_SERVER_URL=http://localhost:6300
VITE_ZK_ARTIFACTS_URL=/contract/alpha_vault
```

### Bot (`bot/.env`)

```env
CONTRACT_ADDRESS=0x...
AGENT_ID=a1b2c3d4...
AGENT_NAME=AlphaBot
PROOF_SERVER_URL=http://localhost:6300
INTERVAL_MS=30000
PROVE_EVERY_N_TRADES=10
THRESHOLD_BPS=1000
NETWORK_ID=devnet
```

---

## Open Questions / Compact Syntax to Verify

Items marked `[VERIFY]` in `contract/src/alpha_vault.compact`:

| Item | Notes |
|------|-------|
| `pragma language_version` | Check exact syntax |
| `import CompactStandardLibrary` | May be implicit |
| `sha256()` built-in | Could be `poseidon`, `blake2`, or `hash` |
| `++` concat operator | Check concatenation syntax |
| `Vector<T, N>` + `length()` | Check iteration primitives |
| `assert(cond)` | May be `require`, `ensure`, or `constraint` |
| Map `??` default | Check nullable map access |
| `as_bytes(T)` | Check primitive-to-bytes cast |
| `pure function` | May just be `function` |
| `witness` declaration | Check private witness form |

---

## Key Design Decisions

- **1AM from day one**: No server-wallet prototype to migrate away from later
- **FetchZkConfigProvider**: Browser-safe, loads artifacts via HTTP (not filesystem)
- **Private state scoped by contract address**: Supports multiple vaults without key collisions
- **Trades never in public state**: The entire value prop depends on this constraint

---

## Screenshots

> _Screenshots to be added after UI polish pass._

---

## Hackathon Submission Notes

**Track**: Midnight Privacy DApp Track

**Core innovation**: Using Midnight's ZK proof primitive for verifiable-but-private trading track records. Traditional leaderboards require self-reporting or full data exposure; Alpha Vault makes neither necessary.

**Demo flow**: Enable `VITE_USE_MOCK_DATA=true` for a full UI walkthrough without a running devnet.

---

## License

MIT
