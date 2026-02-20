'use client';

import { useState } from 'react';
import { useWriteContract, useWaitForTransactionReceipt, useAccount, useReadContract } from 'wagmi';
import { parseUnits, formatEther } from 'viem';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { TOKEN_FACTORY_CONTRACT, TokenType } from '@/lib/contracts';
import { Coins, Sparkles, Shield, Zap, AlertCircle } from 'lucide-react';

const tokenTypes = [
  {
    type: 'standard' as TokenType,
    name: 'Standard Token',
    description: 'Simple ERC-20 token',
    icon: Coins,
    features: ['Basic transfer', 'Fixed supply'],
  },
  {
    type: 'ownable' as TokenType,
    name: 'Ownable Token',
    description: 'Token with owner control',
    icon: Shield,
    features: ['Owner control', 'Management functions'],
  },
  {
    type: 'mintable' as TokenType,
    name: 'Mintable Token',
    description: 'Token that can mint new tokens',
    icon: Zap,
    features: ['Mint new tokens', 'Dynamic supply'],
  },
];

export function TokenFactory() {
  const { address } = useAccount();
  const [selectedType, setSelectedType] = useState<TokenType>('standard');
  const [formData, setFormData] = useState({
    name: '',
    symbol: '',
    totalSupply: '',
  });

  // Get fee information
  const { data: feeData } = useReadContract({
    address: TOKEN_FACTORY_CONTRACT.address,
    abi: TOKEN_FACTORY_CONTRACT.abi,
    functionName: 'getTokenCreationFee',
  });

  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.symbol || !formData.totalSupply) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const totalSupplyBigInt = parseUnits(formData.totalSupply, 18);
      const fee = feeData as bigint || BigInt(0);
      
      let functionName: string;
      switch (selectedType) {
        case 'standard':
          functionName = 'createStandardERC20';
          break;
        case 'ownable':
          functionName = 'createOwnableERC20';
          break;
        case 'mintable':
          functionName = 'createMintableERC20';
          break;
        default:
          functionName = 'createStandardERC20';
      }

      writeContract({
        address: TOKEN_FACTORY_CONTRACT.address,
        abi: TOKEN_FACTORY_CONTRACT.abi,
        functionName,
        args: [formData.name, formData.symbol, totalSupplyBigInt],
        value: fee,
      });
    } catch (error) {
      console.error('Token creation error:', error);
      alert('Error occurred while creating token');
    }
  };

  const resetForm = () => {
    setFormData({ name: '', symbol: '', totalSupply: '' });
  };

  if (isSuccess) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="text-center py-12">
          <div className="mb-6">
            <Sparkles className="w-16 h-16 text-primary-400 mx-auto animate-bounce-slow" />
          </div>
          <h3 className="gradient-text text-2xl font-bold mb-4">Token Created Successfully! 🎉</h3>
          <p className="text-gray-300 mb-6">
            Your {formData.name} ({formData.symbol}) token has been created on the blockchain.
          </p>
          
          {/* Transaction Hash and Explorer Link */}
          {hash && (
            <div className="mb-6 p-4 bg-dark-800/50 rounded-lg border border-dark-700">
              <p className="text-gray-400 text-sm mb-2">Transaction Hash:</p>
              <p className="text-primary-400 font-mono text-sm break-all mb-3">{hash}</p>
              <a
                href={`https://bscscan.com/tx/${hash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 text-primary-400 hover:text-primary-300 transition-colors"
              >
                <span>View on BscScan</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          )}
          
          <Button onClick={resetForm} variant="primary">
            Create New Token
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {/* Token Type Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Token Type</CardTitle>
          <CardDescription>
            Choose the token type that suits your needs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {tokenTypes.map((tokenType) => {
              const Icon = tokenType.icon;
              return (
                <button
                  key={tokenType.type}
                  onClick={() => setSelectedType(tokenType.type)}
                  className={`p-4 rounded-lg border-2 transition-all duration-300 text-left ${
                    selectedType === tokenType.type
                      ? 'border-primary-500 bg-primary-500/10 glow-effect'
                      : 'border-dark-700 hover:border-primary-500/50'
                  }`}
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <Icon className="w-6 h-6 text-primary-400" />
                    <h3 className="font-semibold text-white">{tokenType.name}</h3>
                  </div>
                  <p className="text-gray-400 text-sm mb-3">{tokenType.description}</p>
                  <ul className="space-y-1">
                    {tokenType.features.map((feature, index) => (
                      <li key={index} className="text-xs text-primary-300">
                        • {feature}
                      </li>
                    ))}
                  </ul>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Token Creation Form */}
      <Card>
        <CardHeader>
          <CardTitle>Token Details</CardTitle>
          <CardDescription>
            Enter token information and create
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Token Name"
                placeholder="e.g: My Token"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <Input
                label="Token Symbol"
                placeholder="e.g: MTK"
                value={formData.symbol}
                onChange={(e) => setFormData({ ...formData, symbol: e.target.value.toUpperCase() })}
                required
              />
            </div>
            
            <Input
              label="Total Supply"
              type="number"
              placeholder="e.g: 1000000"
              value={formData.totalSupply}
              onChange={(e) => setFormData({ ...formData, totalSupply: e.target.value })}
              required
            />

            {/* Fee Information */}
            {feeData && (
              <div className="p-4 bg-primary-500/10 border border-primary-500/30 rounded-lg">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5 text-primary-400" />
                  <span className="text-primary-400 font-medium">Token Creation Fee</span>
                </div>
                <p className="text-gray-300 text-sm mt-1">
                  {formatEther(feeData)} BNB fee will be paid for token creation.
                </p>
              </div>
            )}

            <div className="flex items-center justify-between pt-4">
              <div className="text-sm text-gray-400">
                Selected type: <span className="text-primary-400 font-medium">
                  {tokenTypes.find(t => t.type === selectedType)?.name}
                </span>
              </div>
              
              <Button
                type="submit"
                loading={isPending || isConfirming}
                disabled={!address}
                className="min-w-[150px]"
              >
                {isPending ? 'Waiting for Approval...' : 
                 isConfirming ? 'Confirming Transaction...' : 
                 'Create Token'}
              </Button>
            </div>
          </form>

          {!address && (
            <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <p className="text-yellow-400 text-sm">
                Please connect your wallet to create tokens.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
