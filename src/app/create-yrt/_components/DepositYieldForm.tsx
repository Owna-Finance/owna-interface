import { Button } from '@/components/ui/button';
import { CONTRACTS } from '@/constants/contracts/contracts';
import { DollarSign, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';

interface YieldFormData {
  seriesId: string;
  periodId: string;
  amount: string;
  tokenAddress: `0x${string}`;
}

interface DepositYieldFormProps {
  yieldFormData: YieldFormData;
  onSubmit: (e: React.FormEvent) => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  needsApproval: boolean;
  approvalStep: 'check' | 'approve' | 'deposit';
  yieldHash?: `0x${string}`;
  isYieldLoading: boolean;
  isYieldSuccess: boolean;
  yieldError: any;
  address: string | undefined;
}

export function DepositYieldForm({
  yieldFormData,
  onSubmit,
  onInputChange,
  needsApproval,
  approvalStep,
  yieldHash,
  isYieldLoading,
  isYieldSuccess,
  yieldError,
  address
}: DepositYieldFormProps) {
  return (
    <div className="mt-8 bg-[#0A0A0A] rounded-xl border border-[#2A2A2A] p-8">
      <div className="flex items-center space-x-2 mb-6">
        <Image src="/Images/Logo/usdc-logo.png" alt="USDC" width={20} height={20} />
        <h3 className="text-lg font-semibold text-white">Deposit Yield</h3>
      </div>
      
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Series ID
            </label>
            <input
              type="text"
              name="seriesId"
              value={yieldFormData.seriesId}
              onChange={onInputChange}
              placeholder="e.g., 1"
              className="w-full px-4 py-3 bg-[#111111] border border-[#2A2A2A] rounded-lg text-white placeholder-gray-500 focus:border-white focus:outline-none"
              required
            />
            <p className="text-xs text-gray-500 mt-1">YRT series ID</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Period ID
            </label>
            <input
              type="text"
              name="periodId"
              value={yieldFormData.periodId}
              onChange={onInputChange}
              placeholder="e.g., 1"
              className="w-full px-4 py-3 bg-[#111111] border border-[#2A2A2A] rounded-lg text-white placeholder-gray-500 focus:border-white focus:outline-none"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Period ID to deposit yield for</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Token
            </label>
            <TokenDropdown 
              value={yieldFormData.tokenAddress}
              onChange={(value) => {
                const event = {
                  target: {
                    name: 'tokenAddress',
                    value: value
                  }
                } as React.ChangeEvent<HTMLSelectElement>;
                onInputChange(event);
              }}
              options={[
                { value: CONTRACTS.USDC, label: 'USDC', logo: '/Images/Logo/usdc-logo.png' },
                { value: CONTRACTS.IDRX, label: 'IDRX', logo: '/Images/Logo/idrx-logo.svg' }
              ]}
            />
            <p className="text-xs text-gray-500 mt-1">Token to deposit as yield</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Amount
            </label>
            <input
              type="number"
              name="amount"
              value={yieldFormData.amount}
              onChange={onInputChange}
              placeholder="e.g., 100"
              step="0.000001"
              min="0"
              className="w-full px-4 py-3 bg-[#111111] border border-[#2A2A2A] rounded-lg text-white placeholder-gray-500 focus:border-white focus:outline-none"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              {needsApproval ? '⚠️ Approval required' : 'Sufficient allowance'}
            </p>
          </div>
        </div>

        {(yieldHash || yieldError) && (
          <div className="p-4 bg-[#111111] border border-[#2A2A2A] rounded-lg">
            {yieldHash && (
              <>
                <p className="text-sm text-gray-400 mb-2">Yield Transaction Hash:</p>
                <p className="text-xs font-mono text-white break-all">{yieldHash}</p>
              </>
            )}
            {isYieldLoading && (
              <p className="text-sm text-gray-300 mt-2">⏳ Depositing yield...</p>
            )}
            {isYieldSuccess && (
              <p className="text-sm text-white mt-2">✅ Yield deposited successfully!</p>
            )}
            {yieldError && (
              <p className="text-sm text-gray-300 mt-2">❌ Error: {yieldError.message}</p>
            )}
          </div>
        )}

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isYieldLoading || !address || (!yieldFormData.amount)}
            className={`font-medium px-6 py-2 rounded-lg flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed ${
              needsApproval && approvalStep !== 'deposit' 
                ? 'bg-gray-400 hover:bg-gray-500 text-white' 
                : 'bg-white hover:bg-gray-200 text-black'
            }`}
          >
            {isYieldLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-gray-400 border-t-white rounded-full animate-spin"></div>
                <span>
                  {approvalStep === 'approve' ? 'Approving...' : 'Depositing...'}
                </span>
              </>
            ) : (
              <>
                {needsApproval && approvalStep !== 'deposit' ? (
                  <>
                    <DollarSign className="w-4 h-4" />
                    <span>Approve Token</span>
                  </>
                ) : (
                  <>
                    <DollarSign className="w-4 h-4" />
                    <span>Deposit Yield</span>
                  </>
                )}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

interface TokenOption {
  value: string;
  label: string;
  logo: string;
}

interface TokenDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: TokenOption[];
}

function TokenDropdown({ value, onChange, options }: TokenDropdownProps) {
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
        className="w-full px-4 py-3 pl-12 pr-10 bg-[#111111] border border-[#2A2A2A] rounded-lg text-white focus:border-white focus:outline-none text-left flex items-center justify-between"
      >
        <span>{selectedOption.label}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
        <Image 
          src={selectedOption.logo} 
          alt={selectedOption.label} 
          width={20} 
          height={20} 
        />
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-[#111111] border border-[#2A2A2A] rounded-lg shadow-lg z-10">
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
                />
              </div>
              <span>{option.label}</span>
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