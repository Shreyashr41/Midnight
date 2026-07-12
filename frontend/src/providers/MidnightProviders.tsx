import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type {
  MidnightDAppConnector,
  WalletProvider,
  ProofProvider,
} from "../types/midnight";
import type { WalletConnectionState } from "../types/contract";

// ─────────────────────────────────────────────────────────────────────────────
// Context shape
// ─────────────────────────────────────────────────────────────────────────────

interface MidnightWalletContextValue {
  address: string | null;
  balance: bigint | null;
  networkId: string | null;
  connectionState: WalletConnectionState;
  error: string | null;
  isConnected: boolean;
  walletProvider: WalletProvider | null;
  proofProvider: ProofProvider | null;
  connector: MidnightDAppConnector | null;
  connect: () => Promise<void>;
  disconnect: () => void;
}

const MidnightWalletContext = createContext<MidnightWalletContextValue | null>(
  null
);

// ─────────────────────────────────────────────────────────────────────────────
// Provider component
// ─────────────────────────────────────────────────────────────────────────────

interface MidnightProvidersProps {
  children: ReactNode;
}

export function MidnightProviders({ children }: MidnightProvidersProps) {
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<bigint | null>(null);
  const [networkId, setNetworkId] = useState<string | null>(null);
  const [connectionState, setConnectionState] =
    useState<WalletConnectionState>("disconnected");
  const [error, setError] = useState<string | null>(null);
  const [walletProvider, setWalletProvider] = useState<WalletProvider | null>(
    null
  );
  const [proofProvider, setProofProvider] = useState<ProofProvider | null>(
    null
  );
  const [connector, setConnector] = useState<MidnightDAppConnector | null>(
    null
  );

  const connect = useCallback(async () => {
    setError(null);
    setConnectionState("connecting");

    // Check if 1AM is installed
    const wallet1AM = window.midnight?.["1am"];
    if (!wallet1AM) {
      setConnectionState("not_installed");
      setError(
        "1AM wallet is not installed. Please install it from https://1am.xyz"
      );
      return;
    }

    try {
      // Request connection via DApp Connector API v4
      const dappConnector = await wallet1AM.enable();

      const [addr, bal, netId, wp, pp] = await Promise.all([
        dappConnector.getAddress(),
        dappConnector.getBalance(),
        dappConnector.getNetworkId(),
        dappConnector.getWalletProvider(),
        dappConnector.getProofProvider(),
      ]);

      setConnector(dappConnector);
      setAddress(addr);
      setBalance(bal);
      setNetworkId(netId);
      setWalletProvider(wp);
      setProofProvider(pp);
      setConnectionState("connected");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to connect wallet";
      if (message.toLowerCase().includes("user rejected")) {
        setError("Connection rejected by user.");
      } else if (message.toLowerCase().includes("network")) {
        setError(
          "Network mismatch. Please switch 1AM to the correct Midnight network."
        );
      } else {
        setError(message);
      }
      setConnectionState("error");
    }
  }, []);

  const disconnect = useCallback(() => {
    setAddress(null);
    setBalance(null);
    setNetworkId(null);
    setConnector(null);
    setWalletProvider(null);
    setProofProvider(null);
    setConnectionState("disconnected");
    setError(null);
  }, []);

  const value: MidnightWalletContextValue = {
    address,
    balance,
    networkId,
    connectionState,
    error,
    isConnected: connectionState === "connected",
    walletProvider,
    proofProvider,
    connector,
    connect,
    disconnect,
  };

  return (
    <MidnightWalletContext.Provider value={value}>
      {children}
    </MidnightWalletContext.Provider>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────────────────────────────────────

export function use1AMWallet(): MidnightWalletContextValue {
  const ctx = useContext(MidnightWalletContext);
  if (!ctx) {
    throw new Error("use1AMWallet must be used within <MidnightProviders>");
  }
  return ctx;
}
