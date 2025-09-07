import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { defineChain } from 'viem';

// Somnia Network 
export const somniaNetwork = defineChain({
  id: 5031,
  name: 'Somnia Network',
  nativeCurrency: {
    decimals: 18,
    name: 'SOMI',
    symbol: 'SOMI',
  },
  rpcUrls: {
    default: {
      http: ['https://api.infra.mainnet.somnia.network'],
    },
    public: {
      http: ['https://api.infra.mainnet.somnia.network'],
    },
  },
  blockExplorers: {
    default: { name: 'Somnia Explorer', url: 'https://explorer.somnia.network' },
  },
});

export const config = getDefaultConfig({
  appName: 'Somnia Tools',
  projectId: "8287ebdee5a47780eb6b9335f592886b",
  chains: [somniaNetwork],
  ssr: true,
});

// Contract adresleri
export const CONTRACTS = {
  TOKEN_FACTORY: '0xe2e30CefE5685dc632136A748F271D863A783459' as const,
  MULTI_SENDER: '0xa2c1e54B632e001fF906BEE4A54FB89b7eB37619' as const,
};
