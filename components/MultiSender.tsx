'use client';

import { useState, Fragment, ReactNode, useEffect } from 'react';
import { useWriteContract, useWaitForTransactionReceipt, useAccount, useReadContract } from 'wagmi';
import { parseUnits, formatEther } from 'viem';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { FileUpload } from '@/components/FileUpload';
import { MULTI_SENDER_CONTRACT } from '@/lib/contracts';
import { Send, Users, DollarSign, AlertCircle, CheckCircle, Upload, FileText } from 'lucide-react';

interface Recipient {
  address: string;
  amount: string;
}

const formatFeeDisplay = (fee: bigint) => {
  if (fee === 1n) return '1 wei';
  return `${fee.toString()} wei (${formatEther(fee)} BNB)`;
};


export function MultiSender() {
  const { address } = useAccount();
  const [tokenAddress, setTokenAddress] = useState('');
  const [sendMode, setSendMode] = useState<'same' | 'different'>('same');
  const [inputMode, setInputMode] = useState<'manual' | 'file'>('manual');
  const [sameAmount, setSameAmount] = useState('');
  const [recipients, setRecipients] = useState<Recipient[]>([
    { address: '', amount: '' },
  ]);
  const [fileError, setFileError] = useState<string>('');
  const [currentStep, setCurrentStep] = useState<'approve' | 'send'>('approve');
  const [approvalHash, setApprovalHash] = useState<string>('');

  // Get fee information
  const { data: feeData } = useReadContract({
    address: MULTI_SENDER_CONTRACT.address,
    abi: MULTI_SENDER_CONTRACT.abi,
    functionName: 'getFee',
  });

  const { writeContract, data: hash, isPending, error: writeError } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  // Separate hook for approval transaction
  const { writeContract: writeApproval, data: approvalTxHash, isPending: isApprovalPending, error: approvalError } = useWriteContract();
  const { isLoading: isApprovalConfirming, isSuccess: isApprovalSuccess } = useWaitForTransactionReceipt({
    hash: approvalTxHash,
  });

  // Add useEffect for error handling
  useEffect(() => {
    if (writeError) {
      console.error('Write contract error:', writeError);
      alert('Contract error: ' + writeError.message);
    }
    if (approvalError) {
      console.error('Approval error:', approvalError);
      alert('Approval error: ' + approvalError.message);
    }
  }, [writeError, approvalError]);

  // Switch to send step when approval is successful
  useEffect(() => {
    if (isApprovalSuccess && approvalTxHash) {
      setCurrentStep('send');
      setApprovalHash(approvalTxHash);
    }
  }, [isApprovalSuccess, approvalTxHash]);

  const addRecipient = () => {
    setRecipients([...recipients, { address: '', amount: '' }]);
  };

  const removeRecipient = (index: number) => {
    if (recipients.length > 1) {
      setRecipients(recipients.filter((_, i) => i !== index));
    }
  };

  const updateRecipient = (index: number, field: 'address' | 'amount', value: string) => {
    const updated = [...recipients];
    updated[index][field] = value;
    setRecipients(updated);
  };

  // Token approval fonksiyonu
  const handleApprove = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!tokenAddress) {
      alert('Enter token address');
      return;
    }

    const validRecipients = recipients.filter(r => {
      if (!r.address) return false;
      if (sendMode === 'same') return true;
      return r.amount && parseFloat(r.amount) > 0;
    });
    
    if (validRecipients.length === 0) {
      alert('Enter at least one valid recipient');
      return;
    }

    if (sendMode === 'same' && !sameAmount) {
      alert('Enter amount to send');
      return;
    }

    try {
      // Calculate total amount
      let totalAmount: bigint;
      
      if (sendMode === 'same') {
        const singleAmount = parseUnits(sameAmount, 18);
        totalAmount = singleAmount * BigInt(validRecipients.length);
      } else {
        const amounts = validRecipients.map(r => parseUnits(r.amount, 18));
        totalAmount = amounts.reduce((sum, amount) => sum + amount, BigInt(0));
      }

      console.log('Approving total amount:', totalAmount.toString());

      // ERC20 approve function ABI
      const erc20ApproveAbi = [
        {
          name: 'approve',
          type: 'function',
          stateMutability: 'nonpayable',
          inputs: [
            { name: 'spender', type: 'address' },
            { name: 'amount', type: 'uint256' }
          ],
          outputs: [{ name: '', type: 'bool' }]
        }
      ];

      writeApproval({
        address: tokenAddress as `0x${string}`,
        abi: erc20ApproveAbi,
        functionName: 'approve',
        args: [MULTI_SENDER_CONTRACT.address, totalAmount],
      });

    } catch (error) {
      console.error('Approval error:', error);
      alert('Error occurred during approval');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Form submitted:', { tokenAddress, sendMode, sameAmount, recipients });
    
    if (!tokenAddress) {
      alert('Enter token address');
      return;
    }

    const validRecipients = recipients.filter(r => {
      if (!r.address) return false;
      if (sendMode === 'same') return true; // Amount control not needed in same amount mode
      return r.amount && parseFloat(r.amount) > 0; // Amount required in different amounts mode
    });
    
    console.log('Valid recipients:', validRecipients);
    
    if (validRecipients.length === 0) {
      alert('Enter at least one valid recipient');
      return;
    }

    if (sendMode === 'same' && !sameAmount) {
      alert('Enter amount to send');
      return;
    }

    try {
      const addresses = validRecipients.map(r => r.address as `0x${string}`);
      const fee = feeData as bigint || BigInt(0);

      console.log('Contract call params:', {
        addresses,
        fee: fee.toString(),
        sendMode,
        contractAddress: MULTI_SENDER_CONTRACT.address
      });

      if (sendMode === 'same') {
        const amount = parseUnits(sameAmount, 18);
        console.log('Calling sendSameAmount with amount:', amount.toString());
        
        writeContract({
          address: MULTI_SENDER_CONTRACT.address,
          abi: MULTI_SENDER_CONTRACT.abi,
          functionName: 'sendSameAmount',
          args: [tokenAddress as `0x${string}`, addresses, amount],
          value: fee,
        });
      } else {
        const amounts = validRecipients.map(r => parseUnits(r.amount, 18));
        console.log('Calling sendDifferentAmounts with amounts:', amounts.map(a => a.toString()));
        
        writeContract({
          address: MULTI_SENDER_CONTRACT.address,
          abi: MULTI_SENDER_CONTRACT.abi,
          functionName: 'sendDifferentAmounts',
          args: [tokenAddress as `0x${string}`, addresses, amounts],
          value: fee,
        });
      }
    } catch (error) {
      console.error('Send error:', error);
      alert('Error occurred while sending tokens');
    }
  };

  const handleFileRecipientsLoaded = (loadedRecipients: Recipient[]) => {
    setRecipients(loadedRecipients);
    // Switch to different mode if file has amount info, otherwise stay in same mode
    const hasAmounts = loadedRecipients.some(r => r.amount && parseFloat(r.amount) > 0);
    if (hasAmounts) {
      setSendMode('different');
    }
    setFileError('');
  };

  const handleFileError = (error: string) => {
    setFileError(error);
  };

  const resetForm = () => {
    setTokenAddress('');
    setSameAmount('');
    setRecipients([{ address: '', amount: '' }]);
    setFileError('');
    setInputMode('manual');
    setCurrentStep('approve');
    setApprovalHash('');
  };

  if (isSuccess) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="text-center py-12">
          <div className="mb-6">
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto animate-bounce-slow" />
          </div>
          <h3 className="gradient-text text-2xl font-bold mb-4">Send Successful! 🎉</h3>
          <p className="text-gray-300 mb-6">
            Tokens successfully sent to {recipients.filter(r => r.address).length} recipients.
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          )}
          
          <Button onClick={resetForm} variant="primary">
            New Send
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {/* Send Mode Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Send Mode</CardTitle>
          <CardDescription>
            Do you want to send the same amount or different amounts?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => setSendMode('same')}
              className={`p-4 rounded-lg border-2 transition-all duration-300 text-left ${
                sendMode === 'same'
                  ? 'border-primary-500 bg-primary-500/10 glow-effect'
                  : 'border-dark-700 hover:border-primary-500/50'
              }`}
            >
              <div className="flex items-center space-x-3 mb-3">
                <DollarSign className="w-6 h-6 text-primary-400" />
                <h3 className="font-semibold text-white">Same Amount</h3>
              </div>
              <p className="text-gray-400 text-sm">
                Send the same amount of tokens to all recipients
              </p>
            </button>

            <button
              onClick={() => setSendMode('different')}
              className={`p-4 rounded-lg border-2 transition-all duration-300 text-left ${
                sendMode === 'different'
                  ? 'border-primary-500 bg-primary-500/10 glow-effect'
                  : 'border-dark-700 hover:border-primary-500/50'
              }`}
            >
              <div className="flex items-center space-x-3 mb-3">
                <Users className="w-6 h-6 text-primary-400" />
                <h3 className="font-semibold text-white">Different Amounts</h3>
              </div>
              <p className="text-gray-400 text-sm">
                Send different amounts to each recipient
              </p>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Input Mode Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Input Method</CardTitle>
          <CardDescription>
            Choose how you want to add recipients
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => setInputMode('manual')}
              className={`p-4 rounded-lg border-2 transition-all duration-300 text-left ${
                inputMode === 'manual'
                  ? 'border-primary-500 bg-primary-500/10 glow-effect'
                  : 'border-dark-700 hover:border-primary-500/50'
              }`}
            >
              <div className="flex items-center space-x-3 mb-3">
                <Users className="w-6 h-6 text-primary-400" />
                <h3 className="font-semibold text-white">Manual Entry</h3>
              </div>
              <p className="text-gray-400 text-sm">
                Add recipients manually one by one
              </p>
            </button>

            <button
              onClick={() => setInputMode('file')}
              className={`p-4 rounded-lg border-2 transition-all duration-300 text-left ${
                inputMode === 'file'
                  ? 'border-primary-500 bg-primary-500/10 glow-effect'
                  : 'border-dark-700 hover:border-primary-500/50'
              }`}
            >
              <div className="flex items-center space-x-3 mb-3">
                <Upload className="w-6 h-6 text-primary-400" />
                <h3 className="font-semibold text-white">File Upload</h3>
              </div>
              <p className="text-gray-400 text-sm">
                Upload CSV/TXT file with addresses and amounts
              </p>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Send Form */}
      <Card>
        <CardHeader>
          <CardTitle>Token Transfer</CardTitle>
          <CardDescription>
            Enter token address and recipient information
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Step indicator */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div className={`flex items-center space-x-2 ${
                currentStep === 'approve' ? 'text-primary-400' : 
                isApprovalSuccess ? 'text-green-400' : 'text-gray-500'
              }`}>
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                  currentStep === 'approve' ? 'border-primary-400 bg-primary-500/10' : 
                  isApprovalSuccess ? 'border-green-400 bg-green-500/10' : 'border-gray-500'
                }`}>
                  {isApprovalSuccess ? '✓' : '1'}
                </div>
                <span className="font-medium">Approve Token</span>
              </div>
              
              <div className={`w-12 h-0.5 ${isApprovalSuccess ? 'bg-green-400' : 'bg-gray-600'}`}></div>
              
              <div className={`flex items-center space-x-2 ${
                currentStep === 'send' ? 'text-primary-400' : 
                isSuccess ? 'text-green-400' : 'text-gray-500'
              }`}>
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                  currentStep === 'send' ? 'border-primary-400 bg-primary-500/10' : 
                  isSuccess ? 'border-green-400 bg-green-500/10' : 'border-gray-500'
                }`}>
                  {isSuccess ? '✓' : '2'}
                </div>
                <span className="font-medium">Send Tokens</span>
              </div>
            </div>
          </div>

          <form onSubmit={currentStep === 'approve' ? handleApprove : handleSubmit} className="space-y-6">
            {/* Token Adresi */}
            <Input
              label="Token Address"
              placeholder="0x..."
              value={tokenAddress}
              onChange={(e) => setTokenAddress(e.target.value)}
              required
            />

            {/* Same Amount Mode */}
            <div>
              {sendMode === 'same' && (
                <Input
                  label="Amount to Send (For each recipient)"
                  type="number"
                  placeholder="e.g: 100"
                  value={sameAmount}
                  onChange={(e) => setSameAmount(e.target.value)}
                  required
                />
              )}
            </div>

            {/* Recipients */}
            <div className="space-y-4">
              {inputMode === 'file' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-4">
                    Upload Recipients File
                  </label>
                  <FileUpload
                    onRecipientsLoaded={handleFileRecipientsLoaded}
                    onError={handleFileError}
                  />
                  {fileError && (
                    <div className="mt-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <AlertCircle className="w-4 h-4 text-red-400" />
                        <span className="text-red-400 text-sm">{fileError}</span>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="block text-sm font-medium text-gray-300">
                      Recipients ({recipients.filter(r => r.address).length})
                    </label>
                    <Button type="button" onClick={addRecipient} variant="secondary" size="sm">
                      Add Recipient
                    </Button>
                  </div>
                </div>
              )}

              {/* Manual Recipients Input */}
              {inputMode === 'manual' && recipients.map((recipient, index) => (
                <div key={index} className="flex space-x-3 items-end">
                  <div className="flex-1">
                    <Input
                      placeholder="Recipient address (0x...)"
                      value={recipient.address}
                      onChange={(e) => updateRecipient(index, 'address', e.target.value)}
                    />
                  </div>
                  
                  {sendMode === 'different' && (
                    <div className="w-32">
                      <Input
                        type="number"
                        placeholder="Amount"
                        value={recipient.amount}
                        onChange={(e) => updateRecipient(index, 'amount', e.target.value)}
                      />
                    </div>
                  )}

                  {recipients.length > 1 && (
                    <Button
                      type="button"
                      onClick={() => removeRecipient(index)}
                      variant="ghost"
                      size="sm"
                      className="text-red-400 hover:text-red-300"
                    >
                      Delete
                    </Button>
                  )}
                </div>
              ))}

              {/* File Recipients Summary */}
              {inputMode === 'file' && recipients.length > 0 && recipients[0].address && (
                <div className="mt-4 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-green-400 font-medium">
                      {recipients.length} Recipients Loaded
                    </span>
                  </div>
                  <div className="max-h-32 overflow-y-auto space-y-1">
                    {recipients.slice(0, 5).map((recipient, index) => (
                      <div key={index} className="text-sm text-gray-300 font-mono">
                        {recipient.address.slice(0, 10)}...{recipient.address.slice(-8)} → {recipient.amount}
                      </div>
                    ))}
                    {recipients.length > 5 && (
                      <div className="text-sm text-gray-400">
                        ... and {recipients.length - 5} more recipients
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Approval Success Message */}
            {isApprovalSuccess && currentStep === 'send' && (
              <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-green-400 font-medium">Token Approved Successfully!</span>
                </div>
                <p className="text-gray-300 text-sm mt-1">
                  You can now proceed to send tokens to recipients.
                </p>
              </div>
            )}

            {/* Fee Information */}
            {feeData && currentStep === 'send' && (
              <div className="p-4 bg-primary-500/10 border border-primary-500/30 rounded-lg">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5 text-primary-400" />
                  <span className="text-primary-400 font-medium">Transaction Fee</span>
                </div>
                <p className="text-gray-300 text-sm mt-1">
                  {formatFeeDisplay(feeData as bigint)} fee will be paid for this transaction.
                </p>
              </div>
            )}

            <div className="flex justify-end">
              <Button
                type="submit"
                loading={
                  currentStep === 'approve' 
                    ? (isApprovalPending || isApprovalConfirming)
                    : (isPending || isConfirming)
                }
                disabled={!address || (currentStep === 'send' && !isApprovalSuccess)}
                className="min-w-[200px]"
              >
                {currentStep === 'approve' ? (
                  isApprovalPending ? 'Waiting for Approval...' :
                  isApprovalConfirming ? 'Confirming Approval...' :
                  'Approve Token'
                ) : (
                  isPending ? 'Waiting for Transaction...' :
                  isConfirming ? 'Confirming Transaction...' :
                  'Send Tokens'
                )}
              </Button>
            </div>
          </form>

          {!address && (
            <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <p className="text-yellow-400 text-sm">
                Please connect your wallet to send tokens.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
