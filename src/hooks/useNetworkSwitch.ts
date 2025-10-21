import { useCallback } from 'react';
import { useAccount, useChainId, useSwitchChain } from 'wagmi';
import { CHAIN, NETWORK_INFO, isBaseSepolia } from '@/constants/chain';
import { toast } from 'sonner';

/**
 * Custom hook for network switching functionality
 * Provides methods to switch networks and validate current chain
 */
export function useNetworkSwitch() {
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain, isPending } = useSwitchChain();

  // Check if on correct network
  const isCorrectNetwork = isConnected && isBaseSepolia(chainId);
  const isWrongNetwork = isConnected && !isBaseSepolia(chainId);

  // Switch to Base Sepolia
  const switchToBaseSepolia = useCallback(async () => {
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return false;
    }

    try {
      await switchChain({ chainId: CHAIN.id });
      toast.success(`Switched to ${NETWORK_INFO.name}`);
      return true;
    } catch (error: any) {
      console.error('Failed to switch network:', error);

      // Handle specific error codes
      switch (error.code) {
        case 4001:
          toast.error('Network switch was rejected by user');
          break;
        case 4902:
          toast.error('Base Sepolia not found in wallet. Adding network...');
          await addBaseSepoliaNetwork();
          break;
        case -32002:
          toast.error('Network switch request already pending. Please check your wallet.');
          break;
        default:
          toast.error(`Failed to switch network: ${error.message || 'Unknown error'}`);
      }
      return false;
    }
  }, [isConnected, switchChain]);

  // Add Base Sepolia network to wallet
  const addBaseSepoliaNetwork = useCallback(async () => {
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
        toast.success('Base Sepolia added to wallet successfully!');
        return true;
      } else {
        toast.error('No wallet detected');
        return false;
      }
    } catch (error: any) {
      console.error('Failed to add network:', error);
      toast.error(`Failed to add network: ${error.message || 'Unknown error'}`);
      return false;
    }
  }, []);

  // Ensure on Base Sepolia (auto-switch if wrong network)
  const ensureBaseSepolia = useCallback(async () => {
    if (!isConnected) {
      console.warn('Wallet not connected');
      return false;
    }

    if (isCorrectNetwork) {
      return true;
    }

    console.log('Switching to Base Sepolia...');
    return await switchToBaseSepolia();
  }, [isConnected, isCorrectNetwork, switchToBaseSepolia]);

  // Validate network and throw error if wrong
  const validateNetwork = useCallback(() => {
    if (!isConnected) {
      throw new Error('Wallet not connected');
    }

    if (!isBaseSepolia(chainId)) {
      throw new Error(`Please switch to ${NETWORK_INFO.name} (Chain ID: ${CHAIN.id}) to continue`);
    }

    return true;
  }, [isConnected, chainId]);

  // Get network info for current chain
  const getCurrentNetworkInfo = useCallback(() => {
    if (!chainId) return null;

    if (isBaseSepolia(chainId)) {
      return {
        name: NETWORK_INFO.name,
        chainId: CHAIN.id,
        isTestnet: true,
        currency: NETWORK_INFO.currency,
        rpcUrl: NETWORK_INFO.rpcUrl,
        blockExplorerUrl: NETWORK_INFO.blockExplorerUrl,
        isCorrect: true,
      };
    }

    return {
      name: `Unknown Network (${chainId})`,
      chainId,
      isTestnet: false,
      isCorrect: false,
    };
  }, [chainId]);

  return {
    // State
    isConnected,
    chainId,
    isCorrectNetwork,
    isWrongNetwork,
    isPending,

    // Network info
    currentNetwork: getCurrentNetworkInfo(),
    targetNetwork: {
      name: NETWORK_INFO.name,
      chainId: CHAIN.id,
      isTestnet: true,
      currency: NETWORK_INFO.currency,
      rpcUrl: NETWORK_INFO.rpcUrl,
      blockExplorerUrl: NETWORK_INFO.blockExplorerUrl,
    },

    // Actions
    switchToBaseSepolia,
    addBaseSepoliaNetwork,
    ensureBaseSepolia,
    validateNetwork,
  };
}