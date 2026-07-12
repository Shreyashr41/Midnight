// Window augmentation for the 1AM Midnight wallet extension
// The 1AM extension injects window.midnight['1am'] when installed.

export interface MidnightDAppConnector {
  /** Returns the network the wallet is connected to (e.g., "testnet", "mainnet") */
  getNetworkId(): Promise<string>;
  /** Obtain a WalletProvider for transaction submission */
  getWalletProvider(): Promise<WalletProvider>;
  /** Obtain a ProofProvider for ZK proof generation */
  getProofProvider(): Promise<ProofProvider>;
  /** Returns the active wallet address (bech32) */
  getAddress(): Promise<string>;
  /** Returns the current wallet balance in smallest unit */
  getBalance(): Promise<bigint>;
}

export interface WalletProvider {
  submit(tx: unknown): Promise<string>;
  balanceTransaction(unbalanced: unknown): Promise<unknown>;
}

export interface ProofProvider {
  prove(circuit: string, input: unknown): Promise<unknown>;
}

declare global {
  interface Window {
    midnight?: {
      "1am"?: {
        /** Enable the wallet — returns the DApp connector or throws if user rejects */
        enable(): Promise<MidnightDAppConnector>;
        /** Check if the wallet is already enabled for this origin */
        isEnabled(): Promise<boolean>;
        /** API version string, e.g. "4.0.0" */
        apiVersion: string;
        /** Human-readable wallet name */
        name: string;
        /** Base64-encoded wallet icon (data URI) */
        icon: string;
      };
    };
  }
}
