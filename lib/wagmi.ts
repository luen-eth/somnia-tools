import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { defineChain } from 'viem';

// BNB Smart Chain (BSC)
export const bscNetwork = defineChain({
  id: 56,
  name: 'BNB Smart Chain',
  nativeCurrency: {
    decimals: 18,
    name: 'BNB',
    symbol: 'BNB',
  },
  rpcUrls: {
    default: {
      http: ['https://bsc-dataseed.binance.org'],
    },
    public: {
      http: ['https://bsc-dataseed.binance.org'],
    },
  },
  blockExplorers: {
    default: { name: 'BscScan', url: 'https://bscscan.com' },
  },
});

export const config = getDefaultConfig({
  appName: 'Somnia Tools',
  projectId: "8287ebdee5a47780eb6b9335f592886b",
  chains: [bscNetwork],
  ssr: true,
});

// Contract adresleri
export const CONTRACTS = {
  TOKEN_FACTORY: '0xe2e30CefE5685dc632136A748F271D863A783459' as const,
  MULTI_SENDER: '0xbeCE7ce8F9D5e79eC3e59694758326B0FE5d5523' as const,
};
