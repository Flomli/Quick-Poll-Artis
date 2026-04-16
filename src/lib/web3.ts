import { http, createConfig } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';

export const config = createConfig({
  chains: [base, baseSepolia],
  connectors: [injected()],
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http(),
  },
});

// Builder Codes Check-in Contract (Commonly used by developers on Base)
// Note: This is a placeholder, users can update it with the official contract per documentation
export const CHECK_IN_CONTRACT_ADDRESS = '0x60011D447e17D831F413c60521eC636a8E021966';

export const CHECK_IN_ABI = [
  {
    "inputs": [],
    "name": "checkIn",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const;
