'use client';

import { useEffect, useState } from 'react';
import { useAccount, useChainId, useSwitchChain } from 'wagmi';
import { AlertCircle, RefreshCw, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CHAIN, NETWORK_INFO, isBaseSepolia } from '@/constants/chain';
import { toast } from 'sonner';

export function NetworkSwitch() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain, isPending } = useSwitchChain();
  const [showNetworkAlert, setShowNetworkAlert] = useState(false);

  // Check if user is on wrong network
  const isWrongNetwork = isConnected && !isBaseSepolia(chainId);
  const currentChainName = chainId ? `Chain ${chainId}` : 'Unknown Network';

  // Auto-check network when wallet connects or chain changes
  useEffect(() => {
    if (isWrongNetwork) {
      setShowNetworkAlert(true);
    } else {
      setShowNetworkAlert(false);
    }
  }, [isWrongNetwork]);

  // Function to switch to Base Sepolia
  const handleSwitchNetwork = async () => {
    try {
      await switchChain({ chainId: CHAIN.id });
      toast.success(`Switched to ${NETWORK_INFO.name}`);
      setShowNetworkAlert(false);
    } catch (error: any) {
      console.error('Failed to switch network:', error);

      // Handle common user rejection errors
      if (error.code === 4001) {
        toast.error('Network switch was rejected. Please try again.');
      } else if (error.code === 4902) {
        toast.error('Base Sepolia not found in wallet. Please add it manually.');
        // Provide instructions to add network manually
        handleAddNetwork();
      } else {
        toast.error(`Failed to switch network: ${error.message || 'Unknown error'}`);
      }
    }
  };

  // Function to add Base Sepolia network to wallet
  const handleAddNetwork = async () => {
    try {
      if (typeof window !== 'undefined' && window.ethereum) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: `0x${CHAIN.id.toString(16)}`,
              chainName: NETWORK_INFO.name,
              nativeCurrency: {
                name: NETWORK_INFO.currency.name,
                symbol: NETWORK_INFO.currency.symbol,
                decimals: NETWORK_INFO.currency.decimals,
              },
              rpcUrls: [NETWORK_INFO.rpcUrl],
              blockExplorerUrls: [NETWORK_INFO.blockExplorerUrl],
            },
          ],
        });
        toast.success('Base Sepolia added to wallet!');
      }
    } catch (error: any) {
      console.error('Failed to add network:', error);
      toast.error(`Failed to add network: ${error.message || 'Unknown error'}`);
    }
  };

  // Don't show anything if not connected or on correct network
  if (!isConnected || !isWrongNetwork) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-4 shadow-lg backdrop-blur-sm">
        {/* Alert Header */}
        <div className="flex items-start space-x-3 mb-3">
          <div className="flex-shrink-0">
            <AlertCircle className="w-5 h-5 text-red-400 animate-pulse" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-white">Wrong Network</h3>
            <p className="text-xs text-gray-400 mt-1">
              You are currently on {currentChainName}. Please switch to Base Sepolia to continue.
            </p>
          </div>
        </div>

        {/* Network Info */}
        <div className="bg-red-500/5 rounded-lg p-3 mb-3">
          <div className="flex items-center justify-between text-xs">
            <div>
              <p className="text-gray-400">Current:</p>
              <p className="text-white font-mono">{currentChainName}</p>
            </div>
            <div className="text-right">
              <p className="text-gray-400">Required:</p>
              <p className="text-green-400 font-mono">{NETWORK_INFO.name}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <Button
            onClick={handleSwitchNetwork}
            disabled={isPending}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white text-sm font-medium py-2 px-3 rounded-lg transition-colors flex items-center justify-center space-x-2"
          >
            {isPending ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Switching...</span>
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" />
                <span>Switch Network</span>
              </>
            )}
          </Button>

          <Button
            onClick={handleAddNetwork}
            variant="outline"
            className="bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium py-2 px-3 rounded-lg transition-colors border-gray-600"
          >
            Add Network
          </Button>
        </div>

        {/* Additional Help */}
        <div className="mt-3 pt-3 border-t border-red-500/20">
          <p className="text-xs text-gray-400">
            Need help?{' '}
            <a
              href={NETWORK_INFO.blockExplorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 underline"
            >
              Get test ETH from faucet
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

// Network Status Indicator Component
export function NetworkStatus() {
  const { isConnected } = useAccount();
  const chainId = useChainId();

  if (!isConnected) {
    return null;
  }

  const isCorrectNetwork = isBaseSepolia(chainId);

  return (
    <div className="flex items-center space-x-2 px-3 py-1 rounded-lg bg-gray-800/50 border border-gray-700">
      {isCorrectNetwork ? (
        <>
          <CheckCircle className="w-3 h-3 text-green-400" />
          <span className="text-xs text-green-400 font-medium">{NETWORK_INFO.name}</span>
        </>
      ) : (
        <>
          <AlertCircle className="w-3 h-3 text-red-400" />
          <span className="text-xs text-red-400 font-medium">Wrong Network</span>
        </>
      )}
    </div>
  );
}