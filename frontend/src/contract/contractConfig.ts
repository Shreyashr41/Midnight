// Contract deployment address and network configuration.
// Update CONTRACT_ADDRESS after deploying to devnet/testnet.

export const CONTRACT_CONFIG = {
  // Set via VITE_CONTRACT_ADDRESS env var or hardcode after deployment
  address:
    (import.meta.env.VITE_CONTRACT_ADDRESS as string | undefined) ?? "",

  // Network: "devnet" | "testnet" | "mainnet"
  networkId:
    (import.meta.env.VITE_NETWORK_ID as string | undefined) ?? "devnet",

  // Indexer GraphQL endpoint
  indexerUrl:
    (import.meta.env.VITE_INDEXER_URL as string | undefined) ??
    "http://localhost:8080/api/v1/graphql",

  // Local proof server (used by bot/dev tooling; 1AM uses its own prover)
  proofServerUrl:
    (import.meta.env.VITE_PROOF_SERVER_URL as string | undefined) ??
    "http://localhost:6300",

  // Base URL for ZK artifact static files
  zkArtifactsUrl:
    (import.meta.env.VITE_ZK_ARTIFACTS_URL as string | undefined) ??
    "/contract/alpha_vault",
} as const;
