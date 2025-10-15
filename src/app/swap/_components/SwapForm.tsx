import { TokenInput } from './TokenInput';
import { SwapSettings } from './SwapSettings';
import { TransactionStatus } from './TransactionStatus';
import { SwapButton } from './SwapButton';
import { PoolSelector } from './PoolSelector';
import { ChevronDown } from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';

type TokenType = 'YRT' | 'USDC' | 'IDRX';
type SwapStep = 'idle' | 'approving-yrt' | 'yrt-approved' | 'approving-usdc' | 'tokens-approved' | 'swapping' | 'completed';

interface SwapFormData {
  poolAddress: string;
  tokenFrom: TokenType;
  tokenTo: TokenType;
  amountFrom: string;
  amountTo: string;
  slippage: string;
  deadline: string;
  yrtAddress: string;
  propertyName?: string;
}

interface SwapFormProps {
  formData: SwapFormData;
  currentStep: SwapStep;
  onSubmit: (e: React.FormEvent) => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSwapTokens: () => void;
  onPoolSelect: (poolAddress: string, token0: string, token1: string, propertyName?: string) => void;
  onTokenSelect: (tokenFrom: string, tokenTo: string) => void;
  needsYrtApproval: boolean;
  needsUsdcApproval: boolean;
  yrtApprovalHash?: `0x${string}`;
  usdcApprovalHash?: `0x${string}`;
  swapHash?: `0x${string}`;
  isTransactionConfirming: boolean;
  isPending: boolean;
  address: string | undefined;
}

export function SwapForm({
  formData,
  currentStep,
  onSubmit,
  onInputChange,
  onSwapTokens,
  onPoolSelect,
  onTokenSelect,
  needsYrtApproval,
  needsUsdcApproval,
  yrtApprovalHash,
  usdcApprovalHash,
  swapHash,
  isTransactionConfirming,
  isPending,
  address
}: SwapFormProps) {
  const approvalTokens = [];
  if (needsYrtApproval) approvalTokens.push('YRT');
  if (needsUsdcApproval) approvalTokens.push('USDC');

  return (
    <div className="space-y-6">
      {/* Pool Selection */}
      <PoolSelector
        selectedPool={formData.poolAddress}
        onPoolSelect={onPoolSelect}
        onTokenSelect={onTokenSelect}
      />

      {/* Swap Form */}
      <div className="bg-[#0A0A0A] rounded-2xl border border-[#2A2A2A] p-6">
        <form onSubmit={onSubmit} className="space-y-6">
          {/* Selected Pool Info */}
          {formData.poolAddress && formData.poolAddress !== '0x0000000000000000000000000000000000000000' && (
            <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
              <h4 className="text-green-400 font-medium mb-2">Selected Pool</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Trading Pair:</span>
                  <span className="text-white">{formData.tokenFrom} → {formData.tokenTo}</span>
                </div>
                {formData.propertyName && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Property:</span>
                    <span className="text-white">{formData.propertyName}</span>
                  </div>
                )}
              </div>
            </div>
          )}

        <TokenInput
          label="From"
          tokenType={formData.tokenFrom}
          amount={formData.amountFrom}
          onTokenChange={(value) => onInputChange({ target: { name: 'tokenFrom', value } } as any)}
          onAmountChange={(value) => onInputChange({ target: { name: 'amountFrom', value } } as any)}
          showApprovalWarning={needsYrtApproval || needsUsdcApproval}
          approvalTokens={approvalTokens}
          showSwapButton={true}
          onSwap={onSwapTokens}
        />

        <TokenInput
          label="To"
          tokenType={formData.tokenTo}
          amount={formData.amountTo}
          onTokenChange={(value) => onInputChange({ target: { name: 'tokenTo', value } } as any)}
          onAmountChange={() => {}}
          readOnly={true}
        />

        <SwapSettings
          slippage={formData.slippage}
          deadline={formData.deadline}
          onSlippageChange={(value) => onInputChange({ target: { name: 'slippage', value } } as any)}
          onDeadlineChange={(value) => onInputChange({ target: { name: 'deadline', value } } as any)}
        />

        <TransactionStatus
          currentStep={currentStep}
          yrtApprovalHash={yrtApprovalHash}
          usdcApprovalHash={usdcApprovalHash}
          swapHash={swapHash}
          isTransactionConfirming={isTransactionConfirming}
        />

        <SwapButton
          currentStep={currentStep}
          isPending={isPending}
          address={address}
          needsYrtApproval={needsYrtApproval}
          needsUsdcApproval={needsUsdcApproval}
        />
      </form>
    </div>
  </div>
  );
}

interface YRTTokenOption {
  value: string;
  label: string;
  symbol: string;
  logo: string;
}

interface YRTTokenDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: YRTTokenOption[];
}

function YRTTokenDropdown({ value, onChange, options }: YRTTokenDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectedOption = options.find(opt => opt.value === value) || options[0];

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
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 pl-12 pr-10 bg-[#111111] border border-[#2A2A2A] rounded-lg text-white focus:border-blue-500 focus:outline-none text-left flex items-center justify-between"
      >
        <div className="flex flex-col">
          <span className="text-white">{selectedOption?.label || 'Select YRT Token'}</span>
          {selectedOption && (
            <span className="text-xs text-gray-400 truncate">{selectedOption.value}</span>
          )}
        </div>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
        {selectedOption && (
          <Image 
            src={selectedOption.logo} 
            alt={selectedOption.label} 
            width={20} 
            height={20}
            className="rounded-full"
          />
        )}
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-[#111111] border border-[#2A2A2A] rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className="w-full px-4 py-3 pl-12 text-left text-white hover:bg-[#1A1A1A] flex items-center first:rounded-t-lg last:rounded-b-lg"
            >
              <div className="absolute left-3">
                <Image 
                  src={option.logo} 
                  alt={option.label} 
                  width={20} 
                  height={20}
                  className="rounded-full"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-white">{option.label}</span>
                <span className="text-xs text-gray-400 truncate">{option.value}</span>
              </div>
              {option.value === value && (
                <div className="ml-auto">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}