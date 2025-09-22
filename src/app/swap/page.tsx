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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Swap</h1>
            <p className="text-gray-600">Trade tokens instantly on Base</p>
          </div>

          {/* Swap Interface */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
            <style dangerouslySetInnerHTML={{
              __html: `
                .swap-light [data-testid="ockSwapAmountInput_Container"] {
                  background-color: #f9fafb !important;
                  border: 1px solid #e5e7eb !important;
                  border-radius: 12px !important;
                }
                .swap-light [data-testid="ockSwapAmountInput_Container"] input {
                  background-color: transparent !important;
                  color: #111827 !important;
                }
                .swap-light [data-testid="ockSwapAmountInput_Container"] label {
                  color: #6b7280 !important;
                }
                .swap-light [data-testid="ockSwapAmountInput_Container"] div {
                  color: #374151 !important;
                }
                .swap-light [data-testid="ockSwapAmountInput_Container"] span {
                  color: #374151 !important;
                }
                /* Token selector buttons */
                .swap-light [data-testid="ockSwapAmountInput_TokenSelector"] {
                  background-color: #ffffff !important;
                  border: 1px solid #ffffff !important;
                  color: #111827 !important;
                  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05) !important;
                }
                .swap-light [data-testid="ockSwapAmountInput_TokenSelector"]:hover {
                  background-color: #f9fafb !important;
                  border: 1px solid #f9fafb !important;
                }
                /* Toggle button */
                .swap-light [data-testid="ockSwapToggleButton"] {
                  background-color: #ffffff !important;
                  border: 1px solid #ffffff !important;
                  color: #111827 !important;
                  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05) !important;
                }
                .swap-light [data-testid="ockSwapToggleButton"]:hover {
                  background-color: #f9fafb !important;
                  border: 1px solid #f9fafb !important;
                }
                /* Toggle button SVG/Arrow icons - keep black */
                .swap-light [data-testid="ockSwapToggleButton"] svg {
                  color: #111827 !important;
                  fill: #111827 !important;
                  stroke: #111827 !important;
                }
                .swap-light [data-testid="ockSwapToggleButton"] svg path {
                  fill: #111827 !important;
                  stroke: #111827 !important;
                }
                .swap-light [data-testid="ockSwapToggleButton"] svg * {
                  fill: #111827 !important;
                  stroke: #111827 !important;
                  color: #111827 !important;
                }
                /* Alternative selectors for token buttons */
                .swap-light button[class*="token"] {
                  background-color: #ffffff !important;
                  border: 1px solid #ffffff !important;
                  color: #111827 !important;
                  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05) !important;
                }
                .swap-light button[class*="token"]:hover {
                  background-color: #f9fafb !important;
                  border: 1px solid #f9fafb !important;
                }
                /* General button overrides for OnchainKit */
                .swap-light button[style*="background"] {
                  background-color: #ffffff !important;
                  color: #111827 !important;
                  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05) !important;
                  border: 1px solid #ffffff !important;
                }
                /* More specific selectors for OnchainKit buttons */
                .swap-light button {
                  background-color: #ffffff !important;
                  color: #111827 !important;
                  border: 1px solid #ffffff !important;
                }
                .swap-light button:hover {
                  background-color: #f9fafb !important;
                  border: 1px solid #f9fafb !important;
                }
                /* Token dropdown menus */
                .swap-light [role="listbox"],
                .swap-light [role="menu"],
                .swap-light div[class*="dropdown"],
                .swap-light div[class*="menu"] {
                  background-color: #ffffff !important;
                  border: 1px solid #ffffff !important;
                  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1) !important;
                }
                /* Token dropdown options */
                .swap-light [role="option"],
                .swap-light [role="menuitem"] {
                  background-color: #ffffff !important;
                  color: #111827 !important;
                }
                .swap-light [role="option"]:hover,
                .swap-light [role="menuitem"]:hover {
                  background-color: #f9fafb !important;
                }
                /* Keep arrows and icons black */
                .swap-light svg {
                  color: #111827 !important;
                  fill: #111827 !important;
                  stroke: #111827 !important;
                }
                .swap-light svg path {
                  fill: #111827 !important;
                  stroke: #111827 !important;
                }
                .swap-light svg * {
                  fill: #111827 !important;
                  stroke: #111827 !important;
                  color: #111827 !important;
                }
                /* Specific arrow icons */
                .swap-light [class*="arrow"] svg,
                .swap-light [class*="chevron"] svg,
                .swap-light [class*="toggle"] svg {
                  color: #111827 !important;
                  fill: #111827 !important;
                  stroke: #111827 !important;
                }
              `
            }} />
            {address ? (
              <div className="swap-light">
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
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Connect Your Wallet</h3>
                <p className="text-gray-600 mb-6">Connect your wallet to start trading tokens</p>
                <Wallet>
                  <ConnectWallet>
                    <Avatar className="h-6 w-6" />
                    <Name />
                  </ConnectWallet>
                </Wallet>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}