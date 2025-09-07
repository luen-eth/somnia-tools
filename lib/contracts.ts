import { CONTRACTS } from './wagmi';
import factoryAbi from '@/contracts/factoryAbi.json';
import multisenderAbi from '@/contracts/multisenderAbi.json';

export const TOKEN_FACTORY_CONTRACT = {
  address: CONTRACTS.TOKEN_FACTORY,
  abi: factoryAbi,
} as const;

export const MULTI_SENDER_CONTRACT = {
  address: CONTRACTS.MULTI_SENDER,
  abi: multisenderAbi,
} as const;

export type TokenType = 'standard' | 'ownable' | 'mintable';

export interface CreateTokenParams {
  name: string;
  symbol: string;
  totalSupply: bigint;
  tokenType: TokenType;
}

export interface SendTokenParams {
  token: string;
  recipients: string[];
  amounts?: bigint[];
  sameAmount?: bigint;
}
