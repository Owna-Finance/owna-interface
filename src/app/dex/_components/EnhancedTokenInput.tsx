import { Button } from '@/components/ui/button';
import { ArrowUpDown, ChevronDown, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { useTokenInfo, usePoolDetails } from '@/hooks';
import { CONTRACTS } from '@/constants/contracts/contracts';

export interface TokenOption {
  value: string; // Contract address or 'USDC'/'IDRX'
  label: string; // Token symbol
  logo: string;
  address?: `0x${string}`;
  isYRT?: boolean;
  poolAddress?: `0x${string}`;
}

interface TokenInputProps {
  label: string;
  selectedToken: TokenOption | null;
  amount: string;
  onTokenChange: (token: TokenOption) => void;
  onAmountChange: (value: string) => void;
  readOnly?: boolean;
  showSwapButton?: boolean;
  onSwap?: () => void;
  availablePools?: `0x${string}`[];
  selectedPool?: `0x${string}`;
}

export function EnhancedTokenInput({
  label,
  selectedToken,
  amount,
  onTokenChange,
  onAmountChange,
  readOnly = false,
  showSwapButton = false,
  onSwap,
  availablePools = [],
  selectedPool
}: TokenInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get token info for available pools
  const { tokenInfo: token0Info } = useTokenInfo(selectedPool);
  const { tokenInfo: token1Info } = usePoolDetails(selectedPool);

  // Build token options based on available pools
  const tokenOptions: TokenOption[] = [
    // Stablecoins
    {
      value: 'USDC',
      label: 'USDC',
      logo: '/Images/Logo/usdc-logo.png',
      address: CONTRACTS.USDC,
      isYRT: false
    },
    {
      value: 'IDRX',
      label: 'IDRX',
      logo: '/Images/Logo/idrx-logo.svg',
      address: CONTRACTS.IDRX,
      isYRT: false
    }
  ];

  // Add YRT tokens from pools
  availablePools.forEach(poolAddress => {
    // We'll need to fetch pool details to get token info
    // For now, add as placeholder - we'll enhance this
    tokenOptions.push({
      value: poolAddress,
      label: 'YRT', // Will be updated with actual symbol
      logo: '/Images/Logo/logo_YRT.jpg',
      address: poolAddress,
      isYRT: true,
      poolAddress
    });
  });

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-300">{label}</label>
        <TokenDropdown
          value={selectedToken}
          onChange={onTokenChange}
          options={tokenOptions}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          dropdownRef={dropdownRef}
        />
      </div>
      <input
        type="number"
        value={amount}
        onChange={(e) => onAmountChange(e.target.value)}
        placeholder="0.0"
        step="0.000001"
        min="0"
        readOnly={readOnly}
        className={`w-full px-4 py-4 bg-[#111111] border border-[#2A2A2A] rounded-lg text-white text-xl placeholder-gray-500 focus:border-blue-500 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
          readOnly ? 'cursor-not-allowed opacity-75' : ''
        }`}
        required={!readOnly}
      />

      {/* Selected token info */}
      {selectedToken && selectedToken.poolAddress && (
        <div className="flex items-center justify-between text-xs text-gray-400 bg-[#111111] p-2 rounded-lg">
          <span>Pool: {selectedToken.poolAddress.slice(0, 6)}...{selectedToken.poolAddress.slice(-4)}</span>
          <a
            href={`https://sepolia.basescan.org/address/${selectedToken.poolAddress}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300"
          >
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      )}
    </div>
  );
}

interface TokenDropdownProps {
  value: TokenOption | null;
  onChange: (token: TokenOption) => void;
  options: TokenOption[];
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  dropdownRef: React.RefObject<HTMLDivElement>;
}

function TokenDropdown({ value, onChange, options, isOpen, setIsOpen, dropdownRef }: TokenDropdownProps) {
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="bg-[#111111] border border-[#2A2A2A] rounded-lg px-3 py-1 text-white text-sm focus:border-blue-500 focus:outline-none flex items-center space-x-2 min-w-[120px]"
      >
        {value ? (
          <>
            <Image
              src={value.logo}
              alt={value.label}
              width={16}
              height={16}
              className="rounded-full"
            />
            <span>{value.label}</span>
          </>
        ) : (
          <span>Select Token</span>
        )}
        <ChevronDown className={`w-3 h-3 transition-transform ml-auto ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-1 bg-[#111111] border border-[#2A2A2A] rounded-lg shadow-lg z-10 min-w-[160px] max-h-60 overflow-y-auto">
          {/* Group: Stablecoins */}
          <div className="px-2 py-1 text-xs text-gray-400 font-medium border-b border-[#2A2A2A]">
            Stablecoins
          </div>
          {options.filter(opt => !opt.isYRT).map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
              className="w-full px-3 py-2 text-left text-white hover:bg-[#1A1A1A] flex items-center space-x-2"
            >
              <Image
                src={option.logo}
                alt={option.label}
                width={16}
                height={16}
                className="rounded-full"
              />
              <span>{option.label}</span>
              {value?.value === option.value && (
                <div className="ml-auto">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </button>
          ))}

          {/* Group: YRT Tokens */}
          {options.filter(opt => opt.isYRT).length > 0 && (
            <>
              <div className="px-2 py-1 text-xs text-gray-400 font-medium border-b border-[#2A2A2A] mt-2">
                YRT Tokens
              </div>
              {options.filter(opt => opt.isYRT).map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option);
                    setIsOpen(false);
                  }}
                  className="w-full px-3 py-2 text-left text-white hover:bg-[#1A1A1A] flex items-center space-x-2"
                >
                  <Image
                    src={option.logo}
                    alt={option.label}
                    width={16}
                    height={16}
                    className="rounded-full"
                  />
                  <div className="flex-1">
                    <span>{option.label}</span>
                    {option.poolAddress && (
                      <div className="text-xs text-gray-400">
                        {option.poolAddress.slice(0, 6)}...{option.poolAddress.slice(-4)}
                      </div>
                    )}
                  </div>
                  {value?.value === option.value && (
                    <div className="ml-auto">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}