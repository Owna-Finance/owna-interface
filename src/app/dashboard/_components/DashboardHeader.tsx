import { useBalance } from 'wagmi';
import Image from 'next/image';
import { WalletComponents } from '@/components/wallet/connect-wallet';
import { CHAIN_ID } from '@/constants/chain';
import { EthBalance, Avatar, Name } from '@coinbase/onchainkit/identity';
import { base } from 'viem/chains';
import { useAccount } from 'wagmi';

interface DashboardHeaderProps {
  showWalletDropdown?: boolean;
  setShowWalletDropdown?: (show: boolean) => void;
}

export function DashboardHeader({ showWalletDropdown, setShowWalletDropdown }: DashboardHeaderProps) {
  const { address, isConnected } = useAccount();
  const { data: balance, isLoading: balanceLoading } = useBalance({
    address: address,
    chainId: CHAIN_ID,
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

            {/* Enhanced wallet display with OnchainKit identity */}
            <div className="flex items-center space-x-3 bg-[#1A1A1A]/70 border border-[#2A2A2A] rounded-2xl px-4 py-2 backdrop-blur-sm">
              <Avatar className="h-6 w-6" address={address} chain={base} />
              <div className="flex flex-col">
                <Name className="text-white font-medium text-sm" address={address} chain={base} />
                <EthBalance className="text-gray-400 text-xs" address={address} />
              </div>
            </div>
          </>
        ) : (
          <WalletComponents />
        )}
      </div>
    </div>
  );
}