'use client';

import { useState } from 'react';
import { useConnect, useAccount, useDisconnect } from 'wagmi';
import { Button } from '@/components/ui/button';
import { Wallet, Shield, Zap, LogOut, CheckCircle, Copy, ExternalLink, X, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';

export function WalletComponents() {
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { connectors, connect, isPending } = useConnect();

  // Get available connectors
  const metaMaskConnector = connectors.find(c => c.id === 'metaMaskSDK' || c.id === 'metaMask' || c.name.toLowerCase().includes('metamask'));
  const coinbaseConnector = connectors.find(c => c.id === 'coinbaseWalletSDK' || c.id === 'coinbaseWallet' || c.name.toLowerCase().includes('coinbase'));
  const injectedConnector = connectors.find(c => c.id === 'injected' || c.name.toLowerCase().includes('injected'));

  const handleConnect = (connector: any) => {
    if (!connector) {
      toast.error('Wallet not available. Please install the wallet extension.');
      return;
    }

    connect(
      { connector },
      {
        onSuccess: () => {
          toast.success('Wallet connected successfully!');
          setShowWalletModal(false);
        },
        onError: (error) => {
          console.error('Connection error:', error);
          toast.error(error.message || 'Failed to connect wallet');
        },
      }
    );
  };

  const handleDisconnect = () => {
    disconnect();
    setShowAccountMenu(false);
    toast.info('Wallet disconnected');
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      toast.success('Address copied to clipboard');
    }
  };

  const openInExplorer = () => {
    if (address) {
      window.open(`https://sepolia.basescan.org/address/${address}`, '_blank');
    }
  };

  // If wallet is connected, show account button
  if (isConnected && address) {
    return (
      <div className="relative">
        <Button
          onClick={() => setShowAccountMenu(!showAccountMenu)}
          className="
            bg-gradient-to-r from-green-500/20 to-emerald-500/20
            hover:from-green-500/30 hover:to-emerald-500/30
            text-white font-semibold
            px-6 py-3 rounded-xl
            border border-green-500/50
            shadow-lg hover:shadow-xl
            transition-all duration-300
            flex items-center space-x-2
          "
        >
          <CheckCircle className="w-5 h-5 text-green-400" />
          <span>{formatAddress(address)}</span>
          <ChevronDown className="w-4 h-4 opacity-60" />
        </Button>

        {/* Account Dropdown Menu */}
        {showAccountMenu && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowAccountMenu(false)}
            />
            {/* Menu */}
            <div className="absolute right-0 mt-2 w-64 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl shadow-xl z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-[#2A2A2A]">
                <p className="text-gray-400 text-xs">Connected Account</p>
                <p className="text-white text-sm font-mono mt-1">{formatAddress(address)}</p>
              </div>
              <button
                onClick={copyAddress}
                className="w-full px-4 py-3 text-left text-white hover:bg-[#2A2A2A] transition-colors flex items-center space-x-2"
              >
                <Copy className="w-4 h-4" />
                <span>Copy Address</span>
              </button>
              <button
                onClick={openInExplorer}
                className="w-full px-4 py-3 text-left text-white hover:bg-[#2A2A2A] transition-colors flex items-center space-x-2"
              >
                <ExternalLink className="w-4 h-4" />
                <span>View on Explorer</span>
              </button>
              <div className="border-t border-[#2A2A2A]">
                <button
                  onClick={handleDisconnect}
                  className="w-full px-4 py-3 text-left text-red-400 hover:bg-red-500/20 transition-colors flex items-center space-x-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Disconnect</span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <>
      {/* Connect Wallet Button */}
      <Button
        onClick={() => setShowWalletModal(true)}
        className="
          bg-gradient-to-r from-white to-gray-100
          hover:from-gray-100 hover:to-white
          text-black font-semibold
          px-6 py-3 rounded-xl
          border border-gray-200
          shadow-lg hover:shadow-xl
          transition-all duration-300
          flex items-center space-x-2
        "
      >
        <Wallet className="w-5 h-5" />
        <span>Connect Wallet</span>
      </Button>

      {/* Wallet Selection Modal */}
      {showWalletModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-6 w-full max-w-md mx-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white">Connect Your Wallet</h2>
                <p className="text-gray-400 text-sm mt-1">
                  Choose your preferred wallet to connect to Owna Finance on Base Sepolia
                </p>
              </div>
              <button
                onClick={() => setShowWalletModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              {/* MetaMask - Priority 1 */}
              {metaMaskConnector && (
                <button
                  onClick={() => handleConnect(metaMaskConnector)}
                  disabled={isPending}
                  className="w-full h-20 bg-[#FF6B00]/10 hover:bg-[#FF6B00]/20 border border-[#FF6B00]/30 rounded-xl px-6 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-[#FF6B00] rounded-xl flex items-center justify-center">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-lg text-white">MetaMask</div>
                      <div className="text-sm text-gray-400">Connect with MetaMask extension</div>
                    </div>
                  </div>
                </button>
              )}

              {/* Coinbase Wallet - Priority 2 */}
              {coinbaseConnector && (
                <button
                  onClick={() => handleConnect(coinbaseConnector)}
                  disabled={isPending}
                  className="w-full h-20 bg-[#0052FF]/10 hover:bg-[#0052FF]/20 border border-[#0052FF]/30 rounded-xl px-6 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-[#0052FF] rounded-xl flex items-center justify-center">
                      <Wallet className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-lg text-white">Coinbase Wallet</div>
                      <div className="text-sm text-gray-400">Connect with Coinbase Wallet extension</div>
                    </div>
                  </div>
                </button>
              )}

              {/* Injected Wallet (Any extension) - Priority 3 */}
              {injectedConnector && (
                <button
                  onClick={() => handleConnect(injectedConnector)}
                  disabled={isPending}
                  className="w-full h-20 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 rounded-xl px-6 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-lg text-white">Browser Wallet</div>
                      <div className="text-sm text-gray-400">Connect with any browser extension wallet</div>
                    </div>
                  </div>
                </button>
              )}

              {/* No wallets available message */}
              {!metaMaskConnector && !coinbaseConnector && !injectedConnector && (
                <div className="text-center py-8">
                  <p className="text-gray-400 text-sm">No wallet extensions detected.</p>
                  <p className="text-gray-500 text-xs mt-2">Please install MetaMask or Coinbase Wallet.</p>
                </div>
              )}
            </div>

            {isPending && (
              <div className="text-center text-gray-400 text-sm mt-4 animate-pulse">
                Waiting for wallet connection...
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
