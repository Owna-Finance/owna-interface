'use client';

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { 
  Swap, 
  SwapAmountInput, 
  SwapToggleButton, 
  SwapButton, 
  SwapMessage, 
  SwapToast 
} from '@coinbase/onchainkit/swap';
import { Avatar, Name } from '@coinbase/onchainkit/identity';
import { Wallet, ConnectWallet } from '@coinbase/onchainkit/wallet';
import { useAccount } from 'wagmi';
import type { Token } from '@coinbase/onchainkit/token';

// Base chainId = 8453
const ETH: Token = {
  name: 'ETH',
  address: '', // native ETH
  symbol: 'ETH',
  decimals: 18,
  image: 'https://wallet-api-production.s3.amazonaws.com/uploads/tokens/eth_288.png',
  chainId: 8453,
};

const USDC: Token = {
  name: 'USDC',
  address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', // USDC on Base
  symbol: 'USDC',
  decimals: 6,
  image: 'https://dynamic-assets.coinbase.com/3c15df5e2ac7d4abbe9499ed9335041f00c620f28e8de2f93474a9f432058742cdf4674bd43f309e69778a26969372310135be97eb183d91c492154176d455b8/asset_icons/9d67b728b6c8f457717154b3a35f9ddc702eae7e76c4684ee39302c4d7fd0bb8.png',
  chainId: 8453,
};

// Swappable tokens for dropdown
const swappableTokens: Token[] = [ETH, USDC];

// app/swap/page.tsx
export default function SwapPage() {
  const { address } = useAccount();

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-white tracking-tight mb-4">Swap</h1>
          <p className="text-gray-400 text-lg">Trade tokens instantly on Base</p>
        </div>

        {/* Swap Interface */}
        <div className="flex justify-center">
          <div className="w-full max-w-md">
            <div className="bg-[#1A1A1A]/70 backdrop-blur-sm rounded-2xl border border-[#2A2A2A] p-8 shadow-[0_0_30px_rgba(255,255,255,0.05)] transition-all duration-300 hover:shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:border-[#3A3A3A]">
              <style dangerouslySetInnerHTML={{
                __html: `
                  .swap-dark [data-testid="ockSwapAmountInput_Container"] {
                    background-color: #2A2A2A !important;
                    border: 1px solid #3A3A3A !important;
                    border-radius: 16px !important;
                    box-shadow: 0 0 20px rgba(0,0,0,0.3) !important;
                  }
                  .swap-dark [data-testid="ockSwapAmountInput_Container"]:hover {
                    border: 1px solid #4A4A4A !important;
                    box-shadow: 0 0 25px rgba(255,255,255,0.05) !important;
                  }
                  .swap-dark [data-testid="ockSwapAmountInput_Container"] input {
                    background-color: transparent !important;
                    color: #ffffff !important;
                    font-size: 18px !important;
                    font-weight: 600 !important;
                  }
                  .swap-dark [data-testid="ockSwapAmountInput_Container"] label {
                    color: #9CA3AF !important;
                    font-weight: 500 !important;
                  }
                  .swap-dark [data-testid="ockSwapAmountInput_Container"] div {
                    color: #E5E7EB !important;
                  }
                  .swap-dark [data-testid="ockSwapAmountInput_Container"] span {
                    color: #E5E7EB !important;
                  }
                  /* Toggle button */
                  .swap-dark [data-testid="ockSwapToggleButton"] {
                    background: linear-gradient(135deg, #3B82F6, #1D4ED8) !important;
                    border: 1px solid #2563EB !important;
                    color: #ffffff !important;
                    border-radius: 12px !important;
                    box-shadow: 0 0 20px rgba(59,130,246,0.3) !important;
                    transition: all 0.3s ease !important;
                  }
                  .swap-dark [data-testid="ockSwapToggleButton"]:hover {
                    background: linear-gradient(135deg, #2563EB, #1E40AF) !important;
                    box-shadow: 0 0 30px rgba(59,130,246,0.5) !important;
                    transform: scale(1.05) !important;
                  }
                  /* Toggle button SVG/Arrow icons */
                  .swap-dark [data-testid="ockSwapToggleButton"] svg {
                    color: #ffffff !important;
                    fill: #ffffff !important;
                    stroke: #ffffff !important;
                  }
                  .swap-dark [data-testid="ockSwapToggleButton"] svg path {
                    fill: #ffffff !important;
                    stroke: #ffffff !important;
                  }
                  .swap-dark [data-testid="ockSwapToggleButton"] svg * {
                    fill: #ffffff !important;
                    stroke: #ffffff !important;
                    color: #ffffff !important;
                  }
                  /* Swap button */
                  .swap-dark [data-testid="ockSwapButton"] {
                    background: linear-gradient(135deg, #3B82F6, #06B6D4) !important;
                    border: 1px solid #2563EB !important;
                    color: #ffffff !important;
                    border-radius: 16px !important;
                    padding: 16px !important;
                    font-weight: 600 !important;
                    font-size: 16px !important;
                    box-shadow: 0 0 25px rgba(59,130,246,0.3) !important;
                    transition: all 0.3s ease !important;
                  }
                  .swap-dark [data-testid="ockSwapButton"]:hover {
                    background: linear-gradient(135deg, #2563EB, #0891B2) !important;
                    box-shadow: 0 0 35px rgba(59,130,246,0.5) !important;
                    transform: translateY(-2px) !important;
                  }
                  /* Token dropdown menus */
                  .swap-dark [role="listbox"],
                  .swap-dark [role="menu"],
                  .swap-dark div[class*="dropdown"],
                  .swap-dark div[class*="menu"] {
                    background-color: #1A1A1A !important;
                    border: 1px solid #2A2A2A !important;
                    border-radius: 12px !important;
                    box-shadow: 0 0 30px rgba(0,0,0,0.5) !important;
                  }
                  /* Token dropdown options */
                  .swap-dark [role="option"],
                  .swap-dark [role="menuitem"] {
                    background-color: transparent !important;
                    color: #ffffff !important;
                    transition: all 0.2s ease !important;
                  }
                  .swap-dark [role="option"]:hover,
                  .swap-dark [role="menuitem"]:hover {
                    background-color: #2A2A2A !important;
                    color: #ffffff !important;
                  }
                  /* Token selector buttons */
                  .swap-dark [data-testid="ockSwapAmountInput_TokenSelector"] {
                    background-color: #2A2A2A !important;
                    border: 1px solid #3A3A3A !important;
                    color: #ffffff !important;
                    border-radius: 12px !important;
                    transition: all 0.3s ease !important;
                  }
                  .swap-dark [data-testid="ockSwapAmountInput_TokenSelector"]:hover {
                    background-color: #3A3A3A !important;
                    border: 1px solid #4A4A4A !important;
                    box-shadow: 0 0 15px rgba(255,255,255,0.1) !important;
                  }
                `
              }} />
              {address ? (
                <div className="swap-dark">
                  <Swap>
                    <SwapAmountInput
                      label="Sell"
                      swappableTokens={swappableTokens}
                      token={ETH}
                      type="from"
                    />
                    <SwapToggleButton />
                    <SwapAmountInput
                      label="Buy"
                      swappableTokens={swappableTokens}
                      token={USDC}
                      type="to"
                    />
                    <SwapButton />
                    <SwapMessage />
                    <SwapToast />
                  </Swap>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-[#2A2A2A] border border-[#3A3A3A] rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(0,0,0,0.3)]">
                    <svg className="w-10 h-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-semibold text-white mb-3">Connect Your Wallet</h3>
                  <p className="text-gray-400 mb-8 text-lg">Connect your wallet to start trading tokens</p>
                  <div className="bg-[#2A2A2A]/50 border border-[#3A3A3A] rounded-xl p-1 inline-block">
                    <Wallet>
                      <ConnectWallet>
                        <Avatar className="h-6 w-6" />
                        <Name />
                      </ConnectWallet>
                    </Wallet>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}