'use client';

import { useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { useFaucet, TokenType } from '@/hooks';
import { FaucetHeader, TokenCard } from './_components';
import { useAccount } from 'wagmi';

export default function FaucetPage() {
  const { address } = useAccount();
  const {
    mintToken,
    isPending,
    isConfirming,
    isSuccess,
    error,
    currentToken,
  } = useFaucet();

  const handleMint = async (tokenType: TokenType, amount: string) => {
    try {
      await mintToken(tokenType, amount);
    } catch (err) {
      console.error('Mint error:', err);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      // Reset success state after 5 seconds
      const timer = setTimeout(() => {
        window.location.reload();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess]);

  if (!address) {
    return (
      <DashboardLayout>
        <div className="max-w-7xl mx-auto px-6 py-8">
          <FaucetHeader />
          <div className="bg-[#111111] rounded-lg p-8 border border-gray-800 text-center">
            <p className="text-gray-400 text-lg">
              Please connect your wallet to use the faucet
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-6 py-8">
        <FaucetHeader />
        
        <div className="mb-6">
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <p className="text-blue-400 text-sm">
              <strong>Note:</strong> This faucet is for testing purposes only on Base Sepolia testnet. 
              You can mint USDC and IDRX tokens to test the platform features.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TokenCard
            tokenType="USDC"
            tokenName="USD Coin"
            tokenSymbol="USDC"
            tokenLogo="/Images/Logo/usdc-logo.png"
            onMint={(amount) => handleMint('USDC', amount)}
            isPending={isPending}
            isConfirming={isConfirming}
            isSuccess={isSuccess}
            error={error}
            isCurrentToken={currentToken === 'USDC'}
          />

          <TokenCard
            tokenType="IDRX"
            tokenName="Indonesian Rupiah X"
            tokenSymbol="IDRX"
            tokenLogo="/Images/Logo/idrx-logo.svg"
            onMint={(amount) => handleMint('IDRX', amount)}
            isPending={isPending}
            isConfirming={isConfirming}
            isSuccess={isSuccess}
            error={error}
            isCurrentToken={currentToken === 'IDRX'}
          />
        </div>

        <div className="mt-8 bg-[#111111] rounded-lg p-6 border border-gray-800">
          <h3 className="text-lg font-semibold text-white mb-4">How to use the faucet</h3>
          <ol className="space-y-2 text-gray-400">
            <li className="flex items-start">
              <span className="text-white font-semibold mr-2">1.</span>
              <span>Connect your wallet to Base Sepolia testnet</span>
            </li>
            <li className="flex items-start">
              <span className="text-white font-semibold mr-2">2.</span>
              <span>Enter the amount of tokens you want to mint or use the quick amount buttons</span>
            </li>
            <li className="flex items-start">
              <span className="text-white font-semibold mr-2">3.</span>
              <span>Click the "Mint" button and confirm the transaction in your wallet</span>
            </li>
            <li className="flex items-start">
              <span className="text-white font-semibold mr-2">4.</span>
              <span>Wait for the transaction to be confirmed on the blockchain</span>
            </li>
            <li className="flex items-start">
              <span className="text-white font-semibold mr-2">5.</span>
              <span>The tokens will appear in your wallet balance</span>
            </li>
          </ol>
        </div>
      </div>
    </DashboardLayout>
  );
}
