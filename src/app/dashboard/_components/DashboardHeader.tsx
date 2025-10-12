import { useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useDisconnect, useBalance } from 'wagmi';
import { Copy, ExternalLink, LogOut } from 'lucide-react';
import Image from 'next/image';

interface DashboardHeaderProps {
  showWalletDropdown: boolean;
  setShowWalletDropdown: (show: boolean) => void;
}

export function DashboardHeader({ showWalletDropdown, setShowWalletDropdown }: DashboardHeaderProps) {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: balance, isLoading: balanceLoading } = useBalance({
    address: address,
    chainId: 84532,
  });

  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-4xl font-bold text-white tracking-tight">Dashboard</h1>
      <div className="flex items-center space-x-6">
        {isConnected ? (
          <>
            <div className="flex items-center space-x-3">
              <Image
                src="/Images/Logo/eth-logo.svg"
                alt="ETH"
                width={20}
                height={20}
                className="rounded-full"
              />
              <span className="text-white font-medium text-lg">
                {balanceLoading ? '...' : balance ? (parseFloat(balance.value.toString()) / Math.pow(10, balance.decimals)).toFixed(4) : '0.0000'}
              </span>
            </div>
            
            <div className="relative">
              <button
                onClick={() => setShowWalletDropdown(!showWalletDropdown)}
                className="bg-[#1A1A1A]/70 border border-[#2A2A2A] rounded-2xl px-4 py-2 backdrop-blur-sm flex items-center space-x-3 hover:bg-[#2A2A2A]/50 hover:border-[#3A3A3A] transition-all duration-200 cursor-pointer"
              >
                <span className="text-gray-300 font-mono text-sm">
                  {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '0xebFA...4179'}
                </span>
                <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
              </button>

              {showWalletDropdown && (
                <div className="absolute top-full right-0 mt-2 w-64 bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.5)] backdrop-blur-sm z-50">
                  <div className="p-4">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-white font-medium text-sm">Connected Wallet</div>
                        <div className="text-gray-400 text-xs font-mono">
                          {address ? `${address.slice(0, 8)}...${address.slice(-6)}` : '0xebFA...4179'}
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <button
                        onClick={() => {
                          if (address) {
                            navigator.clipboard.writeText(address);
                          }
                          setShowWalletDropdown(false);
                        }}
                        className="w-full flex items-center space-x-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-[#2A2A2A]/50 rounded-xl transition-all duration-200"
                      >
                        <Copy className="w-4 h-4" />
                        <span className="text-sm">Copy Address</span>
                      </button>
                      
                      <button
                        onClick={() => {
                          if (address) {
                            window.open(`https://sepolia.basescan.org/address/${address}`, '_blank');
                          }
                          setShowWalletDropdown(false);
                        }}
                        className="w-full flex items-center space-x-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-[#2A2A2A]/50 rounded-xl transition-all duration-200"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span className="text-sm">View on Explorer</span>
                      </button>
                      
                      <div className="border-t border-[#2A2A2A] my-2"></div>
                      
                      <button
                        onClick={() => {
                          disconnect();
                          setShowWalletDropdown(false);
                        }}
                        className="w-full flex items-center space-x-3 px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-xl transition-all duration-200"
                      >
                        <LogOut className="w-4 h-4" />
                        <span className="text-sm">Disconnect</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="relative">
            <style dangerouslySetInnerHTML={{
              __html: `
                [data-rk] button[data-testid="rk-connect-button"] {
                  background: linear-gradient(135deg, #1A1A1A, #2A2A2A) !important;
                  border: 1px solid #3A3A3A !important;
                  color: #ffffff !important;
                  border-radius: 16px !important;
                  padding: 12px 24px !important;
                  font-weight: 500 !important;
                  font-size: 14px !important;
                  box-shadow: 0 0 20px rgba(255,255,255,0.05) !important;
                  transition: all 0.3s ease !important;
                  backdrop-filter: blur(10px) !important;
                }
                [data-rk] button[data-testid="rk-connect-button"]:hover {
                  background: linear-gradient(135deg, #2A2A2A, #3A3A3A) !important;
                  border: 1px solid #4A4A4A !important;
                  box-shadow: 0 0 30px rgba(255,255,255,0.1) !important;
                  transform: translateY(-1px) !important;
                }
                [data-rk] div[role="button"] {
                  background: linear-gradient(135deg, #1A1A1A, #2A2A2A) !important;
                  border: 1px solid #3A3A3A !important;
                  color: #ffffff !important;
                  border-radius: 16px !important;
                  padding: 12px 24px !important;
                  font-weight: 500 !important;
                  box-shadow: 0 0 20px rgba(255,255,255,0.05) !important;
                  transition: all 0.3s ease !important;
                }
                [data-rk] div[role="button"]:hover {
                  background: linear-gradient(135deg, #2A2A2A, #3A3A3A) !important;
                  border: 1px solid #4A4A4A !important;
                  box-shadow: 0 0 30px rgba(255,255,255,0.1) !important;
                }
              `
            }} />
            <ConnectButton />
          </div>
        )}
      </div>
    </div>
  );
}