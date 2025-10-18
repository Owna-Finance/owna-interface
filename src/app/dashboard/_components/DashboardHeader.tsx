import { useBalance, useDisconnect } from 'wagmi';
import Image from 'next/image';
import { WalletComponents } from '@/components/wallet/connect-wallet';
import { CHAIN_ID } from '@/constants/chain';
import { EthBalance, Avatar, Name } from '@coinbase/onchainkit/identity';
import { base } from 'viem/chains';
import { useAccount } from 'wagmi';
import { useState, useEffect, useRef } from 'react';
import { LogOut, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DashboardHeaderProps {
  showWalletDropdown?: boolean;
  setShowWalletDropdown?: (show: boolean) => void;
}

export function DashboardHeader({ showWalletDropdown, setShowWalletDropdown }: DashboardHeaderProps) {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { data: balance, isLoading: balanceLoading } = useBalance({
    address: address,
    chainId: CHAIN_ID,
  });

  const handleDisconnect = () => {
    disconnect();
    setShowDropdown(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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

            {/* Enhanced wallet display with OnchainKit identity */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center space-x-3 bg-[#1A1A1A]/70 border border-[#2A2A2A] rounded-2xl px-4 py-2 backdrop-blur-sm hover:bg-[#1A1A1A]/90 transition-colors"
              >
                <Avatar className="h-6 w-6" address={address} chain={base} />
                <div className="flex flex-col">
                  <Name className="text-white font-medium text-sm" address={address} chain={base} />
                  <EthBalance className="text-gray-400 text-xs" address={address} />
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {showDropdown && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl shadow-lg z-50">
                  <div className="p-2">
                    <Button
                      onClick={handleDisconnect}
                      variant="ghost"
                      className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Disconnect Wallet
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <WalletComponents />
        )}
      </div>
    </div>
  );
}